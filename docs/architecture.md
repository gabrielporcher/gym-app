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
| Modelo de divisão | `SplitTemplate` | Uma das nove divisões fechadas: Corpo inteiro, Superiores e inferiores, Push Pull Legs, Push Pull Legs 2x, ABC, ABC 2x, ABCD, ABCDE e Personalizado. Programa nomeado (Arnold, PHUL, PHAT, PPLUL, bro split) não é modelo. Bro split é a ênfase inicial do ABCDE. |
| Plano de treino | `WorkoutPlan` | Plano do usuário baseado em um modelo de divisão. Apenas um ativo por vez; os anteriores ficam arquivados. |
| Dia de treino | `WorkoutDay` | Um dia do plano, com weekday (segunda = 1 … domingo = 7). No máximo um por dia da semana. Descanso é a ausência de dia. Dias repetidos do modelo são registros independentes. |
| Ênfase do dia | `DayEmphasis` | Sugestão gravada pelo modelo para ordenar o seletor. Não restringe o catálogo e não é a tag do card. |
| Exercício planejado | `PlannedExercise` | Exercício alocado a um dia de treino, com ordem e meta opcional (séries, faixa de reps e peso em kg). As tags do card saem dos grupos que esses exercícios recrutam em 4 ou 5. |
| Sessão | `Session` | Execução real de um treino em uma data. Pode seguir um dia de treino ou divergir dele. |
| Exercício executado | `SessionExercise` | Exercício realizado dentro de uma sessão. |
| Série | `Set` | Uma série executada: repetições e carga em kg. Pode ser marcada como aquecimento. |
| Exercício | `Exercise` | Item do catálogo (base embutida ou criado pelo usuário). |
| Músculo / Grupo muscular | `Muscle` / `MuscleGroup` | Taxonomia em dois níveis. O músculo pertence a um grupo; o filtro da consulta usa o grupo. |
| Recrutamento | `ExerciseMuscle` | Nota de 1 a 5 de quanto um exercício recruta um músculo. 5 é agonista principal, 4 é agonista secundário e 1 a 3 é sinergista. Músculo ausente não é nota zero. |
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

## Catálogo de exercícios

O catálogo da base é dado de referência, não dado do usuário. Grupo, músculo e exercício nascem com UUID fixo, o mesmo em todo aparelho. `exercises.owner_id` nulo marca a base, e essa linha não entra no sync. Correção de nome, nome alternativo ou recrutamento entra numa migration nova e mantém a identidade. Exercício criado pelo usuário, numa change futura, usa a mesma tabela com `owner_id`.

A taxonomia tem dois níveis. O filtro usa o grupo; o recrutamento é por músculo.

| Grupo | Músculos |
|---|---|
| Peito | Peitoral superior, Peitoral médio-inferior |
| Costas | Latíssimo do dorso, Romboides, Trapézio superior, Trapézio médio, Trapézio inferior, Eretor da espinha |
| Ombros | Deltoide anterior, Deltoide lateral, Deltoide posterior |
| Bíceps | Bíceps braquial, Braquial |
| Tríceps | Tríceps cabeça longa, Tríceps cabeça lateral, Tríceps cabeça medial |
| Antebraço | Braquiorradial, Flexores do punho, Extensores do punho |
| Quadríceps | Reto femoral, Vastos do quadríceps |
| Posterior de coxa | Bíceps femoral, Semitendíneo e semimembranoso |
| Glúteos | Glúteo máximo, Glúteo médio |
| Adutores | Adutores |
| Panturrilhas | Gastrocnêmio, Sóleo |
| Abdômen | Reto abdominal, Oblíquos |

Peitoral médio e peitoral inferior são um músculo só. Vasto lateral, medial e intermédio são "Vastos do quadríceps". Semitendíneo e semimembranoso são um músculo. Redondo maior não é músculo próprio. Lombar não é grupo: eretor da espinha fica em Costas. Bíceps e tríceps são grupos próprios.

O filtro por grupo inclui o exercício quando algum músculo daquele grupo está em 4 ou 5. A separação dos totais do período entre agonista e sinergista continua em `training-dashboard`.

Equipamento (Barra, Barra W, Halteres, Máquina, Cabo, Peso corporal, Smith, Barra hexagonal) é o filtro. Tipo de carga (barra, halter, máquina, peso corporal, cabo) define a carga aceita na série. Barra W, Smith e barra hexagonal usam carga barra. A carga registrada é o número digitado em kg, o mesmo significado da meta do plano: halter é um halter, peso corporal é a carga adicional e aceita zero, e o app não soma a barra nem duplica o halter.

## Estratégia de dados

