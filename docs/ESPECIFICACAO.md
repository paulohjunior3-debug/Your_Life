# Projeto — App de acompanhamento de treino

Documento de especificação para desenvolvimento. Contém todas as decisões já tomadas, o modelo de dados, o escopo da v1 e as regras de negócio.

---

## 1. Contexto e objetivo

Aplicação web mobile-first (PWA) para acompanhamento de treino de musculação, uso pessoal e de um grupo pequeno de amigos (estimativa: 5 a 20 usuários).

O usuário registra os treinos série a série, acompanha a evolução do peso corporal semanalmente, e participa de uma corrida semanal gamificada contra os outros usuários do grupo.

O projeto também serve como peça de portfólio, então organização de repositório e qualidade de código importam.

**Não é um produto comercial.** Não haverá pagamento, onboarding complexo, ou escala além de dezenas de usuários.

---

## 2. Stack definida

| Camada | Escolha |
|---|---|
| Frontend | Next.js (App Router) + TypeScript |
| Estilo | Tailwind CSS |
| Backend / DB | Supabase (Postgres + Auth + Storage) |
| Gráficos | Recharts |
| Hospedagem | Vercel |
| PWA | manifest.json + service worker |

**Autenticação:** e-mail + senha, Google OAuth e Apple OAuth (todos via Supabase Auth). Verificação de e-mail desabilitada nesta fase. Manter a política mínima de senha do Supabase.

**PWA:** o app deve ser instalável via "Adicionar à tela inicial" no Chrome (Android) e Safari (iOS), abrindo em tela cheia sem barra de navegador. Service worker com cache offline das telas de treino — academia com sinal ruim é cenário real e o registro de séries precisa funcionar offline com sincronização posterior.

---

## 3. Identidade visual

Dark mode como padrão e único tema.

### Base
| Uso | Hex |
|---|---|
| Fundo da página | `#0F1115` |
| Card | `#191C22` |
| Superfície elevada | `#22262E` |
| Borda | `#2E3440` |
| Texto primário | `#F2F4F7` |
| Texto secundário | `#9AA3B2` |

### Acento
| Uso | Hex |
|---|---|
| Lima (acento único) | `#C6F432` |
| Lima hover | `#D4FF4D` |

### Status de treino
| Estado | Hex |
|---|---|
| Completo | `#34D399` |
| Parcial | `#FBBF24` |
| Não realizado | `#F87171` |
| Informativo | `#60A5FA` |

### Pódio
| Colocação | Hex |
|---|---|
| Ouro | `#F5C542` |
| Prata | `#C0C7D0` |
| Bronze | `#CD8B52` |

### Regras de aplicação
- O lima é **escasso**. Usar apenas em: botão de ação principal, o aviãozinho do próprio usuário na pista, barra de progresso e número da streak. Não usar como cor decorativa.
- Nunca usar preto puro (`#000`) como fundo — causa smearing em tela OLED ao rolar e contraste agressivo à noite.
- Verde/amarelo/vermelho são reservados ao status de treino. Não reutilizar em outros contextos, para preservar a leitura instantânea.
- Na pista da corrida, os aviões dos outros usuários ficam em `#9AA3B2` e apenas o do usuário logado em lima.

---

## 4. Modelo de dados

```
profiles
  id                uuid PK (FK auth.users)
  nome              text
  idade             int
  telefone          text NULL
  academia          text NULL
  instrutor         text NULL
  avatar_url        text NULL
  altura_cm         int
  peso_inicial_kg   numeric
  data_inicio       date
  objetivo          enum('ganho','perda')
  criado_em         timestamptz

exercises
  id                uuid PK
  nome              text
  grupo_muscular    text
  gif_url           text
  criado_em         timestamptz

workout_templates
  id                uuid PK
  nome              text            -- "Upper A", "Lower B"
  criado_por        uuid FK profiles
  criado_em         timestamptz

template_exercises
  id                uuid PK
  template_id       uuid FK workout_templates
  exercise_id       uuid FK exercises
  series            int
  rep_min           int
  rep_max           int
  ordem             int

sessions
  id                uuid PK
  user_id           uuid FK profiles
  template_id       uuid FK workout_templates
  data              date
  status            enum('completo','parcial','nao_realizado')
  criado_em         timestamptz

session_sets
  id                uuid PK
  session_id        uuid FK sessions
  exercise_id       uuid FK exercises
  serie_num         int
  carga_kg          numeric
  reps              int
  concluida         boolean

body_logs
  id                uuid PK
  user_id           uuid FK profiles
  data              date
  peso_kg           numeric
  UNIQUE (user_id, semana)   -- 1 registro por semana

seasons
  id                uuid PK
  tipo              enum('semanal','trimestral')
  data_inicio       date
  data_fim          date
  encerrada         boolean

season_entries
  id                uuid PK
  season_id         uuid FK seasons
  user_id           uuid FK profiles
  pontos            numeric
  colocacao_final   int NULL

race_optins
  id                uuid PK
  user_id           uuid FK profiles
  ativo             boolean
  criado_em         timestamptz

-- Previstas mas SEM interface na v1:
diet_plans
  id                uuid PK
  user_id           uuid FK profiles
  objetivo          enum('ganho','perda')
  descricao         text

diet_checkins
  id                uuid PK
  user_id           uuid FK profiles
  data              date
  cumpriu           boolean
```

