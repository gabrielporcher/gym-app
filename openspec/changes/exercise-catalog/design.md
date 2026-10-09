# Design

## Context

O cliente local já abre e aplica o journal, e `src/db/schema.ts` não tem tabelas. O journal está vazio de propósito: um SQL em branco derruba o `expo-sqlite`. Ver `proposal.md` para a motivação. O comportamento está em `specs/exercise-catalog/spec.md` e no delta de `specs/local-storage/spec.md`.

O glossário já nomeia `Muscle`, `MuscleGroup` e `ExerciseMuscle`. As seções Início, Treinos e Dashboard continuam sem listar exercício. Não há tela nesta change.

As notas abaixo são curadoria para revisão, não medição. O apply implementa esta tabela como ela estiver depois da revisão. Se uma nota pinada na spec mudar, a spec muda no mesmo ajuste.

## Goals / Non-Goals

**Goals:**

- Tabelas de referência com identidade UUID estável, gravadas por migration, consultáveis sem aparelho nos testes de domínio.
- A mesma tabela de exercícios servir agora à consulta e, depois, a um exercício do usuário sem criar outra tabela.
- A coluna Filtros desta página ser exatamente a regra da consulta (nota 4 ou 5 no grupo).

**Non-Goals:**

- Seletor, rota, hook de tela e qualquer escrita pela interface.
- Fórmula de séries por músculo e cópia do recrutamento para a sessão.
- Regra de qual número de kg gravar na série para cada tipo de carga.

## Decisions

### 1. Taxonomia

Dois níveis, como no glossário. O filtro da consulta usa o grupo. O recrutamento é por músculo. Bíceps e tríceps são grupos próprios, porque o filtro de um dia de braço não pode ser "braços" inteiro. Lombar não é grupo: eretor da espinha fica em Costas.

| Ordem | Grupo | Músculos, nesta ordem |
|---|---|---|
| 1 | Peito | Peitoral superior, Peitoral médio-inferior |
| 2 | Costas | Latíssimo do dorso, Romboides, Trapézio superior, Trapézio médio, Trapézio inferior, Eretor da espinha |
| 3 | Ombros | Deltoide anterior, Deltoide lateral, Deltoide posterior |
| 4 | Bíceps | Bíceps braquial, Braquial |
| 5 | Tríceps | Tríceps cabeça longa, Tríceps cabeça lateral, Tríceps cabeça medial |
| 6 | Antebraço | Braquiorradial, Flexores do punho, Extensores do punho |
| 7 | Quadríceps | Reto femoral, Vastos do quadríceps |
| 8 | Posterior de coxa | Bíceps femoral, Semitendíneo e semimembranoso |
| 9 | Glúteos | Glúteo máximo, Glúteo médio |
| 10 | Adutores | Adutores |
| 11 | Panturrilhas | Gastrocnêmio, Sóleo |
| 12 | Abdômen | Reto abdominal, Oblíquos |

O que ficou de fora, de propósito:

- Peitoral médio e peitoral inferior são um músculo só. Supino reto e declinado marcam esse músculo em 5; o inclinado marca Peitoral superior em 5.
- Vasto lateral, medial e intermédio são "Vastos do quadríceps". A cadeira extensora é que sobe o reto femoral para 5.
- Semitendíneo e semimembranoso são um músculo. A cadeira flexora marca esse músculo em 5; a mesa flexora marca o bíceps femoral em 5.
- Cabeças longa e curta do bíceps não se separam. A pegada muda braquial e braquiorradial, não uma cabeça contra a outra com honestidade bastante para a escala.
- Redondo maior não tem linha. Puxada e remada já carregam o latíssimo.
- Sem pescoço, sem "corpo inteiro" e sem cardio.

Alternativa considerada: um nível só, com "peito" e "ombro" como músculos. Rejeitada porque o dashboard futuro precisa distinguir deltoide lateral de anterior, e a spec já pede os dois níveis.

### 2. Escala e filtro

| Nota | Papel | Na consulta por grupo |
|---|---|---|
| 5 | Agonista principal | Entra |
| 4 | Agonista secundário | Entra |
| 3 | Sinergista | Fica de fora |
| 2 | Sinergista | Fica de fora |
| 1 | Sinergista | Fica de fora |
| ausente | Não envolvido | Não é linha de recrutamento |

Músculo com nota 2 ou mais entra na tabela quando a participação é reconhecível no exercício. Nota 1 não foi usada: estabilização genérica (abdômen no agachamento, antebraço segurando a barra) não vira linha. Todo exercício tem ao menos um 5.

O filtro de grupo inclui o exercício se algum músculo daquele grupo está em 4 ou 5. Texto e equipamento, quando informados, restringem junto. Sem texto e sem filtros, a base inteira volta, em ordem `pt-BR` pelo nome.

Alternativa considerada: filtrar só pela nota 5. Rejeitada porque o supino fechado (tríceps 5, peitoral 4) sumiria do filtro Peito, e as paralelas (peitoral 5, tríceps 4) sumiriam do filtro Tríceps. O custo é a lista de cruzamentos mais abaixo. Se a revisão preferir só a nota 5, a spec e a coluna Filtros mudam juntas antes do apply.

