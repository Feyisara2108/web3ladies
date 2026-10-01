"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const media = () => createClient().storage.from("media");
const publicUrl = (name: string) => media().getPublicUrl(name).data.publicUrl;

export default function AdminMediaPage() {
  const {
    data: files = [],
    isLoading: loading,
    refetch: load,
  } = useQuery({
    queryKey: ["admin", "media"],
    refetchOnMount: "always",
    queryFn: async () => {
      const { data } = await media().list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });
      return data ?? [];
    },
  });
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { error } = await media().upload(`${Date.now()}.${file.name.split(".").pop()}`, file);
    if (error) toast.error(error.message);
    else toast.success("Uploaded");
    setUploading(false);
    load();
    if (fileInput.current) fileInput.current.value = "";
  };

  const copyUrl = (name: string) => {
    navigator.clipboard.writeText(publicUrl(name));
    toast.success("URL copied");
  };

  const remove = async (name: string) => {
    if (!confirm("Delete this file?")) return;
    await media().remove([name]);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground">Upload and manage images and files</p>
        </div>
        <div>
          <input
            ref={fileInput}
            type="file"
            className="hidden"
            accept="image/*,video/*,.pdf"
            onChange={upload}
          />
          <Button onClick={() => fileInput.current?.click()} disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" /> {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : files.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No files uploaded yet.</Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((f) => (
            <Card key={f.id ?? f.name} className="overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                <img src={publicUrl(f.name)} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" onClick={() => copyUrl(f.name)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => remove(f.name)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate">{f.name}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
