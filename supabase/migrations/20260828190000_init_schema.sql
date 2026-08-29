-- Schema inicial do Your_Life.
-- Ver ESPECIFICACAO.md seção 4 para o modelo de dados completo e seção 4
-- "Decisões de modelagem importantes" para o racional de cada escolha.

create extension if not exists "pgcrypto";

create type objetivo as enum ('ganho', 'perda');
create type status_sessao as enum ('completo', 'parcial', 'nao_realizado');
create type tipo_temporada as enum ('semanal', 'trimestral');

-- profiles ------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  idade int,
  telefone text,
  academia text,
  instrutor text,
  avatar_url text,
  altura_cm int,
  peso_inicial_kg numeric,
  data_inicio date not null default current_date,
  objetivo objetivo,
  criado_em timestamptz not null default now()
);

-- exercises -------------------------------------------------------------
create table exercises (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  grupo_muscular text,
  gif_url text,
  criado_em timestamptz not null default now()
);

-- workout_templates -------------------------------------------------------
create table workout_templates (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  criado_por uuid references profiles (id) on delete set null,
  criado_em timestamptz not null default now()
);

-- template_exercises --------------------------------------------------
create table template_exercises (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references workout_templates (id) on delete cascade,
  exercise_id uuid not null references exercises (id) on delete restrict,
  series int not null,
  rep_min int not null,
  rep_max int not null,
  ordem int not null default 0,
  check (rep_min <= rep_max)
);

create index template_exercises_template_id_idx on template_exercises (template_id);

-- sessions --------------------------------------------------------------
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  template_id uuid references workout_templates (id) on delete set null,
  data date not null default current_date,
  status status_sessao not null default 'nao_realizado',
  criado_em timestamptz not null default now()
);

create index sessions_user_id_data_idx on sessions (user_id, data);

-- session_sets ------------------------------------------------------------
create table session_sets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions (id) on delete cascade,
  exercise_id uuid not null references exercises (id) on delete restrict,
  serie_num int not null,
  carga_kg numeric,
  reps int,
  concluida boolean not null default false
);

create index session_sets_session_id_idx on session_sets (session_id);

-- body_logs ---------------------------------------------------------------
-- `semana` guarda a segunda-feira da semana ISO do registro, usada para
-- garantir no máximo 1 pesagem por usuário por semana.
create table body_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  data date not null default current_date,
  semana date not null,
  peso_kg numeric not null,
  unique (user_id, semana)
);

-- seasons -------------------------------------------------------------
create table seasons (
  id uuid primary key default gen_random_uuid(),
  tipo tipo_temporada not null,
  data_inicio date not null,
  data_fim date not null,
  encerrada boolean not null default false,
  check (data_inicio < data_fim)
);

create index seasons_tipo_encerrada_idx on seasons (tipo, encerrada);

-- season_entries --------------------------------------------------------
create table season_entries (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  pontos numeric not null default 0,
  colocacao_final int,
  unique (season_id, user_id)
);

create index season_entries_season_id_idx on season_entries (season_id);

-- race_optins -------------------------------------------------------------
create table race_optins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  ativo boolean not null default false,
  criado_em timestamptz not null default now()
);

-- diet_plans / diet_checkins ---------------------------------------------
-- Previstas no schema mas sem interface na v1 (ver ESPECIFICACAO.md seção 8).
create table diet_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  objetivo objetivo not null,
  descricao text
);

create table diet_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  data date not null default current_date,
  cumpriu boolean not null default false,
  unique (user_id, data)
);