A separação dos totais do período entre agonista e sinergista continua em `training-dashboard`. Esta change só fixa o significado da nota.

### 3. Como ler a tabela de exercícios

114 exercícios. A seção agrupa por família de movimento, para achar o supino perto do supino. Quem decide o filtro é a coluna Filtros, não a seção.

Códigos de músculo:

| Código | Músculo | Grupo |
|---|---|---|
| PS | Peitoral superior | Peito |
| PI | Peitoral médio-inferior | Peito |
| LD | Latíssimo do dorso | Costas |
| RB | Romboides | Costas |
| TS | Trapézio superior | Costas |
| TM | Trapézio médio | Costas |
| TI | Trapézio inferior | Costas |
| EE | Eretor da espinha | Costas |
| DA | Deltoide anterior | Ombros |
| DL | Deltoide lateral | Ombros |
| DP | Deltoide posterior | Ombros |
| BI | Bíceps braquial | Bíceps |
| BR | Braquial | Bíceps |
| TL | Tríceps cabeça longa | Tríceps |
| TLA | Tríceps cabeça lateral | Tríceps |
| TME | Tríceps cabeça medial | Tríceps |
| BQ | Braquiorradial | Antebraço |
| FP | Flexores do punho | Antebraço |
| EP | Extensores do punho | Antebraço |
| RF | Reto femoral | Quadríceps |
| VA | Vastos do quadríceps | Quadríceps |
| BF | Bíceps femoral | Posterior de coxa |
| ST | Semitendíneo e semimembranoso | Posterior de coxa |
| GM | Glúteo máximo | Glúteos |
| GD | Glúteo médio | Glúteos |
| AD | Adutores | Adutores |
| GA | Gastrocnêmio | Panturrilhas |
| SO | Sóleo | Panturrilhas |
| RA | Reto abdominal | Abdômen |
| OB | Oblíquos | Abdômen |

Equipamento é o filtro fino. Tipo de carga é o que `session-logging` vai usar depois, e aqui só fica guardado. Barra W, Smith e barra hexagonal usam carga `barra`.

Unilateral significa que a série de trabalho é de um lado. Os dois braços subindo juntos com halteres não é unilateral. Rosca alternada, serrote, búlgaro e coice são.

Composto é multiarticular. Isolado é uma articulação, inclusive isometria de prancha e extensão de quadril da elevação pélvica.

Nomes alternativos vazios aparecem como —. O encolhimento com barra é o caso pinado na spec.

### 4. Cruzamentos para revisar primeiro

Estes exercícios entram em mais de um filtro. O resto entra em um grupo só.

| # | Exercício | Filtros | Por quê |
|---|---|---|---|
| 3 | Supino inclinado com barra | Peito, Ombros | DA 4 |
| 4 | Supino inclinado com halteres | Peito, Ombros | DA 4 |
| 7 | Supino fechado com barra | Tríceps, Peito | TLA 5, PI 4 |
| 9 | Supino inclinado na máquina | Peito, Ombros | DA 4 |
| 16 | Flexão de braços declinada | Peito, Ombros | DA 4 |
| 17 | Paralelas | Peito, Tríceps | PI 5, TLA 4, TME 4 |
| 18 | Pullover com halter | Costas, Peito | LD 5, PI 4 |
| 20 | Puxada com pegada supinada | Costas, Bíceps | BI 4 |
| 24 | Barra fixa supinada | Costas, Bíceps | BI 4 |
| 27 | Remada curvada supinada | Costas, Bíceps | BI 4 |
| 36 | Levantamento terra | Costas, Glúteos, Posterior de coxa | EE 5, GM 4, BF 4, ST 4. Vastos ficam em 3, então não entra em Quadríceps |
| 37 | Levantamento terra sumô | Glúteos, Adutores, Costas, Quadríceps, Posterior de coxa | GM 5, AD 4, EE 4, VA 4, BF 4 |
| 38 | Levantamento terra com barra hexagonal | Quadríceps, Glúteos, Costas | VA 5, GM 4, EE 4. Posterior fica em 3 |
| 39 | Desenvolvimento com barra | Ombros, Tríceps | TLA 4 |
| 41 | Desenvolvimento na máquina | Ombros, Tríceps | TLA 4 |
| 51 | Puxada para o rosto | Ombros, Costas | DP 5, RB 4, TM 4 |
| 52 | Remada alta com barra | Ombros, Costas | DL 5, TS 4 |
| 53 | Remada alta no cabo | Ombros, Costas | DL 5, TS 4 |
| 58 | Rosca martelo | Bíceps, Antebraço | BR 5, BQ 4 |
| 59 | Rosca martelo no cabo | Bíceps, Antebraço | BR 5, BQ 4 |
| 65 | Rosca inversa com barra | Bíceps, Antebraço | BR 5, BQ 4 |
| 78 | Agachamento livre | Quadríceps, Glúteos | VA 5, GM 4. Posterior fica em 2 |
| 81 | Agachamento no Smith | Quadríceps, Glúteos | GM 4 |
| 82 | Leg press 45° | Quadríceps, Glúteos | GM 4 |
| 83 | Agachamento búlgaro | Quadríceps, Glúteos | GM 4 |
| 84 | Afundo com halteres | Quadríceps, Glúteos | GM 4 |
| 87 | Agachamento sumô com halter | Glúteos, Adutores, Quadríceps | GM 5, AD 4, VA 4 |
| 88 | Levantamento terra romeno | Posterior de coxa, Glúteos | GM 4 |
| 94 | Bom dia | Costas, Posterior de coxa, Glúteos | EE 5, BF 4, ST 4, GM 4 |

