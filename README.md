# Your Life

**PWA mobile-first para acompanhamento de treino de musculação, com corrida
semanal gamificada entre um grupo fechado de amigos.**

Cada pessoa registra os treinos série a série, acompanha a evolução do peso
corporal e do volume de treino, e disputa uma corrida animada na tela
inicial contra o resto do grupo — pontuação baseada em consistência
(treinos concluídos) e evolução (variação de volume levantado).

Projeto pessoal / peça de portfólio, construído em dupla, sem fins
comerciais.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth%20%2B%20Storage-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## Funcionalidades

- **Autenticação** — cadastro e login por e-mail/senha, recuperação de
  senha por e-mail, sessão via cookies (SSR).
- **Montagem de treino** — wizard em 3 passos (dia da semana → grupo
  muscular → exercícios), com busca no catálogo. Editar a ficha depois
  sincroniza as séries da sessão em aberto sem perder o que já foi
  preenchido.
- **Catálogo de exercícios** — mais de 190 exercícios, com GIF ou foto
  demonstrativa, organizados por grupo muscular (peito, costas, ombro,
  bíceps, tríceps, quadríceps, posterior, panturrilha, abdômen).
- **Execução do treino** — registro de carga e repetições série a série,
  com comparação automática contra a última vez que o exercício foi feito.
- **Funciona offline** — as telas essenciais ficam em cache (service
  worker); se a conexão cair no meio do treino, as séries marcadas
  entram numa fila local e sincronizam sozinhas quando a internet volta.
  Iniciar ou abrir uma sessão nova continua exigindo internet (grava no
  banco), mas falha com aviso dentro do app em vez de travar a tela.
- **Corrida semanal** — pista animada na tela inicial com a posição de
  cada participante, atualizada ao vivo. Pontuação = treinos concluídos
  × 10 + variação percentual do volume médio por sessão frente à semana
  anterior. Quem ativa o opt-in no meio da semana só entra a partir da
  semana seguinte.
- **Acompanhamento** — gráficos de peso corporal e de volume de treino ao
  longo do tempo (Recharts), com no máximo 1 pesagem por semana.
- **Perfil com foto** — upload de avatar com recorte (crop) antes de
  salvar, exibido também no ranking.
- **Instalável (PWA)** — manifest + ícones + service worker; funciona em
  tela cheia no Android e iOS a partir do navegador, sem loja de apps.

## Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Server Actions) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Banco / Auth / Storage | Supabase (Postgres + RLS, Auth, Storage) |
| Gráficos | Recharts |
| Recorte de imagem | react-easy-crop |
| PWA / Offline | Service worker próprio + fila local (localStorage) |
| Hospedagem | Vercel |

## Decisões técnicas relevantes

- **Registro em nível de série, não de treino** — cada `session_set` guarda
  carga e reps individualmente, permitindo calcular volume real
  (carga × reps somado) para a corrida e os gráficos, em vez de só marcar
  "treino feito".
- **`gif_url` como campo trocável no banco** — os GIFs de exercícios vêm de
  fontes com licença livre (ex. free-exercise-db), guardados como arquivo
  estático e referenciados por URL na tabela `exercises`, pra poder trocar
  a fonte sem tocar em código.
- **`peso_inicial_kg` trava depois de 48h** (ver
  [peso-inicial.ts](lib/utils/peso-inicial.ts)) — evita que alguém edite o
  peso inicial pra manipular a própria variação percentual na corrida.
- **Views/funções `security definer`** (`public_ranking`,
  `ranking_semana_atual()`) — expõem nome, avatar e pontuação de todo mundo
  pro ranking sem abrir a RLS de `sessions`/`session_sets`, que continua
  restrita a "cada um só vê o próprio treino".
- **Ranking por volume médio por sessão, não volume total** — comparar
  volume total inflava a pontuação de quem treinava mais vezes na semana
  (dupla contagem com o bônus de frequência); comparar a média por sessão
  corrige isso.

## Estrutura

```
app/
  (auth)/              login, cadastro, esqueci-senha, redefinir-senha
  (app)/                telas autenticadas
    inicio/             corrida semanal (pista animada)
    treino/             ficha do dia, montagem (wizard) e execução da sessão
    rank/               ranking completo do grupo
    acompanhamento/      gráficos de peso e volume
    perfil/              dados pessoais + avatar
  auth/callback/         troca o link de e-mail (recuperação de senha) por sessão
components/               nav-bar, registro do service worker
lib/
  actions/                server actions compartilhadas (ex. logout)
  supabase/               clients (browser/server), tipos gerados à mão
  utils/                  datas em fuso America/Sao_Paulo, fila offline, recorte de imagem
public/
  exercicios/             catálogo de GIFs/fotos dos exercícios
  sw.js                   service worker (cache de app shell + fila offline)
supabase/migrations/       schema, RLS, views e funções, versionados em SQL puro
docs/
  ESPECIFICACAO.md         especificação funcional completa do produto
```

## Modelo de dados

Tabelas principais (schema completo em
[supabase/migrations](supabase/migrations)):

`profiles` · `exercises` · `workout_templates` + `template_exercises` ·
`sessions` + `session_sets` · `body_logs` · `race_optins` ·
`seasons` + `season_entries` · `diet_plans` + `diet_checkins` (previstas
no schema, sem tela na v1).

Todas as tabelas com dado de usuário referenciam `auth.users` com
`on delete cascade` — apagar uma conta limpa tudo que era dela.

## Rodando localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um projeto no [Supabase](https://supabase.com) e rode as migrations
   de `supabase/migrations/` em ordem (SQL Editor do dashboard, ou Supabase
   CLI).

3. Copie `.env.example` para `.env.local` e preencha com as credenciais do
   projeto:

   ```bash
   cp .env.example .env.local
   ```

4. Em **Authentication → URL Configuration** no painel do Supabase,
   configure a Site URL e adicione a URL de callback
   (`<sua-url>/auth/callback`) na lista de Redirect URLs — necessário pro
   fluxo de recuperação de senha funcionar.

5. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Abra [http://localhost:3000](http://localhost:3000).

## Status

Em uso pelo grupo de amigos. Funcionalidades da v1 (auth, treino,
corrida, acompanhamento, perfil, PWA/offline) completas.

Backlog conhecido, sem previsão:
- Pódio trimestral e job de fechamento automático de temporada.
- Tela de administração do catálogo de exercícios.
- Telas de dieta (`diet_plans`/`diet_checkins` já existem no schema).
