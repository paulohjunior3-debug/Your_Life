"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Objetivo } from "@/lib/supabase/types";

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

  const update = {
    nome: String(formData.get("nome") ?? "").trim(),
    idade: parseOptionalNumber(formData.get("idade")),
    telefone: parseOptionalText(formData.get("telefone")),
    academia: parseOptionalText(formData.get("academia")),
    instrutor: parseOptionalText(formData.get("instrutor")),
    altura_cm: parseOptionalNumber(formData.get("altura_cm")),
    peso_inicial_kg: parseOptionalNumber(formData.get("peso_inicial_kg")),
    objetivo: parseOptionalText(formData.get("objetivo")) as Objetivo | null,
  };

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