Limites fáceis de contestar, que a tabela trata assim:

- Supino reto entra só em Peito. O tríceps fica em 3.
- Barra fixa pronada e puxada frontal entram só em Costas. A versão supinada é que entra em Bíceps.
- Stiff entra só em Posterior de coxa (glúteo 3). O terra romeno entra também em Glúteos (glúteo 4).
- Cadeira extensora não entra em Glúteos.
- Desenvolvimento com halteres entra só em Ombros (tríceps 3). O com barra entra também em Tríceps.

### 5. Catálogo da base

Colunas: nome, nomes alternativos, equipamento, tipo de carga, tipo, unilateral, recrutamento, filtros.

#### Peito

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 1 | Supino reto com barra | Supino reto; Supino com barra | Barra | barra | Composto | Não | PI 5, PS 3, DA 3, TLA 3, TME 3, TL 2 | Peito |
| 2 | Supino reto com halteres | Supino com halteres | Halteres | halter | Composto | Não | PI 5, PS 3, DA 3, TLA 3, TME 3, TL 2 | Peito |
| 3 | Supino inclinado com barra | Supino inclinado | Barra | barra | Composto | Não | PS 5, PI 3, DA 4, TLA 3, TME 3, TL 2 | Peito, Ombros |
| 4 | Supino inclinado com halteres | Supino inclinado com halter | Halteres | halter | Composto | Não | PS 5, PI 3, DA 4, TLA 3, TME 2, TL 2 | Peito, Ombros |
| 5 | Supino declinado com barra | Supino declinado | Barra | barra | Composto | Não | PI 5, PS 2, DA 2, TLA 3, TME 3, TL 2 | Peito |
| 6 | Supino declinado com halteres | Supino declinado com halter | Halteres | halter | Composto | Não | PI 5, PS 2, DA 2, TLA 3, TME 3, TL 2 | Peito |
| 7 | Supino fechado com barra | Supino pegada fechada | Barra | barra | Composto | Não | TLA 5, TME 4, TL 4, PI 4, PS 2, DA 3 | Tríceps, Peito |
| 8 | Supino na máquina | Supino articulado | Máquina | máquina | Composto | Não | PI 5, PS 3, DA 3, TLA 3, TME 3, TL 2 | Peito |
| 9 | Supino inclinado na máquina | Supino inclinado articulado | Máquina | máquina | Composto | Não | PS 5, PI 3, DA 4, TLA 3, TME 3, TL 2 | Peito, Ombros |
| 10 | Crucifixo reto com halteres | Crucifixo | Halteres | halter | Isolado | Não | PI 5, PS 3, DA 2 | Peito |
| 11 | Crucifixo inclinado com halteres | Crucifixo inclinado | Halteres | halter | Isolado | Não | PS 5, PI 3, DA 3 | Peito |
| 12 | Voador | Peck deck; Crucifixo na máquina | Máquina | máquina | Isolado | Não | PI 5, PS 4, DA 2 | Peito |
| 13 | Crossover na polia | Crossover; Crucifixo no cabo | Cabo | cabo | Isolado | Não | PI 5, PS 3, DA 2 | Peito |
| 14 | Crossover de baixo para cima | Crossover inferior | Cabo | cabo | Isolado | Não | PS 5, PI 3, DA 3 | Peito |
| 15 | Flexão de braços | Flexão | Peso corporal | peso corporal | Composto | Não | PI 5, PS 3, DA 3, TLA 3, TME 3, TL 2 | Peito |
| 16 | Flexão de braços declinada | Flexão com pés elevados | Peso corporal | peso corporal | Composto | Não | PS 5, PI 3, DA 4, TLA 3, TME 3, TL 2 | Peito, Ombros |
| 17 | Paralelas | Mergulho nas paralelas; Dips | Peso corporal | peso corporal | Composto | Não | PI 5, PS 3, TLA 4, TME 4, TL 3, DA 3 | Peito, Tríceps |
| 18 | Pullover com halter | Pullover | Halteres | halter | Isolado | Não | LD 5, PI 4, TL 3 | Costas, Peito |

