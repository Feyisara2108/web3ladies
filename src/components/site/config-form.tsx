"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import {
  DEFAULT_FORM_CONFIGS,
  type FormConfigData,
  type FormFieldConfig,
} from "@/lib/form-configs";

type Values = Record<string, string>;

const isConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const emptyValues = (fields: FormFieldConfig[], initial?: Values) =>
  Object.fromEntries(fields.map((f) => [f.name, initial?.[f.name] ?? ""]));

const sortFields = (fields: FormFieldConfig[]) =>
  [...fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/**
 * Admin-configurable form (port of the live site's form renderer). Renders the
 * `form_configs` row for `formType` and inserts answers into `form_submissions`.
 */
export function ConfigForm({
  formType,
  fallbackTitle,
  fallbackDescription,
  fallbackSubmitLabel,
  fallbackFields,
  onSuccess,
  className,
  initialValues,
  fieldsOnly = false,
}: {
  formType: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackSubmitLabel?: string;
  fallbackFields?: FormFieldConfig[];
  onSuccess?: () => void;
  className?: string;
  initialValues?: Values;
  fieldsOnly?: boolean;
}) {
  const defaultConfig = DEFAULT_FORM_CONFIGS[formType];
  const [config, setConfig] = useState<FormConfigData | null>(
    defaultConfig ? { ...defaultConfig, fields: sortFields(defaultConfig.fields) } : null,
  );
  const [values, setValues] = useState<Values>(() =>
    emptyValues(defaultConfig?.fields ?? fallbackFields ?? [], initialValues),
  );
  const [errors, setErrors] = useState<Values>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isConfigured()) return;
    createClient()
      .from("form_configs")
      .select("*")
      .eq("form_type", formType)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const fields = sortFields(Array.isArray(data.fields) ? data.fields : []);
        setConfig({
          form_type: data.form_type,
          form_title: data.form_title,
          form_description: data.form_description,
          submit_label: data.submit_label,
          fields,
        });
        setValues(emptyValues(fields, initialValues));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only when the form changes
  }, [formType]);

  useEffect(() => {
    // Prefill answers when a parent passes new initial values (e.g. a selected option).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialValues) setValues((v) => ({ ...v, ...initialValues }));
  }, [initialValues]);

  const fields = config?.fields ?? fallbackFields ?? [];
  const title = config?.form_title ?? fallbackTitle;
  const description = config?.form_description ?? fallbackDescription;
  const submitLabel = config?.submit_label ?? fallbackSubmitLabel ?? "Submit";

  const validate = () => {
    const errs: Values = {};
    fields.forEach((f) => {
      const v = (values[f.name] ?? "").trim();
      if (f.required && !v) errs[f.name] = `${f.label} is required`;
      if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        errs[f.name] = "Invalid email address";
    });
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    const { error } = isConfigured()
      ? await createClient().from("form_submissions").insert({ form_type: formType, data: values })
      : { error: new Error("Supabase is not configured") };
    if (error) {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }
    toast.success("Submitted successfully!");
    setValues(emptyValues(fields));
    setErrors({});
    setSubmitting(false);
    onSuccess?.();
  };

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  return (
    <div className={className}>
      {!fieldsOnly && (title || description) && (
        <div className="text-center space-y-2 mb-6">
          {title && <h2 className="text-2xl font-display font-bold text-foreground">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((f) => (
          <div key={f.name} className="space-y-1.5">
            {f.type === "select" ? (
              <Select value={values[f.name] || ""} onValueChange={(v) => set(f.name, v)}>
                <SelectTrigger>
                  <SelectValue placeholder={f.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {(f.options ?? []).map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : f.type === "textarea" ? (
              <Textarea
                placeholder={f.placeholder}
                value={values[f.name] || ""}
                onChange={(e) => set(f.name, e.target.value)}
              />
            ) : (
              <Input
                type={f.type === "email" ? "email" : "text"}
                placeholder={f.placeholder}
                value={values[f.name] || ""}
                onChange={(e) => set(f.name, e.target.value)}
                maxLength={f.type === "email" ? 255 : 500}
              />
            )}
            {errors[f.name] && <p className="text-xs text-destructive">{errors[f.name]}</p>}
          </div>
        ))}
        <Button type="submit" className="w-full rounded-full" size="lg" disabled={submitting}>
          {submitting ? "Submitting..." : submitLabel}
        </Button>
      </form>
    </div>
  );
}
