"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter, type SubscribeState } from "@/app/actions/subscribe-newsletter";

/**
 * Email capture used by the newsletter block and the Cohorts / Circle waitlist
 * cards. `formKey` tags where the signup came from; `buttonLabel` and `compact`
 * adapt it for the small waitlist cards.
 */
export function NewsletterSubscribe({
  buttonLabel = "Subscribe",
  formKey = "newsletter",
  compact = false,
}: {
  buttonLabel?: string;
  formKey?: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscribeState | null>(null);
  const [pending, startTransition] = useTransition();

  if (state?.ok) {
    return <p className="text-sm font-medium text-primary">{state.message}</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => setState(await subscribeNewsletter(email, formKey)));
      }}
      className={compact ? "flex flex-col gap-2" : "mx-auto flex max-w-md flex-col gap-3 sm:flex-row"}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <Button type="submit" disabled={pending} size={compact ? "sm" : "default"} className={compact ? "w-full" : ""}>
        {pending ? "Submitting…" : buttonLabel}
      </Button>
      {state && !state.ok && (
        <p className="text-xs text-destructive">{state.message}</p>
      )}
    </form>
  );
}
