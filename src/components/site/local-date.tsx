"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Formats a date in the visitor's own timezone, like the live site (which
 * formatted dates in the browser). Renders nothing during server rendering.
 */
export function LocalDate({ iso, options }: { iso: string; options: Intl.DateTimeFormatOptions }) {
  const text = useSyncExternalStore(
    subscribe,
    () => new Date(iso).toLocaleDateString("en-US", options),
    () => "",
  );
  return <>{text}</>;
}
