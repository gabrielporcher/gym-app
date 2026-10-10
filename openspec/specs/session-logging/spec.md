# session-logging Specification

## Purpose

Sugere o próximo dia de treino na semana e registra a sessão de fato: exercícios na ordem do plano, séries com repetições e carga, e a conclusão ou o abandono sem depender da tela aberta.

## Requirements

### Requirement: Sugestão pelo primeiro dia ainda não feito
A sugestão MUST ser o dia de treino do plano ativo com menor posição de segunda a domingo que não tenha sessão concluída na semana local. A semana MUST ir da segunda 00:00 inclusive até a próxima segunda 00:00 exclusiva, no horário do aparelho. A sessão MUST contar na semana em que começou. Descanso MUST NOT entrar na sugestão.

#### Scenario: Segunda sugere o primeiro
- **WHEN** o plano ativo é ABC, hoje é segunda 5 de outubro de 2026 e não há sessão concluída nesta semana
- **THEN** a sugestão é Treino A

#### Scenario: Terça sem o primeiro feito
- **WHEN** hoje é terça 6 de outubro de 2026 e Treino A não foi concluído nesta semana
- **THEN** a sugestão é Treino A

#### Scenario: Terça com o primeiro feito
- **WHEN** Treino A foi concluído na segunda 5 de outubro de 2026 e hoje é terça 6 de outubro de 2026
- **THEN** a sugestão é Treino B

#### Scenario: Dia pulado continua pendente
- **WHEN** só Treino B foi concluído nesta semana e hoje é quinta 8 de outubro de 2026
- **THEN** a sugestão é Treino A

#### Scenario: Semana encerrada
- **WHEN** Treino A, Treino B e Treino C foram concluídos na semana de 5 a 11 de outubro de 2026 e hoje é sábado 10 de outubro de 2026
- **THEN** não há sugestão pendente

#### Scenario: Semana seguinte recomeça
- **WHEN** Treino A, Treino B e Treino C foram concluídos na semana de 5 a 11 de outubro de 2026 e hoje é segunda 12 de outubro de 2026
- **THEN** a sugestão é Treino A

#### Scenario: Domingo não conta na segunda
- **WHEN** a sessão de Treino A começou no domingo 11 de outubro de 2026 às 23:00, foi concluída, e hoje é segunda 12 de outubro de 2026
- **THEN** a sugestão é Treino A

#### Scenario: Meia-noite entra na semana nova
- **WHEN** a sessão de Treino A começou na segunda 12 de outubro de 2026 às 00:10, foi concluída, e não há outra sessão nesta semana
- **THEN** a sugestão é Treino B

#### Scenario: Sessão em andamento não conta
- **WHEN** Treino A está só em andamento e hoje é terça 6 de outubro de 2026
- **THEN** a sugestão é Treino A

#### Scenario: Plano ausente
- **WHEN** não há plano ativo
- **THEN** não há sugestão

#### Scenario: Plano arquivado não sugere
- **WHEN** a sessão concluída de Treino A pertence a um plano arquivado, o plano ativo é Superiores e inferiores e nenhum dia dele foi concluído nesta semana
- **THEN** a sugestão é Superiores 1

### Requirement: Treinar o dia sugerido
Sem sessão em andamento e com sugestão, Início MUST mostrar o nome desse dia e a ação "Treinar". "Treinar" MUST abrir a sessão desse dia.

#### Scenario: Treinar o sugerido
- **WHEN** a sugestão é Treino B e não há sessão em andamento
- **THEN** Início mostra "Treino B" e "Treinar"
- **AND** "Treinar" abre a sessão de Treino B

### Requirement: Escolher outro dia
Antes de haver sessão em andamento, Início MUST oferecer "Outro treino" com os dias de treino do plano ativo, na ordem de segunda a domingo. Escolher um dia MUST abrir a sessão dele. Cancelar MUST NOT gravar sessão.

#### Scenario: Terça escolhe o terceiro
- **WHEN** a sugestão é Treino A e o usuário escolhe Treino C
- **THEN** a sessão em andamento é de Treino C
- **AND** Treino A não ganha sessão

