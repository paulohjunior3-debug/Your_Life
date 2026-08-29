-- O índice único parcial (com WHERE) não é reconhecido pelo ON CONFLICT
-- gerado pelo upsert do Supabase. Troca por uma constraint normal — na
-- prática não muda nada, porque o Postgres já trata NULL como distinto de
-- NULL em constraints únicas (várias linhas com dia_semana null continuam
-- permitidas).
drop index if exists workout_templates_criado_por_dia_semana_key;

alter table workout_templates
  add constraint workout_templates_criado_por_dia_semana_key
  unique (criado_por, dia_semana);
