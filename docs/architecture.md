# Arquitetura

Documento vivo com o system design do app. Comportamento detalhado de cada funcionalidade
fica nas specs (`openspec/specs/`); regras de código do dia a dia ficam no `AGENTS.md`.
Este arquivo guarda a visão geral, o glossário e as decisões duráveis.

## Visão geral

App mobile (iOS e Android) para um único usuário criar planos de treino, registrar sessões
de academia e acompanhar métricas de volume muscular por dia, semana e mês.

```
+-----------------------------------------------------------+
|                        App (Expo)                         |
|                                                           |
|  src/app (rotas)  -->  components  -->  components/ui     |
|        |                   |                              |
|        +------> hooks <----+                              |
|                   |                                       |
|          +--------+---------+                             |
|          v                  v                             |
|     repositories         domain (lógica pura)             |
|          |                                                |
|          v                                                |
|     db (Drizzle + expo-sqlite)  <-- fonte da verdade      |
+----------|------------------------------------------------+
           |  (futuro) sync
           v
     Supabase (Postgres + Auth)
```

- **Fonte da verdade é o banco local.** A UI lê e escreve sempre no SQLite; nunca espera rede.
- **Sync é aditivo.** Quando existir, roda em segundo plano empurrando/puxando alterações; a
  aplicação não muda de comportamento por estar online ou offline.

## Camadas

| Camada | Responsabilidade |
|---|---|
| `src/app/` | Rotas do Expo Router. Telas finas que compõem componentes e hooks. |
| `src/components/ui/` | Primitivos visuais sem regra de negócio. |
| `src/components/<domínio>/` | Componentes compostos que conhecem o domínio. |
| `src/hooks/` | Ligam telas a repositórios e ao domínio (carregamento, mutações, estado de UI). |
| `src/domain/` | Funções puras: cálculo de volume, séries efetivas, sugestão do próximo treino. Testadas unitariamente. |
| `src/repositories/` | Leitura/escrita por entidade. Única camada que acessa o `db`. |
| `src/db/` | Schema Drizzle, migrations, cliente e seed do catálogo de exercícios. |

Regras de dependência entre camadas: ver `AGENTS.md`.

## Glossário do domínio

| Termo (pt-BR) | Nome no código | Definição |
|---|---|---|
| Modelo de divisão | `SplitTemplate` | Estrutura de divisão semanal: ABCDE, ABC 2x, Push Pull Legs, Upper Lower, Full Body. Define quantos dias distintos existem e a frequência semanal. |
| Plano de treino | `WorkoutPlan` | Plano do usuário baseado em um modelo de divisão. Apenas um ativo por vez; os anteriores ficam arquivados. |
| Dia de treino | `WorkoutDay` | Um dia distinto do plano (Treino A, Treino B, Push...). |
| Exercício planejado | `PlannedExercise` | Exercício alocado a um dia de treino, com ordem e meta (séries, faixa de reps). |
| Sessão | `Session` | Execução real de um treino em uma data. Pode seguir um dia de treino ou divergir dele. |
| Exercício executado | `SessionExercise` | Exercício realizado dentro de uma sessão. |
| Série | `Set` | Uma série executada: repetições e carga em kg. Pode ser marcada como aquecimento. |
| Exercício | `Exercise` | Item do catálogo (base embutida ou criado pelo usuário). |
| Músculo / Grupo muscular | `Muscle` / `MuscleGroup` | Taxonomia em dois níveis (ex.: deltoide lateral -> ombros). |
| Recrutamento | `ExerciseMuscle` | Nível de 1 a 5 de quanto um exercício recruta um músculo. Distingue músculos agonistas (recrutamento alto) de sinergistas (recrutamento menor). |
| Série válida | `validSet` | Série executada que não é aquecimento. É a unidade de contagem das métricas. |

## Modelo de métricas

Exemplo: Supino, 3 séries x 10 reps x 80 kg; recrutamento peito 5, tríceps 3, deltoide anterior 3.

### Séries por músculo

Cada série válida conta como **1 série** para cada músculo que o exercício recruta. O recrutamento
não reduz a contagem; ele qualifica o quanto aquele músculo participou.

```
  músculo         séries   recrutamento   papel
  peito             3          5/5        agonista
  tríceps           3          3/5        sinergista
  deltoide ant.     3          3/5        sinergista
```

Usos:

- **Resumo ao finalizar a sessão:** músculo mais utilizado e número de séries por músculo,
  mostrando que os sinergistas também trabalharam (ex.: o supino também recrutou tríceps e deltoide).
- **Dashboards diários, semanais e mensais:** total de séries por músculo e grupo muscular no
  período, com o recrutamento indicando se o músculo atuou como agonista ou sinergista.

### Repetições e carga

Repetições e kg de cada série não alteram a contagem de séries. Servem para acompanhar a
**evolução por exercício** e gerar insights comparando estratégias, por exemplo: mais carga com
menos séries versus mais séries com menos carga.

### Regras gerais

- Séries de aquecimento não entram nas métricas.

## Estratégia de dados

- IDs UUID gerados no cliente.
- Toda tabela sincronizável tem `owner_id`, `created_at`, `updated_at`, `deleted_at` (soft delete).
- Sessões guardam o que foi realmente executado e não dependem do estado atual do plano.
- Pesos em kg.
- Sync futuro (change `cloud-sync`): fila local de alterações pendentes, resolução de conflito
  last-write-wins por `updated_at`, autenticação via Supabase Auth, RLS por `owner_id`.

## Roadmap de changes

1. `foundation` — limpar template, estrutura de pastas, tokens e primitivos de UI, db + migrations, jest-expo
2. `exercise-catalog` — taxonomia muscular, catálogo com recrutamento, busca
3. `workout-plans` — modelos de divisão, criação de plano, alocação de exercícios
4. `session-logging` — sugestão do próximo treino, registro de sessões e séries
5. `training-dashboard` — métricas diárias, semanais e mensais
6. `cloud-sync` — auth, Supabase, sync

Depois: insights baseados em regras, papel de admin/coach, RPE/RIR, unidades em lb.

## Questões em aberto

Resolver nas specs da change correspondente:

- Sugestão do próximo treino: por sequência (com reinício semanal) ou por calendário? (`session-logging`)
- Convenção de "peso total" por tipo de carga: barra, halter, máquina, peso corporal. (`exercise-catalog` / `session-logging`)
- Lista de músculos e grupos musculares. (`exercise-catalog`)
- Recrutamento calculado na hora ou copiado para a sessão? (`training-dashboard`)
- A partir de qual nível o músculo é agonista e abaixo de qual é sinergista? Os totais do período separam séries como agonista e como sinergista? (`exercise-catalog` / `training-dashboard`)

## Registro de decisões

| Data | Decisão | Motivo |
|---|---|---|
| 2026-10-07 | MVP local-only; sync em change posterior | Entregar valor antes; schema já preparado para sync |
| 2026-10-07 | `expo-sqlite` + Drizzle localmente | Módulo oficial do Expo; schema tipado e migrations |
| 2026-10-07 | Supabase como backend futuro | Dados relacionais e agregações combinam com Postgres; RLS prepara papel de admin |
| 2026-10-07 | Apenas iOS e Android | `expo-sqlite` na web tem limitações; foco mobile |
| 2026-10-07 | `StyleSheet` + tokens, sem lib de estilo | Simplicidade, sem dependência extra |
| 2026-10-07 | Recrutamento em escala 1–5 | 1–10 é precisão falsa e encarece a curadoria do catálogo |
| 2026-10-07 | Testes unitários obrigatórios em `src/domain/` | Cenários das specs viram testes diretamente |
