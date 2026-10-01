"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState, type ChangeEvent } from "react";
import { Calendar, Image as ImageIcon, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
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
import type { EventRow } from "@/lib/types";

const EMPTY = {
  title: "",
  description: "",
  event_type: "Workshop",
  event_date: "",
  location: "",
  is_virtual: false,
  registration_url: "",
  category: "Web3 x AI Direction & Ecosystem",
  is_featured: false,
  is_published: true,
  status: "upcoming",
  recording_url: "",
  report_url: "",
  gallery_images: [] as string[],
  platform: "",
};

const TYPES = [
  "Technical Workshop",
  "Founder AMA",
  "Panel Conversation",
  "Career Talk",
  "Community Meetup",
  "Demo Session",
  "Masterclass",
  "Special Focus Event",
];

const CATEGORIES = [
  "Web3 x AI Direction & Ecosystem",
  "Income & Financial Readiness",
  "Brand & Visibility",
  "Community & Storytelling",
  "Career Movement",
];

const PLATFORMS = [
  "Twitter Space",
  "Instagram Live",
  "TikTok Live",
  "YouTube Live",
  "LinkedIn Live",
  "Private Event",
  "In-Person",
];

const statusClass = (status: string) =>
  status === "active"
    ? "bg-green-100 text-green-700"
    : status === "past"
      ? "bg-muted text-muted-foreground"
      : "bg-blue-100 text-blue-700";

export default function AdminEventsPage() {
  const {
    data: events = [],
    isLoading: loading,
    refetch: load,
  } = useAdminRows<EventRow>("events", { column: "event_date", ascending: false });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setForm(EMPTY);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (e: EventRow) => {
    setForm({
      title: e.title,
      description: e.description ?? "",
      event_type: e.event_type ?? "Workshop",
      event_date: e.event_date?.slice(0, 16) ?? "",
      location: e.location ?? "",
      is_virtual: !!e.is_virtual,
      registration_url: e.registration_url ?? "",
      category: e.category ?? "",
      is_featured: e.is_featured,
      is_published: e.is_published,
      status: e.status ?? "upcoming",
      recording_url: e.recording_url ?? "",
      report_url: e.report_url ?? "",
      gallery_images: e.gallery_images ?? [],
      platform: e.platform ?? "",
    });
    setEditingId(e.id);
    setOpen(true);
  };

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (form.gallery_images.length >= 5) {
      toast.error("Maximum 5 gallery images allowed");
      return;
    }
    setUploading(true);
    const path = `events/${Date.now()}.${file.name.split(".").pop()}`;
    const storage = createClient().storage.from("media");
    const { error } = await storage.upload(path, file);
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = storage.getPublicUrl(path);
    setForm((f) => ({ ...f, gallery_images: [...f.gallery_images, data.publicUrl] }));
    toast.success("Image uploaded");
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
  };

  const removeImage = (index: number) =>
    setForm((f) => ({ ...f, gallery_images: f.gallery_images.filter((_, i) => i !== index) }));

  const save = async () => {
    const payload = {
      title: form.title,
      description: form.description || null,
      event_type: form.event_type,
      event_date: form.event_date || null,
      location: form.location || null,
      is_virtual: form.is_virtual,
      registration_url: form.registration_url || null,
      category: form.category,
      is_featured: form.is_featured,
      is_published: form.is_published,
      status: form.status,
      recording_url: form.recording_url || null,
      report_url: form.report_url || null,
      gallery_images: form.gallery_images,
      platform: form.platform || null,
    };
    const table = createClient().from("events");
    const { error } = editingId
      ? await table.update(payload).eq("id", editingId)
      : await table.insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Event updated" : "Event created");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await createClient().from("events").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Events</h1>
          <p className="text-sm text-muted-foreground">Manage workshops, AMAs, panels, and more</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : events.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No events yet.</Card>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <Card key={e.id} className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{e.title}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {e.event_type}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusClass(e.status ?? "upcoming")}`}
                  >
                    {e.status ?? "upcoming"}
                  </span>
                  {!e.is_published && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                {e.event_date && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(e.event_date).toLocaleDateString()}
                  </p>
                )}
                {(e.gallery_images?.length ?? 0) > 0 && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> {e.gallery_images!.length} gallery image(s)
                  </p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(e)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(e.id)}>
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
            <DialogTitle>{editingId ? "Edit" : "Add"} Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.event_type} onValueChange={(v) => set("event_type", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((v) => (
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
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
              <Label>Platform</Label>
              <Select value={form.platform} onValueChange={(v) => set("platform", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Label>Date &amp; Time</Label>
                <Input
                  type="datetime-local"
                  value={form.event_date}
                  onChange={(e) => set("event_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. Lagos, Nigeria"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Registration URL</Label>
              <Input
                value={form.registration_url}
                onChange={(e) => set("registration_url", e.target.value)}
                placeholder="https://"
              />
            </div>
            <div className="border-t border-border pt-4 space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Post-Event Content</p>
              <div className="space-y-2">
                <Label>Recording URL</Label>
                <Input
                  value={form.recording_url}
                  onChange={(e) => set("recording_url", e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Event Report URL</Label>
                <Input
                  value={form.report_url}
                  onChange={(e) => set("report_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Gallery Images (max 5)</Label>
                <div className="grid grid-cols-5 gap-2">
                  {form.gallery_images.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                    >
                      <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {form.gallery_images.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      disabled={uploading}
                      className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/40 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInput}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={upload}
                />
                {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_virtual} onCheckedChange={(v) => set("is_virtual", v)} />
                <Label>Virtual Event</Label>
              </div>
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
