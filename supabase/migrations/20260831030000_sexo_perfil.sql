-- Sexo biológico, usado pra escolher a silhueta certa no resumo de
-- bioimpedância. Também vira o sinal de "onboarding completo": perfil sem
-- sexo preenchido é redirecionado pra /onboarding (ver proxy.ts).
create type sexo_biologico as enum ('masculino', 'feminino');

alter table profiles add column sexo sexo_biologico;
