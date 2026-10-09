# Spec Delta

## Purpose

Disponibiliza o catálogo embutido de exercícios de academia tradicional, com a taxonomia muscular e o recrutamento de cada músculo, para consulta na montagem do plano e na troca futura de exercício.

## ADDED Requirements

### Requirement: Catálogo disponível com o armazenamento
Quando o armazenamento local está pronto, a consulta do catálogo MUST devolver os exercícios da base. Quando o armazenamento não está pronto ou a preparação falhou, a consulta MUST NOT devolvê-los.

#### Scenario: Armazenamento pronto
- **WHEN** o armazenamento local está pronto
- **THEN** a consulta sem texto e sem filtros devolve os exercícios da base
- **AND** cada exercício aparece uma única vez

#### Scenario: Armazenamento ausente
- **WHEN** o armazenamento local ainda não está pronto
- **THEN** a consulta não devolve exercícios

#### Scenario: Preparação cancelada por falha
- **WHEN** a preparação do armazenamento falha
- **THEN** a consulta não devolve exercícios

### Requirement: Atributos de cada exercício
Cada exercício da base MUST ter um nome em pt-BR, zero ou mais nomes alternativos, um equipamento, um tipo de carga, a classificação composto ou isolado e a indicação de ser ou não unilateral.

#### Scenario: Supino reto com barra
- **WHEN** a consulta devolve Supino reto com barra
- **THEN** o nome é "Supino reto com barra"
- **AND** os nomes alternativos incluem "Supino reto" e "Supino com barra"
- **AND** o equipamento é Barra e o tipo de carga é barra
- **AND** o exercício é composto e não é unilateral

#### Scenario: Crucifixo reto com halteres
- **WHEN** a consulta devolve Crucifixo reto com halteres
- **THEN** o exercício é isolado e não é unilateral
- **AND** o equipamento é Halteres e o tipo de carga é halter

#### Scenario: Rosca concentrada
- **WHEN** a consulta devolve Rosca concentrada
- **THEN** o exercício é isolado e unilateral
- **AND** o equipamento é Halteres e o tipo de carga é halter

#### Scenario: Exercício sem nome alternativo
- **WHEN** a consulta devolve Encolhimento com barra
- **THEN** a lista de nomes alternativos está vazia
- **AND** a busca pelo nome "Encolhimento com barra" ainda o devolve

### Requirement: Equipamento fechado
O equipamento de um exercício da base MUST ser exatamente um destes: Barra, Barra W, Halteres, Máquina, Cabo, Peso corporal, Smith ou Barra hexagonal.

#### Scenario: Equipamentos usados pela base
- **WHEN** a consulta lista os equipamentos presentes na base
- **THEN** cada valor é um dos oito equipamentos fechados
- **AND** não há equipamento Kettlebell nem Elástico

#### Scenario: Filtro com equipamento ausente
- **WHEN** a consulta filtra pelo equipamento "Kettlebell"
- **THEN** o resultado é vazio

### Requirement: Tipo de carga fechado
O tipo de carga MUST ser exatamente um destes: barra, halter, máquina, peso corporal ou cabo. Barra W, Smith e Barra hexagonal MUST usar o tipo de carga barra.

#### Scenario: Barra W conta como barra
- **WHEN** a consulta devolve Rosca direta com barra W
- **THEN** o equipamento é Barra W
- **AND** o tipo de carga é barra

#### Scenario: Smith conta como barra
- **WHEN** a consulta devolve Agachamento no Smith
- **THEN** o equipamento é Smith
- **AND** o tipo de carga é barra

#### Scenario: Barra hexagonal conta como barra
- **WHEN** a consulta devolve Levantamento terra com barra hexagonal
- **THEN** o equipamento é Barra hexagonal
- **AND** o tipo de carga é barra

#### Scenario: Peso corporal e cabo
- **WHEN** a consulta devolve Flexão de braços e Puxada frontal
- **THEN** Flexão de braços tem equipamento Peso corporal e tipo de carga peso corporal
- **AND** Puxada frontal tem equipamento Cabo e tipo de carga cabo

