-- Lista de quem tá com o opt-in da corrida ativo agora -- ou seja, quem
-- vai valer pra próxima semana (inclui tanto quem já pontua essa semana
-- quanto quem ativou no meio da semana e só entra oficialmente segunda
-- que vem). security definer pelo mesmo motivo de ranking_semana_atual():
-- ler race_optins/profiles de todo mundo, mas só devolve nome/avatar.
create or replace function participantes_proxima_semana()
returns table (
  user_id uuid,
  nome text,
  avatar_url text,
  ja_pontuando boolean
)
language sql
security definer
set search_path = public
stable
as $$
  with semana as (
    select
      date_trunc('week', (now() at time zone 'America/Sao_Paulo'))::date as inicio_atual
  )
  select
    p.id as user_id,
    p.nome,
    p.avatar_url,
    (ro.ativo_desde <= s.inicio_atual) as ja_pontuando
  from race_optins ro
  join profiles p on p.id = ro.user_id
  cross join semana s
  where ro.ativo = true
  order by p.nome asc;
$$;

grant execute on function participantes_proxima_semana() to authenticated;
