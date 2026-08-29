-- Deixa os nomes dos exercícios já cadastrados mais específicos (a
-- variação, não só o movimento base). Atualiza o nome sem trocar o id,
-- então fichas que já referenciam esses exercícios continuam intactas.
update exercises set nome = 'Supino reto (barra)' where nome = 'Supino reto';
update exercises set nome = 'Supino inclinado (barra)' where nome = 'Supino inclinado';
update exercises set nome = 'Crucifixo (halteres)' where nome = 'Crucifixo';
update exercises set nome = 'Crossover (polia alta)' where nome = 'Crossover';
update exercises set nome = 'Puxada frente (pulley)' where nome = 'Puxada frente';
update exercises set nome = 'Remada curvada (barra)' where nome = 'Remada curvada';
update exercises set nome = 'Remada baixa (cabo)' where nome = 'Remada baixa';
update exercises set nome = 'Puxada triângulo' where nome = 'Pull-down';
update exercises set nome = 'Leg press 45°' where nome = 'Leg press';
update exercises set nome = 'Stiff (barra)' where nome = 'Stiff';
update exercises set nome = 'Afundo (halteres)' where nome = 'Afundo';
update exercises set nome = 'Elevação lateral (halteres)' where nome = 'Elevação lateral';
update exercises set nome = 'Elevação frontal (halteres)' where nome = 'Elevação frontal';
update exercises set nome = 'Remada alta (barra)' where nome = 'Remada alta';
update exercises set nome = 'Rosca direta (barra)' where nome = 'Rosca direta';
update exercises set nome = 'Tríceps corda (polia)' where nome = 'Tríceps corda';
update exercises set nome = 'Tríceps testa (barra)' where nome = 'Tríceps testa';

-- Amplia bastante a variedade em todos os grupos musculares.
insert into exercises (nome, grupo_muscular) values
  -- Peito
  ('Supino reto (halteres)', 'Peito'),
  ('Supino inclinado (halteres)', 'Peito'),
  ('Supino declinado (barra)', 'Peito'),
  ('Supino declinado (halteres)', 'Peito'),
  ('Crucifixo inclinado (halteres)', 'Peito'),
  ('Crossover (polia baixa)', 'Peito'),
  ('Peck deck (voador)', 'Peito'),
  ('Flexão de braço', 'Peito'),
  ('Supino máquina', 'Peito'),
  ('Pullover', 'Peito'),

  -- Costas
  ('Puxada supinada', 'Costas'),
  ('Remada curvada (halteres)', 'Costas'),
  ('Remada cavalinho', 'Costas'),
  ('Remada unilateral (serrote)', 'Costas'),
  ('Levantamento terra romeno', 'Costas'),
  ('Barra fixa', 'Costas'),
  ('Barra fixa (pegada supinada)', 'Costas'),
  ('Remada máquina', 'Costas'),

  -- Pernas
  ('Agachamento smith', 'Pernas'),
  ('Agachamento sumô', 'Pernas'),
  ('Agachamento búlgaro', 'Pernas'),
  ('Leg press horizontal', 'Pernas'),
  ('Stiff (halteres)', 'Pernas'),
  ('Afundo (barra)', 'Pernas'),
  ('Passada', 'Pernas'),
  ('Cadeira adutora', 'Pernas'),
  ('Cadeira abdutora', 'Pernas'),
  ('Mesa flexora', 'Pernas'),
  ('Panturrilha sentado', 'Pernas'),
  ('Panturrilha no leg press', 'Pernas'),
  ('Hack squat', 'Pernas'),

  -- Ombros
  ('Desenvolvimento militar (barra)', 'Ombros'),
  ('Desenvolvimento máquina', 'Ombros'),
  ('Desenvolvimento Arnold', 'Ombros'),
  ('Elevação lateral (cabo)', 'Ombros'),
  ('Elevação frontal (barra)', 'Ombros'),
  ('Crucifixo invertido (halteres)', 'Ombros'),
  ('Face pull', 'Ombros'),
  ('Encolhimento de ombros', 'Ombros'),

  -- Bíceps
  ('Rosca direta (halteres)', 'Bíceps'),
  ('Rosca scott', 'Bíceps'),
  ('Rosca concentrada', 'Bíceps'),
  ('Rosca cabo', 'Bíceps'),
  ('Rosca 21', 'Bíceps'),

  -- Tríceps
  ('Tríceps barra (polia)', 'Tríceps'),
  ('Tríceps testa (halteres)', 'Tríceps'),
  ('Tríceps francês', 'Tríceps'),
  ('Mergulho em paralelas', 'Tríceps'),
  ('Tríceps coice', 'Tríceps'),
  ('Supino fechado', 'Tríceps'),

  -- Abdômen
  ('Abdominal infra', 'Abdômen'),
  ('Abdominal oblíquo', 'Abdômen'),
  ('Prancha lateral', 'Abdômen'),
  ('Elevação de joelhos', 'Abdômen'),
  ('Abdominal na polia', 'Abdômen'),
  ('Abdominal máquina', 'Abdômen'),
  ('Roda abdominal', 'Abdômen');