### Requirement: Grupos musculares fechados
A consulta MUST oferecer exatamente estes grupos musculares, nesta ordem: Peito, Costas, Ombros, Bíceps, Tríceps, Antebraço, Quadríceps, Posterior de coxa, Glúteos, Adutores, Panturrilhas e Abdômen.

#### Scenario: Lista de grupos
- **WHEN** a consulta pede os grupos musculares
- **THEN** devolve os doze grupos na ordem definida
- **AND** não devolve Braços, Pernas, Lombar nem Cardio

#### Scenario: Grupo ausente
- **WHEN** a consulta filtra pelo grupo "Cardio"
- **THEN** o resultado é vazio

### Requirement: Músculo pertence a um grupo
Cada músculo da base MUST pertencer a exatamente um grupo muscular. A consulta MUST devolver somente os músculos definidos para cada grupo.

#### Scenario: Músculos por grupo
- **WHEN** a consulta pede os músculos de cada grupo
- **THEN** Peito contém Peitoral superior e Peitoral médio-inferior
- **AND** Costas contém Latíssimo do dorso, Romboides, Trapézio superior, Trapézio médio, Trapézio inferior e Eretor da espinha
- **AND** Ombros contém Deltoide anterior, Deltoide lateral e Deltoide posterior
- **AND** Bíceps contém Bíceps braquial e Braquial
- **AND** Tríceps contém Tríceps cabeça longa, Tríceps cabeça lateral e Tríceps cabeça medial
- **AND** Antebraço contém Braquiorradial, Flexores do punho e Extensores do punho
- **AND** Quadríceps contém Reto femoral e Vastos do quadríceps
- **AND** Posterior de coxa contém Bíceps femoral e Semitendíneo e semimembranoso
- **AND** Glúteos contém Glúteo máximo e Glúteo médio
- **AND** Adutores contém Adutores
- **AND** Panturrilhas contém Gastrocnêmio e Sóleo
- **AND** Abdômen contém Reto abdominal e Oblíquos
- **AND** nenhum músculo aparece em dois grupos

#### Scenario: Músculo não é grupo
- **WHEN** a consulta filtra pelo texto de grupo "Deltoide lateral"
- **THEN** o resultado é vazio
- **AND** Deltoide lateral continua existindo como músculo do grupo Ombros

### Requirement: Recrutamento de 1 a 5
Cada exercício MUST informar um inteiro de 1 a 5 para cada músculo envolvido e MUST omitir músculo não envolvido. MUST haver ao menos um músculo com recrutamento 5. Recrutamento 5 MUST ser agonista principal, 4 MUST ser agonista secundário e 1, 2 e 3 MUST ser sinergista.

#### Scenario: Supino reto com barra
- **WHEN** a consulta devolve o recrutamento de Supino reto com barra
- **THEN** Peitoral médio-inferior é 5 e agonista principal
- **AND** Peitoral superior é 3 e sinergista
- **AND** Deltoide anterior é 3 e sinergista
- **AND** Tríceps cabeça lateral é 3 e sinergista
- **AND** Tríceps cabeça medial é 3 e sinergista
- **AND** Tríceps cabeça longa é 2 e sinergista
- **AND** Deltoide lateral não consta

#### Scenario: Supino inclinado com barra
- **WHEN** a consulta devolve o recrutamento de Supino inclinado com barra
- **THEN** Peitoral superior é 5 e agonista principal
- **AND** Deltoide anterior é 4 e agonista secundário
- **AND** Peitoral médio-inferior é 3 e sinergista
- **AND** Tríceps cabeça lateral é 3 e sinergista
- **AND** Tríceps cabeça medial é 3 e sinergista
- **AND** Tríceps cabeça longa é 2 e sinergista

