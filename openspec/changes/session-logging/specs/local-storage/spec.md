# Spec Delta

## REMOVED Requirements

### Requirement: Plano pode ser gravado; sessão e métrica não
**Reason**: A sessão passa a poder ser gravada. Métrica continua sem gravação.
**Migration**: Usar o requisito "Plano e sessão podem ser gravados; métrica não".

## ADDED Requirements

### Requirement: Plano e sessão podem ser gravados; métrica não
Com o armazenamento pronto, o app MUST poder gravar e devolver plano de treino e sessão. MUST NOT haver métrica gravada. Gravar ou editar um plano MUST NOT criar sessão. O catálogo da base MUST permanecer consultável e MUST NOT incluir exercício criado pelo usuário.

#### Scenario: Aberto sem plano
- **WHEN** o armazenamento está pronto e nenhum plano nem sessão foi gravado
- **THEN** não há plano de treino, sessão nem métrica para consultar
- **AND** a consulta do catálogo devolve os exercícios da base

#### Scenario: Plano gravado não cria sessão
- **WHEN** o armazenamento está pronto, existe um plano de treino gravado e nenhuma sessão foi iniciada
- **THEN** a consulta devolve esse plano
- **AND** não há sessão nem métrica para consultar
- **AND** a consulta do catálogo devolve os exercícios da base

#### Scenario: Sessão gravada
- **WHEN** o armazenamento está pronto e existe uma sessão em andamento
- **THEN** a consulta devolve essa sessão
- **AND** não há métrica para consultar

#### Scenario: Troca de seção não descarta o plano nem a sessão
- **WHEN** o armazenamento está pronto, existe um plano gravado, existe uma sessão em andamento e o usuário troca de seção
- **THEN** o app não grava um plano novo nem descarta o existente
- **AND** não descarta a sessão
- **AND** não pede confirmação por causa da troca
- **AND** o catálogo da base permanece consultável

#### Scenario: Catálogo não é dado do usuário
- **WHEN** o armazenamento está pronto e nenhum exercício da base foi retirado
- **THEN** a consulta do catálogo não inclui exercício criado pelo usuário

#### Scenario: Exclusão cancelada
- **WHEN** o usuário cancela a exclusão de um plano gravado e já existe uma sessão
- **THEN** o plano continua consultável
- **AND** a sessão continua consultável
- **AND** não há métrica

#### Scenario: Cancelar não cria sessão
- **WHEN** o usuário cancela a exclusão de um plano gravado e não existe sessão
- **THEN** o plano continua consultável
- **AND** continua sem sessão e sem métrica