#### Costas

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 19 | Puxada frontal | Puxada aberta; Lat pulldown | Cabo | cabo | Composto | Não | LD 5, RB 3, TM 3, BI 3, BR 2 | Costas |
| 20 | Puxada com pegada supinada | Puxada supinada | Cabo | cabo | Composto | Não | LD 5, BI 4, BR 3, RB 3, TM 2 | Costas, Bíceps |
| 21 | Puxada com pegada neutra | Puxada neutra | Cabo | cabo | Composto | Não | LD 5, BI 3, BR 3, RB 3, TM 3 | Costas |
| 22 | Puxada unilateral | Puxada unilateral no cabo | Cabo | cabo | Composto | Sim | LD 5, RB 3, TM 3, BI 3, BR 2 | Costas |
| 23 | Barra fixa | Barra fixa pronada | Peso corporal | peso corporal | Composto | Não | LD 5, RB 3, TM 3, BI 3, BR 2 | Costas |
| 24 | Barra fixa supinada | Chin-up | Peso corporal | peso corporal | Composto | Não | LD 5, BI 4, BR 3, RB 2, TM 2 | Costas, Bíceps |
| 25 | Barra fixa com pegada neutra | Barra fixa neutra | Peso corporal | peso corporal | Composto | Não | LD 5, BI 3, BR 3, RB 3, TM 3 | Costas |
| 26 | Remada curvada com barra | Remada curvada | Barra | barra | Composto | Não | LD 5, RB 4, TM 4, TI 3, BI 3, BR 2, EE 3 | Costas |
| 27 | Remada curvada supinada | Remada supinada; Remada Yates | Barra | barra | Composto | Não | LD 5, BI 4, BR 3, RB 4, TM 3, EE 3 | Costas, Bíceps |
| 28 | Remada cavalinho | Remada T | Máquina | máquina | Composto | Não | LD 5, RB 4, TM 4, TI 3, BI 3, EE 3 | Costas |
| 29 | Remada sentada no cabo | Remada baixa; Remada no pulley | Cabo | cabo | Composto | Não | RB 5, TM 4, LD 4, TI 3, BI 3, BR 2 | Costas |
| 30 | Remada unilateral com halter | Remada serrote | Halteres | halter | Composto | Sim | LD 5, RB 4, TM 3, BI 3, EE 2 | Costas |
| 31 | Remada na máquina | Remada articulada | Máquina | máquina | Composto | Não | RB 5, TM 4, LD 4, TI 3, BI 3 | Costas |
| 32 | Remada unilateral no cabo | Remada serrote no cabo | Cabo | cabo | Composto | Sim | LD 5, RB 4, TM 3, BI 3 | Costas |
| 33 | Pulldown com braços estendidos | Pullover no cabo | Cabo | cabo | Isolado | Não | LD 5, TI 3, PI 2 | Costas |
| 34 | Encolhimento com barra | — | Barra | barra | Isolado | Não | TS 5 | Costas |
| 35 | Encolhimento com halteres | Encolhimento com halter | Halteres | halter | Isolado | Não | TS 5 | Costas |
| 36 | Levantamento terra | Terra convencional; Deadlift | Barra | barra | Composto | Não | EE 5, GM 4, BF 4, ST 4, VA 3, TS 3 | Costas, Glúteos, Posterior de coxa |
| 37 | Levantamento terra sumô | Terra sumô | Barra | barra | Composto | Não | GM 5, AD 4, EE 4, VA 4, BF 4, ST 3 | Glúteos, Adutores, Costas, Quadríceps, Posterior de coxa |
| 38 | Levantamento terra com barra hexagonal | Terra hexagonal | Barra hexagonal | barra | Composto | Não | VA 5, GM 4, EE 4, BF 3, ST 3, TS 3 | Quadríceps, Glúteos, Costas |

#### Ombros

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 39 | Desenvolvimento com barra | Desenvolvimento militar | Barra | barra | Composto | Não | DA 5, TLA 4, TME 3, DL 3, TL 3, TS 2 | Ombros, Tríceps |
| 40 | Desenvolvimento com halteres | Desenvolvimento | Halteres | halter | Composto | Não | DA 5, DL 4, TLA 3, TME 3, TL 3 | Ombros |
| 41 | Desenvolvimento na máquina | Desenvolvimento articulado | Máquina | máquina | Composto | Não | DA 5, TLA 4, TME 3, DL 3, TL 3 | Ombros, Tríceps |
| 42 | Desenvolvimento Arnold | Arnold press | Halteres | halter | Composto | Não | DA 5, DL 4, TLA 3, TME 3, TL 2 | Ombros |
| 43 | Elevação lateral com halteres | Elevação lateral | Halteres | halter | Isolado | Não | DL 5, DA 2, TS 2 | Ombros |
| 44 | Elevação lateral no cabo | Elevação lateral no cabo | Cabo | cabo | Isolado | Sim | DL 5, DA 2 | Ombros |
| 45 | Elevação lateral na máquina | Elevação lateral na máquina | Máquina | máquina | Isolado | Não | DL 5, DA 2 | Ombros |
| 46 | Elevação frontal com halteres | Elevação frontal | Halteres | halter | Isolado | Não | DA 5, PS 2 | Ombros |
| 47 | Elevação frontal com barra | Elevação frontal com barra | Barra | barra | Isolado | Não | DA 5, PS 2 | Ombros |
| 48 | Crucifixo inverso com halteres | Elevação posterior; Reverse fly | Halteres | halter | Isolado | Não | DP 5, RB 3, TM 3, TI 2 | Ombros |
| 49 | Crucifixo inverso na máquina | Peck deck inverso | Máquina | máquina | Isolado | Não | DP 5, RB 3, TM 3 | Ombros |
| 50 | Crucifixo inverso no cabo | Elevação posterior no cabo | Cabo | cabo | Isolado | Não | DP 5, RB 3, TM 3 | Ombros |
| 51 | Puxada para o rosto | Face pull | Cabo | cabo | Composto | Não | DP 5, RB 4, TM 4, TI 3 | Ombros, Costas |
| 52 | Remada alta com barra | Remada alta | Barra | barra | Composto | Não | DL 5, TS 4, DA 3 | Ombros, Costas |
| 53 | Remada alta no cabo | Remada alta no cabo | Cabo | cabo | Composto | Não | DL 5, TS 4, DA 3 | Ombros, Costas |

