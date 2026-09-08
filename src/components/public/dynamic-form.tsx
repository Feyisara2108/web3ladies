"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { submitForm, type SubmitState } from "@/app/actions/submit-form";
import type { FormConfig } from "@/lib/types";

const inputBase =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Renders a configurable public form from its DB config. If the form isn't
 * configured yet (no DB / not seeded), shows a friendly placeholder so the page
 * still renders during setup.
 */
export function DynamicForm({
  config,
  formKey,
  fallbackTitle,
}: {
  config: FormConfig | null;
  formKey: string;
  fallbackTitle?: string;
}) {
  const [state, setState] = useState<SubmitState | null>(null);
  const [pending, startTransition] = useTransition();

  if (!config) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
        <h3 className="font-display text-lg font-semibold">
          {fallbackTitle ?? "Form coming soon"}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This form will appear here once the database is connected and the form
          is configured in the admin.
        </p>
      </div>
    );
  }

  if (state?.ok) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <p className="mt-4 text-base font-medium">{state.message}</p>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    for (const field of config!.fields) {
      values[field.name] = String(formData.get(field.name) ?? "");
    }
    startTransition(async () => {
      setState(await submitForm(formKey, values));
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(config.title || config.description) && (
        <div>
          {config.title && (
            <h3 className="font-display text-xl font-semibold">{config.title}</h3>
          )}
          {config.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {config.description}
            </p>
          )}
        </div>
      )}

      {config.fields.map((field) => {
        const err = state?.errors?.[field.name];
        const id = `field-${field.name}`;
        return (
          <div key={field.id} className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium">
              {field.label}
              {field.is_required && <span className="ml-0.5 text-destructive">*</span>}
            </label>

            {field.field_type === "textarea" ? (
              <textarea
                id={id}
                name={field.name}
                required={field.is_required}
                placeholder={field.placeholder ?? undefined}
                rows={4}
                className={cn(inputBase, err && "border-destructive")}
              />
            ) : field.field_type === "select" ? (
              <select
                id={id}
                name={field.name}
                required={field.is_required}
                defaultValue=""
                className={cn(inputBase, err && "border-destructive")}
              >
                <option value="" disabled>
                  {field.placeholder ?? "Select an option"}
                </option>
                {(field.options ?? []).map((o) => (
                  <option key={o.id} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : field.field_type === "checkbox" ? (
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input
                  id={id}
                  type="checkbox"
                  name={field.name}
                  value="yes"
                  required={field.is_required}
                  className="mt-0.5 size-4 rounded border-input"
                />
                {field.help_text ?? field.label}
              </label>
            ) : (
              <input
                id={id}
                type={field.field_type}
                name={field.name}
                required={field.is_required}
                placeholder={field.placeholder ?? undefined}
                className={cn(inputBase, err && "border-destructive")}
              />
            )}

            {field.help_text && field.field_type !== "checkbox" && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>
        );
      })}

      {state && !state.ok && !state.errors && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Submitting…" : config.submit_label}
      </Button>
    </form>
  );
}
