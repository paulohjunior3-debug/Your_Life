"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Biotipo, Database, Objetivo, Sexo } from "@/lib/supabase/types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : Number(str);
}

function parseOptionalText(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const update: ProfileUpdate = {
    nome: String(formData.get("nome") ?? "").trim(),
    idade: parseOptionalNumber(formData.get("idade")),
    telefone: parseOptionalText(formData.get("telefone")),
    academia: parseOptionalText(formData.get("academia")),
    instrutor: parseOptionalText(formData.get("instrutor")),
    altura_cm: parseOptionalNumber(formData.get("altura_cm")),
    objetivo: parseOptionalText(formData.get("objetivo")) as Objetivo | null,
    sexo: parseOptionalText(formData.get("sexo")) as Sexo | null,
    biotipo: parseOptionalText(formData.get("biotipo")) as Biotipo | null,
  };

  // Campo de peso inicial trancado (>48h) vem desabilitado no form, então
  // nem é enviado -- só mexe nele se realmente veio no submit, senão o
  // trigger do banco barra a "mudança" pra null.
  if (formData.has("peso_inicial_kg")) {
    update.peso_inicial_kg = parseOptionalNumber(
      formData.get("peso_inicial_kg")
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (error) {
    redirect(`/perfil?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/perfil");
  redirect("/perfil?sucesso=1");
}
