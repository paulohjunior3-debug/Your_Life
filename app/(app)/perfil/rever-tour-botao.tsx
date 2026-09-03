"use client";

import { Compass } from "lucide-react";

export function ReverTourBotao() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("reabrir-tour"))}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 font-medium text-foreground transition-colors hover:bg-card"
    >
      <Compass size={16} />
      Ver tour novamente
    </button>
  );
}
