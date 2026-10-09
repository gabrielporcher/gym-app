# Spec Delta

## Purpose

Permite que o usuário crie o próprio plano de treino a partir de um modelo de divisão, distribua os dias na semana e aloque exercícios com uma ênfase muscular visível.

## ADDED Requirements

### Requirement: Nove modelos de divisão
A escolha de um plano MUST oferecer exatamente estes modelos, nesta ordem: Corpo inteiro, Superiores e inferiores, Push Pull Legs, Push Pull Legs 2x, ABC, ABC 2x, ABCD, ABCDE e Personalizado. Cada um MUST mostrar o próprio nome e a frase de ajuda abaixo.

#### Scenario: Lista fechada
- **WHEN** não há plano ativo e o usuário pede para criar um plano
- **THEN** aparecem os nove modelos, nessa ordem
- **AND** não aparece modelo Arnold, PHUL, PHAT nem PPLUL

#### Scenario: Frases de ajuda
- **WHEN** os modelos estão visíveis
- **THEN** Corpo inteiro mostra "O mesmo tipo de treino, com o corpo todo, três vezes na semana. Dá para tirar ou acrescentar dias depois."
- **AND** Superiores e inferiores mostra "Quatro treinos: superiores na segunda e na quinta, inferiores na terça e na sexta. Os dois dias de superiores são independentes."
- **AND** Push Pull Legs mostra "Três treinos: push, pull e pernas, em dias alternados."
- **AND** Push Pull Legs 2x mostra "O ciclo push, pull e pernas repetido na semana. A segunda ocorrência de cada um começa igual e pode ser editada à parte."
- **AND** ABC mostra "Três treinos diferentes, A, B e C, em dias alternados."
- **AND** ABC 2x mostra "A, B e C duas vezes na semana. O A da segunda vez é outro dia: pode ficar igual ou mudar."
- **AND** ABCD mostra "Quatro treinos diferentes ao longo da semana."
- **AND** ABCDE mostra "Cinco treinos diferentes, um por dia útil, começando por peito, costas, pernas, ombros e braços."
- **AND** Personalizado mostra "Começa com um dia, sem grupos sugeridos. Os outros dias e os grupos ficam por sua conta."

#### Scenario: Cancelar antes de escolher
- **WHEN** a lista de modelos está visível e o usuário cancela
- **THEN** nenhum plano é gravado

### Requirement: Plano nasce do modelo
Confirmar um modelo sem outro plano ativo MUST gravar um plano ativo com o nome do modelo, os dias abaixo e a semana de segunda a domingo. Dia sem treino MUST aparecer como "Descanso" e MUST NOT ter exercício.

#### Scenario: Superiores e inferiores
- **WHEN** o usuário confirma Superiores e inferiores e não havia plano ativo
- **THEN** o plano ativo se chama "Superiores e inferiores"
- **AND** segunda é "Superiores 1" com as tags Peito, Costas, Ombros, Bíceps e Tríceps, nessa ordem
- **AND** terça é "Inferiores 1" com as tags Quadríceps, Posterior de coxa, Glúteos, Adutores e Panturrilhas, nessa ordem
- **AND** quarta é Descanso
- **AND** quinta é "Superiores 2" com as mesmas tags de "Superiores 1"
- **AND** sexta é "Inferiores 2" com as mesmas tags de "Inferiores 1"
- **AND** sábado e domingo são Descanso

#### Scenario: Corpo inteiro em três dias
- **WHEN** o usuário confirma Corpo inteiro e não havia plano ativo
- **THEN** o plano ativo se chama "Corpo inteiro"
- **AND** segunda é "Corpo inteiro 1", quarta é "Corpo inteiro 2" e sexta é "Corpo inteiro 3"
- **AND** cada um desses dias mostra a tag "Corpo inteiro" e não mostra os doze grupos
- **AND** terça, quinta, sábado e domingo são Descanso

#### Scenario: Push Pull Legs em três dias
- **WHEN** o usuário confirma Push Pull Legs e não havia plano ativo
- **THEN** segunda é "Push" com Peito, Ombros e Tríceps
- **AND** quarta é "Pull" com Costas, Bíceps e Antebraço, sem Ombros
- **AND** sexta é "Pernas" com Quadríceps, Posterior de coxa, Glúteos, Adutores e Panturrilhas
- **AND** terça, quinta, sábado e domingo são Descanso

