-- Row Level Security: cada usuário só lê/escreve os próprios dados de
-- treino, peso e perfil (ver ESPECIFICACAO.md seção 7). O ranking público
-- é exposto separadamente por uma view `public_ranking` (ver migration
-- seguinte) que roda como security definer e nunca expõe cargas/pesos.

alter table profiles enable row level security;
alter table exercises enable row level security;
alter table workout_templates enable row level security;
alter table template_exercises enable row level security;
alter table sessions enable row level security;
alter table session_sets enable row level security;
alter table body_logs enable row level security;
alter table seasons enable row level security;
alter table season_entries enable row level security;
alter table race_optins enable row level security;
alter table diet_plans enable row level security;
alter table diet_checkins enable row level security;

-- profiles: cada um só vê/edita o próprio perfil.
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- exercises / workout_templates / template_exercises: catálogo compartilhado,
-- leitura livre para autenticados. Escrita fica a cargo do service role
-- (Supabase Studio / telas de admin da v1), não há policy de INSERT/UPDATE
-- para o role `authenticated`.
create policy "exercises_select_all" on exercises
  for select to authenticated using (true);

create policy "workout_templates_select_all" on workout_templates
  for select to authenticated using (true);

create policy "template_exercises_select_all" on template_exercises
  for select to authenticated using (true);

-- sessions: dono do treino.
create policy "sessions_select_own" on sessions
  for select using (auth.uid() = user_id);

create policy "sessions_insert_own" on sessions
  for insert with check (auth.uid() = user_id);

create policy "sessions_update_own" on sessions
  for update using (auth.uid() = user_id);

create policy "sessions_delete_own" on sessions
  for delete using (auth.uid() = user_id);

-- session_sets: dono via sessão.
create policy "session_sets_select_own" on session_sets
  for select using (
    exists (
      select 1 from sessions
      where sessions.id = session_sets.session_id
        and sessions.user_id = auth.uid()
    )
  );

create policy "session_sets_insert_own" on session_sets
  for insert with check (
    exists (
      select 1 from sessions
      where sessions.id = session_sets.session_id
        and sessions.user_id = auth.uid()
    )
  );

create policy "session_sets_update_own" on session_sets
  for update using (
    exists (
      select 1 from sessions
      where sessions.id = session_sets.session_id
        and sessions.user_id = auth.uid()
    )
  );

create policy "session_sets_delete_own" on session_sets
  for delete using (
    exists (
      select 1 from sessions
      where sessions.id = session_sets.session_id
        and sessions.user_id = auth.uid()
    )
  );

-- body_logs: dono do registro de peso.
create policy "body_logs_select_own" on body_logs
  for select using (auth.uid() = user_id);

create policy "body_logs_insert_own" on body_logs
  for insert with check (auth.uid() = user_id);

create policy "body_logs_update_own" on body_logs
  for update using (auth.uid() = user_id);

create policy "body_logs_delete_own" on body_logs
  for delete using (auth.uid() = user_id);

-- seasons: leitura livre (calendário da corrida é público entre o grupo).
create policy "seasons_select_all" on seasons
  for select to authenticated using (true);

-- season_entries: cada um só enxerga a própria pontuação pela tabela crua;
-- o ranking público passa pela view `public_ranking`. Escrita é feita pelo
-- job de fechamento de temporada via service role.
create policy "season_entries_select_own" on season_entries
  for select using (auth.uid() = user_id);

-- race_optins: dono do opt-in.
create policy "race_optins_select_own" on race_optins
  for select using (auth.uid() = user_id);

create policy "race_optins_insert_own" on race_optins
  for insert with check (auth.uid() = user_id);

create policy "race_optins_update_own" on race_optins
  for update using (auth.uid() = user_id);

-- diet_plans / diet_checkins: dono do dado (sem interface na v1, mas a
-- proteção já vale desde já).
create policy "diet_plans_select_own" on diet_plans
  for select using (auth.uid() = user_id);

create policy "diet_plans_insert_own" on diet_plans
  for insert with check (auth.uid() = user_id);

create policy "diet_plans_update_own" on diet_plans
  for update using (auth.uid() = user_id);

create policy "diet_checkins_select_own" on diet_checkins
  for select using (auth.uid() = user_id);

create policy "diet_checkins_insert_own" on diet_checkins
  for insert with check (auth.uid() = user_id);

create policy "diet_checkins_update_own" on diet_checkins
  for update using (auth.uid() = user_id);
