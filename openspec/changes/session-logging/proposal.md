# Proposal

## Why

O plano ativo já diz quais exercícios fazer, mas o usuário ainda não registra o que aconteceu na academia. Sem sessão e série gravadas, Início não indica o treino da semana e o dashboard futuro não tem o que medir.

## What Changes

- Início oferece **Treinar** quando há plano ativo. A sugestão é o primeiro dia de treino do plano, na ordem de segunda a domingo, que ainda não tenha sessão concluída na semana local. A semana recomeça na segunda 00:00. Se o dia anterior da sequência não foi feito, a sugestão continua nele. O usuário sempre pode escolher outro dia do plano antes de começar.
- Começar copia os exercícios planejados daquele dia, na ordem do plano, para uma sessão em andamento. O registro pode seguir qualquer ordem. A sessão não muda se o plano for editado depois.
- A tela do treino diferencia exercício não iniciado, em andamento e concluído. Dá para remover um exercício da sessão (ou simplesmente não fazê-lo) e acrescentar um exercício do catálogo que não estava no dia. Há **Concluir treino**, com confirmação, e **Abandonar treino**, com confirmação. Abandonar não conta como treino feito.
- Ao abrir um exercício, o usuário registra cada série com repetições e carga em kg, podendo fazer mais ou menos séries do que a meta. **Concluir exercício** marca aquele exercício. A carga é o mesmo número em kg da meta do plano: halter é um halter, peso corporal é a carga adicional (zero permitido), e o app não soma o peso da barra.
- Cada série é gravada na hora. Trocar para Treinos ou Dashboard, voltar, ou reabrir o app mantém a sessão em andamento, as séries e a tela do exercício. Só existe uma sessão em andamento por vez; outro dia só começa depois de concluir ou abandonar a atual.
- **BREAKING** Início deixa de mostrar só "Nada por aqui ainda." quando há plano ativo ou sessão em andamento. Dashboard continua sem métrica.
- **BREAKING** O armazenamento local passa a gravar sessão, exercício executado e série. Métrica continua ausente.

## Capabilities

### New Capabilities

- `session-logging`: sugestão do próximo dia de treino, sessão em andamento, registro de séries e conclusão ou abandono do treino.

### Modified Capabilities

- `app-shell`: Início passa a ser a entrada do treino. A troca de seção não descarta a sessão em andamento. Dashboard permanece vazio.
- `local-storage`: com o armazenamento pronto, pode existir sessão. Métrica continua sem como ser gravada. Gravar um plano continua sem criar sessão.

## Impact

- Tabelas novas de dado do usuário (sessão, exercício executado, série), com UUID, `owner_id` e soft delete, para o sync futuro não exigir outro modelo.
- Domínio puro para a semana, a sugestão e a validação da série, com testes unitários.
- Rotas na pilha de Início, com a barra de seções ainda acessível. O catálogo entra só ao acrescentar exercício na sessão.
- `docs/architecture.md` fecha a sugestão por sequência semanal e a convenção de kg.

## Fora de escopo

- Recomendar um exercício substituto quando o usuário não conseguir fazer o planejado. Remover e acrescentar cobrem o desvio manual desta change.
- Resumo muscular ao finalizar, dashboard e qualquer métrica. As séries válidas ficam gravadas para `training-dashboard`.
- Tela de histórico das sessões já concluídas, e editar uma sessão depois de concluída.
- Marcar série como aquecimento, RPE, RIR, timer de descanso e unidade em lb.
- Exercício criado pelo usuário, supersérie e sync.

## Depois

- Troca guiada de exercício na sessão, com sugestão de substituto, reusando o exercício executado já separado do plano.
- `training-dashboard` calcula séries por músculo e a evolução de carga a partir das séries desta change, inclusive o resumo ao finalizar.
- Série de aquecimento, timer de descanso, RPE/RIR e histórico editável.
- `cloud-sync` envia sessão, exercício executado e série com o mesmo `owner_id`.
