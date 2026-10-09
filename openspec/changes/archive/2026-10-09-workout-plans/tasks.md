# Tasks

## 1. Modelos e semana no domínio

- [x] 1.1 Criar `src/domain/workout-plan.ts` com os nove `SplitTemplate` do design (`full-body`, `upper-lower`, `push-pull-legs`, `push-pull-legs-2x`, `abc`, `abc-2x`, `abcd`, `abcde`, `custom`), weekday 1 = segunda … 7 = domingo, e a montagem do rascunho (nome do plano, dias, tags ou modo corpo inteiro). Criar `src/domain/workout-plan.test.ts` com os cenários da spec: ordem e frases dos nove, semanas de Superiores e inferiores, Corpo inteiro, Push Pull Legs, Push Pull Legs 2x, ABC, ABC 2x, ABCD, ABCDE e Personalizado, e a ausência de Arnold, PHUL, PHAT e PPLUL. Verificar que `npx jest src/domain/workout-plan.test.ts` passa e que o arquivo não importa React, React Native, Expo nem `src/db`.
- [x] 1.2 No mesmo módulo, implementar acrescentar dia (primeiro weekday livre, nome "Treino N"), recusar o oitavo, remover dia, recusar remover o último, mover para um weekday livre e recusar destino ocupado. Estender o teste com quarta-feira livre no upper/lower, semana de sete dias, "Inferiores 2" removido sem afetar outro dia, "Superiores 2" movido para quarta, e cancelamento que não altera o weekday. Verificar que `npx jest src/domain/workout-plan.test.ts` passa.

## 2. Seletor e meta no domínio

- [x] 2.1 Implementar a ordenação em cima de `filterExercises`: grupo agonista só com recrutamento 4 ou 5, índice da tag, composto antes de isolado, nome `pt-BR` explícito, corpo inteiro por tipo e dia sem tag só por nome. Estender o teste com fixtures dos cenários da spec (Supino reto com barra, Supino inclinado com barra, Remada curvada com barra, Agachamento livre, Cadeira extensora, Tríceps testa com barra W), inclusive busca "agachamento", busca "kettlebell", filtro Quadríceps num dia de Peito e supino como sinergista de tríceps. Verificar que `npx jest src/domain/workout-plan.test.ts` passa.
- [x] 2.2 Implementar a meta opcional: vazio, séries 3 com mínimo e máximo vazios, 3/8/12, mínimo 8 e máximo 6 rejeitado sem substituir 3/8/12, 0 rejeitado, limpar os três valores, e 8/8 aceito. Cobrir no mesmo teste. Verificar que `npx jest src/domain/workout-plan.test.ts` passa.

## 3. Schema

- [x] 3.1 Declarar em `src/db/schema.ts` `local_owner`, `workout_plans`, `workout_days`, `workout_day_muscles` e `planned_exercises` como no design: UUID, `owner_id` nas tabelas do plano, timestamps, `deleted_at` só nas tabelas do plano, `CHECK` de weekday, emphasis, status e meta, índices únicos parciais e chaves `ON DELETE RESTRICT`. Gerar a migration com o Drizzle já configurado, sem editar migration aplicada. Verificar que o SQL novo tem `CREATE TABLE`, não está vazio, e que `npx tsc --noEmit` passa.

## 4. Repositório

- [x] 4.1 Criar a leitura ou criação do dono em `local_owner` (UUID no cliente, uma linha, sem dependência nova) e `src/repositories/workout-plan.ts` com criar plano a partir do rascunho do domínio numa transação, listar ativo e arquivados, arquivar, reativar e soft delete em cascata de dias, ênfases e exercícios planejados. Telas, hooks e `src/app` ainda não mudam. Verificar que `npx tsc --noEmit` passa e que `src/app/` não ganhou arquivo.
- [x] 4.2 No mesmo repositório, persistir acrescentar, remover e mover dia, editar nome, trocar ênfase (corpo inteiro e grupos não convivem), alocar exercício uma vez, gravar meta só quando o domínio aceitar, e reordenar uma posição. Ignorar `deleted_at` preenchido. Verificar que `npx tsc --noEmit` passa e que essas escritas passam pelas funções do domínio, sem regra duplicada na query.

## 5. Primitivos da tela

- [x] 5.1 Acrescentar `MuscleGroupColors` em `src/constants/theme.ts` com os doze pares claro/escuro do design. Verificar que nenhum componente fora de `src/components/workout-plan/` precisa conhecer o nome do grupo para pintar, e que `npx tsc --noEmit` passa.
- [x] 5.2 Criar `src/components/ui/input.tsx` com `TextInput`, tokens de cor, raio e altura mínima 44, sem termo de plano ou exercício. Verificar que `npx tsc --noEmit` passa.

## 6. Treinos e o modelo

- [x] 6.1 Trocar o vazio de `(workouts)/index` para o título "Treinos", "Nenhum plano de treino ainda." e "Criar plano" quando não há plano. Com plano, mostrar o ativo (nome e dias) e os arquivados. Início e Dashboard continuam "Nada por aqui ainda.", sem plano. Verificar que essas rotas não importam `src/db` nem `src/repositories` direto, só hook, e que `npx tsc --noEmit` passa.
- [x] 6.2 Criar `(workouts)/new` com os nove modelos, frases e ordem da spec. Cancelar volta sem gravar. Confirmar sem plano ativo grava e abre o plano. Confirmar com plano ativo pede arquivamento; cancelar não grava; confirmar arquiva o anterior. Título da lista permanece "Treinos"; esta rota usa título "Modelo" sem large title. Verificar que `npx tsc --noEmit` passa.

## 7. Editor do plano

- [x] 7.1 Criar `(workouts)/[planId]` com a faixa Seg–Dom, "Descanso", cards dos dias, tags com nome e cor do grupo, e "Corpo inteiro" no `tint`. Implementar nome do plano e do dia (vazio mantém o anterior), acrescentar, remover, mover e editar tags, inclusive trocar corpo inteiro por um grupo. Sair da tela e voltar mostra o mesmo plano. Verificar que `npx tsc --noEmit` passa.
- [x] 7.2 Criar o seletor em `(workouts)/[planId]/days/[dayId]`, título "Exercícios", reusando a consulta do catálogo. Mostrar "Sugeridos" e "Outros" só quando há grupos e as duas partes têm item. Alocar uma vez, cancelar sem alocar, ordenar, e editar a meta nos três casos válidos e nos rejeitados da spec. Subir e descer não passam do primeiro nem do último. Verificar que `npx tsc --noEmit` passa.

## 8. Arquivar, reativar e excluir

- [x] 8.1 Na lista, reativar pede confirmação e troca o ativo; cancelar não troca. Excluir pede confirmação; cancelar mantém; confirmar some com o plano e, se era o único, volta ao vazio sem promover arquivado. Nenhuma dessas ações cria sessão ou métrica. Verificar que `npx tsc --noEmit` passa e que não surgiu rota fora de `(workouts)`.

## 9. Arquitetura

- [x] 9.1 Atualizar `docs/architecture.md` com as decisões duráveis do design: nove modelos, programa nomeado fora da lista, weekday no `WorkoutDay`, um treino por dia da semana, dias repetidos independentes, ênfase como sugestão, `local_owner` fora do sync. Manter em aberto a sugestão do próximo treino. Acrescentar uma linha no registro de decisões. Verificar que a tabela de exercícios do catálogo não foi copiada para o documento.

## 10. Verificação

- [x] 10.1 Rodar `npx expo lint`, `npx tsc --noEmit` e `npx jest`. Verificar que os três terminam com código 0.