### Decisões de modelagem importantes

**Registro série a série.** `session_sets` guarda cada série individualmente, não um peso agregado por exercício. Isso é obrigatório: sem esse nível de granularidade não dá para calcular volume total (`carga × reps × séries`), que é a métrica que mostra progressão real.

**`gif_url` como campo no banco.** Os GIFs de exercício não ficam no código. O admin cadastra a URL, e trocar depois é editar registro. Isso importa porque a maioria dos GIFs de exercício disponíveis na internet é protegida por direitos autorais — se o app um dia sair do círculo de amigos, os GIFs precisam ser trocados por fontes licenciadas (wger, ExerciseDB) ou material próprio, e a troca não pode exigir deploy.

**`peso_inicial_kg` editável por 48h, depois travado.** Erro de digitação no cadastro (78 em vez de 87) quebraria o gráfico do usuário para sempre. A janela de 48h resolve o erro honesto sem abrir brecha para alguém "consertar" a linha de base depois de já ter progredido.

---

## 5. Telas (v1)

### 5.1 Aba inicial
- Mapa da corrida no topo (altura máxima ~200px no celular, não pode dominar a tela)
- Métricas do usuário logado abaixo: peso atual, variação desde o início, treinos na semana, streak

### 5.2 Aba rank
- Pódio com 3 colocações, foto e nome
- Lista simples com as demais colocações abaixo do pódio
- Toggle "quero participar da corrida"

> Nota de design: o pódio tem 3 lugares, não 4. Destacar o 4º lugar visualmente é destacar "o primeiro de fora", que é a pior posição possível de evidenciar. As demais colocações vão na lista.

### 5.3 Aba treino
- Seleção do dia/template de treino
- Lista de exercícios com GIF demonstrativo
- Para cada série: campo de carga (kg) e campo de repetições
- Check de série concluída
- Marcar exercício como não finalizado (reflete em `sessions.status = 'parcial'`)

### 5.4 Aba acompanhamento
- Dados fixos vindos do perfil: data de início, peso inicial, altura, idade
- Registro semanal de peso, às segundas-feiras
- Aviso na tela: **"Pese-se com a mesma roupa e o mesmo tênis da semana anterior"** — variação de vestuário introduz ruído de 0,5 a 1,5 kg e invalida a leitura da tendência
- Gráfico de evolução de peso corporal
- Gráfico de evolução de volume de treino

### 5.5 Aba perfil
- Nome, idade, telefone (opcional), academia, instrutor (opcional)
- Foto de perfil (Supabase Storage, com fallback de iniciais)
- Data de início (somente leitura, vem do cadastro)

---

## 6. Regras da corrida

### Pontuação semanal

```
pontos = (treinos_concluídos × 10)
       + (variação percentual de volume vs. semana anterior × peso)
```

**Por que não usar carga bruta:** ranking por peso levantado faz o usuário mais pesado e mais avançado vencer sempre, e os demais param de abrir o app em duas semanas. Pontuar consistência somada a progressão relativa mantém iniciante e avançado competindo de igual para igual — o iniciante progride mais rápido em percentual, o que equilibra naturalmente.

### Ciclo

- Temporada semanal: **segunda a domingo**
- Reseta toda segunda-feira
- Opt-in: quem marca "quero participar" durante a semana entra na temporada **seguinte**, nunca no meio de uma corrida em andamento
- Participação é opcional e reversível. Nem todo mundo do grupo vai querer ter o desempenho visível.

### Temporada trimestral (pódio)

- Duração: ~13 semanas
- Pontuação por colocação semanal: 1º = 3 pts, 2º = 2 pts, 3º = 1 pt
- **Não somar pontos semanais brutos** — isso tornaria quem entrou primeiro intocável. Contar colocações permite que quem entrou tarde ainda faça boa figura nas semanas que jogou.
- Desempate: número de vitórias, depois total de treinos realizados

