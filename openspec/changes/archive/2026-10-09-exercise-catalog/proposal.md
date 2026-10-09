# Proposal

## Why

Planos de treino e o registro de sessão vão precisar escolher exercícios de academia tradicional, e o dashboard futuro precisa saber quanto cada exercício recruta cada músculo — não só o agonista. Essa base tem de existir antes de `workout-plans`, com uma lista estável para revisar agora.

## What Changes

- Catálogo embutido de exercícios de academia tradicional (cerca de 100), com nome em pt-BR, nomes alternativos, equipamento, tipo de carga, composto ou isolado, unilateral e recrutamento de 1 a 5 por músculo envolvido.
- Taxonomia em dois níveis: músculo pertence a um grupo muscular. A lista proposta fica no design, para revisão antes do apply.
- Cada exercício, músculo e grupo muscular nasce com identidade fixa. Correção futura de nome, alias ou recrutamento entra numa migration nova e mantém a mesma identidade.
- Consulta por nome e nomes alternativos, ignorando acentos e maiúsculas, com filtro opcional por grupo muscular e por equipamento.
- A spec `local-storage` deixa de afirmar que não existe exercício: o catálogo da base passa a estar disponível quando o armazenamento fica pronto. Plano de treino, sessão e métrica continuam ausentes.

## Capabilities

### New Capabilities

- `exercise-catalog`: taxonomia muscular, catálogo da base com recrutamento e a consulta por nome, grupo muscular e equipamento.

### Modified Capabilities

- `local-storage`: com o armazenamento pronto, o catálogo da base pode ser consultado. A ausência de plano de treino, sessão e métrica permanece. A falha de preparação continua sem oferecer o catálogo.

## Impact

- Primeiras tabelas de domínio no cliente local já aberto na change `foundation`, mais a migration que grava o catálogo.
- Camadas novas: dados do catálogo, repositório de consulta e funções puras de normalização de busca e de papel do recrutamento, com testes.
- Nenhuma rota, tela ou dependência nova. As seções Início, Treinos e Dashboard permanecem como estão.
- `docs/architecture.md` recebe a taxonomia, a escala de recrutamento e o fato de o catálogo ser dado de referência, não dado do usuário.

## Fora de escopo

- Qualquer tela, rota ou seção de Exercícios. O seletor nasce em `workout-plans`.
- Exercício criado pelo usuário e qualquer edição da base pela interface.
- Convenção de como registrar a carga na sessão (barra, halter, máquina, peso corporal, cabo). O tipo de carga só fica guardado no exercício; a regra de "peso total" vai para `session-logging`.
- Cálculo de séries por músculo, cópia do recrutamento para a sessão e separação dos totais do período entre agonista e sinergista. Isso é `training-dashboard`.
- Crossfit, Hyrox, levantamento olímpico, kettlebell e cardio.

## Depois

- `workout-plans` usa esta consulta para alocar exercícios no dia de treino.
- `session-logging` reutiliza a mesma consulta quando o usuário troca um exercício planejado, e define a convenção de carga por tipo.
- `training-dashboard` usa o recrutamento gravado aqui para séries por músculo e por grupo, inclusive sinergistas.
- Exercícios criados pelo usuário, no mesmo catálogo, com dono e sync.
- Correções da lista (nome, alias, nota) por migration nova, sem trocar a identidade.
