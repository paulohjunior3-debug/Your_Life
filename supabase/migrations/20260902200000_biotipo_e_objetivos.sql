-- Biotipo: parâmetro de personalização de treino (não é diagnóstico
-- médico), usado pelo gerador de treino pronto do onboarding.
create type biotipo_corporal as enum ('ectomorfo', 'mesomorfo', 'endomorfo');

alter table profiles add column biotipo biotipo_corporal;

-- Objetivos mais específicos que "ganho/perda", pra dar contexto real ao
-- gerador de treino (hipertrofia e força treinam diferente, por exemplo).
-- Mantém os valores antigos no tipo (não dá pra remover valor de enum e
-- não há necessidade -- só deixam de aparecer como opção nas telas).
alter type objetivo add value if not exists 'hipertrofia';
alter type objetivo add value if not exists 'emagrecimento';
alter type objetivo add value if not exists 'definicao';
alter type objetivo add value if not exists 'manutencao';
alter type objetivo add value if not exists 'forca';
alter type objetivo add value if not exists 'condicionamento';