#### Scenario: Cancelar a lista
- **WHEN** a lista de dias está visível e o usuário cancela
- **THEN** não há sessão em andamento
- **AND** a sugestão permanece

### Requirement: Semana sem sugestão
Quando cada dia de treino do plano ativo já tem sessão concluída na semana, Início MUST mostrar "Os treinos desta semana já foram feitos." e MUST manter "Outro treino".

#### Scenario: Sábado com os três feitos
- **WHEN** hoje é sábado 10 de outubro de 2026 e Treino A, Treino B e Treino C já foram concluídos nesta semana
- **THEN** Início mostra "Os treinos desta semana já foram feitos."
- **AND** "Outro treino" está visível
- **AND** "Treinar" não está visível

### Requirement: Continuar a sessão em andamento
Com sessão em andamento, Início MUST mostrar o nome do dia dessa sessão e "Continuar treino". "Continuar treino" MUST reabrir a mesma sessão. Início MUST NOT começar outra sessão enquanto essa não for concluída ou abandonada.

#### Scenario: Voltar do Dashboard
- **WHEN** há sessão em andamento de Treino A e o usuário vai ao Dashboard e volta a Início
- **THEN** Início mostra "Treino A" e "Continuar treino"
- **AND** não há segunda sessão em andamento

#### Scenario: Continuar não duplica
- **WHEN** já existe sessão em andamento de Treino A e o usuário toca "Continuar treino"
- **THEN** abre a mesma sessão
- **AND** não existe outra sessão em andamento

### Requirement: Início sem plano
Sem plano ativo e sem sessão em andamento, Início MUST mostrar "Nada por aqui ainda." e MUST NOT mostrar "Treinar" nem "Outro treino".

#### Scenario: Sem plano
- **WHEN** não há plano ativo nem sessão em andamento
- **THEN** o texto "Nada por aqui ainda." está visível
- **AND** "Treinar" não está visível

### Requirement: Sessão nasce do dia
Começar um dia MUST gravar uma sessão em andamento com os exercícios planejados daquele dia, na ordem do plano, cada um não iniciado. Dia sem exercício MUST abrir a lista vazia. A sessão MUST mostrar o nome do dia como estava ao começar.

#### Scenario: Ordem do plano
- **WHEN** Treino A está na ordem Supino reto com barra, Remada curvada com barra, Agachamento livre e o usuário toca "Treinar"
- **THEN** a sessão lista os três nessa ordem
- **AND** os três estão não iniciados

#### Scenario: Dia sem exercício
- **WHEN** o dia não tem exercício e o usuário começa esse dia
- **THEN** a sessão abre sem exercício
- **AND** a sessão fica em andamento

#### Scenario: Plano editado depois não altera a sessão
- **WHEN** a sessão de Treino A já lista Supino reto com barra e o usuário tira esse exercício do plano
- **THEN** a sessão continua listando Supino reto com barra

### Requirement: A lista não reordena ao registrar
Registrar um exercício MUST NOT mudar a posição dele na lista.

#### Scenario: O terceiro registrado continua terceiro
- **WHEN** a ordem é Supino reto com barra, Remada curvada com barra, Agachamento livre e o usuário conclui Agachamento livre primeiro
- **THEN** a ordem continua Supino reto com barra, Remada curvada com barra, Agachamento livre
- **AND** só Agachamento livre está concluído

### Requirement: Registrar fora da ordem
O usuário MUST poder abrir qualquer exercício da sessão sem ter aberto os anteriores.

#### Scenario: O terceiro antes do primeiro
- **WHEN** a ordem é Supino reto com barra, Remada curvada com barra, Agachamento livre e o usuário abre Agachamento livre primeiro
- **THEN** a tela de Agachamento livre abre
- **AND** Supino reto com barra continua não iniciado

### Requirement: Estado do exercício na sessão
A sessão MUST mostrar cada exercício como não iniciado, em andamento ou concluído. Sem série, MUST ser não iniciado. Com série e sem "Concluir exercício", MUST ser em andamento. Depois de "Concluir exercício", MUST ser concluído.

#### Scenario: Primeira série deixa em andamento
- **WHEN** o usuário grava 10 repetições e 60 kg na primeira série de Supino reto com barra e volta à sessão sem concluir o exercício
- **THEN** Supino reto com barra está em andamento
- **AND** Remada curvada com barra continua não iniciada