#### Scenario: Push Pull Legs 2x
- **WHEN** o usuário confirma Push Pull Legs 2x e não havia plano ativo
- **THEN** segunda é "Push", terça é "Pull", quarta é "Pernas", quinta é "Push 2", sexta é "Pull 2" e sábado é "Pernas 2"
- **AND** domingo é Descanso
- **AND** "Push 2" começa com as mesmas tags de "Push"

#### Scenario: ABC
- **WHEN** o usuário confirma ABC e não havia plano ativo
- **THEN** segunda é "Treino A" com Peito, Ombros e Tríceps
- **AND** quarta é "Treino B" com Costas e Bíceps
- **AND** sexta é "Treino C" com Quadríceps, Posterior de coxa, Glúteos, Adutores e Panturrilhas
- **AND** terça, quinta, sábado e domingo são Descanso

#### Scenario: ABC 2x
- **WHEN** o usuário confirma ABC 2x e não havia plano ativo
- **THEN** segunda é "Treino A1", terça é "Treino B1", quarta é "Treino C1", quinta é "Treino A2", sexta é "Treino B2" e sábado é "Treino C2"
- **AND** domingo é Descanso
- **AND** "Treino A1" e "Treino A2" começam com Peito, Ombros e Tríceps

#### Scenario: ABCD
- **WHEN** o usuário confirma ABCD e não havia plano ativo
- **THEN** segunda é "Treino A" com Peito e Tríceps
- **AND** terça é "Treino B" com Costas e Bíceps
- **AND** quinta é "Treino C" com Quadríceps, Posterior de coxa, Glúteos, Adutores e Panturrilhas
- **AND** sexta é "Treino D" com Ombros, Bíceps e Tríceps
- **AND** quarta, sábado e domingo são Descanso

#### Scenario: ABCDE
- **WHEN** o usuário confirma ABCDE e não havia plano ativo
- **THEN** segunda é "Treino A" com Peito
- **AND** terça é "Treino B" com Costas
- **AND** quarta é "Treino C" com Quadríceps, Posterior de coxa, Glúteos, Adutores e Panturrilhas
- **AND** quinta é "Treino D" com Ombros
- **AND** sexta é "Treino E" com Bíceps, Tríceps e Antebraço
- **AND** sábado e domingo são Descanso

#### Scenario: Personalizado
- **WHEN** o usuário confirma Personalizado e não havia plano ativo
- **THEN** o plano ativo se chama "Personalizado"
- **AND** segunda é "Treino 1" e não mostra tag de grupo nem "Corpo inteiro"
- **AND** terça a domingo são Descanso

### Requirement: Dias repetidos são independentes
Dois dias que nascem com a mesma ênfase MUST ser editáveis sem alterar um ao outro.

#### Scenario: Exercício só no primeiro A
- **WHEN** o plano é ABC 2x e o usuário aloca Supino reto com barra em "Treino A1"
- **THEN** "Treino A2" não contém Supino reto com barra

#### Scenario: Tag só no primeiro A
- **WHEN** o plano é ABC 2x e o usuário remove a tag Peito de "Treino A1"
- **THEN** "Treino A2" continua mostrando Peito

### Requirement: Um plano ativo
MUST haver no máximo um plano ativo. Confirmar outro modelo com um plano ativo MUST pedir arquivamento antes de gravar o novo. Cancelar MUST manter o ativo e MUST NOT gravar o novo.

#### Scenario: Confirmar arquiva o anterior
- **WHEN** "ABC" está ativo e o usuário confirma arquivar e criar "Superiores e inferiores"
- **THEN** "Superiores e inferiores" fica ativo
- **AND** "ABC" fica arquivado

#### Scenario: Cancelar o arquivamento
- **WHEN** "ABC" está ativo e o usuário cancela o arquivamento ao escolher outro modelo
- **THEN** "ABC" continua ativo
- **AND** nenhum plano novo é gravado

#### Scenario: Primeiro plano não pede arquivamento
- **WHEN** não há plano ativo e o usuário confirma Corpo inteiro
- **THEN** o app não pede arquivamento
- **AND** Corpo inteiro fica ativo

### Requirement: Planos na seção Treinos
Treinos MUST mostrar o plano ativo com o nome e os dias de treino. Planos arquivados MUST aparecer como arquivados. Sem plano gravado, vale o estado vazio da seção.

#### Scenario: Ativo e arquivado juntos
- **WHEN** "Superiores e inferiores" está ativo e "ABC" está arquivado
- **THEN** Treinos mostra "Superiores e inferiores" como plano ativo, com Superiores 1, Inferiores 1, Superiores 2 e Inferiores 2
- **AND** mostra "ABC" como arquivado

