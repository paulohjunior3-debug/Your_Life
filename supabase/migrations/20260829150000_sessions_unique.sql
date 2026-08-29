-- No máximo uma sessão por usuário/treino/dia — permite reabrir o treino
-- de hoje (upsert) sem duplicar ao navegar pra fora e voltar.
alter table sessions
  add constraint sessions_user_template_data_key
  unique (user_id, template_id, data);