#### Scenario: Concluir marca o exercício
- **WHEN** Supino reto com barra tem uma série gravada e o usuário toca "Concluir exercício"
- **THEN** Supino reto com barra está concluído

### Requirement: Meta copiada na sessão
Cada exercício vindo do plano MUST mostrar a meta de séries, repetições e peso como estava ao entrar na sessão. Exercício acrescentado MUST NOT mostrar meta. Mudar a meta no plano depois MUST NOT mudar a meta da sessão.

#### Scenario: Faixa visível
- **WHEN** a meta no plano é 3 séries de 8 a 12 e 60 kg e o usuário abre o exercício na sessão
- **THEN** o exercício mostra 3, 8, 12 e 60 kg

#### Scenario: Plano muda a meta
- **WHEN** a sessão já mostra 3, 8, 12 e 60 kg e o plano passa a 5 séries de 5 e 80 kg
- **THEN** a sessão continua mostrando 3, 8, 12 e 60 kg

#### Scenario: Acrescentado sem meta
- **WHEN** o usuário acrescenta Rosca direta com barra
- **THEN** esse exercício não mostra quantidade de séries nem de repetições

### Requirement: Remover exercício da sessão
O usuário MUST poder remover um exercício da sessão. Com série gravada, a remoção MUST pedir confirmação: confirmar MUST retirar o exercício e as séries dele; cancelar MUST mantê-los. Sem série, remover MUST retirar o exercício sem confirmação. Remover MUST NOT alterar o plano.

#### Scenario: Sem série sai direto
- **WHEN** Supino reto com barra está não iniciado e o usuário remove esse exercício
- **THEN** a sessão não lista mais Supino reto com barra
- **AND** o plano continua com Supino reto com barra

#### Scenario: Com série pede confirmação
- **WHEN** Supino reto com barra tem 10 repetições e 60 kg gravados e o usuário pede para remover
- **THEN** o app pede confirmação
- **AND** a série continua gravada antes da resposta

#### Scenario: Confirmar a remoção
- **WHEN** o usuário confirma remover Supino reto com barra
- **THEN** a sessão não lista mais esse exercício
- **AND** a série de 10 repetições e 60 kg não permanece na sessão

#### Scenario: Cancelar a remoção
- **WHEN** o usuário cancela a remoção
- **THEN** Supino reto com barra continua na sessão com 10 repetições e 60 kg

### Requirement: Acrescentar exercício fora do plano
A sessão MUST deixar acrescentar um exercício do catálogo, um por vez, no fim da lista e não iniciado. Cancelar MUST NOT acrescentar. Exercício já presente MUST NOT entrar de novo. Acrescentar MUST NOT alterar o plano.

#### Scenario: Rosca no fim
- **WHEN** a sessão lista Supino reto com barra e o usuário acrescenta Rosca direta com barra
- **THEN** a ordem fica Supino reto com barra, Rosca direta com barra
- **AND** Rosca direta com barra está não iniciada
- **AND** o dia no plano não contém Rosca direta com barra

#### Scenario: Cancelar não acrescenta
- **WHEN** o catálogo está aberto para a sessão e o usuário cancela
- **THEN** a sessão permanece com os exercícios que já tinha

#### Scenario: Já está na sessão
- **WHEN** a sessão já tem Supino reto com barra e o usuário tenta acrescentar Supino reto com barra
- **THEN** a sessão continua com uma única ocorrência de Supino reto com barra

#### Scenario: Busca sem resultado
- **WHEN** o usuário busca "kettlebell"
- **THEN** a lista do catálogo fica vazia
- **AND** a sessão permanece com os exercícios que já tinha

### Requirement: Registro da série
A tela do exercício MUST listar as séries gravadas, em ordem, com repetições e carga em kg. Repetições MUST ser inteiro maior ou igual a 1. Para barra, halter, máquina e cabo a carga MUST ser maior que zero. Para peso corporal, zero MUST ser aceito. Valor rejeitado MUST NOT criar série nem apagar as anteriores.

