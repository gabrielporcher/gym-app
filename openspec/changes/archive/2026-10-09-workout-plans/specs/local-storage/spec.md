# Spec Delta

## REMOVED Requirements

### Requirement: Nenhum dado de treino nesta base
**Reason**: O usuário passa a poder gravar plano de treino. A frase que impedia qualquer dado de treino não cabe mais.
**Migration**: Sessão e métrica continuam ausentes. O comportamento novo está em "Plano pode ser gravado; sessão e métrica não".

## ADDED Requirements

### Requirement: Plano pode ser gravado; sessão e métrica não
Com o armazenamento pronto, o app MUST poder gravar e devolver plano de treino. MUST NOT haver sessão nem métrica gravadas, porque esta base não oferece como criá-las. O catálogo de exercícios da base MUST permanecer consultável e MUST NOT incluir exercício criado pelo usuário.

#### Scenario: Aberto sem plano
- **WHEN** o armazenamento está pronto e nenhum plano foi gravado
- **THEN** não há plano de treino, sessão nem métrica para consultar
- **AND** a consulta do catálogo devolve os exercícios da base

#### Scenario: Plano gravado não cria sessão
- **WHEN** o armazenamento está pronto e existe um plano de treino gravado
- **THEN** a consulta devolve esse plano
- **AND** não há sessão nem métrica para consultar
- **AND** a consulta do catálogo devolve os exercícios da base

#### Scenario: Troca de seção não descarta o plano
- **WHEN** o armazenamento está pronto, existe um plano gravado e o usuário troca de seção
- **THEN** o app não grava um plano novo nem descarta o existente
- **AND** não pede confirmação por causa da troca
- **AND** o catálogo da base permanece consultável

#### Scenario: Catálogo não é dado do usuário
- **WHEN** o armazenamento está pronto e nenhum exercício da base foi retirado
- **THEN** a consulta do catálogo não inclui exercício criado pelo usuário

#### Scenario: Exclusão cancelada
- **WHEN** o usuário cancela a exclusão de um plano gravado
- **THEN** o plano continua consultável
- **AND** continua sem sessão e sem métrica
