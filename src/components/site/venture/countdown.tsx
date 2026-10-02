"use client";

import { useSyncExternalStore } from "react";

const subscribe = (tick: () => void) => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
};

/** Live days/hours/minutes/seconds until `deadline`. Renders nothing on the server. */
export function useCountdown(deadline: string) {
  const now = useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
  if (now === null) return null;
  const left = Math.max(0, Math.floor(new Date(deadline).getTime() / 1000) - now);
  return {
    days: Math.floor(left / 86400),
    hours: Math.floor((left % 86400) / 3600),
    minutes: Math.floor((left % 3600) / 60),
    seconds: left % 60,
    closed: left === 0,
  };
}

export function Countdown({ deadline, tone = "light" }: { deadline: string; tone?: "light" | "dark" }) {
  const t = useCountdown(deadline);
  const box =
    tone === "dark"
      ? "bg-white/10 border-white/20 text-white"
      : "bg-card border-border text-foreground";
  const label = tone === "dark" ? "text-white/70" : "text-muted-foreground";

  if (t?.closed) {
    return <p className={`text-sm font-medium ${label}`}>Applications for this cohort have closed.</p>;
  }

  const units = [
    { value: t?.days, label: "days" },
    { value: t?.hours, label: "hrs" },
    { value: t?.minutes, label: "min" },
    { value: t?.seconds, label: "sec" },
  ];

  return (
    <div className="flex gap-2" aria-label="Time left to apply">
      {units.map((u) => (
        <div key={u.label} className={`rounded-xl border px-3 py-2 min-w-[60px] text-center ${box}`}>
          <div className="font-display text-2xl font-bold tabular-nums leading-none">
            {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
          </div>
          <div className={`mt-1 text-[10px] uppercase tracking-wider ${label}`}>{u.label}</div>
        </div>
      ))}
    </div>
  );
}
