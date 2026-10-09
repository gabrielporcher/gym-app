# Proposal

## Why

O catálogo de exercícios já pode ser consultado, mas o usuário ainda não tem como montar o próprio plano. Sem um plano, a seção Treinos continua vazia e as changes de sessão e dashboard não têm o que executar nem o que medir.

## What Changes

- O usuário cria o próprio plano de treino na seção Treinos, escolhendo um modelo de divisão e, em seguida, alocando exercícios a cada dia de treino.
- Nove modelos, classificados pela quantidade de papéis na semana (ver abaixo). Cada um nasce com dias, nomes, ênfase muscular e uma semana sugerida. O usuário acrescenta ou remove dias e move um dia para um dia da semana que estava em descanso. A ênfase ordena o seletor; o card não pede para acrescentar grupo.
- A repetição (ABC 2x, Push Pull Legs 2x, os dois superiores do upper/lower) cria dias independentes: o segundo começa com a mesma ênfase e pode receber outros exercícios.
- No card, a tag aparece depois que o exercício é alocado, com o nome do grupo agonista (nota 4 ou 5) e uma cor estável. O seletor continua o catálogo inteiro: o que combina com a ênfase vem primeiro; o resto continua escolhível. A escolha é múltipla e só grava ao confirmar.
- Cada exercício planejado tem ordem e uma meta opcional de séries, faixa de repetições e peso em kg.
- Só um plano fica ativo. Criar ou reativar outro arquiva o ativo, depois de confirmação. Plano arquivado pode ser reativado ou excluído. Excluir é soft delete.
- **BREAKING** A seção Treinos deixa de ser só "Nada por aqui ainda." quando não há plano, e passa a mostrar o plano quando existe. Início e Dashboard continuam sem plano, sessão ou métrica.
- **BREAKING** O armazenamento local passa a poder gravar plano de treino. Sessão e métrica continuam ausentes.

### Classificação dos modelos

O modelo é a divisão da semana, não um programa com séries prontas. Programas nomeados (PHUL, PHAT, Arnold, PPLUL, StrongLifts) cabem num modelo abaixo, renomeando dias e ajustando a ênfase. Não viram cards próprios.

| Família | Cards nesta change | Semana inicial | Por que este corte |
|---|---|---|---|
| 1 papel, repetido | Corpo inteiro | 3 dias (segunda, quarta, sexta) | O mais comum para 2–4 dias. 2, 4 ou mais saem acrescentando ou removendo dias, até 7. |
| 2 papéis | Superiores e inferiores | 4 dias: superiores, inferiores, descanso, superiores, inferiores | Formato clássico de 4 dias. Os dois dias de cada papel já nascem separados. |
| 3 papéis | Push Pull Legs e Push Pull Legs 2x; ABC e ABC 2x | 3 dias alternados, ou 6 dias com o ciclo repetido | PPL é o nome internacional; ABC é o nome de academia no Brasil. Os dois entram, cada um em 1x e 2x, porque a pessoa escolhe pelo nome que já usa. |
| 4 papéis | ABCD | 4 dias (segunda, terça, quinta, sexta) | Divisão de 4 dias que não é upper/lower. |
| 5 papéis | ABCDE | segunda a sexta | Cobre o bro split: a ênfase inicial é um bloco principal por dia. |
| Livre | Personalizado | um dia na segunda, sem grupos | O usuário define dias e tags. |

Ficam de fora como cards, e como se expressam:

- Bro split: é o ABCDE com a ênfase inicial (peito, costas, pernas, ombros, braços).
- Arnold: ABC 2x com tags peito+costas, ombros+braços, pernas. A ênfase é editável; não há card.
- PHUL: superiores e inferiores, renomeando os quatro dias (força e hipertrofia).
- PHAT e PPLUL: cinco dias distintos. Começam de Personalizado ou de um modelo próximo, com dias acrescentados.
- Push/Pull sem pernas, torso/membros e anterior/posterior: Personalizado.

Premissas desta lista: no máximo um treino por dia da semana (dois treinos no mesmo dia ficam para depois); Corpo inteiro não ganha cards separados para 2x e 4x.

## Capabilities

### New Capabilities

- `workout-plans`: escolha do modelo de divisão, plano ativo, dias na semana, ênfase muscular, alocação de exercícios e meta opcional de séries e repetições.

### Modified Capabilities

- `app-shell`: Treinos passa a ser o lugar do plano. Início e Dashboard permanecem sem conteúdo de treino. A troca de seção não descarta o plano já gravado.
- `local-storage`: com o armazenamento pronto, pode existir plano de treino. Sessão e métrica continuam sem como serem gravadas. A falha de preparação continua sem gravar plano.

## Impact

- Tabelas novas de dado do usuário (plano, dia, ênfase, exercício planejado), com UUID, `owner_id` e soft delete, para o sync e um futuro coach não exigirem outra tabela.
- Domínio puro para montar a semana a partir do modelo, ordenar o seletor e validar a meta. Testes unitários desses cenários.
- Rotas só dentro de Treinos. O catálogo entra no seletor do dia, não como seção.
- Tokens de cor por grupo muscular, sempre junto com o nome do grupo.
- `docs/architecture.md` recebe a classificação dos modelos e a semana com no máximo um treino por dia.

## Fora de escopo

- Registrar sessão, sugerir o próximo treino e decidir se essa sugestão segue a ordem dos dias ou o calendário. Os dias guardam o dia da semana; a regra da sugestão continua em `session-logging`.
- Dashboard, séries por músculo e qualquer métrica.
- Coach ou admin atribuindo plano a outra pessoa. O plano já nasce com dono, e só.
- Exercício criado pelo usuário, supersérie, RPE, RIR e descanso entre séries.
- Dois treinos no mesmo dia da semana.
- Mapa corporal ilustrado. A ajuda visual desta change é a faixa da semana mais a tag com nome e cor.
- Cards próprios para Arnold, PHUL, PHAT, PPLUL, bro split, push/pull sem pernas, torso/membros e anterior/posterior.

## Depois

- `session-logging` lê o dia de treino, a ordem e a meta, e define a sugestão do próximo treino.
- Um coach atribui um plano a um usuário, reusando as mesmas tabelas.
- Presets de ênfase para Arnold e PHUL, se a edição manual se mostrar insuficiente.
- Mapa corporal, se as tags não bastarem para achar o exercício.
- Dois treinos no mesmo dia, supersérie, RPE ou descanso.
