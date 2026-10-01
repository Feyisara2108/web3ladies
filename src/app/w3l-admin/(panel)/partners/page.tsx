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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useAdminRows } from "@/components/admin/use-admin-rows";
import type { PartnerRow } from "@/lib/types";

const EMPTY = {
  name: "",
  logo_url: "",
  website_url: "",
  category: "supporter",
  report_url: "",
  report_label: "",
  description: "",
  display_order: 0,
  is_published: true,
};

const CATEGORY_LABEL: Record<string, string> = {
  supporter: "Logo Marquee",
  past: "Past Partner",
  impact: "Impact Highlight",
};

export default function AdminPartnersPage() {
  const {
    data: partners = [],
    isLoading: loading,
    refetch: load,
  } = useAdminRows<PartnerRow>("partners", { column: "display_order" });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => {
    setForm(EMPTY);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (p: PartnerRow) => {
    setForm({
      name: p.name,
      logo_url: p.logo_url ?? "",
      website_url: p.website_url ?? "",
      category: p.category ?? "supporter",
      report_url: p.report_url ?? "",
      report_label: p.report_label ?? "",
      description: p.description ?? "",
      display_order: p.display_order,
      is_published: p.is_published,
    });
    setEditingId(p.id);
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      logo_url: form.logo_url || null,
      website_url: form.website_url || null,
      report_url: form.report_url || null,
      report_label: form.report_label || null,
      description: form.description || null,
    };
    const table = createClient().from("partners");
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
    if (!confirm("Delete this partner?")) return;
    await createClient().from("partners").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Partners</h1>
          <p className="text-sm text-muted-foreground">
            Manage supporters, past partners &amp; organizations
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Partner
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : partners.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No partners yet.</Card>
      ) : (
        <div className="space-y-3">
          {partners.map((p) => (
            <Card key={p.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {p.logo_url && <img src={p.logo_url} alt={p.name} className="w-8 h-8 object-contain" />}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {CATEGORY_LABEL[p.category ?? ""] ?? p.category}
                    </span>
                    {!p.is_published && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
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
            <DialogTitle>{editingId ? "Edit" : "Add"} Partner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supporter">Supporter (Logo Marquee)</SelectItem>
                  <SelectItem value="past">Past Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input
                value={form.logo_url}
                onChange={(e) => set("logo_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input
                value={form.website_url}
                onChange={(e) => set("website_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Report URL</Label>
                <Input
                  value={form.report_url}
                  onChange={(e) => set("report_url", e.target.value)}
                  placeholder="/reports/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Report Label</Label>
                <Input
                  value={form.report_label}
                  onChange={(e) => set("report_label", e.target.value)}
                  placeholder="Download Report"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => set("display_order", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.is_published} onCheckedChange={(v) => set("is_published", v)} />
                <Label>Published</Label>
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