#### Bíceps

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 54 | Rosca direta com barra | Rosca direta | Barra | barra | Isolado | Não | BI 5, BR 3 | Bíceps |
| 55 | Rosca direta com barra W | Rosca W; Rosca EZ | Barra W | barra | Isolado | Não | BI 5, BR 3 | Bíceps |
| 56 | Rosca direta com halteres | Rosca com halteres | Halteres | halter | Isolado | Não | BI 5, BR 3 | Bíceps |
| 57 | Rosca alternada com halteres | Rosca alternada | Halteres | halter | Isolado | Sim | BI 5, BR 3 | Bíceps |
| 58 | Rosca martelo | Martelo; Rosca hammer | Halteres | halter | Isolado | Não | BR 5, BQ 4, BI 3 | Bíceps, Antebraço |
| 59 | Rosca martelo no cabo | Martelo no cabo | Cabo | cabo | Isolado | Não | BR 5, BQ 4, BI 3 | Bíceps, Antebraço |
| 60 | Rosca concentrada | Rosca concentração | Halteres | halter | Isolado | Sim | BI 5, BR 2 | Bíceps |
| 61 | Rosca scott com barra W | Rosca scott | Barra W | barra | Isolado | Não | BI 5, BR 4 | Bíceps |
| 62 | Rosca scott na máquina | Scott máquina | Máquina | máquina | Isolado | Não | BI 5, BR 3 | Bíceps |
| 63 | Rosca na polia baixa | Rosca no cabo | Cabo | cabo | Isolado | Não | BI 5, BR 3 | Bíceps |
| 64 | Rosca inclinada com halteres | Rosca inclinada | Halteres | halter | Isolado | Não | BI 5, BR 3 | Bíceps |
| 65 | Rosca inversa com barra | Rosca inversa | Barra | barra | Isolado | Não | BR 5, BQ 4, BI 2, EP 2 | Bíceps, Antebraço |

#### Tríceps

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 66 | Tríceps testa com barra W | Tríceps testa; Skull crusher | Barra W | barra | Isolado | Não | TL 5, TLA 4, TME 3 | Tríceps |
| 67 | Tríceps testa com halteres | Testa com halter | Halteres | halter | Isolado | Não | TL 5, TLA 3, TME 3 | Tríceps |
| 68 | Tríceps na polia com barra | Tríceps pulley; Pushdown | Cabo | cabo | Isolado | Não | TLA 5, TME 4, TL 3 | Tríceps |
| 69 | Tríceps na polia com corda | Tríceps corda | Cabo | cabo | Isolado | Não | TLA 5, TME 4, TL 4 | Tríceps |
| 70 | Tríceps francês com halter | Tríceps francês | Halteres | halter | Isolado | Não | TL 5, TLA 3, TME 3 | Tríceps |
| 71 | Tríceps francês no cabo | Francês no cabo | Cabo | cabo | Isolado | Não | TL 5, TLA 3, TME 3 | Tríceps |
| 72 | Tríceps coice com halter | Coice | Halteres | halter | Isolado | Sim | TLA 5, TME 4, TL 3 | Tríceps |
| 73 | Tríceps coice no cabo | Coice no cabo | Cabo | cabo | Isolado | Sim | TLA 5, TME 4, TL 3 | Tríceps |
| 74 | Mergulho no banco | Tríceps banco | Peso corporal | peso corporal | Composto | Não | TLA 5, TME 4, TL 3, DA 2, PI 2 | Tríceps |
| 75 | Tríceps na máquina | Tríceps articulado | Máquina | máquina | Isolado | Não | TLA 5, TME 4, TL 3 | Tríceps |

#### Antebraço

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 76 | Rosca de punho com barra | Flexão de punho | Barra | barra | Isolado | Não | FP 5 | Antebraço |
| 77 | Rosca de punho inversa com barra | Extensão de punho | Barra | barra | Isolado | Não | EP 5 | Antebraço |

