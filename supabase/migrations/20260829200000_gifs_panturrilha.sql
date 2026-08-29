-- Lote 3 de GIFs: panturrilha. Completa os 3 exercicios que ja existiam
-- sem gif e adiciona 5 variacoes novas.
update exercises set gif_url = '/exercicios/panturrilha-no-leg-press.gif' where nome = 'Panturrilha no leg press';
update exercises set gif_url = '/exercicios/panturrilha-sentado.gif' where nome = 'Panturrilha sentado';
update exercises set gif_url = '/exercicios/panturrilha-em-pe.gif' where nome = 'Panturrilha em pé';

insert into exercises (nome, grupo_muscular, gif_url) values
  ('Alongamento de panturrilha (uma perna)', 'Panturrilha', '/exercicios/panturrilha-alongamento-uma-perna.gif'),
  ('Panturrilha sentado (alavanca)', 'Panturrilha', '/exercicios/panturrilha-sentado-alavanca.gif'),
  ('Panturrilha sentado (barra)', 'Panturrilha', '/exercicios/panturrilha-sentado-barra.gif'),
  ('Panturrilha em pé (máquina)', 'Panturrilha', '/exercicios/panturrilha-em-pe-maquina.gif'),
  ('Panturrilha (máquina)', 'Panturrilha', '/exercicios/panturrilha-maquina.gif');
