-- Separa as medidas de membros pareados em esquerdo/direito -- assimetria
-- entre os dois lados é algo que faz sentido acompanhar separadamente.
alter table bioimpedancia_logs
  drop column if exists coxa_cm,
  drop column if exists panturrilha_cm,
  drop column if exists braco_contraido_cm,
  drop column if exists braco_relaxado_cm;

alter table bioimpedancia_logs
  add column if not exists coxa_direita_cm numeric,
  add column if not exists coxa_esquerda_cm numeric,
  add column if not exists panturrilha_direita_cm numeric,
  add column if not exists panturrilha_esquerda_cm numeric,
  add column if not exists braco_contraido_direito_cm numeric,
  add column if not exists braco_contraido_esquerdo_cm numeric,
  add column if not exists braco_relaxado_direito_cm numeric,
  add column if not exists braco_relaxado_esquerdo_cm numeric;
