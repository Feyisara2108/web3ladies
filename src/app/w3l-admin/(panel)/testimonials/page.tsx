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
import type { TestimonialRow } from "@/lib/types";

const EMPTY = {
  name: "",
  role: "",
  category: "General",
  highlight: "",
  full_quote: "",
  source_url: "",
  is_featured: false,
  is_published: true,
  page: "home",
  display_order: 0,
};

const CATEGORIES = [
  "General",
  "Mentorship",
  "Community",
  "Worktool",
  "Job Placement",
  "Hackathon",
  "Workshop",
];

export default function AdminTestimonialsPage() {
  const {
    data: items = [],
    isLoading: loading,
    refetch: load,
  } = useAdminRows<TestimonialRow>("testimonials", { column: "display_order" });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => {
    setForm(EMPTY);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (t: TestimonialRow) => {
    setForm({
      name: t.name,
      role: t.role ?? "",
      category: t.category ?? "General",
      highlight: t.highlight ?? "",
      full_quote: t.full_quote ?? "",
      source_url: t.source_url ?? "",
      is_featured: t.is_featured,
      is_published: t.is_published,
      page: t.page,
      display_order: t.display_order,
    });
    setEditingId(t.id);
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      role: form.role || null,
      full_quote: form.full_quote || null,
      source_url: form.source_url || null,
    };
    const table = createClient().from("testimonials");
    const { error } = editingId
      ? await table.update(payload).eq("id", editingId)
      : await table.insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Testimonial updated" : "Testimonial created");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await createClient().from("testimonials").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Testimonials</h1>
          <p className="text-sm text-muted-foreground">Manage member testimonials across pages</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No testimonials yet. Add your first one.
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <Card key={t.id} className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{t.name}</span>
                  {t.role && <span className="text-xs text-muted-foreground">• {t.role}</span>}
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {t.category}
                  </span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{t.page}</span>
                  {!t.is_published && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.highlight}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(t.id)}>
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
            <DialogTitle>{editingId ? "Edit" : "Add"} Testimonial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Role / Title</Label>
                <Input value={form.role} onChange={(e) => set("role", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Page</Label>
                <Select value={form.page} onValueChange={(v) => set("page", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["home", "community", "cohorts"].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Highlight Quote</Label>
              <Textarea
                value={form.highlight}
                onChange={(e) => set("highlight", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Full Quote (optional)</Label>
              <Textarea
                value={form.full_quote}
                onChange={(e) => set("full_quote", e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Source Link (optional)</Label>
              <Input
                placeholder="https://twitter.com/..."
                value={form.source_url}
                onChange={(e) => set("source_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) => set("display_order", parseInt(e.target.value) || 0)}
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