### Streak

Contador de treinos cumpridos que **não reseta para zero** ao falhar um dia. Exibir no formato "12 de 15 treinos este mês".

> Isso é uma decisão deliberada. Streak que zera cria incentivo para treinar doente e desmotiva mais do que motiva depois da primeira falha. O formato acumulativo entrega a mesma sensação de progresso sem o efeito colateral.

---

## 7. Pontos de atenção técnica

**RLS no Supabase.** Cada usuário só pode ler e escrever os próprios dados de treino, peso e perfil. Mas o ranking precisa ler dados agregados dos outros participantes. Solução: view ou função `security definer` que expõe apenas nome, avatar, pontos e colocação de quem fez opt-in — nunca as cargas e pesos individuais.

**Fechamento de temporada.** Job agendado (pg_cron ou edge function) rodando na segunda-feira. Atenção ao fuso: o servidor roda em UTC, e o app é usado em `America/Sao_Paulo` (UTC-3). Um cron ingênuo às 00:00 UTC fecha a temporada às 21h de domingo no horário local.

**Casos de borda a tratar explicitamente:**
- Empate na corrida
- Usuário que entrou no meio do trimestre
- Semana sem pesagem registrada
- Usuário sem semana anterior para comparar volume (primeira semana)
- Usuário que fez opt-out no meio da temporada

---

## 8. Escopo e faseamento

### v0.5 — meta de 2 semanas
Objetivo: ter algo usável de verdade o quanto antes.
- Auth (Google + e-mail/senha)
- Visualizar o treino do dia
- Registrar carga e reps série a série
- **Sem** corrida, **sem** gráficos, **sem** telas de admin (os treinos são cadastrados direto pela interface do Supabase)

### v1 — completa
- Tudo da v0.5
- Telas de admin para cadastro de exercícios e montagem de templates
- Aba acompanhamento com gráficos
- Corrida, ranking, pódio, temporadas
- Perfil com foto
- PWA instalável

### v2 — futuro
- Aba de dieta (tabelas já previstas no schema, sem interface na v1)
- Ranking de instrutores

> Sobre o ranking de instrutores: quando for implementado, pontuar por **consistência dos alunos** (frequência, adesão, progressão de carga), nunca por quilos ganhos. Ranquear instrutor por ganho de peso premia quem empurra o aluno para o maior superávit calórico, não quem treina melhor.

---

## 9. Convenções de repositório

Como o projeto é peça de portfólio, desde o commit inicial:

- README com descrição do problema, stack, screenshots e instruções de setup
- `.env.example` versionado; `.env` no `.gitignore`. Nenhuma credencial no repositório.
- Commits com mensagens descritivas (Conventional Commits é uma boa opção)
- Migrations versionadas em `supabase/migrations/`

### Estrutura sugerida

```
/app                 rotas do Next (App Router)
  /(auth)            login, cadastro
  /(app)             telas autenticadas
    /inicio
    /rank
    /treino
    /acompanhamento
    /perfil
  /admin             cadastro de exercícios e templates
/components          componentes reutilizáveis
/lib
  /supabase          client, tipos gerados
  /scoring           cálculo de pontos e temporadas
/supabase
  /migrations
/public
  manifest.json
  /icons
```

---

## 10. Estimativa de esforço

Aproximadamente **70 a 95 horas** de trabalho focado para a v1 completa.

| Frente | Horas |
|---|---|
| Setup, auth e deploy | 4–6 |
| Schema e RLS | 4–6 |
| Layout base e PWA | 6–8 |
| Admin de exercícios e treinos | 8–12 |
| Aba treino (registro série a série) | 12–16 |
| Acompanhamento e gráficos | 6–8 |
| Perfil e upload de foto | 4–6 |
| Corrida, pontuação e temporadas | 12–16 |
| Polimento e correção de bugs | 10–15 |

O CRUD de administração é a parte mais subestimada — chata, invisível para o usuário final, e consistentemente maior do que parece.

---

## 11. Primeira tarefa para o Claude Code

1. Inicializar o projeto Next.js com TypeScript e Tailwind
2. Configurar o tema dark com os tokens de cor da seção 3
3. Escrever a migration inicial com todo o schema da seção 4
4. Configurar as políticas RLS
5. Implementar autenticação (Google + e-mail/senha)
6. Montar o shell de navegação com as 5 abas

Priorizar o caminho da v0.5 antes de qualquer coisa da corrida ou dos gráficos.
