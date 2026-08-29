-- Lote 2 de GIFs (ombros + pernas). Tambem reclassifica os exercicios
-- de pernas que estavam todos sob o grupo generico 'Pernas' em
-- categorias mais especificas: Quadriceps, Posterior, Panturrilha e
-- Adutores/Abdutores.

-- Exercicios existentes: imagem nova e, quando aplicavel, grupo mais especifico
update exercises set gif_url = '/exercicios/desenvolvimento-halteres.gif', grupo_muscular = 'Ombros' where nome = 'Desenvolvimento com halteres';
update exercises set gif_url = '/exercicios/desenvolvimento-maquina.gif', grupo_muscular = 'Ombros' where nome = 'Desenvolvimento máquina';
update exercises set gif_url = '/exercicios/encolhimento-ombros.gif', grupo_muscular = 'Ombros' where nome = 'Encolhimento de ombros';
update exercises set gif_url = '/exercicios/agachamento-livre.gif', grupo_muscular = 'Quadríceps' where nome = 'Agachamento livre';
update exercises set gif_url = '/exercicios/agachamento-bulgaro.gif', grupo_muscular = 'Quadríceps' where nome = 'Agachamento búlgaro';
update exercises set gif_url = '/exercicios/hack-squat.gif', grupo_muscular = 'Quadríceps' where nome = 'Hack squat';
update exercises set gif_url = '/exercicios/agachamento-smith.gif', grupo_muscular = 'Quadríceps' where nome = 'Agachamento smith';
update exercises set gif_url = '/exercicios/cadeira-extensora.gif', grupo_muscular = 'Quadríceps' where nome = 'Cadeira extensora';
update exercises set gif_url = '/exercicios/agachamento-sumo.gif', grupo_muscular = 'Posterior' where nome = 'Agachamento sumô';
update exercises set gif_url = '/exercicios/cadeira-flexora.gif', grupo_muscular = 'Posterior' where nome = 'Cadeira flexora';
update exercises set gif_url = '/exercicios/mesa-flexora.gif', grupo_muscular = 'Posterior' where nome = 'Mesa flexora';

-- Exercicios de pernas que nao ganharam gif nesse lote, so reclassificados
update exercises set grupo_muscular = 'Quadríceps' where nome = 'Leg press 45°';
update exercises set grupo_muscular = 'Quadríceps' where nome = 'Afundo (halteres)';
update exercises set grupo_muscular = 'Quadríceps' where nome = 'Leg press horizontal';
update exercises set grupo_muscular = 'Quadríceps' where nome = 'Afundo (barra)';
update exercises set grupo_muscular = 'Quadríceps' where nome = 'Passada';
update exercises set grupo_muscular = 'Posterior' where nome = 'Stiff (barra)';
update exercises set grupo_muscular = 'Posterior' where nome = 'Stiff (halteres)';
update exercises set grupo_muscular = 'Panturrilha' where nome = 'Panturrilha em pé';
update exercises set grupo_muscular = 'Panturrilha' where nome = 'Panturrilha sentado';
update exercises set grupo_muscular = 'Panturrilha' where nome = 'Panturrilha no leg press';
update exercises set grupo_muscular = 'Adutores/Abdutores' where nome = 'Cadeira adutora';
update exercises set grupo_muscular = 'Adutores/Abdutores' where nome = 'Cadeira abdutora';