#### Scenario: Primeira série do supino
- **WHEN** a meta de Supino reto com barra é 3 séries de 8 a 12 e 60 kg e o usuário grava 10 repetições e 60 kg
- **THEN** a primeira série mostra 10 e 60 kg
- **AND** a sessão continua em andamento

#### Scenario: Carga do halter é a de um halter
- **WHEN** o exercício é Crucifixo reto com halteres e o usuário grava 12 repetições e 22 kg
- **THEN** a série mostra 22 kg
- **AND** não mostra 44 kg

#### Scenario: Peso corporal com zero
- **WHEN** o exercício é Flexão de braços e o usuário grava 15 repetições e 0 kg
- **THEN** a série mostra 15 e 0 kg

#### Scenario: Zero no supino não entra
- **WHEN** Supino reto com barra não tem série e o usuário tenta gravar 10 repetições e 0 kg
- **THEN** não há série gravada

#### Scenario: Repetição zero não entra
- **WHEN** o usuário tenta gravar 0 repetições e 60 kg
- **THEN** não há série gravada

#### Scenario: Carga negativa não entra
- **WHEN** já existe uma série de 10 repetições e 60 kg e o usuário tenta gravar 8 repetições e -5 kg
- **THEN** continua só a série de 10 e 60 kg

#### Scenario: Sair no meio guarda a série
- **WHEN** o usuário grava 10 repetições e 60 kg e volta à sessão sem concluir o exercício
- **THEN** a série de 10 e 60 kg continua no exercício

### Requirement: Mais ou menos séries que a meta
O usuário MUST poder gravar mais séries do que a meta e MUST poder concluir o exercício com menos. Sem meta de séries, MUST poder gravar uma ou mais. A série seguinte ainda vazia MUST oferecer as repetições e a carga da anterior. A primeira MUST oferecer o mínimo de repetições e a carga da meta quando esses valores existirem.

#### Scenario: Quatro séries em vez de três
- **WHEN** a meta é 3 séries e o usuário grava 10 repetições a 60 kg, 8 a 60 kg, 8 a 62,5 kg e 6 a 65 kg
- **THEN** o exercício mostra quatro séries
- **AND** a quarta mostra 6 repetições e 65 kg

#### Scenario: Concluir com uma de três
- **WHEN** a meta é 3 séries, só a primeira está gravada com 10 repetições e 60 kg, e o usuário conclui o exercício
- **THEN** o exercício fica concluído
- **AND** mostra uma série, de 10 repetições e 60 kg

#### Scenario: Sem meta
- **WHEN** o exercício não tem meta e o usuário grava 12 repetições e 40 kg
- **THEN** a série mostra 12 e 40 kg

#### Scenario: A segunda copia a primeira
- **WHEN** a primeira série é 10 repetições e 60 kg e o usuário olha a segunda ainda vazia
- **THEN** a segunda oferece 10 repetições e 60 kg

#### Scenario: A primeira copia a meta
- **WHEN** a meta é 3 séries de 8 a 12 e 60 kg e não há série gravada
- **THEN** a primeira série oferece 8 repetições e 60 kg

#### Scenario: Meta sem repetições
- **WHEN** a meta é 3 séries e 60 kg, sem mínimo nem máximo
- **THEN** a primeira série oferece 60 kg
- **AND** as repetições começam vazias

### Requirement: Editar ou remover série
Enquanto a sessão está em andamento, o usuário MUST poder alterar repetições e carga de uma série gravada e MUST poder remover uma série. Remover a última série de um exercício não concluído MUST deixá-lo não iniciado. Sessão concluída MUST NOT aceitar alteração.

#### Scenario: Corrigir a carga
- **WHEN** a série gravada é 10 repetições e 60 kg e o usuário grava 10 repetições e 62,5 kg no lugar
- **THEN** a série mostra 10 e 62,5 kg
- **AND** não permanece a de 60 kg

#### Scenario: Edição rejeitada
- **WHEN** a série é 10 repetições e 60 kg e o usuário tenta trocar para 0 repetições
- **THEN** a série continua 10 e 60 kg

#### Scenario: Remover a única série
- **WHEN** a única série é 10 repetições e 60 kg, o exercício não está concluído e o usuário remove a série
- **THEN** o exercício fica não iniciado
- **AND** não há série

