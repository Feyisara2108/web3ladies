"use server";

import { createClient } from "@/lib/supabase/server";
import { getFormConfig } from "@/lib/queries";

export type SubmitState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

/**
 * Public form submission. Server-side authoritative: re-loads the form config
 * from the database, validates required fields, then writes a submission +
 * per-field values. Anon inserts are permitted by RLS; reads are not.
 */
export async function submitForm(
  formKey: string,
  values: Record<string, string>,
): Promise<SubmitState> {
  const config = await getFormConfig(formKey);
  if (!config) {
    return {
      ok: false,
      message:
        "This form isn't available yet. Please connect the database and configure it in the admin.",
    };
  }

  // Server-side validation against the stored config.
  const errors: Record<string, string> = {};
  for (const field of config.fields) {
    const value = (values[field.name] ?? "").trim();
    if (field.is_required && !value) {
      errors[field.name] = `${field.label} is required.`;
    }
    if (value && field.field_type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field.name] = "Please enter a valid email address.";
    }
  }
  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  try {
    const supabase = await createClient();
    const { data: submission, error: subErr } = await supabase
      .from("submissions")
      .insert({ form_id: config.id, form_key: config.key, source: "form" })
      .select("id")
      .single();
    if (subErr || !submission) throw subErr ?? new Error("insert failed");

    const rows = config.fields.map((field) => ({
      submission_id: submission.id,
      field_id: field.id,
      field_name: field.label,
      value: values[field.name] ?? null,
    }));
    const { error: valErr } = await supabase.from("submission_values").insert(rows);
    if (valErr) throw valErr;

    return { ok: true, message: config.success_message };
  } catch (err) {
    console.error("[submitForm] failed:", (err as Error).message);
    return {
      ok: false,
      message: "Something went wrong submitting the form. Please try again.",
    };
  }
}
