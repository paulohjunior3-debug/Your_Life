-- View de ranking público: expõe apenas nome, avatar, pontos e colocação de
-- quem fez opt-in na corrida (race_optins.ativo = true). Nunca expõe cargas
-- ou pesos individuais (ver ESPECIFICACAO.md seção 7).
--
-- security_invoker = false (padrão) faz a view rodar com os privilégios do
-- dono (postgres), contornando a RLS restritiva de `season_entries` e
-- `profiles` só para essas colunas específicas.
create view public_ranking
with (security_invoker = false) as
select
  se.season_id,
  se.user_id,
  p.nome,
  p.avatar_url,
  se.pontos,
  se.colocacao_final
from season_entries se
join profiles p on p.id = se.user_id
join race_optins ro on ro.user_id = se.user_id
where ro.ativo = true;

grant select on public_ranking to authenticated;