#### Scenario: Agachamento livre
- **WHEN** a consulta devolve o recrutamento de Agachamento livre
- **THEN** Vastos do quadríceps é 5 e agonista principal
- **AND** Glúteo máximo é 4 e agonista secundário
- **AND** Reto femoral é 3 e sinergista
- **AND** Eretor da espinha é 3 e sinergista
- **AND** Bíceps femoral é 2 e sinergista
- **AND** Semitendíneo e semimembranoso é 2 e sinergista

#### Scenario: Tríceps testa com barra W
- **WHEN** a consulta devolve o recrutamento de Tríceps testa com barra W
- **THEN** Tríceps cabeça longa é 5 e agonista principal
- **AND** Tríceps cabeça lateral é 4 e agonista secundário
- **AND** Tríceps cabeça medial é 3 e sinergista
- **AND** nenhum músculo de Peito consta

#### Scenario: Nota fora da escala não entra
- **WHEN** a consulta devolve o recrutamento de qualquer exercício da base
- **THEN** toda nota presente está entre 1 e 5 inclusive
- **AND** não há nota 0

### Requirement: Busca por nome e nome alternativo
A consulta MUST comparar o texto com o nome e com os nomes alternativos, sem diferenciar maiúsculas de minúsculas e sem considerar acentos. Texto vazio ou só com espaços MUST NOT restringir por nome. Um exercício MUST aparecer no máximo uma vez.

#### Scenario: Trecho do nome
- **WHEN** a consulta usa o texto "supino" e nenhum filtro
- **THEN** o resultado inclui Supino reto com barra e Supino inclinado com barra
- **AND** não inclui Rosca direta com barra

#### Scenario: Nome alternativo
- **WHEN** a consulta usa o texto "voador"
- **THEN** o resultado inclui Voador
- **AND** Voador aparece uma única vez

#### Scenario: Acento ignorado
- **WHEN** a consulta usa o texto "triceps"
- **THEN** o resultado inclui Tríceps testa com barra W

#### Scenario: Maiúsculas ignoradas
- **WHEN** a consulta usa o texto "PUXADA FRONTAL"
- **THEN** o resultado inclui Puxada frontal

#### Scenario: Texto vazio
- **WHEN** a consulta usa o texto "   " e nenhum filtro
- **THEN** o resultado é o mesmo da consulta sem texto e sem filtros

#### Scenario: Nada encontrado
- **WHEN** a consulta usa o texto "burpee"
- **THEN** o resultado é vazio

### Requirement: Filtro por grupo muscular
O filtro de grupo muscular MUST incluir o exercício quando pelo menos um músculo daquele grupo tem recrutamento 4 ou 5, e MUST excluí-lo quando o maior recrutamento naquele grupo é 3 ou menos. Sem grupo informado, a consulta MUST NOT restringir por grupo.

#### Scenario: Agonista principal entra no grupo
- **WHEN** a consulta filtra pelo grupo Peito e não informa texto nem equipamento
- **THEN** o resultado inclui Supino reto com barra

#### Scenario: Sinergista fica de fora
- **WHEN** a consulta filtra pelo grupo Tríceps e não informa texto nem equipamento
- **THEN** o resultado não inclui Supino reto com barra
- **AND** inclui Tríceps testa com barra W

#### Scenario: Agonista secundário entra no grupo
- **WHEN** a consulta filtra pelo grupo Ombros
- **THEN** o resultado inclui Supino inclinado com barra
- **AND** não inclui Supino reto com barra

#### Scenario: Agachamento no filtro de glúteos
- **WHEN** a consulta filtra pelo grupo Glúteos
- **THEN** o resultado inclui Agachamento livre
- **AND** não inclui Cadeira extensora

#### Scenario: Grupo omitido
- **WHEN** a consulta não informa grupo muscular e usa o texto "agachamento"
- **THEN** o filtro de grupo não remove Agachamento livre

### Requirement: Filtro por equipamento
O filtro de equipamento MUST incluir somente exercícios daquele equipamento. Sem equipamento informado, a consulta MUST NOT restringir por equipamento.

