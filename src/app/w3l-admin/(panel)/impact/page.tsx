"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useAdminRows } from "@/components/admin/use-admin-rows";
import type { ImpactHighlightRow, ImpactStatRow } from "@/lib/types";

const EMPTY_STAT = {
  value: "",
  label: "",
  description: "",
  page: "home",
  display_order: 0,
  is_published: true,
};

const EMPTY_HIGHLIGHT = {
  title: "",
  description: "",
  icon: "users",
  report_url: "",
  report_label: "",
  display_order: 0,
  is_published: true,
};

export default function AdminImpactPage() {
  const statsQuery = useAdminRows<ImpactStatRow>("impact_stats", { column: "display_order" });
  const highlightsQuery = useAdminRows<ImpactHighlightRow>("impact_highlights", {
    column: "display_order",
  });
  const stats = statsQuery.data ?? [];
  const highlights = highlightsQuery.data ?? [];
  const loading = statsQuery.isLoading || highlightsQuery.isLoading;
  const load = () => {
    statsQuery.refetch();
    highlightsQuery.refetch();
  };

  const [statOpen, setStatOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stat, setStat] = useState(EMPTY_STAT);
  const [highlight, setHighlight] = useState(EMPTY_HIGHLIGHT);

  const newStat = () => {
    setStat(EMPTY_STAT);
    setEditingId(null);
    setStatOpen(true);
  };

  const editStat = (s: ImpactStatRow) => {
    setStat({
      value: s.value,
      label: s.label,
      description: s.description ?? "",
      page: s.page ?? "home",
      display_order: s.display_order,
      is_published: s.is_published,
    });
    setEditingId(s.id);
    setStatOpen(true);
  };

  const saveStat = async () => {
    const payload = { ...stat, description: stat.description || null };
    const table = createClient().from("impact_stats");
    const { error } = editingId
      ? await table.update(payload).eq("id", editingId)
      : await table.insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    setStatOpen(false);
    load();
  };

  const removeStat = async (id: string) => {
    if (!confirm("Delete?")) return;
    await createClient().from("impact_stats").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const newHighlight = () => {
    setHighlight(EMPTY_HIGHLIGHT);
    setEditingId(null);
    setHighlightOpen(true);
  };

  const editHighlight = (h: ImpactHighlightRow) => {
    setHighlight({
      title: h.title,
      description: h.description ?? "",
      icon: h.icon ?? "users",
      report_url: h.report_url ?? "",
      report_label: h.report_label ?? "",
      display_order: h.display_order,
      is_published: h.is_published,
    });
    setEditingId(h.id);
    setHighlightOpen(true);
  };

  const saveHighlight = async () => {
    const payload = {
      ...highlight,
      description: highlight.description || null,
      report_url: highlight.report_url || null,
      report_label: highlight.report_label || null,
    };
    const table = createClient().from("impact_highlights");
    const { error } = editingId
      ? await table.update(payload).eq("id", editingId)
      : await table.insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    setHighlightOpen(false);
    load();
  };

  const removeHighlight = async (id: string) => {
    if (!confirm("Delete?")) return;
    await createClient().from("impact_highlights").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const setS = <K extends keyof typeof EMPTY_STAT>(key: K, value: (typeof EMPTY_STAT)[K]) =>
    setStat((f) => ({ ...f, [key]: value }));
  const setH = <K extends keyof typeof EMPTY_HIGHLIGHT>(
    key: K,
    value: (typeof EMPTY_HIGHLIGHT)[K],
  ) => setHighlight((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Impact &amp; Partnerships</h1>
        <p className="text-sm text-muted-foreground">Manage impact stats and partnership highlights</p>
      </div>

      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats">Impact Stats ({stats.length})</TabsTrigger>
          <TabsTrigger value="highlights">Partnership Highlights ({highlights.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={newStat}>
              <Plus className="w-4 h-4 mr-2" /> Add Stat
            </Button>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : stats.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">No stats yet.</Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.map((s) => (
                <Card key={s.id} className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-2xl font-bold text-primary">{s.value}</p>
                      <p className="text-sm text-foreground">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.page}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => editStat(s)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeStat(s.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="highlights" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button onClick={newHighlight}>
              <Plus className="w-4 h-4 mr-2" /> Add Highlight
            </Button>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : highlights.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">No highlights yet.</Card>
          ) : (
            <div className="space-y-3">
              {highlights.map((h) => (
                <Card key={h.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">{h.title}</span>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{h.description}</p>
                    {h.report_url && <p className="text-xs text-primary mt-1">{h.report_label}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => editHighlight(h)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeHighlight(h.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={statOpen} onOpenChange={setStatOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Impact Stat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Value</Label>
                <Input value={stat.value} onChange={(e) => setS("value", e.target.value)} placeholder="20,000+" />
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={stat.label}
                  onChange={(e) => setS("label", e.target.value)}
                  placeholder="women reached"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={stat.description}
                onChange={(e) => setS("description", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Page</Label>
                <Input
                  value={stat.page}
                  onChange={(e) => setS("page", e.target.value)}
                  placeholder="home or partner"
                />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={stat.display_order}
                  onChange={(e) => setS("display_order", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={stat.is_published} onCheckedChange={(v) => setS("is_published", v)} />
              <Label>Published</Label>
            </div>
            <Button className="w-full" onClick={saveStat}>
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={highlightOpen} onOpenChange={setHighlightOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Partnership Highlight</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={highlight.title} onChange={(e) => setH("title", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={highlight.description}
                onChange={(e) => setH("description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Report URL</Label>
                <Input
                  value={highlight.report_url}
                  onChange={(e) => setH("report_url", e.target.value)}
                  placeholder="/reports/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Report Label</Label>
                <Input
                  value={highlight.report_label}
                  onChange={(e) => setH("report_label", e.target.value)}
                  placeholder="Download Report"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Input value={highlight.icon} onChange={(e) => setH("icon", e.target.value)} placeholder="users" />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={highlight.display_order}
                  onChange={(e) => setH("display_order", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={highlight.is_published}
                onCheckedChange={(v) => setH("is_published", v)}
              />
              <Label>Published</Label>
            </div>
            <Button className="w-full" onClick={saveHighlight}>
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
