# Spec Delta

## Purpose

Define as seções principais do app, o conteúdo vazio de cada uma e a aparência que segue o sistema.

## ADDED Requirements

### Requirement: Três seções em ordem fixa
O app MUST apresentar três seções nesta ordem: Início, Treinos e Dashboard. A seção inicial MUST ser Início. O app MUST NOT apresentar uma seção Exercícios na barra.

#### Scenario: Abertura na primeira seção
- **WHEN** o armazenamento local está pronto e o usuário abre o app
- **THEN** a seção visível é Início
- **AND** a barra mostra Início, Treinos e Dashboard nessa ordem
- **AND** a barra não mostra Exercícios

#### Scenario: Aparência do sistema ausente
- **WHEN** o sistema não informa se a aparência é clara ou escura
- **THEN** o app usa fundo claro e texto escuro

### Requirement: Seção sem conteúdo de treino
Cada seção MUST mostrar o próprio nome como título e o texto "Nada por aqui ainda." MUST NOT mostrar plano de treino, sessão, exercício ou métrica.

#### Scenario: Início vazio
- **WHEN** o usuário está em Início
- **THEN** o título é "Início"
- **AND** o texto "Nada por aqui ainda." está visível
- **AND** não há plano de treino, sessão, exercício nem métrica

#### Scenario: Treinos vazio
- **WHEN** o usuário seleciona Treinos
- **THEN** o título é "Treinos"
- **AND** o texto "Nada por aqui ainda." está visível
- **AND** não há plano de treino, sessão, exercício nem métrica

#### Scenario: Dashboard vazio
- **WHEN** o usuário seleciona Dashboard
- **THEN** o título é "Dashboard"
- **AND** o texto "Nada por aqui ainda." está visível
- **AND** não há plano de treino, sessão, exercício nem métrica

### Requirement: Troca de seção sem confirmação
O usuário MUST poder sair de uma seção e voltar sem confirmação. A troca MUST NOT gravar nem descartar plano de treino, sessão ou exercício.

#### Scenario: Voltar para Início
- **WHEN** o usuário sai de Início, seleciona Treinos e seleciona Início de novo
- **THEN** Início mostra o título "Início" e o texto "Nada por aqui ainda."
- **AND** o app não pede para salvar nem descartar

#### Scenario: Nenhuma ação pendente para cancelar
- **WHEN** o usuário troca de seção sem ter informado dados
- **THEN** o app não oferece cancelar uma edição
- **AND** o conteúdo das duas seções permanece a frase "Nada por aqui ainda."

### Requirement: Aparência clara ou escura do sistema
O app MUST usar fundo claro e texto escuro quando a aparência do sistema é clara, e fundo escuro e texto claro quando a aparência do sistema é escura. Não há controle no app para escolher a aparência.

#### Scenario: Aparência clara
- **WHEN** a aparência do sistema é clara
- **THEN** o fundo das seções é claro e o texto é escuro

#### Scenario: Aparência escura
- **WHEN** a aparência do sistema é escura
- **THEN** o fundo das seções é escuro e o texto é claro

### Requirement: Material translúcido na barra de seções
Quando o aparelho oferece o material translúcido, a barra de seções MUST usá-lo e os títulos e a frase MUST permanecer legíveis. Quando o aparelho não oferece esse material, as mesmas seções MUST permanecer e a barra MUST ser opaca.

#### Scenario: Material disponível
- **WHEN** o aparelho oferece o material translúcido
- **THEN** a barra de seções usa esse material
- **AND** os títulos e o texto "Nada por aqui ainda." continuam legíveis

#### Scenario: Material indisponível
- **WHEN** o aparelho não oferece o material translúcido
- **THEN** as três seções, os títulos e o texto "Nada por aqui ainda." permanecem
- **AND** a barra de seções é opaca