#### Quadríceps

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 78 | Agachamento livre | Agachamento com barra; Back squat | Barra | barra | Composto | Não | VA 5, GM 4, RF 3, EE 3, BF 2, ST 2 | Quadríceps, Glúteos |
| 79 | Agachamento frontal | Agachamento frontal com barra | Barra | barra | Composto | Não | VA 5, RF 4, GM 3, EE 3 | Quadríceps |
| 80 | Agachamento no hack | Hack; Hack squat | Máquina | máquina | Composto | Não | VA 5, RF 4, GM 3 | Quadríceps |
| 81 | Agachamento no Smith | Smith squat | Smith | barra | Composto | Não | VA 5, GM 4, RF 3, EE 2 | Quadríceps, Glúteos |
| 82 | Leg press 45° | Leg press | Máquina | máquina | Composto | Não | VA 5, GM 4, RF 3, BF 2, ST 2 | Quadríceps, Glúteos |
| 83 | Agachamento búlgaro | Búlgaro; Afundo búlgaro | Halteres | halter | Composto | Sim | VA 5, GM 4, RF 3, BF 2 | Quadríceps, Glúteos |
| 84 | Afundo com halteres | Avanço; Passada | Halteres | halter | Composto | Sim | VA 5, GM 4, RF 3, BF 2 | Quadríceps, Glúteos |
| 85 | Agachamento taça | Goblet squat | Halteres | halter | Composto | Não | VA 5, RF 4, GM 3 | Quadríceps |
| 86 | Cadeira extensora | Extensora | Máquina | máquina | Isolado | Não | RF 5, VA 4 | Quadríceps |
| 87 | Agachamento sumô com halter | Sumô com halter | Halteres | halter | Composto | Não | GM 5, AD 4, VA 4, BF 3 | Glúteos, Adutores, Quadríceps |

#### Posterior de coxa

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 88 | Levantamento terra romeno | RDL; Terra romeno | Barra | barra | Composto | Não | BF 5, ST 4, GM 4, EE 3 | Posterior de coxa, Glúteos |
| 89 | Stiff com barra | Stiff | Barra | barra | Composto | Não | BF 5, ST 5, GM 3, EE 3 | Posterior de coxa |
| 90 | Stiff com halteres | Stiff com halter | Halteres | halter | Composto | Não | BF 5, ST 5, GM 3, EE 3 | Posterior de coxa |
| 91 | Mesa flexora | Flexora deitada | Máquina | máquina | Isolado | Não | BF 5, ST 4, GA 2 | Posterior de coxa |
| 92 | Cadeira flexora | Flexora sentada | Máquina | máquina | Isolado | Não | ST 5, BF 4 | Posterior de coxa |
| 93 | Flexora em pé | Flexora unilateral | Máquina | máquina | Isolado | Sim | BF 5, ST 4 | Posterior de coxa |
| 94 | Bom dia | Good morning | Barra | barra | Composto | Não | EE 5, BF 4, ST 4, GM 4 | Costas, Posterior de coxa, Glúteos |

#### Glúteos

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 95 | Elevação pélvica com barra | Hip thrust | Barra | barra | Isolado | Não | GM 5, BF 3, ST 3 | Glúteos |
| 96 | Elevação pélvica na máquina | Hip thrust na máquina | Máquina | máquina | Isolado | Não | GM 5, BF 3, ST 2 | Glúteos |
| 97 | Coice no cabo | Glúteo no cabo; Kickback | Cabo | cabo | Isolado | Sim | GM 5 | Glúteos |
| 98 | Abdução de quadril na máquina | Cadeira abdutora | Máquina | máquina | Isolado | Não | GD 5, GM 2 | Glúteos |
| 99 | Abdução de quadril no cabo | Abdução no cabo | Cabo | cabo | Isolado | Sim | GD 5, GM 2 | Glúteos |
| 100 | Ponte de glúteo | Ponte | Peso corporal | peso corporal | Isolado | Não | GM 5 | Glúteos |

#### Adutores

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 101 | Adução de quadril na máquina | Cadeira adutora | Máquina | máquina | Isolado | Não | AD 5 | Adutores |

#### Panturrilhas

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 102 | Panturrilha em pé na máquina | Panturrilha em pé | Máquina | máquina | Isolado | Não | GA 5, SO 3 | Panturrilhas |
| 103 | Panturrilha sentada | Panturrilha sentado | Máquina | máquina | Isolado | Não | SO 5, GA 2 | Panturrilhas |
| 104 | Panturrilha no leg press | Panturrilha no press | Máquina | máquina | Isolado | Não | GA 5, SO 3 | Panturrilhas |
| 105 | Panturrilha em pé com barra | Panturrilha livre | Barra | barra | Isolado | Não | GA 5, SO 3 | Panturrilhas |
| 106 | Panturrilha unilateral no degrau | Panturrilha unilateral | Peso corporal | peso corporal | Isolado | Sim | GA 5, SO 3 | Panturrilhas |

