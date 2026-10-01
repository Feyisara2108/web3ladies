"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

type FounderForm = {
  id?: string;
  name: string;
  title: string;
  story: string;
  quote: string;
  image_url: string;
  is_published: boolean;
};

const EMPTY: FounderForm = {
  name: "",
  title: "",
  story: "",
  quote: "",
  image_url: "",
  is_published: true,
};

export default function AdminFounderStoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "founder_story"],
    refetchOnMount: "always",
    queryFn: async (): Promise<FounderForm> => {
      const { data: row } = await createClient()
        .from("founder_story")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (!row) return EMPTY;
      return {
        id: row.id,
        name: row.name,
        title: row.title || "",
        story: row.story || "",
        quote: row.quote || "",
        image_url: row.image_url || "",
        is_published: row.is_published ?? true,
      };
    },
  });

  if (isLoading || !data) return <p className="text-muted-foreground">Loading…</p>;
  return <FounderStoryEditor key={data.id ?? "new"} initial={data} />;
}

function FounderStoryEditor({ initial }: { initial: FounderForm }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      title: form.title || null,
      story: form.story || null,
      quote: form.quote || null,
      image_url: form.image_url || null,
      is_published: form.is_published,
    };
    const table = createClient().from("founder_story");
    let error;
    if (form.id) {
      ({ error } = await table.update(payload).eq("id", form.id));
    } else {
      const result = await table.insert(payload).select().single();
      error = result.error;
      if (result.data) setForm((f) => ({ ...f, id: result.data.id }));
    }
    setSaving(false);
    if (error) toast.error("Failed to save");
    else toast.success("Founder story saved!");
  };

  const set = <K extends keyof FounderForm>(key: K, value: FounderForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Founder Story</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage the founder&apos;s story section on the homepage
        </p>
      </div>
      <Card className="p-6 space-y-5 max-w-2xl">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Founder's name" />
        </div>
        <div className="space-y-2">
          <Label>Title / Role</Label>
          <Input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Founder, Web3Ladies"
          />
        </div>
        <div className="space-y-2">
          <Label>Story</Label>
          <Textarea
            rows={5}
            value={form.story}
            onChange={(e) => set("story", e.target.value)}
            placeholder="The motivation behind Web3Ladies…"
          />
        </div>
        <div className="space-y-2">
          <Label>Quote</Label>
          <Textarea
            rows={3}
            value={form.quote}
            onChange={(e) => set("quote", e.target.value)}
            placeholder="A memorable quote from the founder"
          />
        </div>
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            value={form.image_url}
            onChange={(e) => set("image_url", e.target.value)}
            placeholder="https://…"
          />
          <p className="text-xs text-muted-foreground">
            Upload the image via Media, then paste the URL here
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => set("is_published", e.target.checked)}
            id="published"
            className="rounded"
          />
          <Label htmlFor="published">Published</Label>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving…" : "Save"}
        </Button>
      </Card>
    </div>
  );
}
