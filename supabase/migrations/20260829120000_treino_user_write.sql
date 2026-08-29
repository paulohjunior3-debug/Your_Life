-- Cada usuário monta seu próprio treino a partir do catálogo de exercícios
-- (o personal passa o treino, a pessoa monta a lista pelo app). Antes só o
-- service role podia escrever em workout_templates/template_exercises.
create policy "workout_templates_insert_own" on workout_templates
  for insert with check (auth.uid() = criado_por);

create policy "template_exercises_insert_own" on template_exercises
  for insert with check (
    exists (
      select 1 from workout_templates
      where workout_templates.id = template_exercises.template_id
        and workout_templates.criado_por = auth.uid()
    )
  );
