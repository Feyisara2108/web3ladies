"use client";

import { useState } from "react";
import { GripVertical, Pencil, Plus, Save, Trash2, X } from "lucide-react";
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
import type { FormFieldConfig } from "@/lib/form-configs";

type FormConfigRow = {
  id: string;
  form_type: string;
  form_title: string | null;
  form_description: string | null;
  submit_label: string | null;
  fields: FormFieldConfig[];
};

const FORM_LABELS: Record<string, string> = {
  community: "Community Join",
  venture_builder: "Venture Builder",
  partner: "Partner Inquiry",
  event_host: "Event Host Request",
  membership: "Membership Application",
};

const FIELD_TYPES = ["text", "email", "textarea", "select"];

const newField = (): FormFieldConfig => ({
  name: `field_${Date.now()}`,
  label: "",
  type: "text",
  required: false,
  placeholder: "",
  order: 999,
});

const sortedFields = (fields: unknown) =>
  (Array.isArray(fields) ? (fields as FormFieldConfig[]) : []).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

export default function AdminFormConfigPage() {
  const {
    data = [],
    isFetching: loading,
    refetch: load,
  } = useAdminRows<FormConfigRow>("form_configs", { column: "form_type" });
  const configs = data.map((c) => ({ ...c, fields: sortedFields(c.fields) }));
  const [editing, setEditing] = useState<FormConfigRow | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (config: FormConfigRow) =>
    setEditing({ ...config, fields: config.fields.map((f, i) => ({ ...f, order: i })) });

  const updateField = (index: number, patch: Partial<FormFieldConfig>) => {
    if (!editing) return;
    const fields = [...editing.fields];
    fields[index] = { ...fields[index], ...patch };
    setEditing({ ...editing, fields });
  };

  const addField = () => {
    if (editing)
      setEditing({ ...editing, fields: [...editing.fields, { ...newField(), order: editing.fields.length }] });
  };

  const removeField = (index: number) => {
    if (!editing) return;
    const fields = editing.fields.filter((_, i) => i !== index).map((f, i) => ({ ...f, order: i }));
    setEditing({ ...editing, fields });
  };

  const moveField = (index: number, direction: number) => {
    if (!editing) return;
    const target = index + direction;
    if (target < 0 || target >= editing.fields.length) return;
    const fields = [...editing.fields];
    [fields[index], fields[target]] = [fields[target], fields[index]];
    setEditing({ ...editing, fields: fields.map((f, i) => ({ ...f, order: i })) });
  };

  const save = async () => {
    if (!editing) return;
    for (const f of editing.fields) {
      if (!f.label.trim()) {
        toast.error("All fields must have a label");
        return;
      }
      if (!f.name.trim()) {
        toast.error("All fields must have a field name");
        return;
      }
    }
    setSaving(true);
    const { error } = await createClient()
      .from("form_configs")
      .update({
        form_title: editing.form_title,
        form_description: editing.form_description,
        submit_label: editing.submit_label,
        fields: JSON.parse(JSON.stringify(editing.fields)),
        updated_at: new Date().toISOString(),
      })
      .eq("id", editing.id);
    if (error) toast.error("Failed to save");
    else {
      toast.success("Form configuration saved!");
      setEditing(null);
      load();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Form Configuration</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage form fields, labels, and validation for each public form
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {configs.map((config) => (
            <Card key={config.id} className="p-5 space-y-3">
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-foreground">
                  {FORM_LABELS[config.form_type] || config.form_type}
                </h3>
                <p className="text-xs text-muted-foreground">{config.form_title}</p>
              </div>
              <div className="space-y-1">
                {config.fields.map((f) => (
                  <div key={f.name} className="flex items-center gap-2 text-xs">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${f.required ? "bg-primary" : "bg-muted-foreground/30"}`}
                    />
                    <span className="text-foreground">{f.label}</span>
                    <span className="text-muted-foreground ml-auto">{f.type}</span>
                    {f.required && <span className="text-primary text-[10px] font-medium">Required</span>}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => startEdit(config)}>
                <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Fields
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit: {editing ? FORM_LABELS[editing.form_type] || editing.form_type : ""}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Form Title</Label>
                  <Input
                    value={editing.form_title || ""}
                    onChange={(e) => setEditing({ ...editing, form_title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    value={editing.form_description || ""}
                    onChange={(e) => setEditing({ ...editing, form_description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Submit Button Label</Label>
                  <Input
                    value={editing.submit_label || ""}
                    onChange={(e) => setEditing({ ...editing, submit_label: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Fields</Label>
                  <Button variant="outline" size="sm" onClick={addField}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Field
                  </Button>
                </div>
                {editing.fields.map((f, i) => (
                  <Card key={i} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-0.5">
                          <button
                            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                            onClick={() => moveField(i, -1)}
                            disabled={i === 0}
                          >
                            <GripVertical className="w-3.5 h-3.5 rotate-180" />
                          </button>
                          <button
                            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                            onClick={() => moveField(i, 1)}
                            disabled={i === editing.fields.length - 1}
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Field {i + 1}</span>
                      </div>
                      <button
                        onClick={() => removeField(i)}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={f.label}
                          onChange={(e) => updateField(i, { label: e.target.value })}
                          placeholder="e.g. Full name"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Field Name (key)</Label>
                        <Input
                          value={f.name}
                          onChange={(e) =>
                            updateField(i, { name: e.target.value.replace(/\s+/g, "_").toLowerCase() })
                          }
                          placeholder="e.g. full_name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Select value={f.type} onValueChange={(v) => updateField(i, { type: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Placeholder</Label>
                        <Input
                          value={f.placeholder ?? ""}
                          onChange={(e) => updateField(i, { placeholder: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!!f.required}
                          onCheckedChange={(v) => updateField(i, { required: v })}
                        />
                        <Label className="text-xs">Required</Label>
                      </div>
                    </div>
                    {f.type === "select" && (
                      <div className="space-y-1">
                        <Label className="text-xs">Options (one per line)</Label>
                        <Textarea
                          value={(f.options ?? []).join("\n")}
                          onChange={(e) =>
                            updateField(i, { options: e.target.value.split("\n").filter((o) => o.trim()) })
                          }
                          rows={3}
                          placeholder={"Option 1\nOption 2\nOption 3"}
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setEditing(null)}>
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button onClick={save} disabled={saving}>
                  <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
