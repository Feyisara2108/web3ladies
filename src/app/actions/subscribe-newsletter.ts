"use server";

import { createClient } from "@/lib/supabase/server";

export type SubscribeState = { ok: boolean; message: string };

/**
 * Newsletter subscribe. Stored as a submission with form_key = 'newsletter'
 * (no form config needed) so it shows up in the admin Submissions view. Anon
 * inserts are permitted by RLS; reads are admin-only.
 */
export async function subscribeNewsletter(email: string): Promise<SubscribeState> {
  const trimmed = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  try {
    const supabase = await createClient();
    const { data: submission, error } = await supabase
      .from("submissions")
      .insert({ form_key: "newsletter", source: "form", meta: {} })
      .select("id")
      .single();
    if (error || !submission) throw error ?? new Error("insert failed");

    await supabase.from("submission_values").insert({
      submission_id: submission.id,
      field_name: "Email",
      value: trimmed,
    });
    return { ok: true, message: "You're subscribed! Watch your inbox." };
  } catch (err) {
    console.error("[subscribeNewsletter] failed:", (err as Error).message);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
