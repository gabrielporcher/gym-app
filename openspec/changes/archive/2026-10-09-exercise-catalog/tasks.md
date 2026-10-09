# Tasks

## 1. Consulta no domínio

- [x] 1.1 Criar `src/domain/exercise-catalog.ts` com `normalizeSearchText` e `recruitmentRole`, e `src/domain/exercise-catalog.test.ts` cobrindo acento e caixa (`triceps` / `Tríceps`, `áéíóúãõâêôç`), texto vazio ou só espaços, e os papéis 5 (agonista principal), 4 (agonista secundário) e 3, 2 (sinergista). Apagar `src/domain/example.ts` e `src/domain/example.test.ts`. Verificar que `npx jest src/domain/exercise-catalog.test.ts` passa e que o domínio não importa React, React Native, Expo nem `src/db`.
- [x] 1.2 Em `filterExercises` (e na busca por identidade), implementar texto, grupo, equipamento, limpeza dos filtros, ordem `pt-BR`, deduplicação, grupo ou equipamento desconhecido e ausência de item removido ou inexistente. Estender o teste com fixtures dos casos pinados na spec: Supino reto com barra, Supino inclinado com barra, Supino reto com halteres, Supino declinado com barra, Supino declinado com halteres, Crucifixo reto com halteres, Agachamento livre, Cadeira extensora, Tríceps testa com barra W, Rosca direta com barra, Voador, Puxada frontal, Flexão de braços e Encolhimento com barra. Verificar que `npx jest src/domain/exercise-catalog.test.ts` passa esses cenários, inclusive nota ausente não virar 0.

## 2. Catálogo tipado

- [x] 2.1 Criar `src/db/catalog.ts` com a taxonomia e os 114 exercícios da tabela do design, UUID v4 gerados uma vez, `owner_id` nulo e sem import de Expo. Nomes, alternativos, equipamento, carga, composto ou isolado, unilateral e recrutamento devem ser os da tabela. Verificar que `npx tsc --noEmit` passa e que o arquivo não é importado por `src/app`, `src/hooks` nem `src/repositories`.
- [x] 2.2 Criar `src/db/catalog.test.ts` que percorre o catálogo e confere os 114 nomes, a taxonomia fechada da spec, um 5 por exercício, notas só de 2 a 5, equipamentos e o mapa de carga (Barra W, Smith e barra hexagonal como `barra`), nomes únicos e os recrutamentos pinados de Supino reto com barra, Supino inclinado com barra, Agachamento livre e Tríceps testa com barra W. Rodar esses registros em `filterExercises` para os cenários de busca e filtro da spec (Peito inclui o supino reto e exclui do Tríceps; Ombros inclui o inclinado; Glúteos inclui o agachamento e exclui a extensora; `voador`, `triceps`, `burpee`). Verificar que `npx jest src/db/catalog.test.ts` passa.

## 3. Schema e migrations

- [x] 3.1 Declarar em `src/db/schema.ts` as cinco tabelas do design (`muscle_groups`, `muscles`, `exercises`, `exercise_aliases`, `exercise_muscles`), com UUID, timestamps, `deleted_at`, `owner_id` só em `exercises`, `CHECK` de recrutamento e as chaves estrangeiras `ON DELETE RESTRICT`. Gerar a migration com o Drizzle já configurado. Verificar que o SQL novo tem `CREATE TABLE`, não está vazio, e que `npx tsc --noEmit` passa.
- [x] 3.2 Gravar os `INSERT` do `catalog.ts` numa migration seguinte, não vazia, registrada no journal que `prepareLocalDatabase` já aplica. Não semear na abertura e não editar migration já aplicada. Estender `src/db/catalog.test.ts` para exigir que cada UUID do catálogo apareça nesse SQL e que nenhum se repita. Verificar que `npx jest src/db/catalog.test.ts` passa e que `src/db/client.ts` e `src/hooks/use-local-database.ts` continuam iguais.

## 4. Repositório somente leitura

- [x] 4.1 Criar `src/repositories/exercise-catalog.ts` que lê grupos, músculos e exercícios com `deleted_at` nulo e devolve o formato do domínio, sem chamar `filterExercises` e sem `insert`, `update` ou `delete`. Não criar hook, componente nem rota. Verificar que `npx tsc --noEmit` passa, que uma busca no arquivo não acha escrita, e que `src/app/` não ganhou arquivo.

## 5. Arquitetura

- [x] 5.1 Atualizar `docs/architecture.md` com as decisões duráveis do design: taxonomia, escala e corte 4 do filtro, catálogo como dado de referência com UUID fixo e `owner_id` nulo, equipamento versus tipo de carga. Fechar na lista de questões em aberto a lista de músculos e o corte do agonista. Manter em aberto a cópia do recrutamento para a sessão, a separação dos totais do período e a convenção de kg por tipo de carga. Verificar que o registro de decisões ganhou uma linha para isso e que os 114 exercícios não foram copiados para o documento.

## 6. Verificação

- [x] 6.1 Rodar `npx expo lint`, `npx tsc --noEmit` e `npx jest`. Verificar que os três terminam com código 0.
