# Design

## Context

O plano ativo, os dias (weekday 1 = segunda … 7 = domingo) e a meta do exercício planejado já estão no SQLite. A migration mais recente é `0003_planned_exercise_weight`. Início só mostra "Nada por aqui ainda." A barra é `NativeTabs`; a pilha de Início já é um `Stack`. Confirmações existentes usam `Alert.alert`. Ver `proposal.md` para o motivo e `specs/session-logging/spec.md` para o comportamento.

## Goals / Non-Goals

**Goals:**

- Sessão em andamento como dado local, relida ao voltar de outra seção ou ao reabrir o app.
- Funções puras para a semana, a sugestão, a série válida e o rascunho da próxima série.
- Exercício executado separado do plano, para uma troca futura não reescrever a série.

**Non-Goals:**

- Copiar recrutamento para a sessão. A questão "calcular na hora ou copiar" continua em `training-dashboard`.
- Coluna ou controle de aquecimento. Toda série gravada aqui é série válida.
- Tela de histórico e qualquer número de volume.

## Decisions

### 1. A sessão em andamento mora no banco

Cada série confirmada é gravada na hora, na transação do repositório. A tela não é a fonte da verdade: ao abrir de novo, o hook lê a sessão `in_progress`. Trocar de seção pode até desmontar a rota; o dado continua.

Alternativa considerada: contexto em memória na pilha de Início. Rejeitada porque a spec exige sobreviver ao Dashboard e a reabrir o app, e a arquitetura já trata o SQLite como fonte da verdade.

Há no máximo uma sessão `in_progress` por dono. Índice único parcial em `owner_id` onde `status = 'in_progress'` e `deleted_at` é nulo. A interface não oferece "Treinar" enquanto essa linha existir.

### 2. Entidades

Dado do usuário, UUID no cliente, `owner_id` de `local_owner`, `created_at`, `updated_at`, `deleted_at`. Pesos em kg (`real`). Timestamps em ISO UTC, como o plano (`toISOString()`). A semana é interpretada no fuso local na leitura, não gravada como data civil.

`sessions`

| Coluna | Papel |
|---|---|
| `plan_id`, `workout_day_id` | Origem. FK `restrict`. Soft delete do plano não apaga a linha, então a FK segue válida. |
| `day_name` | Cópia do nome no instante em que a sessão começa. A lista não depende do nome atual do dia. |
| `status` | `in_progress` ou `completed`. |
| `started_at` | Define a semana da sugestão. |
| `completed_at` | Nulo até concluir. |

`session_exercises`

| Coluna | Papel |
|---|---|
| `exercise_id` | O exercício que está sendo registrado. FK para o catálogo. |
| `planned_exercise_id` | Nulo quando o exercício foi acrescentado na hora. |
| `position` | Ordem de exibição. Nasce da ordem do plano; o acrescentado entra no fim. Registrar não altera `position`. |
| `target_sets`, `target_rep_min`, `target_rep_max`, `target_weight_kg` | Cópia da meta. Nulos no exercício acrescentado. |
| `completed_at` | Nulo até "Concluir exercício". |

Índice único parcial em (`session_id`, `exercise_id`) onde `deleted_at` é nulo. Não dá para acrescentar o mesmo exercício duas vezes.

`sets`

| Coluna | Papel |
|---|---|
| `session_exercise_id` | A série pertence ao exercício executado, não ao id do catálogo. |
| `position` | 1, 2, 3… entre as séries não apagadas. |
| `reps` | Inteiro ≥ 1. |
| `weight_kg` | ≥ 0. Zero só passa no domínio quando o tipo de carga é peso corporal. |

Check no banco: `reps >= 1` e `weight_kg >= 0`. O banco não conhece o tipo de carga; quem recusa 0 kg no supino é o domínio.

Estado do exercício não é coluna de enum. Deriva assim: sem série → não iniciado e `completed_at` nulo; com série e `completed_at` nulo → em andamento; `completed_at` preenchido → concluído. Remover a última série zera `completed_at`, porque a spec não admite concluído sem série.

Abandonar preenche `deleted_at` na sessão, nos exercícios executados e nas séries. Concluir só muda `status` e `completed_at` da sessão. Nenhuma das duas reescreve o plano.

Sync futuro: as três tabelas sobem com o mesmo `owner_id`, soft delete e last-write-wins por `updated_at`. Não há tabela de métrica. Um coach futuro lê a sessão pelo dono; não precisa de outra tabela para atribuir o treino feito.

### 3. Troca de exercício fica para depois, sem tabela nova

O substituto futuro troca o `exercise_id` desta linha, ou grava o id original numa coluna nova, e mantém as séries, que apontam para `session_exercises.id`. `planned_exercise_id` continua dizendo de qual meta aquilo saiu. Esta change não cria coluna de substituição nem botão de trocar. O desvio de hoje é remover e acrescentar.

Alternativa considerada: já criar `original_exercise_id` nulo. Rejeitada porque ninguém lê essa coluna agora.

### 4. Sugestão e série no domínio

`src/domain/session.ts`, sem React e sem banco.

