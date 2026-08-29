"use client";

import { useState, useTransition } from "react";
import { Play, WifiOff } from "lucide-react";

export function BotaoIniciarTreino({
  action,
  templateId,
  data,
  label,
}: {
  action: (formData: FormData) => void;
  templateId: string;
  data: string;
  label: string;
}) {
  const [offline, setOffline] = useState(false);
  const [pending, startTransition] = useTransition();

  function aoClicar() {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setOffline(true);
      return;
    }
    setOffline(false);
    const formData = new FormData();
    formData.set("template_id", templateId);
    formData.set("data", data);
    startTransition(() => {
      action(formData);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={aoClicar}
        disabled={pending}
        className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        <Play size={16} />
        {pending ? "Abrindo..." : label}
      </button>
      {offline && (
        <p className="flex items-center gap-1.5 text-xs text-status-partial">
          <WifiOff size={14} />
          Você está offline. Conecte-se à internet pra iniciar ou continuar o
          treino.
        </p>
      )}
    </div>
  );
}
