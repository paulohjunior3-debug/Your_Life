-- Medidas de fita métrica (circunferências), complementares aos dados de
-- bioimpedância -- guardadas na mesma tabela pra não precisar de outra
-- aba/tela.
alter table bioimpedancia_logs
  add column pescoco_cm numeric,
  add column peito_cm numeric,
  add column cintura_cm numeric,
  add column abdomen_cm numeric,
  add column quadril_cm numeric,
  add column coxa_cm numeric,
  add column panturrilha_cm numeric,
  add column braco_contraido_cm numeric,
  add column braco_relaxado_cm numeric;