#### Scenario: Sessão concluída não muda
- **WHEN** a sessão já foi concluída com 10 repetições e 60 kg e o usuário reabre o app
- **THEN** a série continua 10 e 60 kg
- **AND** não há ação de alterar essa série

### Requirement: Concluir exercício
"Concluir exercício" MUST marcar o exercício quando existe ao menos uma série e MUST voltar à sessão. Sem série, MUST NOT marcar. Reabrir um exercício concluído MUST permitir outra série enquanto a sessão não foi concluída, e o exercício MUST permanecer concluído.

#### Scenario: Volta à sessão
- **WHEN** o usuário conclui Supino reto com barra com 10 repetições e 60 kg
- **THEN** a sessão mostra esse exercício concluído
- **AND** a série permanece

#### Scenario: Sem série não conclui
- **WHEN** não há série e o usuário pede "Concluir exercício"
- **THEN** o exercício continua não iniciado
- **AND** a sessão continua em andamento

#### Scenario: Acrescentar depois de concluir
- **WHEN** o exercício já está concluído com 10 repetições e 60 kg e o usuário grava mais 8 repetições e 62,5 kg
- **THEN** o exercício continua concluído
- **AND** mostra as duas séries, 60 kg e 62,5 kg

### Requirement: Concluir treino
"Concluir treino" MUST pedir confirmação. Confirmar, havendo ao menos uma série na sessão, MUST concluir a sessão e voltar a Início. Essa sessão MUST contar na sugestão da semana. Cancelar MUST manter a sessão em andamento. Sem série, "Concluir treino" MUST NOT estar disponível.

#### Scenario: Confirmar com série
- **WHEN** Supino reto com barra tem 10 repetições e 60 kg, os outros exercícios não foram feitos, e o usuário confirma "Concluir treino"
- **THEN** a sessão fica concluída
- **AND** Início deixa de oferecer "Continuar treino"
- **AND** a série de 10 e 60 kg permanece

#### Scenario: Cancelar a conclusão
- **WHEN** a confirmação está visível e o usuário cancela
- **THEN** a sessão continua em andamento
- **AND** a série permanece

#### Scenario: Sem série a ação não aparece
- **WHEN** a sessão não tem série
- **THEN** "Concluir treino" não está disponível
- **AND** "Abandonar treino" está disponível

### Requirement: Abandonar treino
A sessão em andamento MUST oferecer "Abandonar treino" e MUST pedir confirmação. Confirmar MUST retirar a sessão da consulta e MUST NOT contar o dia como feito. Cancelar MUST manter a sessão e as séries.

#### Scenario: Confirmar o abandono
- **WHEN** a sessão de Treino A tem 10 repetições e 60 kg em Supino reto com barra e o usuário confirma abandonar
- **THEN** não há sessão em andamento
- **AND** Treino A não conta como feito nesta semana
- **AND** a série não permanece para consulta

#### Scenario: Cancelar o abandono
- **WHEN** o usuário cancela o abandono
- **THEN** a sessão continua em andamento
- **AND** a série de 10 repetições e 60 kg permanece

### Requirement: A sessão sobrevive à navegação
Séries gravadas, o estado de cada exercício e a sessão em andamento MUST permanecer ao ir para Treinos ou Dashboard e ao reabrir o app. Voltar ao exercício MUST mostrar as mesmas séries. Só concluir ou abandonar MUST encerrar a sessão em andamento.

#### Scenario: Dashboard no meio do exercício
- **WHEN** a primeira série de Supino reto com barra está gravada com 10 repetições e 60 kg, a segunda ainda não, e o usuário abre Dashboard e depois volta ao exercício
- **THEN** a primeira série mostra 10 e 60 kg
- **AND** a segunda continua por gravar

#### Scenario: Reabrir o app
- **WHEN** a sessão de Treino A está em andamento com essa série e o usuário abre o app de novo
- **THEN** Início mostra "Continuar treino" de Treino A
- **AND** a série continua 10 repetições e 60 kg

#### Scenario: Troca de seção não pede descarte
- **WHEN** há sessão em andamento e o usuário vai a Treinos
- **THEN** o app não pede para descartar a sessão
- **AND** a sessão continua em andamento
