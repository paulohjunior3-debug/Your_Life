-- GIFs enviados manualmente pelo time (pasta gif/), processados e
-- comprimidos (gifsicle) em public/exercicios/. Atualiza os exercicios
-- ja existentes e cadastra as variacoes novas de Peito/Ombros/Costas.

-- Exercicios existentes: so troca a imagem
update exercises set gif_url = '/exercicios/crossover-polia-alta.gif' where nome = 'Crossover (polia alta)';
update exercises set gif_url = '/exercicios/crossover-polia-baixa.gif' where nome = 'Crossover (polia baixa)';
update exercises set gif_url = '/exercicios/supino-declinado-halteres.gif' where nome = 'Supino declinado (halteres)';
update exercises set gif_url = '/exercicios/supino-fechado.gif' where nome = 'Supino fechado';
update exercises set gif_url = '/exercicios/supino-inclinado-halteres.gif' where nome = 'Supino inclinado (halteres)';
update exercises set gif_url = '/exercicios/supino-maquina.gif' where nome = 'Supino máquina';
update exercises set gif_url = '/exercicios/supino-reto-barra.gif' where nome = 'Supino reto (barra)';
update exercises set gif_url = '/exercicios/supino-reto-halteres.gif' where nome = 'Supino reto (halteres)';
update exercises set gif_url = '/exercicios/supino-declinado-barra.gif' where nome = 'Supino declinado (barra)';
update exercises set gif_url = '/exercicios/supino-inclinado-barra.gif' where nome = 'Supino inclinado (barra)';

-- Exercicios novos
insert into exercises (nome, grupo_muscular, gif_url) values
  ('Crossover (polia média)', 'Peito', '/exercicios/crossover-polia-media.gif'),
  ('Crossover unilateral (cabo)', 'Peito', '/exercicios/crossover-unilateral-cabo.gif'),
  ('Crossover peitoral superior (cabo)', 'Peito', '/exercicios/crossover-peitoral-superior-cabo.gif'),
  ('Crossover na alavanca', 'Peito', '/exercicios/crossover-alavanca.gif'),
  ('Crucifixo inclinado (cabo)', 'Peito', '/exercicios/crucifixo-inclinado-cabo.gif'),
  ('Elevação lateral cruzada (crossover)', 'Ombros', '/exercicios/elevacao-lateral-cruzada-crossover.gif'),
  ('Remada cruzada (crossover)', 'Costas', '/exercicios/remada-cruzada-crossover.gif'),
  ('Supino alternado (halteres)', 'Peito', '/exercicios/supino-alternado-halteres.gif'),
  ('Supino declinado unilateral pegada martelo (halteres)', 'Peito', '/exercicios/supino-declinado-unilateral-martelo-halteres.gif'),
  ('Supino inclinado pegada invertida (halteres)', 'Peito', '/exercicios/supino-inclinado-pegada-invertida-halteres.gif'),
  ('Supino inclinado pegada martelo (halteres)', 'Peito', '/exercicios/supino-inclinado-pegada-martelo-halteres.gif'),
  ('Supino inclinado na alavanca', 'Peito', '/exercicios/supino-inclinado-alavanca.gif'),
  ('Supino inclinado máquina pegada martelo', 'Peito', '/exercicios/supino-inclinado-maquina-pegada-martelo.gif'),
  ('Supino invertido pegada fechada', 'Peito', '/exercicios/supino-invertido-pegada-fechada.gif'),
  ('Supino unilateral pegada reversa (halteres)', 'Peito', '/exercicios/supino-unilateral-pegada-reversa-halteres.gif'),
  ('Supino unilateral (cabo)', 'Peito', '/exercicios/supino-unilateral-cabo.gif'),
  ('Supino na alavanca', 'Peito', '/exercicios/supino-alavanca.gif'),
  ('Supino pegada invertida (halteres)', 'Peito', '/exercicios/supino-pegada-invertida-halteres.gif'),
  ('Supino sentado, pegada fechada (cabo)', 'Peito', '/exercicios/supino-sentado-pegada-fechada-cabo.gif'),
  ('Supino inclinado no Smith', 'Peito', '/exercicios/supino-inclinado-smith.gif'),
  ('Supino com barra no chão', 'Peito', '/exercicios/supino-barra-no-chao.gif'),
  ('Supino sentado (cabo)', 'Peito', '/exercicios/supino-sentado-cabo.gif'),
  ('Supino pegada fechada (halteres)', 'Peito', '/exercicios/supino-pegada-fechada-halteres.gif'),
  ('Supino kettlebell unilateral', 'Peito', '/exercicios/supino-kettlebell-unilateral.gif'),
  ('Supino kettlebell no chão', 'Peito', '/exercicios/supino-kettlebell-no-chao.gif'),
  ('Supino pegada aberta (barra)', 'Peito', '/exercicios/supino-pegada-aberta-barra.gif'),
  ('Supino declinado na alavanca', 'Peito', '/exercicios/supino-declinado-alavanca.gif'),
  ('Supino declinado na máquina', 'Peito', '/exercicios/supino-declinado-maquina.gif'),
  ('Supino declinado no Smith', 'Peito', '/exercicios/supino-declinado-smith.gif'),
  ('Supino declinado pegada martelo (halteres)', 'Peito', '/exercicios/supino-declinado-pegada-martelo-halteres.gif'),
  ('Supino em pé (faixa elástica)', 'Peito', '/exercicios/supino-em-pe-faixa-elastica.gif'),
  ('Supino inclinado (cabo)', 'Peito', '/exercicios/supino-inclinado-cabo.gif'),
  ('Supino inclinado, pegada fechada (halteres)', 'Peito', '/exercicios/supino-inclinado-pegada-fechada-halteres.gif'),
  ('Supino inclinado, pegada fechada (barra)', 'Peito', '/exercicios/supino-inclinado-pegada-fechada-barra.jpg'),
  ('Supino inclinado na máquina', 'Peito', '/exercicios/supino-inclinado-maquina.gif'),
  ('Supino invertido, pegada aberta', 'Peito', '/exercicios/supino-invertido-pegada-aberta.gif'),
  ('Supino máquina (miolo do peitoral)', 'Peito', '/exercicios/supino-maquina-miolo-peitoral.gif'),
  ('Supino no Smith', 'Peito', '/exercicios/supino-smith.gif'),
  ('Supino inclinado 30°, pegada invertida', 'Peito', '/exercicios/supino-inclinado-30-pegada-invertida.gif'),
  ('Supino no Smith com triângulo', 'Peito', '/exercicios/supino-smith-triangulo.gif'),
  ('Supino pegada martelo (barra)', 'Peito', '/exercicios/supino-pegada-martelo-barra.gif'),
  ('Supino reto em pé (crossover)', 'Peito', '/exercicios/supino-reto-em-pe-crossover.gif'),
  ('Supino unilateral na alavanca', 'Peito', '/exercicios/supino-unilateral-alavanca.gif'),
  ('Elevação frontal, cabo duplo (crossover)', 'Ombros', '/exercicios/elevacao-frontal-cabo-duplo-crossover.gif');