#### Scenario: Reabrir mantém o plano
- **WHEN** o usuário sai de Treinos e volta, ou abre o app de novo, com um plano gravado
- **THEN** o mesmo plano, os mesmos dias e os mesmos exercícios continuam visíveis

### Requirement: Reativar plano arquivado
Reativar um plano arquivado MUST pedir confirmação. Confirmar MUST arquivar o ativo atual e MUST tornar o escolhido ativo. Cancelar MUST NOT mudar qual plano está ativo.

#### Scenario: Confirmar a reativação
- **WHEN** "Superiores e inferiores" está ativo, "ABC" está arquivado e o usuário confirma reativar "ABC"
- **THEN** "ABC" fica ativo
- **AND** "Superiores e inferiores" fica arquivado

#### Scenario: Cancelar a reativação
- **WHEN** o usuário cancela a reativação de "ABC"
- **THEN** "Superiores e inferiores" continua ativo
- **AND** "ABC" continua arquivado

### Requirement: Excluir plano
Excluir um plano MUST pedir confirmação. Confirmar MUST retirar esse plano, os dias e os exercícios dele da consulta. Cancelar MUST mantê-lo. Excluir o ativo MUST NOT ativar um arquivado.

#### Scenario: Confirmar a exclusão do ativo
- **WHEN** o único plano é o ativo e o usuário confirma a exclusão
- **THEN** Treinos volta ao estado sem plano
- **AND** o catálogo ainda devolve Supino reto com barra

#### Scenario: Excluir o ativo não promove arquivado
- **WHEN** há um plano ativo e um arquivado e o usuário confirma excluir o ativo
- **THEN** o arquivado continua arquivado
- **AND** não há plano ativo

#### Scenario: Cancelar a exclusão
- **WHEN** o usuário cancela a exclusão
- **THEN** o plano continua na lista, com os mesmos dias e exercícios

### Requirement: Acrescentar dia de treino
Acrescentar um dia MUST colocá-lo no primeiro dia da semana, de segunda a domingo, que estiver em Descanso, com nome "Treino N" (menor inteiro positivo ainda não usado nesse nome) e sem tag. A ação MUST ficar indisponível quando os sete dias já têm treino.

#### Scenario: Upper/lower ganha a quarta-feira
- **WHEN** o plano é Superiores e inferiores e o usuário acrescenta um dia
- **THEN** quarta passa a ser "Treino 1", sem tags
- **AND** segunda, terça, quinta e sexta permanecem como estavam

#### Scenario: Semana cheia
- **WHEN** os sete dias da semana já têm treino
- **THEN** a ação de acrescentar dia não está disponível
- **AND** os sete treinos permanecem

### Requirement: Remover dia de treino
Remover um dia MUST devolver esse dia da semana para Descanso e MUST retirar os exercícios daquele dia. Com um único dia de treino, a remoção MUST estar indisponível.

#### Scenario: Remover o segundo inferiores
- **WHEN** o plano é Superiores e inferiores com Supino reto com barra em "Superiores 1" e o usuário remove "Inferiores 2"
- **THEN** sexta volta a ser Descanso
- **AND** "Superiores 1" continua com Supino reto com barra

#### Scenario: Último dia não sai
- **WHEN** o plano tem só "Treino 1"
- **THEN** a remoção desse dia não está disponível
- **AND** "Treino 1" permanece

### Requirement: Mover dia para um descanso
O usuário MUST poder mover um dia de treino para um dia da semana que está em Descanso. O dia de origem MUST passar a ser Descanso. Um dia da semana ocupado MUST NOT ser destino.

#### Scenario: Superiores 2 vai para quarta
- **WHEN** o plano é Superiores e inferiores e o usuário move "Superiores 2" de quinta para quarta
- **THEN** quarta é "Superiores 2"
- **AND** quinta é Descanso
- **AND** sexta continua "Inferiores 2"

#### Scenario: Destino ocupado não é oferecido
- **WHEN** segunda já é "Superiores 1" e o usuário vai mover "Superiores 2"
- **THEN** segunda não é oferecida como destino
- **AND** cancelar esse movimento deixa "Superiores 2" na quinta

### Requirement: Editar ênfase do dia
O usuário MUST poder remover uma tag e acrescentar um grupo muscular que ainda não está no dia. "Corpo inteiro" e grupos específicos MUST NOT aparecer juntos: acrescentar um grupo MUST substituir "Corpo inteiro". Remover a última tag MUST ser permitido.

