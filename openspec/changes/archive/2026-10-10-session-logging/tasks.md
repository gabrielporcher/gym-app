# Tasks

## 1. Sugestão e série no domínio

- [x] 1.1 Criar `src/domain/session.ts` com `suggestWorkoutDay`: dias de treino já sem descanso, sessões só concluídas (`workoutDayId`, `startedAt`) e um `Date` agora. Semana local de segunda 00:00 inclusive até a próxima segunda 00:00 exclusiva; a sessão conta pela semana de `startedAt`. Devolver o menor weekday ainda sem sessão concluída, ou vazio. Criar `src/domain/session.test.ts` com fixtures segunda = Treino A, quarta = Treino B, sexta = Treino C e datas locais (`new Date(2026, 9, …)`, sem meia-noite UTC): segunda 5/10 sem sessão → A; terça 6/10 sem A → A; A concluído na segunda e hoje terça → B; só B concluído e hoje quinta 8/10 → A; A, B e C concluídos e hoje sábado 10/10 → vazio; os três concluídos na semana de 5 a 11/10 e hoje segunda 12/10 → A; A começado domingo 11/10 23:00 e hoje segunda 12/10 → A; A começado segunda 12/10 00:10 → B; A só em andamento na terça não entra e a sugestão continua A; sessão de plano arquivado não entra na lista do plano ativo. Verificar que `npx jest src/domain/session.test.ts` passa e que o arquivo não importa React, React Native, Expo nem `src/db`.
- [x] 1.2 No mesmo módulo, implementar `parseSet` e `nextSetDraft`. `parseSet`: repetições inteiras ≥ 1; carga > 0 para barra, halter, máquina e cabo; carga ≥ 0 para peso corporal; vírgula ou ponto; não duplicar halter nem somar barra. `nextSetDraft`: copia a série anterior; sem anterior, copia mínimo de reps e kg da meta quando existem; campo ausente fica vazio. Estender o teste com 10 reps e 60 kg no supino, 12 e 22 kg no halter sem virar 44, 15 e 0 kg na flexão, 0 kg e 0 reps e carga negativa rejeitados sem apagar 10/60, "62,5" e "62.5" gravados como 62.5, segunda série oferecendo 10 e 60, primeira oferecendo 8 e 60 quando a meta é 8–12 e 60 kg, e meta só de 3 séries e 60 kg oferecendo 60 kg com reps vazias. Verificar que `npx jest src/domain/session.test.ts` passa.

## 2. Schema

- [x] 2.1 Declarar em `src/db/schema.ts` `sessions`, `session_exercises` e `sets` como no design: UUID, `owner_id`, timestamps, `deleted_at`, FKs `ON DELETE RESTRICT`, `day_name` e a meta copiados, `status` `in_progress` ou `completed`, `completed_at` nulos, checks de reps ≥ 1 e `weight_kg` ≥ 0, índice único parcial de uma sessão `in_progress` por dono e de um `exercise_id` por sessão. Gerar a migration `0004` com o Drizzle já configurado, sem editar `0000`–`0003`, e garantir que `src/db/migrations/migrations.js` exporta a migration nova. Verificar que o SQL tem `CREATE TABLE` das três, não está vazio, e que `npx tsc --noEmit` passa.

## 3. Repositório

- [x] 3.1 Criar `src/repositories/session.ts` para começar a sessão numa transação: copiar nome do dia, ordem e meta dos exercícios planejados, exercícios não iniciados, `started_at` agora. Dia sem exercício grava a sessão com lista vazia. Recusar uma segunda `in_progress` do mesmo dono. Ler a sessão em andamento e a lista na ordem de `position`. Telas e `src/app` ainda não mudam. Verificar que `npx tsc --noEmit` passa e que `src/app/` não ganhou arquivo.
- [x] 3.2 No mesmo repositório, gravar, editar e remover série só quando `parseSet` aceitar, renumerar `position`, concluir exercício só com ao menos uma série, e zerar `completed_at` ao remover a última série. Acrescentar exercício do catálogo no fim, sem meta, recusando duplicata. Remover exercício da sessão em soft delete, com as séries dele, sem alterar o plano. Ignorar `deleted_at` preenchido. Verificar que `npx tsc --noEmit` passa e que a validação da série não está reimplementada na query.
- [x] 3.3 Concluir a sessão só se existir ao menos uma série: `status` `completed` e `completed_at`. Abandonar faz soft delete da sessão, dos exercícios executados e das séries. Listar sessões concluídas do plano ativo com `workoutDayId` e `startedAt` para o domínio sugerir. Editar o plano depois de a sessão existir não reescreve `day_name`, a lista nem a meta copiada. Verificar que `npx tsc --noEmit` passa.

