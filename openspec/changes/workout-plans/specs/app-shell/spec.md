# Spec Delta

## MODIFIED Requirements

### Requirement: Seção sem conteúdo de treino
Início e Dashboard MUST mostrar o próprio nome como título e o texto "Nada por aqui ainda." e MUST NOT mostrar plano de treino, sessão, exercício ou métrica. Treinos MUST mostrar o título "Treinos". Sem plano de treino gravado, Treinos MUST mostrar "Nenhum plano de treino ainda." e a ação "Criar plano", e MUST NOT mostrar sessão nem métrica.

#### Scenario: Início vazio
- **WHEN** o usuário está em Início
- **THEN** o título é "Início"
- **AND** o texto "Nada por aqui ainda." está visível
- **AND** não há plano de treino, sessão, exercício nem métrica

#### Scenario: Treinos vazio
- **WHEN** o usuário seleciona Treinos e não há plano de treino gravado
- **THEN** o título é "Treinos"
- **AND** o texto "Nenhum plano de treino ainda." está visível
- **AND** a ação "Criar plano" está visível
- **AND** não há sessão nem métrica

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
- **WHEN** o usuário troca de seção sem ter informado dados e não há plano gravado
- **THEN** o app não oferece cancelar uma edição
- **AND** Início e Dashboard mostram "Nada por aqui ainda."
- **AND** Treinos mostra "Nenhum plano de treino ainda."

#### Scenario: Plano gravado sobrevive à troca
- **WHEN** existe um plano de treino gravado e o usuário vai para Início e volta para Treinos
- **THEN** o app não pede para salvar nem descartar
- **AND** Treinos continua mostrando esse plano
