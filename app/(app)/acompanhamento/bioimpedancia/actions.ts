"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function numeroOuNull(valor: FormDataEntryValue | null) {
  const str = String(valor ?? "").replace(",", ".").trim();
  if (!str) return null;
  const num = Number(str);
  return Number.isNaN(num) ? null : num;
}

export async function registrarBioimpedancia(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = String(formData.get("data") ?? "");

  const { error } = await supabase.from("bioimpedancia_logs").insert({
    user_id: user.id,
    data: data || undefined,
    peso_kg: numeroOuNull(formData.get("peso_kg")),
    percentual_gordura: numeroOuNull(formData.get("percentual_gordura")),
    massa_magra_kg: numeroOuNull(formData.get("massa_magra_kg")),
    massa_muscular_kg: numeroOuNull(formData.get("massa_muscular_kg")),
    agua_corporal_pct: numeroOuNull(formData.get("agua_corporal_pct")),
    massa_ossea_kg: numeroOuNull(formData.get("massa_ossea_kg")),
    gordura_visceral: numeroOuNull(formData.get("gordura_visceral")),
    taxa_metabolica_basal: numeroOuNull(
      formData.get("taxa_metabolica_basal")
    ),
    idade_metabolica: numeroOuNull(formData.get("idade_metabolica")),
    pescoco_cm: numeroOuNull(formData.get("pescoco_cm")),
    peito_cm: numeroOuNull(formData.get("peito_cm")),
    cintura_cm: numeroOuNull(formData.get("cintura_cm")),
    abdomen_cm: numeroOuNull(formData.get("abdomen_cm")),
    quadril_cm: numeroOuNull(formData.get("quadril_cm")),
    coxa_direita_cm: numeroOuNull(formData.get("coxa_direita_cm")),
    coxa_esquerda_cm: numeroOuNull(formData.get("coxa_esquerda_cm")),
    panturrilha_direita_cm: numeroOuNull(
      formData.get("panturrilha_direita_cm")
    ),
    panturrilha_esquerda_cm: numeroOuNull(
      formData.get("panturrilha_esquerda_cm")
    ),
    braco_contraido_direito_cm: numeroOuNull(
      formData.get("braco_contraido_direito_cm")
    ),
    braco_contraido_esquerdo_cm: numeroOuNull(
      formData.get("braco_contraido_esquerdo_cm")
    ),
    braco_relaxado_direito_cm: numeroOuNull(
      formData.get("braco_relaxado_direito_cm")
    ),
    braco_relaxado_esquerdo_cm: numeroOuNull(
      formData.get("braco_relaxado_esquerdo_cm")
    ),
  });

  if (error) {
    redirect(
      `/acompanhamento/bioimpedancia?erro=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath("/acompanhamento/bioimpedancia");
  revalidatePath("/acompanhamento");
  redirect("/acompanhamento/bioimpedancia?sucesso=1");
}

export async function excluirBioimpedancia(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "");

  await supabase
    .from("bioimpedancia_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/acompanhamento/bioimpedancia");
  revalidatePath("/acompanhamento");
  redirect("/acompanhamento/bioimpedancia");
}
