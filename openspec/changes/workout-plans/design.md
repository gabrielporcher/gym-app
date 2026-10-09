# Design

## Context

O catálogo já é consultável (`filterExercises` em `src/domain/exercise-catalog.ts`) e as seções Início, Treinos e Dashboard existem, com Treinos vazio. Não há tabela de plano. Ver `proposal.md` para o motivo e `specs/workout-plans/spec.md` para o comportamento. Este desenho só diz como isso se encaixa nas camadas atuais.

O glossário já define `SplitTemplate`, `WorkoutPlan` (um ativo), `WorkoutDay` e `PlannedExercise` (ordem e meta de séries e faixa de reps). A sugestão do próximo treino continua em aberto em `session-logging`.

## Goals / Non-Goals

**Goals:**

- Modelos como dado de código, semana e exercícios como dado do usuário, com dono e soft delete.
- Funções puras testáveis para a semana inicial, a vaga livre, a ordenação do seletor e a meta.
- Treinos como o único lugar da interface. Início e Dashboard permanecem vazios.

**Non-Goals:**

- Arrastar para reordenar. Subir e descer uma posição cobre a spec e acerta o alvo de toque de 44.
- Ilustração de corpo, presets Arnold/PHUL e qualquer tabela de sessão.

## Decisions

### 1. O que é modelo e o que é plano

`SplitTemplate` não é tabela. É uma lista fechada em `src/domain/workout-plan.ts`, com id estável:

| Id | Nome na interface |
|---|---|
| `full-body` | Corpo inteiro |
| `upper-lower` | Superiores e inferiores |
| `push-pull-legs` | Push Pull Legs |
| `push-pull-legs-2x` | Push Pull Legs 2x |
| `abc` | ABC |
| `abc-2x` | ABC 2x |
| `abcd` | ABCD |
| `abcde` | ABCDE |
| `custom` | Personalizado |

Cada item traz a frase da spec, o nome do plano e os dias iniciais: nome, dia da semana (1 = segunda … 7 = domingo) e ênfase. A ênfase é `{ mode: 'full-body' }` ou `{ mode: 'groups', groups: MuscleGroupName[] }` na ordem das tags. `custom` nasce com um dia, `mode: 'groups'` e lista vazia.

O plano guarda o id do modelo só como origem. Depois de gravado, a semana editada é a fonte da verdade: acrescentar um dia não recalcula o modelo.

Alternativa considerada: tabela de modelos semeada por migration. Rejeitada porque a lista é fechada, muda com o app e não é dado do usuário. Outra alternativa: um card por programa (Arnold, PHUL, PHAT, PPLUL). Rejeitada na proposal; aqueles programas são ênfase e nomes em cima destas famílias.

### 2. Ajuda visual: faixa da semana e tags

A tela do plano mostra sete células, segunda a domingo, rótulos Seg, Ter, Qua, Qui, Sex, Sáb, Dom. Célula sem dia mostra "Descanso". Célula com dia mostra o nome do dia. Abaixo, um card por dia de treino, em ordem de dia da semana, com as tags.

A tag de grupo mostra o nome e uma cor só daquele grupo, nos dois temas. "Corpo inteiro" usa a cor `tint` e esse texto, não as doze cores. A cor vive em `src/constants/theme.ts` (`MuscleGroupColors`), fora do domínio. O componente de tag fica em `components/workout-plan/`, porque conhece grupo muscular.

| Grupo | Claro | Escuro |
|---|---|---|
| Peito | `#D92D20` | `#FF7A70` |
| Costas | `#175CD3` | `#84ADFF` |
| Ombros | `#DC6803` | `#FDB022` |
| Bíceps | `#088AB2` | `#22CCEE` |
| Tríceps | `#6941C6` | `#B692F6` |
| Antebraço | `#667085` | `#98A2B3` |
| Quadríceps | `#079455` | `#47CD89` |
| Posterior de coxa | `#0E9384` | `#2ED3B7` |
| Glúteos | `#DD2590` | `#F670C7` |
| Adutores | `#444CE7` | `#A4BCFD` |
| Panturrilhas | `#669F2A` | `#ACDC79` |
| Abdômen | `#CA8504` | `#FDE272` |

Texto do grupo sempre por cima, com o token `label` ou `onTint` conforme o contraste do fundo da tag. A spec exige o nome visível; o par claro/escuro acima é o valor inicial.

