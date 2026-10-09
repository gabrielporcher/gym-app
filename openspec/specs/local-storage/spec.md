# local-storage Specification

## Purpose

Garante que o armazenamento local do aparelho esteja pronto antes das seções e que nenhum dado de treino exista nesta base.

## Requirements

### Requirement: Seções somente com armazenamento pronto
O app MUST mostrar as seções Início, Treinos e Dashboard somente depois que o armazenamento local estiver pronto. Não há seção Exercícios.

#### Scenario: Preparação concluída
- **WHEN** o armazenamento local fica pronto
- **THEN** as seções Início, Treinos e Dashboard ficam disponíveis
- **AND** não há seção Exercícios

#### Scenario: Preparação em andamento
- **WHEN** o armazenamento local ainda não está pronto
- **THEN** as três seções não são mostradas

#### Scenario: Primeira abertura sem dados gravados
- **WHEN** o usuário abre o app e não há plano de treino, sessão nem métrica gravados
- **THEN** a preparação conclui
- **AND** as seções ficam disponíveis
- **AND** o catálogo da base pode ser consultado

### Requirement: Falha ao preparar o armazenamento
Se o armazenamento local não puder ser preparado, o app MUST mostrar o texto "Não foi possível preparar o armazenamento deste aparelho." e MUST NOT mostrar as três seções. A falha MUST NOT gravar plano de treino, sessão ou métrica, e MUST NOT disponibilizar o catálogo.

#### Scenario: Mensagem de falha
- **WHEN** a preparação do armazenamento falha
- **THEN** o usuário vê "Não foi possível preparar o armazenamento deste aparelho."
- **AND** as seções Início, Treinos e Dashboard não são mostradas

#### Scenario: Falha não grava treino
- **WHEN** a preparação do armazenamento falha
- **THEN** não existe plano de treino, sessão nem métrica gravado
- **AND** o catálogo não pode ser consultado

#### Scenario: Nada a cancelar na falha
- **WHEN** a tela de falha está visível
- **THEN** o app não oferece uma ação de confirmar ou cancelar gravação
- **AND** as três seções continuam ocultas

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
