"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useAdminRows } from "@/components/admin/use-admin-rows";
import type { BlogPostRow } from "@/lib/types";

const EMPTY = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author_name: "",
  category: "News",
  is_featured: false,
  is_published: false,
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function AdminBlogPage() {
  const {
    data: posts = [],
    isLoading: loading,
    refetch: load,
  } = useAdminRows<BlogPostRow>("blog_posts", { column: "created_at", ascending: false });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => {
    setForm(EMPTY);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (p: BlogPostRow) => {
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? "",
      content: p.content ?? "",
      author_name: p.author_name ?? "",
      category: p.category,
      is_featured: p.is_featured,
      is_published: p.is_published,
    });
    setEditingId(p.id);
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt || null,
      content: form.content || null,
      author_name: form.author_name || null,
      category: form.category,
      is_featured: form.is_featured,
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
    };
    const table = createClient().from("blog_posts");
    const { error } = editingId
      ? await table.update(payload).eq("id", editingId)
      : await table.insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Post updated" : "Post created");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await createClient().from("blog_posts").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">Create and manage articles and news updates</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : posts.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No posts yet.</Card>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{p.title}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {p.category}
                  </span>
                  {p.is_published ? (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Published
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                {p.author_name && (
                  <p className="text-xs text-muted-foreground mt-1">by {p.author_name}</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "New"} Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: editingId ? f.slug : slugify(title) }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Author</Label>
                <Input value={form.author_name} onChange={(e) => set("author_name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["News", "Announcement", "Report", "Story", "Guide"].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Content (Markdown)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_published} onCheckedChange={(v) => set("is_published", v)} />
                <Label>Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_featured} onCheckedChange={(v) => set("is_featured", v)} />
                <Label>Featured</Label>
              </div>
            </div>
            <Button className="w-full" onClick={save}>
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
