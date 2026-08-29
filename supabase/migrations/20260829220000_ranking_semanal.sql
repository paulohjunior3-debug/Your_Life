-- Marca desde quando o opt-in está ativo, pra aplicar a regra "quem ativa
-- no meio da semana só entra na temporada seguinte" (ESPECIFICACAO.md
-- seção 6).
alter table race_optins add column ativo_desde timestamptz;
update race_optins set ativo_desde = criado_em where ativo = true;

-- Ranking da semana atual (segunda a domingo, fuso America/Sao_Paulo),
-- calculado ao vivo. security definer pra poder ler sessions/session_sets
-- de todo mundo (RLS normal restringe a cada usuário só os próprios
-- treinos), mas só devolve nome/pontos -- nunca carga ou peso individual,
-- seguindo a mesma regra de privacidade da view public_ranking.
create or replace function ranking_semana_atual()
returns table (
  user_id uuid,
  nome text,
  avatar_url text,
  treinos_concluidos bigint,
  variacao_volume numeric,
  pontos numeric
)
language sql
security definer
set search_path = public
stable
as $$
  with semana as (
    select
      date_trunc('week', (now() at time zone 'America/Sao_Paulo'))::date as inicio_atual
  ),
  limites as (
    select
      inicio_atual,
      inicio_atual + 6 as fim_atual,
      inicio_atual - 7 as inicio_anterior,
      inicio_atual - 1 as fim_anterior
    from semana
  ),
  participantes as (
    select p.id as user_id, p.nome, p.avatar_url
    from profiles p
    join race_optins ro on ro.user_id = p.id
    cross join limites l
    where ro.ativo = true
      and ro.ativo_desde is not null
      and ro.ativo_desde <= l.inicio_atual
  ),
  treinos as (
    select s.user_id, count(*) as treinos_concluidos
    from sessions s
    cross join limites l
    where s.status = 'completo'
      and s.data between l.inicio_atual and l.fim_atual
    group by s.user_id
  ),
  volume_atual as (
    select s.user_id, sum(ss.carga_kg * ss.reps) as volume
    from sessions s
    join session_sets ss on ss.session_id = s.id
    cross join limites l
    where ss.concluida = true
      and ss.carga_kg is not null
      and ss.reps is not null
      and s.data between l.inicio_atual and l.fim_atual
    group by s.user_id
  ),
  volume_anterior as (
    select s.user_id, sum(ss.carga_kg * ss.reps) as volume
    from sessions s
    join session_sets ss on ss.session_id = s.id
    cross join limites l
    where ss.concluida = true
      and ss.carga_kg is not null
      and ss.reps is not null
      and s.data between l.inicio_anterior and l.fim_anterior
    group by s.user_id
  )
  select
    part.user_id,
    part.nome,
    part.avatar_url,
    coalesce(t.treinos_concluidos, 0) as treinos_concluidos,
    case
      when coalesce(va.volume, 0) = 0 then 0
      else round(((coalesce(vat.volume, 0) - va.volume) / va.volume) * 100, 1)
    end as variacao_volume,
    round(
      coalesce(t.treinos_concluidos, 0) * 10 +
      (case
        when coalesce(va.volume, 0) = 0 then 0
        else ((coalesce(vat.volume, 0) - va.volume) / va.volume) * 100
      end),
      1
    ) as pontos
  from participantes part
  left join treinos t on t.user_id = part.user_id
  left join volume_atual vat on vat.user_id = part.user_id
  left join volume_anterior va on va.user_id = part.user_id
  order by pontos desc, part.nome asc;
$$;

grant execute on function ranking_semana_atual() to authenticated;
