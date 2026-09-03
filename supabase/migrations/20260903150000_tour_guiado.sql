-- Controla se o usuário já viu o tour guiado de primeiro acesso. Fica em
-- profiles (não em localStorage) pra não reaparecer ao trocar de
-- navegador/dispositivo.
alter table profiles add column tour_concluido boolean not null default false;
