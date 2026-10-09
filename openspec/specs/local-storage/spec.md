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

### Requirement: Nenhum dado de treino nesta base
Com o armazenamento pronto, o app MUST NOT ter plano de treino, sessão ou métrica gravados, porque esta base não oferece como criá-los. O catálogo de exercícios da base MUST estar disponível para consulta e não é dado de treino do usuário.

#### Scenario: Troca de seção não grava
- **WHEN** o armazenamento está pronto e o usuário troca de seção
- **THEN** o app não grava nem descarta plano de treino ou sessão
- **AND** não pede confirmação
- **AND** o catálogo da base permanece consultável

#### Scenario: Dado de treino ausente
- **WHEN** o armazenamento está pronto
- **THEN** não há plano de treino, sessão nem métrica para consultar
- **AND** a consulta do catálogo devolve os exercícios da base

#### Scenario: Catálogo não é dado do usuário
- **WHEN** o armazenamento está pronto e nenhum exercício da base foi retirado
- **THEN** a consulta do catálogo não inclui exercício criado pelo usuário
