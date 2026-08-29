# Your Life

Aplicação web mobile-first (PWA) para acompanhamento de treino de musculação,
uso pessoal e de um grupo pequeno de amigos. O usuário registra os treinos
série a série, acompanha a evolução do peso corporal semanalmente e participa
de uma corrida semanal gamificada contra os outros usuários do grupo.

Projeto pessoal / peça de portfólio — não é um produto comercial.

## Stack

| Camada | Escolha |
|---|---|
| Frontend | Next.js (App Router) + TypeScript |
| Estilo | Tailwind CSS |
| Backend / DB | Supabase (Postgres + Auth + Storage) |
| Gráficos | Recharts |
| Hospedagem | Vercel |

## Status

Em desenvolvimento. Caminho atual: **v0.5** — auth, visualizar treino do dia e
registrar carga/reps série a série. Corrida, gráficos e telas de admin ficam
para a v1.

## Setup local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um projeto no [Supabase](https://supabase.com) e rode as migrations
   em `supabase/migrations/` (via Supabase CLI ou colando no SQL Editor do
   dashboard, em ordem).

3. Copie `.env.example` para `.env.local` e preencha com as credenciais do
   projeto Supabase:

   ```bash
   cp .env.example .env.local
   ```

4. No dashboard do Supabase, habilite o provedor Google em
   Authentication → Providers, e configure a URL de callback
   `http://localhost:3000/auth/callback` (e a equivalente em produção).

5. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Abra [http://localhost:3000](http://localhost:3000).

## Estrutura

```
/app
  /(auth)            login, cadastro
  /(app)             telas autenticadas (inicio, rank, treino, acompanhamento, perfil)
  /auth/callback     troca do código OAuth por sessão
/components          componentes reutilizáveis
/lib
  /supabase          clients (browser/server) e tipos
  /actions           server actions compartilhadas
/supabase/migrations schema, RLS e views versionados
```
