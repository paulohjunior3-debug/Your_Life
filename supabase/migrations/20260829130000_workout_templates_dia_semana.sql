-- Associa cada treino (workout_template) a um dia da semana, pra suportar
-- a montagem de ficha completa (seg a dom) e, no futuro, mostrar
-- automaticamente o treino do dia na aba Início.
alter table workout_templates
  add column dia_semana text
    check (dia_semana in ('segunda','terca','quarta','quinta','sexta','sabado','domingo'));

-- No máximo um treino por dia da semana por usuário (permite "reeditar" um
-- dia sem duplicar).
create unique index workout_templates_criado_por_dia_semana_key
  on workout_templates (criado_por, dia_semana)
  where dia_semana is not null;

-- Necessário pro fluxo de "montar/editar ficha" poder atualizar um treino
-- existente (upsert) e substituir os exercícios de um dia já montado.
create policy "workout_templates_update_own" on workout_templates
  for update using (auth.uid() = criado_por);

create policy "template_exercises_delete_own" on template_exercises
  for delete using (
    exists (
      select 1 from workout_templates
      where workout_templates.id = template_exercises.template_id
        and workout_templates.criado_por = auth.uid()
    )
  );