#### Scenario: Tirar ombros e pôr abdômen
- **WHEN** "Superiores 1" tem Peito, Costas, Ombros, Bíceps e Tríceps e o usuário remove Ombros e acrescenta Abdômen
- **THEN** as tags são Peito, Costas, Bíceps, Tríceps e Abdômen
- **AND** Ombros não aparece

#### Scenario: Corpo inteiro vira um grupo
- **WHEN** o dia mostra "Corpo inteiro" e o usuário acrescenta Peito
- **THEN** o dia mostra Peito
- **AND** não mostra "Corpo inteiro"

#### Scenario: Dia sem tag
- **WHEN** o usuário remove a única tag do dia
- **THEN** o dia continua existindo
- **AND** não mostra tag de grupo nem "Corpo inteiro"

### Requirement: Tag com nome e cor estável
Toda tag de grupo MUST mostrar o nome do grupo. O mesmo grupo MUST usar a mesma cor em qualquer dia e na lista do seletor. A cor MUST NOT ser o único sinal: o nome continua visível na aparência clara e na escura.

#### Scenario: Peito igual nos dois superiores
- **WHEN** "Superiores 1" e "Superiores 2" mostram Peito
- **THEN** as duas tags mostram o texto "Peito"
- **AND** as duas usam a mesma cor

#### Scenario: Aparência escura mantém o nome
- **WHEN** a aparência do sistema é escura e o dia tem a tag Peito
- **THEN** o texto "Peito" continua visível na tag

### Requirement: Seletor prioriza a ênfase
Com grupos na ênfase, o seletor MUST listar primeiro os exercícios que entram no filtro daquele grupo (algum músculo do grupo em 4 ou 5). A ordem das tags desempata. No mesmo grupo, composto MUST vir antes de isolado e, por último, o nome em pt-BR. Quem não combina MUST vir depois, por nome em pt-BR. Sinergista MUST NOT contar como combinação.

#### Scenario: Peito antes de costas antes do resto
- **WHEN** a ênfase é Peito e depois Costas e o seletor abre sem texto e sem filtro
- **THEN** Supino reto com barra aparece antes de Remada curvada com barra
- **AND** Remada curvada com barra aparece antes de Agachamento livre
- **AND** Agachamento livre continua na lista

#### Scenario: Tríceps não puxa o supino
- **WHEN** a ênfase é só Tríceps e o seletor abre sem texto e sem filtro
- **THEN** Tríceps testa com barra W aparece antes de Supino reto com barra
- **AND** Supino reto com barra continua na lista

#### Scenario: Composto antes de isolado no mesmo grupo
- **WHEN** a ênfase é só Quadríceps e o seletor abre sem texto e sem filtro
- **THEN** Agachamento livre aparece antes de Cadeira extensora

#### Scenario: Mesmo grupo e mesmo tipo ordenam pelo nome
- **WHEN** a ênfase é só Peito e o seletor abre sem texto e sem filtro
- **THEN** Supino inclinado com barra aparece antes de Supino reto com barra

### Requirement: Corpo inteiro ordena por tipo
Enquanto o dia mostra "Corpo inteiro", o seletor sem texto e sem filtro MUST listar todos os exercícios, compostos antes dos isolados e, dentro de cada tipo, pelo nome em pt-BR.

#### Scenario: Composto de nome posterior vem antes do isolado
- **WHEN** o dia mostra "Corpo inteiro" e o seletor abre sem texto e sem filtro
- **THEN** Agachamento livre aparece antes de Supino reto com barra
- **AND** Supino reto com barra aparece antes de Cadeira extensora

### Requirement: Sem ênfase, o seletor segue o nome
Sem tag e sem "Corpo inteiro", o seletor sem texto e sem filtro MUST ordenar pelo nome em pt-BR.

#### Scenario: Personalizado em ordem de nome
- **WHEN** "Treino 1" não tem tag e o seletor abre sem texto e sem filtro
- **THEN** Agachamento livre aparece antes de Cadeira extensora
- **AND** Cadeira extensora aparece antes de Supino reto com barra

### Requirement: O seletor não esconde o catálogo
Texto e filtro de grupo MUST restringir como na consulta do catálogo, e a ordenação da ênfase MUST valer só sobre o que passou. Cancelar MUST NOT alocar exercício. O mesmo exercício MUST aparecer no máximo uma vez no dia.

