-- Completa exercicios de Costas, Biceps, Triceps, Ombros, Abdomen e
-- Adutores/Abdutores que ainda nao tinham imagem, usando o
-- free-exercise-db (dominio publico, licenca Unlicense). Fotos
-- estaticas, nao gif animado -- ver README para trocar por gif de
-- verdade quando houver fonte licenciada.

-- Exercicios existentes
update exercises set gif_url = '/exercicios/puxada-frente-pulley.jpg' where nome = 'Puxada frente (pulley)';
update exercises set gif_url = '/exercicios/remada-curvada-barra.jpg' where nome = 'Remada curvada (barra)';
update exercises set gif_url = '/exercicios/remada-baixa-cabo.jpg' where nome = 'Remada baixa (cabo)';
update exercises set gif_url = '/exercicios/levantamento-terra.jpg' where nome = 'Levantamento terra';
update exercises set gif_url = '/exercicios/puxada-triangulo.jpg' where nome = 'Puxada triângulo';
update exercises set gif_url = '/exercicios/rosca-alternada.jpg' where nome = 'Rosca alternada';
update exercises set gif_url = '/exercicios/rosca-martelo.jpg' where nome = 'Rosca martelo';
update exercises set gif_url = '/exercicios/rosca-direta-barra.jpg' where nome = 'Rosca direta (barra)';
update exercises set gif_url = '/exercicios/triceps-corda-polia.jpg' where nome = 'Tríceps corda (polia)';
update exercises set gif_url = '/exercicios/triceps-testa-barra.jpg' where nome = 'Tríceps testa (barra)';
update exercises set gif_url = '/exercicios/desenvolvimento-militar-barra.jpg' where nome = 'Desenvolvimento militar (barra)';
update exercises set gif_url = '/exercicios/desenvolvimento-arnold.jpg' where nome = 'Desenvolvimento Arnold';
update exercises set gif_url = '/exercicios/elevacao-lateral-halteres.jpg' where nome = 'Elevação lateral (halteres)';
update exercises set gif_url = '/exercicios/elevacao-lateral-cabo.jpg' where nome = 'Elevação lateral (cabo)';
update exercises set gif_url = '/exercicios/elevacao-frontal-halteres.jpg' where nome = 'Elevação frontal (halteres)';
update exercises set gif_url = '/exercicios/elevacao-frontal-barra.jpg' where nome = 'Elevação frontal (barra)';
update exercises set gif_url = '/exercicios/crucifixo-invertido-halteres.jpg' where nome = 'Crucifixo invertido (halteres)';
update exercises set gif_url = '/exercicios/face-pull.jpg' where nome = 'Face pull';
update exercises set gif_url = '/exercicios/abdominal-supra.jpg' where nome = 'Abdominal supra';
update exercises set gif_url = '/exercicios/prancha.jpg' where nome = 'Prancha';
update exercises set gif_url = '/exercicios/elevacao-de-pernas.jpg' where nome = 'Elevação de pernas';
update exercises set gif_url = '/exercicios/abdominal-infra.jpg' where nome = 'Abdominal infra';
update exercises set gif_url = '/exercicios/abdominal-obliquo.jpg' where nome = 'Abdominal oblíquo';
update exercises set gif_url = '/exercicios/elevacao-de-joelhos.jpg' where nome = 'Elevação de joelhos';
update exercises set gif_url = '/exercicios/abdominal-polia.jpg' where nome = 'Abdominal na polia';
update exercises set gif_url = '/exercicios/abdominal-maquina.jpg' where nome = 'Abdominal máquina';
update exercises set gif_url = '/exercicios/roda-abdominal.jpg' where nome = 'Roda abdominal';
update exercises set gif_url = '/exercicios/cadeira-adutora.jpg' where nome = 'Cadeira adutora';
update exercises set gif_url = '/exercicios/cadeira-abdutora.jpg' where nome = 'Cadeira abdutora';

-- Exercicios novos
insert into exercises (nome, grupo_muscular, gif_url) values
  ('Puxada supinada', 'Costas', '/exercicios/puxada-supinada.jpg'),
  ('Remada curvada (halteres)', 'Costas', '/exercicios/remada-curvada-halteres.jpg'),
  ('Remada cavalinho', 'Costas', '/exercicios/remada-cavalinho.jpg'),
  ('Remada unilateral (serrote)', 'Costas', '/exercicios/remada-unilateral-serrote.jpg'),
  ('Levantamento terra romeno', 'Costas', '/exercicios/levantamento-terra-romeno.jpg'),
  ('Barra fixa', 'Costas', '/exercicios/barra-fixa.jpg'),
  ('Barra fixa (pegada supinada)', 'Costas', '/exercicios/barra-fixa-supinada.jpg'),
  ('Remada máquina', 'Costas', '/exercicios/remada-maquina.jpg'),
  ('Rosca direta (halteres)', 'Bíceps', '/exercicios/rosca-direta-halteres.jpg'),
  ('Rosca scott', 'Bíceps', '/exercicios/rosca-scott.jpg'),
  ('Rosca concentrada', 'Bíceps', '/exercicios/rosca-concentrada.jpg'),
  ('Rosca cabo', 'Bíceps', '/exercicios/rosca-cabo.jpg'),
  ('Tríceps francês', 'Tríceps', '/exercicios/triceps-frances.jpg'),
  ('Mergulho no banco', 'Tríceps', '/exercicios/mergulho-banco.jpg'),
  ('Mergulho em paralelas', 'Tríceps', '/exercicios/mergulho-paralelas.jpg'),
  ('Tríceps coice', 'Tríceps', '/exercicios/triceps-coice.jpg'),
  ('Tríceps barra (polia)', 'Tríceps', '/exercicios/triceps-barra-polia.jpg'),
  ('Tríceps testa (halteres)', 'Tríceps', '/exercicios/triceps-testa-halteres.jpg');
