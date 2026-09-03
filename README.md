# Your Life

**PWA mobile-first para acompanhamento de treino de musculação, com
onboarding que gera uma ficha personalizada automaticamente e uma corrida
semanal gamificada entre um grupo fechado de amigos.**

Cada pessoa registra os treinos série a série, acompanha a evolução do peso
corporal, do volume de treino e da composição corporal, e disputa uma
corrida animada na tela inicial contra o resto do grupo.

Projeto pessoal / peça de portfólio, construído em dupla, do zero até
produção — em uso real por um grupo de ~10-20 amigos.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth%20%2B%20Storage-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

**[your-life-nine.vercel.app](https://your-life-nine.vercel.app)** — o
cadastro é livre, mas o app foi feito pra um grupo fechado (a corrida
semanal só faz sentido com gente conhecida).

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitetura e decisões técnicas](#arquitetura-e-decisões-técnicas)
- [Desafios técnicos resolvidos](#desafios-técnicos-resolvidos)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Modelo de dados](#modelo-de-dados)
- [Rodando localmente](#rodando-localmente)
- [Status e roadmap](#status-e-roadmap)

## Funcionalidades

### Onboarding e geração automática de treino
Depois do cadastro (rápido: nome/e-mail/senha), o primeiro login abre um
onboarding obrigatório — sexo biológico, biotipo, altura, peso inicial e
objetivo (hipertrofia, emagrecimento, definição, manutenção, força ou
condicionamento). No final, a pessoa escolhe entre **receber um treino
pronto** (escolhe os dias da semana e um motor de regras monta a ficha
sozinho — full body, upper/lower, push/pull/legs ou bro split dependendo
da quantidade de dias, com séries/reps ajustados pelo objetivo e biotipo)
ou **montar o próprio treino** manualmente.

### Catálogo de exercícios
611 exercícios com GIF demonstrativo, organizados em 14 grupos musculares
(peito, costas, ombro, bíceps, tríceps, quadríceps, posterior, glúteos,
panturrilha, abdômen, antebraço, trapézio, adutores/abdutores,
calistenia). Todos os exercícios da ficha — gerados automaticamente ou
montados na mão — podem ser editados depois: trocar o exercício, ajustar
séries e faixa de repetições, ou remover, direto na tela de treino.

### Execução do treino
Registro de carga e repetições série a série (não só "treino feito"),
com comparação automática contra a última vez que o exercício foi
executado. Funciona offline: se a conexão cair no meio do treino, as
séries marcadas entram numa fila local e sincronizam sozinhas quando a
internet volta.

### Corrida semanal
Pista animada na tela inicial com a posição de cada participante,
atualizada ao vivo. Pontuação = treinos concluídos × 10 + variação
percentual do volume médio por sessão frente à semana anterior. Quem
ativa o opt-in no meio da semana entra oficialmente só na semana
seguinte — e aparece marcado como "novo" numa lista de quem já está
confirmado pra próxima semana.

### Acompanhamento
Gráficos de peso corporal e de volume de treino ao longo do tempo. Uma
aba separada de bioimpedância guarda histórico completo de composição
corporal (gordura, massa magra/muscular, água, gordura visceral) e
medidas de circunferência por lado do corpo (braço, coxa, panturrilha
esquerda/direita), com um resumo visual — silhueta do corpo (conforme o
sexo do perfil) ao lado de um gráfico de pizza com a média de gordura vs.
massa magra de todas as medições.

### Tour guiado de primeiro acesso
Depois do onboarding, um tour de 7 passos destaca as abas reais do app
(spotlight sobre os ícones do menu) explicando pra que cada uma serve.
Pode ser pulado a qualquer momento e revisto depois em Perfil.

### Perfil, conta e PWA
Upload de avatar com recorte antes de salvar, recuperação de senha por
e-mail, instalável em tela cheia no Android e iOS direto do navegador
(sem loja de apps).

## Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Server Actions) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Banco / Auth / Storage | Supabase (Postgres + RLS, Auth, Storage) |
| Gráficos | Recharts |
| Recorte de imagem | react-easy-crop |
| PWA / Offline | Service worker próprio + fila local (sem next-pwa) |
| Compressão de mídia | gifsicle (GIFs), sharp (fotos) |
| Hospedagem | Vercel |

Sem bibliotecas de UI/tour prontas — todo componente (modais, steppers,
tour guiado com spotlight, wizard) é hand-rolled em cima de Tailwind puro.
Foi uma escolha deliberada: o app já tem ~140MB de mídia pra carregar,
então bundle size importa, e nenhuma dessas interações precisava de mais
do que `getBoundingClientRect` + `useState`.

## Arquitetura e decisões técnicas

- **Registro em nível de série, não de treino** — cada `session_set`
  guarda carga e reps individualmente. Isso é o que permite calcular
  volume real (carga × reps somado) pra corrida e pros gráficos, em vez
  de só marcar "treino feito".
- **RLS como camada real de autorização, não frontend fingido** — toda
  tabela com dado pessoal tem row-level security no Postgres (`auth.uid()
  = user_id`); o app nunca decide sozinho "esse dado é seu", o banco
  decide. Funções e views `security definer`
  (`ranking_semana_atual()`, `participantes_proxima_semana()`,
  `public_ranking`) expõem só nome/avatar/pontuação de todo mundo pro
  ranking, sem abrir a RLS de `sessions`/`session_sets` — ninguém vê a
  carga ou o peso de outra pessoa, só a pontuação final.
- **Motor de geração de treino como regras, não IA** — pra "treino
  pronto", uma tabela de splits (full body → PPL → bro split, conforme o
  número de dias escolhido) decide os grupos musculares de cada dia;
  dentro de cada grupo, sorteia exercícios reais do catálogo. Ajuste de
  série por biotipo é deliberadamente pequeno (±1 série) — é
  personalização, não WHO/pretensão médica.
- **`peso_inicial_kg` trava depois de 48h** (trigger no banco, não só
  validação no front) — dá espaço pra corrigir erro de digitação sem
  abrir brecha pra reescrever a linha de base depois de já ter
  progredido, o que inflaria a variação percentual na corrida.
- **Offline como fila local + reconciliação, não cache genérico** — o
  service worker cuida do app shell; separadamente, uma fila em
  localStorage guarda mutações de série feitas sem internet e sincroniza
  sozinha quando a conexão volta. Reabrir uma sessão sempre reconcilia
  `session_sets` contra o estado atual da ficha (adiciona séries novas,
  remove as que saíram), então editar a ficha no meio de um ciclo de
  treino nunca perde progresso já registrado.
- **`gif_url` como campo trocável, catálogo versionado em SQL** — os 611
  exercícios (e seus GIFs, comprimidos de ~1,7GB pra ~140MB via
  gifsicle) entraram como uma migration só, então trocar/expandir o
  catálogo no futuro é outra migration, não uma reescrita de código.

## Desafios técnicos resolvidos

Alguns problemas reais que apareceram construindo isso, do jeito que
apareceram:

- **Bug de pontuação descoberto via dado de teste realista**: comparar
  volume *total* da semana deixava quem treinava mais vezes ganhar bônus
  em dobro (uma vez pela frequência, outra pelo volume inflado). Só
  ficou óbvio depois de popular uma conta de teste com semanas inteiras
  de dado plausível — corrigido comparando volume *médio por sessão*.
- **Bug de segurança silencioso em RLS**: uma policy de `UPDATE` em
  `template_exercises` nunca tinha sido criada (só existiam `INSERT` e
  `DELETE`). O Postgres não erra nesse caso — o `UPDATE` simplesmente
  afeta 0 linhas, sem aviso nenhum. Só apareceu ao testar a feature de
  editar exercício da ficha; a correção incluiu um script isolado
  (conta descartável + `supabase-js` autenticado) pra reproduzir o bug
  antes de confiar que a policy nova resolvia.
- **PWA que se recusava a registrar offline**: o service worker
  (`/sw.js`) passava pelo mesmo middleware de autenticação de todas as
  outras rotas, então usuário deslogado recebia um redirect pro
  `/login` — e navegador nenhum registra um service worker cujo script
  vem com redirect. Corrigido excluindo `sw.js` do matcher do
  middleware.
- **Recuperação de senha falhando silenciosamente**: exigiu descobrir,
  na prática, que o Supabase usa PKCE por padrão (o link de e-mail só
  funciona no mesmo navegador que pediu a recuperação) e que a URL de
  callback precisa estar na allowlist do projeto — nenhum dos dois erros
  aparece de forma óbvia pro usuário final.
- **1,7GB de GIFs brutos**: a leva nova de exercícios vinha sem
  compressão nenhuma (alguns arquivos de 8MB+ para uma miniatura de
  48px). Um pipeline com `gifsicle` (resize + lossy + otimização),
  rodado sequencialmente pra evitar corrida de escrita em arquivo no
  Windows, trouxe isso pra ~140MB sem perda visível de qualidade.

## Estrutura do projeto

```
app/
  (auth)/                  login, cadastro, esqueci-senha, redefinir-senha
  onboarding/               sexo/biotipo/altura/peso/objetivo
    comecar/                 escolha: treino pronto vs. montar o próprio
    gerar-treino/             seletor de dias + motor de geração
  (app)/                    telas autenticadas
    inicio/                   corrida semanal (pista animada) + resumo do dia
    rank/                     ranking completo + opt-in da corrida
    treino/                   ficha do dia, execução da sessão
      montar/                   wizard manual (dia → grupo muscular → exercício)
    acompanhamento/            gráficos de peso e volume
      bioimpedancia/             composição corporal + medidas, histórico
    perfil/                   dados pessoais, avatar, "ver tour novamente"
    tour-guiado.tsx            tour de primeiro acesso (spotlight sobre o menu)
  auth/callback/            troca o link de e-mail (recuperação) por sessão
components/                 nav-bar, silhueta corporal, service worker
lib/
  actions/                    server actions compartilhadas (logout)
  supabase/                    clients (browser/server), tipos gerados à mão
  utils/                       datas em fuso America/Sao_Paulo, motor de
                                geração de treino, fila offline, objetivos
public/
  exercicios/                 611 GIFs/fotos do catálogo de exercícios
  sw.js                       service worker (app shell + fila offline)
supabase/migrations/          schema, RLS, views e funções — 27 migrations,
                               100% SQL puro, sem CLI/ORM
docs/
  ESPECIFICACAO.md             especificação funcional completa do produto
```

## Modelo de dados

Tabelas principais (schema completo em
[supabase/migrations](supabase/migrations)):

`profiles` (com `sexo`, `biotipo`, `objetivo`, `tour_concluido`) ·
`exercises` · `workout_templates` + `template_exercises` · `sessions` +
`session_sets` · `body_logs` · `bioimpedancia_logs` · `race_optins` ·
`seasons` + `season_entries` · `diet_plans` + `diet_checkins` (previstas
no schema, sem tela ainda).

Todas as tabelas com dado de usuário referenciam `auth.users` com
`on delete cascade` — apagar uma conta limpa tudo que era dela, sem
precisar de lógica de limpeza manual em nenhum lugar.

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

## Status e roadmap

Em produção, em uso real pelo grupo. Onboarding, geração de treino,
edição de ficha, corrida, acompanhamento (peso/volume/bioimpedância),
PWA/offline e tour guiado — tudo completo e no ar.

Backlog conhecido, sem previsão:
- Pódio trimestral e job de fechamento automático de temporada.
- Tela de administração do catálogo de exercícios (hoje é só SQL).
- Telas de dieta (`diet_plans`/`diet_checkins` já existem no schema).
- Adicionar exercício avulso na ficha (hoje só editar/trocar/remover).