#### Scenario: Halteres
- **WHEN** a consulta filtra pelo equipamento Halteres e não informa texto nem grupo
- **THEN** o resultado inclui Supino reto com halteres e Crucifixo reto com halteres
- **AND** não inclui Supino reto com barra

#### Scenario: Equipamento omitido
- **WHEN** a consulta não informa equipamento e usa o texto "supino reto"
- **THEN** o resultado inclui Supino reto com barra e Supino reto com halteres

### Requirement: Texto e filtros juntos
Texto, grupo muscular e equipamento informados juntos MUST valer ao mesmo tempo. Limpar texto e filtros MUST devolver de novo a base inteira.

#### Scenario: Peito com halteres
- **WHEN** a consulta filtra pelo grupo Peito e pelo equipamento Halteres
- **THEN** o resultado inclui Crucifixo reto com halteres e Supino reto com halteres
- **AND** não inclui Supino reto com barra

#### Scenario: Texto com grupo e equipamento
- **WHEN** a consulta usa o texto "declinado", o grupo Peito e o equipamento Barra
- **THEN** o resultado inclui Supino declinado com barra
- **AND** não inclui Supino reto com barra nem Supino declinado com halteres

#### Scenario: Limpar a consulta
- **WHEN** uma consulta com texto e filtros devolve um subconjunto e, em seguida, texto e filtros são limpos
- **THEN** o resultado volta a ser a base inteira
- **AND** nenhum exercício foi gravado ou removido

#### Scenario: Combinação sem resultado
- **WHEN** a consulta usa o texto "rosca", o grupo Peito e o equipamento Barra
- **THEN** o resultado é vazio

### Requirement: Ordem alfabética
O resultado MUST vir em ordem alfabética do português pelo nome do exercício.

#### Scenario: Nomes com o mesmo prefixo
- **WHEN** a consulta usa o texto "supino" e nenhum filtro
- **THEN** Supino declinado com barra vem antes de Supino fechado com barra
- **AND** Supino inclinado com barra vem antes de Supino reto com barra

### Requirement: Identidade estável da base
A identidade de um exercício, músculo ou grupo da base MUST permanecer quando uma correção muda o nome, um nome alternativo ou o recrutamento. Uma identidade retirada MUST NOT ser reutilizada por outro item. Consultar uma identidade que não existe MUST devolver ausência.

#### Scenario: Correção de nome
- **WHEN** o nome de Supino reto com barra é corrigido e os nomes alternativos não passam a incluir o nome antigo
- **THEN** a consulta pelo nome novo devolve a mesma identidade
- **AND** a consulta pelo nome antigo não devolve esse exercício

#### Scenario: Correção de recrutamento
- **WHEN** o recrutamento de um músculo de Supino reto com barra é corrigido
- **THEN** a identidade do exercício permanece
- **AND** a consulta devolve a nota corrigida

#### Scenario: Item retirado
- **WHEN** um exercício da base é retirado
- **THEN** a consulta por nome deixa de devolvê-lo
- **AND** a identidade retirada não passa a identificar outro exercício

#### Scenario: Identidade ausente
- **WHEN** a consulta pede uma identidade que não existe
- **THEN** não devolve exercício

### Requirement: Somente a base
A consulta MUST NOT incluir exercício criado pelo usuário e MUST NOT aceitar inclusão nem edição de exercício.

#### Scenario: Inclusão não entra na consulta
- **WHEN** se tenta incluir um exercício de nome "Meu supino"
- **THEN** a consulta seguinte não devolve "Meu supino"

#### Scenario: Edição cancelada
- **WHEN** se inicia uma alteração de nome de um exercício da base e essa alteração é cancelada
- **THEN** a consulta devolve o nome anterior
- **AND** a identidade permanece

#### Scenario: Base sem exercício avulso
- **WHEN** o armazenamento está pronto e nenhum exercício foi retirado
- **THEN** todo item devolvido pela consulta é um exercício da base