#### Scenario: Busca no dia de superiores
- **WHEN** a ênfase começa por Peito e o usuário busca "agachamento"
- **THEN** Agachamento livre aparece
- **AND** Supino reto com barra não aparece

#### Scenario: Busca sem resultado
- **WHEN** o usuário busca "kettlebell" e cancela
- **THEN** a lista do seletor fica vazia antes do cancelamento
- **AND** o dia permanece com os exercícios que já tinha

#### Scenario: Filtro de grupo fora da ênfase
- **WHEN** a ênfase é Peito e o usuário filtra pelo grupo Quadríceps
- **THEN** Agachamento livre aparece
- **AND** Supino reto com barra não aparece

#### Scenario: Cancelar não aloca
- **WHEN** o seletor está aberto e o usuário cancela sem escolher
- **THEN** o dia permanece com os exercícios que já tinha

#### Scenario: Exercício repetido não duplica
- **WHEN** o dia já tem Supino reto com barra e o usuário escolhe Supino reto com barra de novo
- **THEN** o dia continua com uma única ocorrência de Supino reto com barra

### Requirement: Meta opcional de séries e repetições
Cada exercício do dia MUST aceitar uma meta vazia ou inteiros maiores ou iguais a 1 para séries, repetições mínimas e repetições máximas. Com mínimo e máximo preenchidos, o máximo MUST ser maior ou igual ao mínimo. Valor rejeitado MUST NOT substituir a meta anterior nem remover o exercício.

#### Scenario: Faixa 3 séries de 8 a 12
- **WHEN** o usuário grava 3 séries, mínimo 8 e máximo 12 em Supino reto com barra
- **THEN** o dia mostra 3, 8 e 12 nesse exercício

#### Scenario: Só as séries
- **WHEN** o usuário grava 3 séries e deixa mínimo e máximo vazios
- **THEN** o dia mostra 3 séries nesse exercício
- **AND** não mostra mínimo nem máximo de repetições

#### Scenario: Sem meta
- **WHEN** o exercício acaba de ser alocado e o usuário não informa meta
- **THEN** o dia não mostra quantidade de séries nem de repetições nesse exercício

#### Scenario: Máximo menor que o mínimo
- **WHEN** a meta anterior é 3 séries de 8 a 12 e o usuário tenta gravar mínimo 8 e máximo 6
- **THEN** o dia continua mostrando 3, 8 e 12
- **AND** o exercício continua no dia

#### Scenario: Zero não entra
- **WHEN** a meta está vazia e o usuário tenta gravar 0 séries
- **THEN** o dia continua sem quantidade de séries nesse exercício
- **AND** o exercício continua no dia

#### Scenario: Limpar a meta
- **WHEN** a meta é 3 séries de 8 a 12 e o usuário limpa os três valores
- **THEN** o dia deixa de mostrar séries e repetições nesse exercício
- **AND** o exercício continua no dia

### Requirement: Ordem dos exercícios no dia
O usuário MUST poder mover um exercício uma posição para cima ou para baixo. O primeiro MUST NOT subir. O último MUST NOT descer.

#### Scenario: O terceiro sobe uma posição
- **WHEN** o dia está na ordem Supino reto com barra, Remada curvada com barra, Agachamento livre e o usuário move Agachamento livre para cima
- **THEN** a ordem fica Supino reto com barra, Agachamento livre, Remada curvada com barra

#### Scenario: O primeiro não sobe
- **WHEN** Supino reto com barra é o primeiro e o usuário pede para movê-lo para cima
- **THEN** Supino reto com barra continua primeiro

#### Scenario: O último não desce
- **WHEN** Agachamento livre é o último e o usuário pede para movê-lo para baixo
- **THEN** Agachamento livre continua último

### Requirement: Nome vazio não apaga o anterior
Confirmar nome vazio no plano ou no dia MUST manter o nome anterior.

#### Scenario: Plano sem nome
- **WHEN** o plano se chama "Superiores e inferiores" e o usuário confirma o nome vazio
- **THEN** o plano continua se chamando "Superiores e inferiores"

#### Scenario: Dia sem nome
- **WHEN** o dia se chama "Superiores 1" e o usuário confirma o nome vazio
- **THEN** o dia continua se chamando "Superiores 1"

### Requirement: Plano não cria sessão nem métrica
Gravar, editar, arquivar ou excluir um plano MUST NOT criar sessão ou métrica.

#### Scenario: Plano ativo ainda sem sessão
- **WHEN** existe um plano ativo com exercícios alocados
- **THEN** não há sessão para consultar
- **AND** não há métrica para consultar
