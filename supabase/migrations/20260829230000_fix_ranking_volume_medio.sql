-- A funcao original comparava o VOLUME TOTAL da semana. Isso faz quem
-- treinou mais vezes parecer ter "progredido" muito mais (o total cresce
-- so por ter mais sessoes, nao por levantar mais peso), inflando a
-- variacao percentual e dominando a pontuacao -- o oposto do que a
-- especificacao queria (competir por progressao relativa, ja que a
-- frequencia de treino ja conta separadamente via treinos_concluidos*10).
-- Troca para MEDIA de volume por sessao, que mede progressao de
-- intensidade de verdade.
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
    select s.user_id,
      sum(ss.carga_kg * ss.reps) / count(distinct s.id) as volume_medio
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
    select s.user_id,
      sum(ss.carga_kg * ss.reps) / count(distinct s.id) as volume_medio
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
      when coalesce(va.volume_medio, 0) = 0 then 0
      else round(((coalesce(vat.volume_medio, 0) - va.volume_medio) / va.volume_medio) * 100, 1)
    end as variacao_volume,
    round(
      coalesce(t.treinos_concluidos, 0) * 10 +
      (case
        when coalesce(va.volume_medio, 0) = 0 then 0
        else ((coalesce(vat.volume_medio, 0) - va.volume_medio) / va.volume_medio) * 100
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