- IDs UUID gerados no cliente.
- Identidade local: uma linha `local_owner`, com id fixo `local` e `owner_id` UUID gerado no aparelho na primeira gravação de plano. Não tem `deleted_at` e não entra no sync, até a conta existir. As tabelas do plano usam esse `owner_id`.
- Tabelas de dado do usuário têm `owner_id`, `created_at`, `updated_at` e `deleted_at` (soft delete).
- Grupos, músculos, nomes alternativos e recrutamentos da base não têm `owner_id`: são dado de referência e não sincronizam por usuário. `exercises.owner_id` existe e fica nulo na base.
- Sessões guardam o que foi realmente executado e não dependem do estado atual do plano.
  A sugestão do próximo treino segue a sequência dos dias, do menor weekday ao maior, e recomeça
  na segunda 00:00 no horário do aparelho. O weekday ordena os dias do plano; não casa o dia do
  calendário com o weekday do treino.
- A lista da sessão nasce dos exercícios daquele dia e pode perder ou ganhar um exercício do
  catálogo. O catálogo completo abre para acrescentar, não como lista do treino. A troca guiada
  continua fora.
- Há no máximo uma sessão em andamento por vez. Nome do dia e meta são copiados ao começar;
  editar o plano depois não reescreve essa sessão.
- Pesos em kg. A série grava o número digitado: halter é um halter, peso corporal é carga
  adicional e aceita zero, e o app não soma a barra nem duplica o halter.
- Sync futuro (change `cloud-sync`): fila local de alterações pendentes, resolução de conflito
  last-write-wins por `updated_at`, autenticação via Supabase Auth, RLS por `owner_id`. Linha de
  exercício com `owner_id` nulo não sobe.
- A abertura aplica as migrations locais antes das seções. O catálogo da base entra nessas
  migrations, com UUID fixo, e não é semeado de novo na abertura.

## Interface

- Tab bar e header nativos, sem fundo opaco forçado, para o material do sistema aparecer.
  `Card` usa o material translúcido só quando a API está disponível; senão, superfície opaca
  com os tokens semânticos. Fonte do sistema, sem embarcar SF Pro. No Android a barra é a
  nativa da plataforma.
- Espaçamento `xs`/`sm`/`md`/`lg` (4/8/16/24). Tipografia com os nomes dos estilos do HIG,
  no tamanho Large padrão, com `allowFontScaling` do sistema.
- A barra tem três seções: Início, Treinos e Dashboard. O catálogo de exercícios não é seção
  raiz. A lista completa entra na criação do plano. No registro, a lista da sessão nasce dos
  exercícios daquele dia e pode perder ou ganhar um exercício do catálogo. O catálogo completo
  abre para acrescentar, não como lista do treino. A troca guiada de exercício continua fora.

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

- Recrutamento calculado na hora ou copiado para a sessão? (`training-dashboard`)
- Os totais do período separam séries como agonista e como sinergista? (`training-dashboard`)

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
| 2026-10-08 | Tab bar e header nativos, sem fundo opaco forçado; `Card` translúcido só com a API disponível, senão superfície opaca; fonte do sistema | O material do sistema aparece quando o aparelho oferece; Android usa a barra nativa da plataforma |
| 2026-10-08 | Espaçamento `xs`/`sm`/`md`/`lg` (4/8/16/24) e tipografia com os nomes do HIG, tamanho Large, `allowFontScaling` do sistema | Escala única para as próximas telas, sem embarcar SF Pro |
| 2026-10-08 | Abertura aplica as migrations locais antes das seções; journal sem SQL e sem tabela de domínio | A primeira tabela de domínio vem depois, com UUID e colunas de sync, no mesmo cliente |
| 2026-10-08 | Três seções: Início, Treinos e Dashboard; catálogo de exercícios não é seção raiz | A lista completa entra na criação do plano e na troca de exercício na sessão; no registro, só os exercícios daquele treino |
| 2026-10-09 | Catálogo da base é dado de referência: doze grupos, recrutamento 5/4/1–3 com filtro de grupo em 4 ou 5, UUID fixo e `owner_id` nulo, equipamento separado do tipo de carga | A consulta e o dashboard futuro usam o mesmo recorte; correção entra em migration nova e a base não sobe no sync |
| 2026-10-09 | Nove modelos de divisão; programa nomeado não é modelo; `WorkoutDay` guarda weekday 1–7 com no máximo um treino por dia; dias repetidos são independentes; ênfase é sugestão; `local_owner` fica fora do sync | A semana visível e o sync futuro usam o mesmo plano, sem card para Arnold, PHUL, PHAT ou PPLUL |
| 2026-10-09 | Tags do card saem dos exercícios alocados (agonista 4 ou 5); a ênfase do modelo só ordena o seletor; a meta do exercício planejado inclui peso em kg | O card não pede grupo muscular antes do exercício, e a carga planejada fica junto da faixa de séries |
| 2026-10-09 | Sugestão por sequência, com reinício na segunda 00:00 local; a carga registrada é o kg digitado; a sessão copia o dia e pode perder ou ganhar exercício; uma sessão em andamento, independente do plano depois da cópia | O weekday ordena os dias e não casa com o calendário; o dashboard futuro lê a série, não a meta |