Alternativas consideradas:

- Mapa corporal, como o destaque de músculo do Hevy. Rejeitado nesta change: pede ilustração, e a taxonomia é doze grupos, não um desenho. As tags nomeiam o grupo, que é o que o filtro já usa.
- Lista de rotinas sem dia da semana, como Hevy e Strong. Rejeitado como forma principal: a spec pede a semana visível, inclusive o descanso da quarta no upper/lower. O dia da semana fica gravado para a faixa continuar verdadeira depois de acrescentar ou mover um dia. A sugestão do próximo treino ainda não consome esse campo.
- Esconder exercícios fora da ênfase. Rejeitado: a spec manda o catálogo inteiro continuar escolhível. O seletor separa "Sugeridos" e "Outros" só quando há grupos e as duas partes têm item. Corpo inteiro e dia sem tag não ganham esses títulos; a ordem sozinha cumpre a spec.

### 3. Ordenação do seletor

Função pura em `src/domain/workout-plan.ts`. Primeiro `filterExercises` (texto, grupo, equipamento). Depois a ordenação da spec, com `localeCompare` `pt-BR` explícito no último critério, sem depender de sort estável.

Combina com um grupo quando algum recrutamento daquele `groupName` é 4 ou 5. Nota 1–3 não combina: é o mesmo corte do catálogo, e é o que coloca Tríceps testa com barra W na frente de Supino reto com barra num dia só de tríceps.

Com grupos: menor índice de grupo que combina; quem não combina vai para o fim. No mesmo grupo, `compound` antes de `isolation`, depois o nome. Sem grupos e sem corpo inteiro: só o nome. `full-body`: `compound` antes de `isolation`, depois o nome.

Acrescentar um grupo num dia `full-body` grava `mode: 'groups'` com esse grupo e apaga a tag "Corpo inteiro".

### 4. Schema

Migration nova. Não editar `0000` nem `0001`. UUID gerado no cliente. Timestamps em texto ISO. Soft delete nas tabelas do usuário. `ON DELETE RESTRICT`.

`local_owner`: `id` fixo `'local'`, `owner_id` UUID, `created_at`. Uma linha, criada na primeira gravação de plano, não na migration (um UUID na migration seria igual em todo aparelho). Sem `deleted_at` e sem sync: é a identidade local até `cloud-sync` trocar `owner_id` pelo usuário autenticado. Desvio consciente da regra "toda tabela tem colunas de sync", o mesmo tipo de desvio das tabelas de referência do catálogo.

`workout_plans`: `id`, `owner_id`, `name`, `template_id`, `status` (`active` ou `archived`), timestamps. Índice único parcial: um `active` por `owner_id` com `deleted_at` nulo.

`workout_days`: `id`, `plan_id`, `owner_id`, `name`, `weekday` (inteiro 1–7), `emphasis` (`groups` ou `full-body`), timestamps. `CHECK` do weekday e do emphasis. Índice único parcial em (`plan_id`, `weekday`) com `deleted_at` nulo.

`workout_day_muscles`: `id`, `workout_day_id`, `owner_id`, `muscle_group_id`, `sort_order`, timestamps. Índice único parcial em (`workout_day_id`, `muscle_group_id`). `muscle_group_id` aponta para a taxonomia, que tem o mesmo UUID em todo aparelho.

`planned_exercises`: `id`, `workout_day_id`, `owner_id`, `exercise_id`, `sort_order`, `target_sets`, `target_rep_min`, `target_rep_max` (os três inteiros anuláveis), timestamps. Índice único parcial em (`workout_day_id`, `exercise_id`). `CHECK`: cada meta é nula ou `>= 1`; se mínimo e máximo existem, máximo `>=` mínimo.

Dia `full-body` não tem linha em `workout_day_muscles`. O repositório recusa gravar os dois ao mesmo tempo.

Sync futuro: as quatro tabelas de plano sobem com `owner_id`. Catálogo com `owner_id` nulo não sobe, e os UUID de exercício e grupo já coincidem entre aparelhos, então a chave estrangeira sobrevive. `local_owner` não sobe. Dois ativos em aparelhos diferentes ficam para a reconciliação de `cloud-sync`; este aparelho único não produz esse caso. Um coach futuro atribui plano reusando estas tabelas (o dono é quem treina); não há coluna `assigned_by` agora.

### 5. Regras puras da semana e da meta

