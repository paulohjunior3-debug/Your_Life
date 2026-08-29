"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { Database } from "@/lib/supabase/types";
import { updateProfile } from "./actions";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent disabled:opacity-50";
const labelClass = "text-sm text-foreground-secondary";

const CAMPOS_LEITURA: { label: string; value: (p: Profile) => string }[] = [
  { label: "Idade", value: (p) => (p.idade ? String(p.idade) : "—") },
  { label: "Telefone", value: (p) => p.telefone ?? "—" },
  { label: "Academia", value: (p) => p.academia ?? "—" },
  { label: "Instrutor", value: (p) => p.instrutor ?? "—" },
  { label: "Altura", value: (p) => (p.altura_cm ? `${p.altura_cm} cm` : "—") },
  {
    label: "Peso inicial",
    value: (p) => (p.peso_inicial_kg ? `${p.peso_inicial_kg} kg` : "—"),
  },
  {
    label: "Objetivo",
    value: (p) =>
      p.objetivo === "ganho"
        ? "Ganho de massa"
        : p.objetivo === "perda"
          ? "Perda de peso"
          : "—",
  },
  { label: "Data de início", value: (p) => p.data_inicio ?? "—" },
];

export function PerfilEditor({
  profile,
  travado,
}: {
  profile: Profile | null;
  travado: boolean;
}) {
  const [editando, setEditando] = useState(false);

  if (!editando) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {profile &&
            CAMPOS_LEITURA.map((campo) => (
              <div
                key={campo.label}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm text-foreground-secondary">
                  {campo.label}
                </span>
                <span className="text-sm text-foreground">
                  {campo.value(profile)}
                </span>
              </div>
            ))}
        </div>

        <button
          type="button"
          onClick={() => setEditando(true)}
          className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 font-medium text-foreground transition-colors hover:bg-card"
        >
          <Pencil size={16} />
          Editar perfil
        </button>
      </div>
    );
  }

  return (
    <form action={updateProfile} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="nome" className={labelClass}>
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          defaultValue={profile?.nome ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="idade" className={labelClass}>
          Idade
        </label>
        <input
          id="idade"
          name="idade"
          type="number"
          min={0}
          defaultValue={profile?.idade ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="telefone" className={labelClass}>
          Telefone
        </label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          defaultValue={profile?.telefone ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="academia" className={labelClass}>
          Academia
        </label>
        <input
          id="academia"
          name="academia"
          type="text"
          defaultValue={profile?.academia ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="instrutor" className={labelClass}>
          Instrutor
        </label>
        <input
          id="instrutor"
          name="instrutor"
          type="text"
          defaultValue={profile?.instrutor ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="altura_cm" className={labelClass}>
          Altura (cm)
        </label>
        <input
          id="altura_cm"
          name="altura_cm"
          type="number"
          min={0}
          defaultValue={profile?.altura_cm ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="peso_inicial_kg" className={labelClass}>
          Peso inicial (kg)
        </label>
        <input
          id="peso_inicial_kg"
          name="peso_inicial_kg"
          type="number"
          min={0}
          step="0.1"
          disabled={travado}
          defaultValue={profile?.peso_inicial_kg ?? ""}
          className={inputClass}
        />
        {travado ? (
          <p className="text-xs text-foreground-secondary">
            Só pode ser editado nas primeiras 48h após o cadastro.
          </p>
        ) : (
          <p className="text-xs text-foreground-secondary">
            Editável só nas primeiras 48h após o cadastro — depois disso
            trava, pra não bagunçar o gráfico de evolução.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="objetivo" className={labelClass}>
          Objetivo
        </label>
        <select
          id="objetivo"
          name="objetivo"
          defaultValue={profile?.objetivo ?? ""}
          className={inputClass}
        >
          <option value="">Não definido</option>
          <option value="ganho">Ganho de massa</option>
          <option value="perda">Perda de peso</option>
        </select>
      </div>

      <div className="flex items-center justify-between px-1 py-1">
        <span className={labelClass}>Data de início</span>
        <span className="text-sm text-foreground">
          {profile?.data_inicio ?? "—"}
        </span>
      </div>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => setEditando(false)}
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 font-medium text-foreground transition-colors hover:bg-card"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
