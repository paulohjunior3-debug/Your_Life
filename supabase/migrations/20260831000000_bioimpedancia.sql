-- Registros de bioimpedância, preenchidos à mão pelo usuário (sem limite de
-- frequência, ao contrário de body_logs -- cada exame vira um registro).
create table bioimpedancia_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  data date not null default current_date,
  peso_kg numeric,
  percentual_gordura numeric,
  massa_magra_kg numeric,
  massa_muscular_kg numeric,
  agua_corporal_pct numeric,
  massa_ossea_kg numeric,
  gordura_visceral numeric,
  taxa_metabolica_basal numeric,
  idade_metabolica int,
  criado_em timestamptz not null default now()
);

create index bioimpedancia_logs_user_id_data_idx
  on bioimpedancia_logs (user_id, data desc);

alter table bioimpedancia_logs enable row level security;

create policy "bioimpedancia_logs_select_own" on bioimpedancia_logs
  for select using (auth.uid() = user_id);

create policy "bioimpedancia_logs_insert_own" on bioimpedancia_logs
  for insert with check (auth.uid() = user_id);

create policy "bioimpedancia_logs_update_own" on bioimpedancia_logs
  for update using (auth.uid() = user_id);

create policy "bioimpedancia_logs_delete_own" on bioimpedancia_logs
  for delete using (auth.uid() = user_id);
