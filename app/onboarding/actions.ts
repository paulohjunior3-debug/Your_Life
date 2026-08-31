"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Objetivo, Sexo } from "@/lib/supabase/types";

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : Number(str);
}

function parseOptionalText(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

export async function salvarOnboarding(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const sexo = String(formData.get("sexo") ?? "");
  if (sexo !== "masculino" && sexo !== "feminino") {
    redirect(
      `/onboarding?erro=${encodeURIComponent("Selecione o sexo biológico")}`
    );
  }

  const update = {
    sexo: sexo as Sexo,
    altura_cm: parseOptionalNumber(formData.get("altura_cm")),
    peso_inicial_kg: parseOptionalNumber(formData.get("peso_inicial_kg")),
    objetivo: parseOptionalText(formData.get("objetivo")) as Objetivo | null,
  };

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (error) {
    redirect(`/onboarding?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/perfil");
  revalidatePath("/acompanhamento");
  redirect("/inicio");
}