#### Abdômen

| # | Exercício | Nomes alternativos | Equipamento | Carga | Tipo | Unilat. | Recrutamento | Filtros |
|---|---|---|---|---|---|---|---|---|
| 107 | Abdominal supra | Crunch; Abdominal curto | Peso corporal | peso corporal | Isolado | Não | RA 5 | Abdômen |
| 108 | Abdominal na máquina | Crunch na máquina | Máquina | máquina | Isolado | Não | RA 5 | Abdômen |
| 109 | Abdominal no cabo | Crunch no cabo | Cabo | cabo | Isolado | Não | RA 5 | Abdômen |
| 110 | Abdominal infra | Elevação de pernas deitado | Peso corporal | peso corporal | Isolado | Não | RA 5 | Abdômen |
| 111 | Elevação de pernas suspenso | Elevação de joelhos na barra | Peso corporal | peso corporal | Isolado | Não | RA 5, OB 2 | Abdômen |
| 112 | Prancha | Prancha isométrica | Peso corporal | peso corporal | Isolado | Não | RA 5, OB 3 | Abdômen |
| 113 | Rotação no cabo | Oblíquo no cabo; Woodchop | Cabo | cabo | Isolado | Não | OB 5, RA 3 | Abdômen |
| 114 | Abdominal oblíquo | Oblíquo bicicleta | Peso corporal | peso corporal | Isolado | Não | OB 5, RA 3 | Abdômen |

Remada cavalinho está como máquina porque, na academia, o cavalinho usual é o apoio de peito com anilhas, não a barra T livre. Se a revisão quiser a barra T livre, o equipamento passa a Barra e a carga continua `barra`.

### 6. Entidades

Cinco tabelas. Chave primária UUID em todas. `created_at`, `updated_at` e `deleted_at` em todas, em texto ISO-8601 UTC. O seed usa um único instante e `deleted_at` nulo. Correção futura faz `UPDATE` numa migration nova e avança `updated_at`. Retirar um exercício é `deleted_at` preenchido, nunca `DELETE`, e o UUID não volta a ser usado.

`muscle_groups`: `id`, `name`, `sort_order`, timestamps. Sem `owner_id`. A taxonomia é do app, igual em todo aparelho.

`muscles`: `id`, `muscle_group_id`, `name`, `sort_order`, timestamps. Sem `owner_id`. Cada músculo tem um grupo.

`exercises`: `id`, `name`, `equipment`, `load_type`, `kind` (`compound` ou `isolation`), `unilateral` (0 ou 1), `owner_id` nulo, timestamps. `owner_id` nulo significa exercício da base. A change de exercício do usuário preenche `owner_id` na mesma tabela. Esta change não grava linha com dono e não expõe escrita.

`exercise_aliases`: `id`, `exercise_id`, `alias`, timestamps. Sem `owner_id`: acompanha o exercício pai.

`exercise_muscles`: `id`, `exercise_id`, `muscle_id`, `recruitment`, timestamps. `recruitment` tem `CHECK` entre 1 e 5. Único em (`exercise_id`, `muscle_id`) enquanto `deleted_at` é nulo. Sem `owner_id`.

Índice único parcial do nome do exercício onde `owner_id` é nulo e `deleted_at` é nulo, para a base não ter dois nomes iguais e o usuário futuro poder repetir um nome da base. Chaves estrangeiras com `ON DELETE RESTRICT`.

Códigos internos, com rótulo pt-BR na borda da consulta:

| Código | Rótulo |
|---|---|
| `barbell` | Barra |
| `ez-bar` | Barra W |
| `dumbbell` | Halteres |
| `machine` | Máquina |
| `cable` | Cabo |
| `bodyweight` | Peso corporal |
| `smith` | Smith |
| `trap-bar` | Barra hexagonal |

| Código de carga | Rótulo |
|---|---|
| `barbell` | barra |
| `dumbbell` | halter |
| `machine` | máquina |
| `bodyweight` | peso corporal |
| `cable` | cabo |

`ez-bar`, `smith` e `trap-bar` mapeiam para carga `barbell`.

Sync futuro: linha com `owner_id` nulo não sobe. É dado de referência, já presente em todo aparelho pela migration. Linha com dono, quando existir, entra na fila como o resto dos dados do usuário. Os UUID da base são os mesmos em todo aparelho, então um plano futuro pode referenciar `exercises.id` sem colidir no sync. Músculo e grupo não sincronizam por usuário.

Desvio da frase "toda tabela sincronizável tem `owner_id`": estas tabelas não são dado sincronizável do usuário. `exercises.owner_id` existe e fica nulo para a base não precisar de outra tabela depois. Grupos, músculos, aliases e recrutamentos não têm `owner_id`.

### 7. Onde cada peça mora