- `suggestWorkoutDay` recebe os dias de treino do plano ativo (já sem descanso), as sessões concluídas (`workoutDayId`, `startedAt`) e um `Date` "agora". Devolve o dia de menor weekday ainda sem sessão concluída na semana local, ou vazio se todos já foram feitos. Sessão em andamento não entra na lista.
- A semana local é segunda 00:00 inclusive até a próxima segunda 00:00 exclusiva. `Date#getDay` trata domingo como 0; a função normaliza para o weekday 1–7 já usado no plano. Os testes constroem datas com o construtor local (`new Date(2026, 9, 6, …)`), nunca com meia-noite UTC, para o cenário de domingo 23:00 e segunda 00:10 não depender do fuso da máquina.
- `parseSet` recebe repetições, carga e o tipo de carga (`barra`, `halter`, `máquina`, `peso corporal`, `cabo`). Repetições inteiras ≥ 1. Carga > 0, ou ≥ 0 só em peso corporal. Aceita vírgula ou ponto na digitação. Não multiplica halter por dois e não soma a barra: o número gravado é o número digitado, o mesmo significado de `target_weight_kg`.
- `nextSetDraft` devolve o rascunho ainda não gravado. Se há série anterior, copia reps e kg. Senão, copia `target_rep_min` e `target_weight_kg` quando existem. Campo ausente volta vazio.

A tela mostra as séries gravadas e um único rascunho da próxima. Confirmar o rascunho grava a série e abre outro rascunho. Menos séries do que a meta é concluir sem preencher tudo. Mais séries é continuar gravando. O rascunho não gravado pode sumir na navegação; a série confirmada não.

### 5. Onde a interface mora

Rotas na pilha de Início, para a barra continuar acessível:

- `src/app/(home)/index.tsx` — sugestão, "Treinar", "Outro treino", "Continuar treino"
- `src/app/(home)/session/[sessionId]/index.tsx` — lista do treino
- `src/app/(home)/session/[sessionId]/exercises/[sessionExerciseId].tsx` — séries
- `src/app/(home)/session/[sessionId]/add-exercise.tsx` — catálogo para acrescentar um

Componentes em `src/components/session/`. O seletor de catálogo é o `ExerciseSelector` já existente, com um modo de uma escolha só: confirmar acrescenta o marcado, cancelar não grava. A lista desse modo é o catálogo filtrado por texto e grupo, ordenado pelo nome em pt-BR, sem a ênfase do dia. Exercício já presente na sessão não entra como opção. Hooks em `src/hooks/` chamam `src/repositories/session.ts`. Tela não consulta o banco.

Confirmação de concluir treino, abandonar e remover exercício com série usa `Alert.alert`, como arquivar e excluir plano. Textos: "Concluir treino?", "Abandonar treino?" e "Remover exercício?", com o verbo e "Cancelar". Sem série, remover não pede confirmação e "Concluir treino" não é oferecido.

Os três estados usam os tokens que já existem: não iniciado em `secondaryLabel`, em andamento em `label`, concluído em `tint`. Sem cor nova.

## Risks / Trade-offs

- [Semana calculada no fuso do aparelho] → A sessão guarda instante UTC; a função pura aplica o fuso na leitura. Viagem de fuso pode mudar a semana de uma sessão antiga. Aceito: a spec pede o horário do aparelho, e não há fuso gravado no plano.
- [Meta e nome copiados] → Editar o plano não corrige a sessão já aberta. É o que a spec pede. O dashboard futuro lê a série, não a meta.
- [Zero kg no banco] → O check aceita 0 para a flexão. Um bug no repositório poderia gravar 0 no supino. O único caminho de escrita passa por `parseSet`.
- [Índice de uma sessão em andamento] → Abandonar precisa do soft delete antes de começar outra. A Início não mostra as duas ações juntas.
- [Pilha da aba desmontada] → A rota do exercício pode não estar lá ao voltar. "Continuar treino" reabre a sessão, e a tela do exercício relê as séries.

## Migration Plan

1. Nova migration Drizzle `0004`, só com as três tabelas, checks e índices. Não editar `0000`–`0003`.
2. Não há backfill: nenhuma sessão existe hoje.
3. Rollback antes de publicar é reverter a migration. Depois de aplicada num aparelho, não se edita o SQL; uma change seguinte corrige com migration nova.

## Decisões duráveis

Promover para `docs/architecture.md`:

- A sugestão do próximo treino é por sequência, com reinício na segunda local. O weekday ordena os dias do plano; não casa o dia do calendário com o weekday do treino. Fecha a questão em aberto de `session-logging`.
- A carga registrada é um número em kg, o mesmo significado da meta do plano. Halter é um halter. Peso corporal é carga adicional e aceita zero. O app não soma a barra nem duplica o halter. Fecha a convenção de kg.
- A lista da sessão nasce dos exercícios daquele dia e pode perder ou ganhar exercício do catálogo. O catálogo completo abre para acrescentar, não como lista do treino. A troca guiada continua fora.
- Sessão em andamento é linha local, uma por vez, e não depende do plano depois de copiada a meta.