-- Exercicios novos
insert into exercises (nome, grupo_muscular, gif_url) values
  ('Adução de ombro (faixa elástica)', 'Ombros', '/exercicios/aducao-ombro-faixa.gif'),
  ('Desenvolvimento alternado em pé (halteres)', 'Ombros', '/exercicios/desenvolvimento-alternado-em-pe-halteres.gif'),
  ('Desenvolvimento com rotação alternada (halteres)', 'Ombros', '/exercicios/desenvolvimento-rotacao-alternada-halteres.gif'),
  ('Desenvolvimento sentado (barra)', 'Ombros', '/exercicios/desenvolvimento-sentado-barra.gif'),
  ('Desenvolvimento ajoelhado (cabo)', 'Ombros', '/exercicios/desenvolvimento-ajoelhado-cabo.gif'),
  ('Desenvolvimento (cabo)', 'Ombros', '/exercicios/desenvolvimento-cabo.gif'),
  ('Desenvolvimento halteres em Z', 'Ombros', '/exercicios/desenvolvimento-halteres-z.gif'),
  ('Desenvolvimento halteres em W', 'Ombros', '/exercicios/desenvolvimento-halteres-w.gif'),
  ('Desenvolvimento (kettlebell)', 'Ombros', '/exercicios/desenvolvimento-kettlebell.gif'),
  ('Desenvolvimento deitado', 'Ombros', '/exercicios/desenvolvimento-deitado.gif'),
  ('Desenvolvimento máquina, pegada martelo', 'Ombros', '/exercicios/desenvolvimento-maquina-pegada-martelo.gif'),
  ('Desenvolvimento reverso (máquina)', 'Ombros', '/exercicios/desenvolvimento-reverso-maquina.gif'),
  ('Desenvolvimento sentado (faixa elástica)', 'Ombros', '/exercicios/desenvolvimento-sentado-faixa.gif'),
  ('Desenvolvimento unilateral (banda elástica)', 'Ombros', '/exercicios/desenvolvimento-unilateral-banda.gif'),
  ('Desenvolvimento unilateral (halter)', 'Ombros', '/exercicios/desenvolvimento-unilateral-halter.gif'),
  ('Desenvolvimento atrás da cabeça (Smith)', 'Ombros', '/exercicios/desenvolvimento-atras-cabeca-smith.gif'),
  ('Desenvolvimento atrás do pescoço, sentado', 'Ombros', '/exercicios/desenvolvimento-atras-pescoco-sentado.gif'),
  ('Desenvolvimento barra W, pegada invertida', 'Ombros', '/exercicios/desenvolvimento-barra-w-pegada-invertida.gif'),
  ('Desenvolvimento em pé, pegada neutra (halteres)', 'Ombros', '/exercicios/desenvolvimento-em-pe-pegada-neutra-halteres.gif'),
  ('Desenvolvimento no Smith', 'Ombros', '/exercicios/desenvolvimento-smith.gif'),
  ('Elevação de ombros na paralela', 'Ombros', '/exercicios/elevacao-ombros-paralela.gif'),
  ('Encolhimento no Smith', 'Ombros', '/exercicios/encolhimento-smith.gif'),
  ('Extensão de ombro (faixa elástica)', 'Ombros', '/exercicios/extensao-ombro-faixa.gif'),
  ('Flexão alternada de ombro', 'Ombros', '/exercicios/flexao-alternada-ombro.gif'),
  ('Flexão com toque no ombro', 'Ombros', '/exercicios/flexao-toque-ombro.gif'),
  ('Remada para deltoide posterior (halteres)', 'Ombros', '/exercicios/remada-deltoide-posterior-halteres.gif'),
  ('Rotação externa (cabo)', 'Ombros', '/exercicios/rotacao-externa-cabo.gif'),
  ('Rotação externa do ombro', 'Ombros', '/exercicios/rotacao-externa-ombro.gif'),
  ('Rotação interna (cabo)', 'Ombros', '/exercicios/rotacao-interna-cabo.gif'),
  ('Rotação interna, sentado (cabo)', 'Ombros', '/exercicios/rotacao-interna-sentado-cabo.gif'),
  ('Agachamento búlgaro (peso corporal)', 'Quadríceps', '/exercicios/agachamento-bulgaro-peso-corporal.gif'),
  ('Agachamento búlgaro (halteres)', 'Quadríceps', '/exercicios/agachamento-bulgaro-halteres.gif'),
  ('Agachamento dividido profundo', 'Quadríceps', '/exercicios/agachamento-dividido-profundo.gif'),
  ('Agachamento frontal com barra no banco', 'Quadríceps', '/exercicios/agachamento-frontal-banco.gif'),
  ('Agachamento frontal no Smith', 'Quadríceps', '/exercicios/agachamento-frontal-smith.gif'),
  ('Agachamento frontal (cabo)', 'Quadríceps', '/exercicios/agachamento-frontal-cabo.gif'),
  ('Agachamento frontal', 'Quadríceps', '/exercicios/agachamento-frontal.gif'),
  ('Agachamento funcional', 'Quadríceps', '/exercicios/agachamento-funcional.gif'),
  ('Agachamento goblet (haltere)', 'Quadríceps', '/exercicios/agachamento-goblet.gif'),
  ('Agachamento Jefferson', 'Quadríceps', '/exercicios/agachamento-jefferson.gif'),
  ('Agachamento búlgaro com salto', 'Quadríceps', '/exercicios/agachamento-bulgaro-salto.gif'),
  ('Agachamento com trava', 'Quadríceps', '/exercicios/agachamento-trava.gif'),
  ('Agachamento com barra e salto', 'Quadríceps', '/exercicios/agachamento-barra-salto.gif'),
  ('Agachamento com kettlebell', 'Quadríceps', '/exercicios/agachamento-kettlebell.gif'),
  ('Agachamento landmine', 'Quadríceps', '/exercicios/agachamento-landmine.gif'),
  ('Agachamento com salto e joelhos flexionados', 'Quadríceps', '/exercicios/agachamento-salto-joelhos-flexionados.gif'),
  ('Salto na caixa (agachamento pistola)', 'Quadríceps', '/exercicios/salto-caixa-agachamento-pistola.gif'),
  ('Extensão de perna unilateral', 'Quadríceps', '/exercicios/extensao-perna-unilateral.gif'),
  ('Extensão de perna no Smith reverso', 'Quadríceps', '/exercicios/extensao-perna-smith-reverso.gif'),
  ('Agachamento hack invertido', 'Posterior', '/exercicios/agachamento-hack-invertido.gif'),
  ('Agachamento sumô sem peso', 'Posterior', '/exercicios/agachamento-sumo-sem-peso.gif'),
  ('Coice com perna flexionada', 'Posterior', '/exercicios/coice-perna-flexionada.gif'),
  ('Elevação lateral de perna deitado (faixa elástica)', 'Posterior', '/exercicios/elevacao-lateral-perna-deitado-faixa.gif'),
  ('Elevação lateral de perna em pé (faixa elástica)', 'Posterior', '/exercicios/elevacao-lateral-perna-em-pe-faixa.gif'),
  ('Elevação pélvica na máquina', 'Posterior', '/exercicios/elevacao-pelvica-maquina.gif'),
  ('Flexão de perna deitado (halteres)', 'Posterior', '/exercicios/flexao-perna-deitado-halteres.gif'),
  ('Flexão de pernas (alavanca)', 'Posterior', '/exercicios/flexao-pernas-alavanca.gif'),
  ('Flexão de pernas (faixa elástica)', 'Posterior', '/exercicios/flexao-pernas-faixa.gif'),
  ('Flexão de pernas declinado (halteres)', 'Posterior', '/exercicios/flexao-pernas-declinado-halteres.gif'),
  ('Flexão de pernas (bola de estabilidade)', 'Posterior', '/exercicios/flexao-pernas-bola.gif'),
  ('Flexão de pernas com toalha', 'Posterior', '/exercicios/flexao-pernas-toalha.gif'),
  ('Glúteo coice na máquina', 'Posterior', '/exercicios/gluteo-coice-maquina.gif'),
  ('Mesa flexora unilateral', 'Posterior', '/exercicios/mesa-flexora-unilateral.gif'),
  ('Panturrilha unilateral no Hack', 'Panturrilha', '/exercicios/panturrilha-unilateral-hack.gif'),
  ('Panturrilha unilateral', 'Panturrilha', '/exercicios/panturrilha-unilateral.gif'),
  ('Panturrilha unilateral com apoio', 'Panturrilha', '/exercicios/panturrilha-unilateral-apoio.gif'),
  ('Levantamento lateral de perna em quatro apoios', 'Posterior', '/exercicios/levantamento-lateral-quatro-apoios.gif');
