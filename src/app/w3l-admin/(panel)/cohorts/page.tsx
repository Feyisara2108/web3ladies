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
import type { CohortRow } from "@/lib/types";

const EMPTY = {
  title: "",
  description: "",
  track: "Blockchain",
  cohort_number: "",
  start_date: "",
  end_date: "",
  application_url: "",
  status: "upcoming",
  total_participants: "0",
  completion_rate: "",
  is_published: true,
};

const STATUS_CLASS: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-muted text-muted-foreground",
};

export default function AdminCohortsPage() {
  const {
    data: cohorts = [],
    isLoading: loading,
    refetch: load,
  } = useAdminRows<CohortRow>("cohorts", { column: "cohort_number", ascending: false });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => {
    setForm(EMPTY);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (c: CohortRow) => {
    setForm({
      title: c.title,
      description: c.description ?? "",
      track: c.track,
      cohort_number: c.cohort_number?.toString() ?? "",
      start_date: c.start_date ?? "",
      end_date: c.end_date ?? "",
      application_url: c.application_url ?? "",
      status: c.status,
      total_participants: c.total_participants.toString(),
      completion_rate: c.completion_rate?.toString() ?? "",
      is_published: c.is_published,
    });
    setEditingId(c.id);
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      title: form.title,
      description: form.description || null,
      track: form.track,
      cohort_number: form.cohort_number ? parseInt(form.cohort_number) : null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      application_url: form.application_url || null,
      status: form.status,
      total_participants: parseInt(form.total_participants) || 0,
      completion_rate: form.completion_rate ? parseFloat(form.completion_rate) : null,
      is_published: form.is_published,
    };
    const table = createClient().from("cohorts");
    const { error } = editingId
      ? await table.update(payload).eq("id", editingId)
      : await table.insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Cohort updated" : "Cohort created");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this cohort?")) return;
    await createClient().from("cohorts").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Cohorts</h1>
          <p className="text-sm text-muted-foreground">Manage learning cohorts and programs</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Cohort
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : cohorts.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No cohorts yet.</Card>
      ) : (
        <div className="space-y-3">
          {cohorts.map((c) => (
            <Card key={c.id} className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{c.title}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {c.track}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CLASS[c.status] ?? ""}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {c.total_participants} participants
                  {c.completion_rate ? ` • ${c.completion_rate}% completion` : ""}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(c.id)}>
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
            <DialogTitle>{editingId ? "Edit" : "Add"} Cohort</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cohort Number</Label>
                <Input
                  type="number"
                  value={form.cohort_number}
                  onChange={(e) => set("cohort_number", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Track</Label>
                <Select value={form.track} onValueChange={(v) => set("track", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Blockchain", "AI", "Product Design", "Frontend", "Backend", "Data"].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["upcoming", "active", "completed"].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => set("start_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => set("end_date", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Participants</Label>
                <Input
                  type="number"
                  value={form.total_participants}
                  onChange={(e) => set("total_participants", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Completion Rate (%)</Label>
                <Input
                  type="number"
                  value={form.completion_rate}
                  onChange={(e) => set("completion_rate", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Application URL</Label>
              <Input
                value={form.application_url}
                onChange={(e) => set("application_url", e.target.value)}
                placeholder="https://"
              />
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