- `src/db/catalog.ts`: a transcrição tipada da tabela desta página, com os UUID gerados uma vez. Não roda na abertura.
- `src/db/schema.ts`: as cinco tabelas.
- Migration de schema gerada pelo Drizzle, e uma migration seguinte só com `INSERT`. As duas entram no journal que `prepareLocalDatabase` já aplica. Não semear de novo em runtime: uma correção é `UPDATE` numa migration posterior, e um seed na abertura brigaria com ela.
- `src/domain/exercise-catalog.ts`: `normalizeSearchText`, `recruitmentRole`, `filterExercises`. Sem import de React, Expo ou banco.
- `src/repositories/exercise-catalog.ts`: lê as linhas não removidas e devolve o formato que o domínio filtra. Não importa função de domínio, só tipos. Não há `insert`, `update` nem `delete`.

`normalizeSearchText` tira espaço nas pontas, colapsa espaços internos, põe em minúsculas `pt-BR`, decompõe NFD e remove marcas combinantes. "triceps" encontra "Tríceps". Texto vazio não restringe. O exercício entra uma vez só, mesmo se o texto bater no nome e num alternativo.

O repositório carrega a base inteira (114 linhas) e o domínio filtra na memória. Coluna `search_text` foi rejeitada: o acento no SQLite sem extensão é pior do que filtrar cem linhas, e a coluna teria de ser reescrita em toda correção.

Não há hook nem componente. `workout-plans` é quem compõe repositório e domínio na tela.

A consulta por identidade ausente ou já removida devolve ausência. Grupo ou equipamento fora da lista devolve lista vazia, não erro. "Cardio", "Kettlebell" e "Deltoide lateral" como grupo caem nesse caso. O nome do grupo e o equipamento, na consulta, passam pela mesma normalização de acento e caixa.

`src/domain/example.ts` sai nesta change. A função de identidade era o corredor de teste da fundação; o teste do catálogo ocupa esse lugar.

### 8. UUID

Gerar UUID v4 na implementação e gravá-los em `catalog.ts` e no `INSERT`. Não regenerar ao recriar o arquivo. A tabela desta página não lista os UUID: eles não ajudam a revisão das notas. O teste de catálogo exige que todo id de `catalog.ts` apareça na migration de `INSERT` e que nenhum id se repita.

## Risks / Trade-offs

- [Notas são julgamento] → A tabela é o artefato de revisão. O apply não "corrige" nota por conta própria.
- [Filtro em 4 puxa agachamento para Glúteos e supino inclinado para Ombros] → A seção de cruzamentos deixa isso explícito antes do apply.
- [Pullover marcado em peito e dorsal ao mesmo tempo] → Dorsal 5 e peitoral 4, isolado. Se a revisão quiser um alvo só, baixa o outro para 3.
- [Migration grande] → O `INSERT` é gerado a partir de `catalog.ts` no momento da implementação, numa migration nova e não vazia. Não editar migration já aplicada. Não deixar SQL vazio no journal.
- [`\p{M}` no runtime do aparelho] → O teste de `normalizeSearchText` cobre `áéíóúãõâêôç`. Se o runtime não aceitar a classe Unicode, trocar por um intervalo de marcas combinantes sem mudar o comportamento.
- [Spec pinou notas de quatro exercícios] → Supino reto, supino inclinado, agachamento livre e tríceps testa com barra W. Mudou a nota na tabela, muda a spec no mesmo commit de planejamento, antes do apply.
- [Cavalinho classificado como máquina] → Registrado na seção do catálogo. Trocar para Barra não muda o tipo de carga.

## Migration Plan

Não há dado de usuário nem binário publicado. A abertura passa a aplicar as migrations novas antes das seções, no fluxo que já existe. Rollback é reverter o commit. Num banco local de desenvolvimento que tenha aplicado uma migration quebrada, apagar o arquivo do banco e abrir de novo. Não há base antiga para migrar.

Correção depois do apply: migration nova com `UPDATE` ou com `deleted_at`. O UUID permanece.

## Decisões duráveis

Promover para `docs/architecture.md`:

- Taxonomia de doze grupos e os músculos da tabela da decisão 1, inclusive o que foi fundido (peitoral médio-inferior, vastos, semitendíneo e semimembranoso) e a ausência de redondo maior como músculo próprio.
- Recrutamento 5 é agonista principal, 4 é agonista secundário, 1 a 3 é sinergista. Músculo ausente não é nota zero. O filtro por grupo usa 4 ou 5. A separação dos totais do período continua em `training-dashboard`.
- O catálogo da base é dado de referência, não dado do usuário: UUID fixo, `owner_id` nulo, sem sync. Correção entra em migration nova. Exercício do usuário, depois, usa a mesma tabela com `owner_id`.
- Equipamento (Barra, Barra W, Halteres, Máquina, Cabo, Peso corporal, Smith, Barra hexagonal) é o filtro. Tipo de carga (barra, halter, máquina, peso corporal, cabo) fica guardado para `session-logging`. Barra W, Smith e barra hexagonal são carga `barra`. A convenção de qual kg registrar continua em aberto em `session-logging`.
- Fechar, na lista de questões em aberto, a lista de músculos e o corte do agonista. Manter em aberto a cópia do recrutamento para a sessão e a separação dos totais do período.
