"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { useAdminRows } from "@/components/admin/use-admin-rows";
import type { SocialProofRow } from "@/lib/types";

const EMPTY = {
  image_url: "",
  caption: "",
  tag: "Community Win",
  display_order: 0,
  is_published: true,
};

export default function AdminSocialProofPage() {
  const {
    data: items = [],
    isLoading: loading,
    refetch: load,
  } = useAdminRows<SocialProofRow>("social_proof_items", { column: "display_order" });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => {
    setForm(EMPTY);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (item: SocialProofRow) => {
    setForm({
      image_url: item.image_url ?? "",
      caption: item.caption,
      tag: item.tag ?? "",
      display_order: item.display_order,
      is_published: item.is_published,
    });
    setEditingId(item.id);
    setOpen(true);
  };

  const save = async () => {
    const payload = { ...form, image_url: form.image_url || null };
    const table = createClient().from("social_proof_items");
    const { error } = editingId
      ? await table.update(payload).eq("id", editingId)
      : await table.insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Updated" : "Created");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await createClient().from("social_proof_items").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Social Proof</h1>
          <p className="text-sm text-muted-foreground">Manage proof-of-work screenshots &amp; wins</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No social proof items yet.</Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.image_url && (
                <img src={item.image_url} alt={item.caption} className="w-full h-40 object-cover" />
              )}
              <div className="p-4 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">{item.caption}</p>
                  {!item.is_published && (
                    <span className="text-xs text-amber-600 mt-1 block">Draft</span>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(item.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Proof Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={form.image_url}
                onChange={(e) => set("image_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Input value={form.caption} onChange={(e) => set("caption", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tag</Label>
                <Input
                  value={form.tag}
                  onChange={(e) => set("tag", e.target.value)}
                  placeholder="e.g. Hackathon Win"
                />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => set("display_order", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_published} onCheckedChange={(v) => set("is_published", v)} />
              <Label>Published</Label>
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
