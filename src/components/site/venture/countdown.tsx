"use client";

import { useSyncExternalStore } from "react";

const subscribe = (tick: () => void) => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
};

/** Live days/hours/minutes/seconds until `deadline`; null during server rendering. */
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