Ainda em `src/domain/workout-plan.ts`:

- Montar o rascunho dos nove modelos, inclusive tags e dias de descanso.
- Próximo weekday livre, de 1 a 7, ou nenhum se a semana está cheia.
- Nome "Treino N" com o menor inteiro positivo cujo nome exato ainda não existe.
- Mover um dia para um weekday livre troca o weekday; o de origem fica sem dia. Weekday ocupado não é destino.
- Remover o último dia é recusado.
- Meta: aceita vazio ou inteiros `>= 1`; com os dois limites, máximo `>=` mínimo. Rejeição devolve a meta anterior.

O repositório aplica essas funções e persiste. Tela e hook não reinventam a regra.

Gravação imediata: confirmar o modelo insere plano, dias e ênfases numa transação e esse plano já é o ativo. Cada edição seguinte é outra escrita. Sair da tela ou trocar de seção não tem rascunho a descartar. Confirmação (arquivar, reativar, excluir) usa `Alert` do React Native, antes da escrita. Cancelar não chama o repositório.

Excluir plano faz soft delete do plano, dos dias, das ênfases e dos exercícios planejados.

### 6. Camadas e rotas

Só o grupo `(workouts)`, que já tem um `Stack`.

| Rota | Papel |
|---|---|
| `(workouts)/index` | Vazio com "Criar plano", ou o ativo e os arquivados |
| `(workouts)/new` | Os nove modelos |
| `(workouts)/[planId]` | Faixa, dias, tags, meta, ordem, acrescentar e remover |
| `(workouts)/[planId]/days/[dayId]` | Seletor: busca, filtro de grupo, "Sugeridos" / "Outros" quando couber |

O layout atual força `headerLargeTitle` em todas. A lista mantém o título grande "Treinos". As rotas empurradas usam título normal: "Modelo", o nome do plano, e "Exercícios".

`src/repositories/workout-plan.ts` é a única escrita no banco, junto com a leitura do dono local. O seletor lê pelo repositório do catálogo que já existe. Hooks em `src/hooks/use-workout-plan.ts`. Componentes em `src/components/workout-plan/`.

Não há `Input` em `components/ui/`. Nome do plano e nome do dia precisam de um. Criar `src/components/ui/input.tsx`: `TextInput`, tokens, altura mínima 44, sem regra de plano. `ListItem` não tem slot para subir/descer; o card do dia é componente do domínio, composto de `Card`, `Text`, `Button` e `Input`, em vez de duplicar um primitivo pela metade.

Início e Dashboard não são alterados.

## Risks / Trade-offs

- [Doze cores não são todas distinguíveis para daltonismo] → O nome do grupo está na tag. A cor só reforça.
- [Pull não sugere Ombros, então o deltoide posterior não sobe sozinho] → A taxonomia não separa o ombro em dois grupos. Ombros fica no push; o usuário acrescenta a tag no pull se quiser. O seletor não esconde o exercício.
- [Um treino por dia da semana impede dois treinos no mesmo dia] → Limite da spec. Sete é o teto.
- [Índice de um ativo não resolve dois aparelhos] → Aceito até `cloud-sync`. O dono local evita `owner_id` nulo, que no catálogo significa "dado de referência, não sincroniza".
- [Meta opcional deixa o dia sem números] → `session-logging` trata meta ausente quando for registrar. A coluna já existe.

## Migration Plan

Uma migration Drizzle nova, gerada a partir do schema, aplicada na abertura pelo cliente que já existe. Não há plano antigo para migrar. Reverter, antes de qualquer uso real, é remover esta migration e as tabelas que ela cria.

## Decisões duráveis

Promover para `docs/architecture.md`:

- Os nove modelos e a classificação: programa nomeado (Arnold, PHUL, PHAT, PPLUL, bro split) não é modelo; bro split é a ênfase inicial do ABCDE.
- `WorkoutDay` guarda o dia da semana (segunda = 1 … domingo = 7). No máximo um dia de treino por dia da semana. Descanso é a ausência de dia. Dias repetidos do modelo são registros independentes.
- Ênfase do dia é sugestão de grupos (agonista 4 ou 5) ou o modo corpo inteiro. Não restringe o catálogo. A sugestão do próximo treino continua em aberto e pode usar weekday ou a ordem, em `session-logging`.
- Identidade local: uma linha `local_owner`, UUID gerado no aparelho, fora do sync, até a conta existir.