## 4. Início

- [x] 4.1 Criar o hook de Início e trocar `src/app/(home)/index.tsx`. Sem plano ativo e sem sessão em andamento, manter "Nada por aqui ainda." Sem sessão e com sugestão, mostrar o nome do dia e "Treinar". "Outro treino" lista os dias do plano ativo de segunda a domingo; escolher começa esse dia; cancelar não grava. Sem sugestão pendente, mostrar "Os treinos desta semana já foram feitos." e manter "Outro treino", sem "Treinar". Com sessão em andamento, mostrar o nome dela e "Continuar treino", sem começar outra. A rota não importa `src/db` nem `src/repositories`. Verificar que `npx tsc --noEmit` passa.

## 5. Tela do treino

- [x] 5.1 Criar `src/app/(home)/session/[sessionId]/index.tsx` e os componentes em `src/components/session/`. Listar os exercícios na `position`, com não iniciado em `secondaryLabel`, em andamento em `label` e concluído em `tint`. Abrir qualquer um sem exigir ordem. "Concluir treino" usa `Alert.alert` ("Concluir treino?", "Concluir", "Cancelar"), só aparece se há série, confirma volta a Início e conta na sugestão; cancelar mantém a sessão. "Abandonar treino" pede "Abandonar treino?" e, ao confirmar, tira a sessão da consulta. Verificar que a tela não importa `src/db` e que `npx tsc --noEmit` passa.
- [x] 5.2 Na mesma tela, remover exercício sem série na hora, e com série só depois de "Remover exercício?"; cancelar mantém a série; o plano não muda. Acrescentar um exercício por `src/app/(home)/session/[sessionId]/add-exercise.tsx`, estendendo `ExerciseSelector` com modo de uma escolha, catálogo filtrado por texto e grupo em ordem de nome pt-BR, sem ênfase do dia. Confirmar põe o exercício no fim, não iniciado, sem meta. Cancelar, busca "kettlebell" e exercício já presente não alteram a lista. Verificar que `npx tsc --noEmit` passa.

## 6. Tela da série

- [x] 6.1 Criar `src/app/(home)/session/[sessionId]/exercises/[sessionExerciseId].tsx`. Mostrar a meta copiada (3, 8, 12 e 60 kg quando for o caso; exercício acrescentado sem meta). Listar séries gravadas e um rascunho vindo de `nextSetDraft`. Gravar, editar e remover passam por `parseSet`. "Concluir exercício" marca e volta à sessão se há série; sem série não marca. Dá para gravar a quarta série além da meta 3 e concluir com uma só. Reabrir um concluído e gravar outra série mantém o exercício concluído. Sessão já concluída não oferece edição. O hook relê o repositório ao focar a tela, para Dashboard, Treinos e reabrir o app mostrarem 10 reps e 60 kg já gravados. Verificar que a rota não importa `src/db` e que `npx tsc --noEmit` passa.

## 7. Arquitetura

- [x] 7.1 Atualizar `docs/architecture.md` com as decisões duráveis do design: sugestão por sequência com reinício na segunda local, convenção de kg, lista da sessão que pode perder ou ganhar exercício, sessão em andamento única e independente do plano depois da cópia. Tirar essas duas questões da lista em aberto. Ajustar a frase da interface que hoje diz que o registro só lista os exercícios alocados. Acrescentar uma linha no registro de decisões. Verificar que recrutamento copiado para a sessão e resumo muscular ao finalizar continuam fora deste documento como trabalho de `training-dashboard`.

## 8. Verificação

- [x] 8.1 Rodar `npx expo lint`, `npx tsc --noEmit` e `npx jest`. Verificar que os três terminam com código 0.
