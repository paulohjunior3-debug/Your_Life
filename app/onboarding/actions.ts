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

  const biotipo = String(formData.get("biotipo") ?? "");
  if (
    biotipo !== "ectomorfo" &&
    biotipo !== "mesomorfo" &&
    biotipo !== "endomorfo"
  ) {
    redirect(`/onboarding?erro=${encodeURIComponent("Selecione o biotipo")}`);
  }

  const altura_cm = parseOptionalNumber(formData.get("altura_cm"));
  if (altura_cm == null || altura_cm <= 0 || altura_cm > 260) {
    redirect(
      `/onboarding?erro=${encodeURIComponent("Informe uma altura válida")}`
    );
  }

  const objetivo = parseOptionalText(formData.get("objetivo"));
  if (!objetivo) {
    redirect(
      `/onboarding?erro=${encodeURIComponent("Selecione seu objetivo")}`
    );
  }

  const update: ProfileUpdate = {
    sexo: sexo as Sexo,
    biotipo: biotipo as Biotipo,
    altura_cm,
    objetivo: objetivo as Objetivo,
  };

  // Campo de peso inicial trancado (>48h) vem desabilitado no form, então
  // nem é enviado -- só mexe nele se realmente veio no submit, senão o
  // trigger do banco barra a "mudança" pra null.
  if (formData.has("peso_inicial_kg")) {
    const peso = parseOptionalNumber(formData.get("peso_inicial_kg"));
    if (peso == null || peso <= 0 || peso > 400) {
      redirect(
        `/onboarding?erro=${encodeURIComponent("Informe um peso válido")}`
      );
    }
    update.peso_inicial_kg = peso;
  } else {
    const { data: perfilAtual } = await supabase
      .from("profiles")
      .select("peso_inicial_kg")
      .eq("id", user.id)
      .maybeSingle();
    if (perfilAtual?.peso_inicial_kg == null) {
      redirect(
        `/onboarding?erro=${encodeURIComponent("Informe um peso válido")}`
      );
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (error) {
    redirect(`/onboarding?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/perfil");
  revalidatePath("/acompanhamento");
  redirect("/onboarding/comecar");
}
