-- Faltava a policy de UPDATE em template_exercises -- só existiam INSERT e
-- DELETE. Sem ela, um UPDATE simplesmente afeta 0 linhas silenciosamente
-- sob RLS (não dá erro, só não muda nada), o que bloqueava qualquer
-- edição de série/repetições/exercício na ficha já montada.
create policy "template_exercises_update_own" on template_exercises
  for update using (
    exists (
      select 1 from workout_templates
      where workout_templates.id = template_exercises.template_id
        and workout_templates.criado_por = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from workout_templates
      where workout_templates.id = template_exercises.template_id
        and workout_templates.criado_por = auth.uid()
    )
  );
