# Design

## Context

O app está no template do Expo SDK 57 (`expo` ~57): abas Home/Explore, componentes de demo, `global.css` e alvo web. Não há `babel.config.js` nem `metro.config.js`. Ver `proposal.md` para a motivação. O comportamento observável está em `specs/app-shell/spec.md` e `specs/local-storage/spec.md`.

`expo-sqlite` entra no Expo Go. O material translúcido de `expo-glass-effect` (`GlassView`) só existe no iOS 26+ e, fora isso, o componente cai para uma `View` comum. A doc do SDK 57 manda checar `isGlassEffectAPIAvailable()` antes de usar `GlassView`. A API de abas nativas documentada é `expo-router/unstable-native-tabs`.

## Goals / Non-Goals

**Goals:**

- Casca navegável e aparência do sistema, com material nativo quando o aparelho oferece e superfície opaca quando não oferece.
- Contrato de tokens e primitivos que as próximas changes reutilizam.
- Cliente local que aplica o journal de migrations antes das seções, sem tabela de domínio.
- Runner de teste executando um arquivo `*.test.ts` em `src/domain`.

**Non-Goals:**

- Queries ao vivo, Drizzle Studio, SQLCipher e plugin avançado do `expo-sqlite`.
- Testes de componente e a tabela completa de Dynamic Type.
- Barra de abas desenhada em JavaScript para imitar o iOS no Android.

## Decisions

### 1. Abas nativas e um stack por seção

A raiz, depois do armazenamento pronto, renderiza `NativeTabs` importado de `expo-router/unstable-native-tabs`. Cada seção é um grupo com um `Stack` do `expo-router` e uma única tela:

| Grupo | Rótulo | SF Symbol (default / selected) | Material icon |
|---|---|---|---|
| `(home)` | Início | `house` / `house.fill` | `home` |
| `(workouts)` | Treinos | `dumbbell` / `dumbbell.fill` | `fitness_center` |
| `(dashboard)` | Dashboard | `chart.bar` / `chart.bar.fill` | `bar_chart` |

O `Icon` recebe `sf` e `md` juntos. No Android, `labelVisibilityMode="labeled"` mantém os três nomes visíveis. Não criar o grupo `(exercises)`: o catálogo de exercícios não é seção raiz.

Nas changes seguintes, a lista completa de exercícios entra na criação do plano, para escolher os exercícios daquele dia de treino, e mais adiante na troca de um exercício durante a sessão. No registro da sessão, a lista mostrada é só a dos exercícios alocados naquele treino.

Não definir `backgroundColor` opaco na tab bar nem no header. O sistema aplica o material (translúcido no iOS atual; barra opaca da plataforma quando esse material não existe). `tintColor` usa o token `tint`. O título da spec é o título do stack (`headerLargeTitle: true` no iOS); o corpo da tela só tem a frase "Nada por aqui ainda."

Alternativa considerada: abas em JavaScript iguais nas duas plataformas. Rejeitada porque a escolha desta change é a tab bar nativa, aceitando que o Android não fique idêntico.

### 2. Tokens

Substituir `src/constants/theme.ts` (hoje importa `global.css` e usa nomes `one`/`two`/…). Sem fonte embarcada: a fonte é a do sistema. SF Pro não vai para o Android.

Espaçamento, em pontos: `xs` 4, `sm` 8, `md` 16, `lg` 24.

Raios: `sm` 8, `md` 12, `lg` 16, `full` 9999 (cápsula dos botões).

Alvo de toque: `min` 44.

Pesos: `regular` 400, `medium` 500, `semibold` 600, `bold` 700.

Tipografia no tamanho Large padrão do iOS (tamanho / line height / peso):

| Token | Tamanho | Line height | Peso |
|---|---|---|---|
| `largeTitle` | 34 | 41 | regular |
| `title1` | 28 | 34 | regular |
| `title2` | 22 | 28 | regular |
| `title3` | 20 | 25 | regular |
| `headline` | 17 | 22 | semibold |
| `body` | 17 | 22 | regular |
| `callout` | 16 | 21 | regular |
| `subheadline` | 15 | 20 | regular |
| `footnote` | 13 | 18 | regular |
| `caption1` | 12 | 16 | regular |
| `caption2` | 11 | 13 | regular |

`allowFontScaling` permanece no padrão do React Native. Não mapear os outros tamanhos de Dynamic Type.

Cores semânticas, claro / escuro:

| Token | Claro | Escuro |
|---|---|---|
| `background` | `#FFFFFF` | `#000000` |
| `groupedBackground` | `#F2F2F7` | `#000000` |
| `secondaryGroupedBackground` | `#FFFFFF` | `#1C1C1E` |
| `label` | `#000000` | `#FFFFFF` |
| `secondaryLabel` | `rgba(60,60,67,0.6)` | `rgba(235,235,245,0.6)` |
| `tertiaryLabel` | `rgba(60,60,67,0.3)` | `rgba(235,235,245,0.3)` |
| `separator` | `rgba(60,60,67,0.29)` | `rgba(84,84,88,0.65)` |
| `tint` | `#007AFF` | `#0A84FF` |
| `destructive` | `#FF3B30` | `#FF453A` |
| `onTint` | `#FFFFFF` | `#FFFFFF` |

`resolveScheme` em `theme.ts`: `dark` só quando o esquema é `dark`; `null` e `unspecified` caem em `light`.

### 3. Primitivos

Arquivos em `src/components/ui/`: `text.tsx`, `button.tsx`, `card.tsx`, `screen.tsx`, `list-item.tsx`. Exports nomeados `Text`, `Button`, `Card`, `Screen`, `ListItem`.

Desvio da regra `components/ui --> constants only`: um primitivo React Native precisa importar `react-native`. Só o `Card` importa `expo-glass-effect`. Nenhum primitivo importa `hooks/`, `repositories/`, `domain/` ou `db/`. O esquema de cor vem de `useColorScheme` do React Native mais `resolveScheme`, porque `ui` não pode importar a camada de hooks.

- `Text`: variantes da tabela acima; cor padrão `label`.
- `Button`: `filled` (fundo `tint`, rótulo `onTint`, raio `full`), `plain` (sem fundo, rótulo `tint`), `destructive` (sem fundo, rótulo `destructive`). Altura mínima 44. Não usar `GlassView` no botão: opacidade no toque impede o efeito, e no Android o fallback seria uma view sem fundo.
- `Card`: se `isGlassEffectAPIAvailable()`, `GlassView` com `glassEffectStyle="regular"`, raio `lg` e padding `md`, sem `opacity` no card nem num ancestral. Senão, `View` com `secondaryGroupedBackground`, o mesmo raio e o mesmo padding.
- `Screen`: fundo `groupedBackground`, padding horizontal `md`, `edges` configuráveis. Padrão `top`, `left`, `right`. As telas de seção passam só `left` e `right`, porque o header e a tab bar nativa já tratam o inset vertical.
- `ListItem`: `title`, `subtitle?`, `showChevron?` (padrão falso), `onPress?`. Chevron é o caractere "›" via `Text`. Fundo `secondaryGroupedBackground`, separador `separator`, altura mínima 44.

### 4. Abertura do banco sem tabela de domínio

Instalar com `npx expo install` (o repo tem `package-lock.json`): `expo-sqlite` e `drizzle-orm`; em dev, `drizzle-kit` e `babel-plugin-inline-import`. Não usar as tags `@rc` / `@next` da página do Drizzle.

- `src/db/client.ts`: `openDatabaseSync('gym-training.db')`, em seguida `PRAGMA journal_mode = WAL`, e o cliente Drizzle de `drizzle-orm/expo-sqlite`.
- `src/db/schema.ts`: schema sem tabelas. Nenhuma entidade de domínio, nenhuma relação.
- `src/db/migrations/migrations.js`: journal com `entries: []` e `migrations: {}`. Não gerar migration vazia com `drizzle-kit generate --custom`. Um SQL em branco quebra o `expo-sqlite` na abertura.
- `drizzle.config.ts`: `dialect: 'sqlite'`, `driver: 'expo'`, schema em `./src/db/schema.ts`, saída em `./src/db/migrations`.
- `babel.config.js`: preset `babel-preset-expo` e `inline-import` para `.sql`. `metro.config.js`: acrescentar `sql` em `sourceExts`. Isso deixa a primeira migration real empacotável.

Camadas: `src/repositories/local-database.ts` expõe `prepareLocalDatabase()` e chama a função assíncrona `migrate` de `drizzle-orm/expo-sqlite/migrator`. `src/hooks/use-local-database.ts` chama o repositório e expõe `pending`, `ready` ou `error`. `src/app/_layout.tsx` só usa o hook.

Enquanto `pending`, o splash permanece e as seções não aparecem. Em `error`, esconder o splash e mostrar "Não foi possível preparar o armazenamento deste aparelho." Em `ready`, esconder o splash e mostrar as abas.

Sync futuro: nenhuma linha de usuário nasce aqui. A tabela interna de controle do migrator, se passar a existir na primeira migration SQL, não é sincronizável. A change que criar a primeira tabela de domínio adiciona UUID, `owner_id`, `created_at`, `updated_at` e `deleted_at` em cima deste cliente, sem trocar o arquivo nem o fluxo de abertura.

Se a versão instalada de `drizzle-orm` não exportar `migrate`, parar e atualizar este design antes de furar a regra de camadas com `useMigrations` na tela.

### 5. Limpeza do template

Apagar a rota Explore, os componentes de demo (`animated-icon`, `app-tabs`, `hint-row`, `external-link`, `themed-text`, `themed-view`, `web-badge`, `ui/collapsible`), `global.css`, arquivos `.web.tsx` / `.web.ts` / `.css`, os hooks `use-theme` e `use-color-scheme`, o script `reset-project` e os PNGs de aba que ficarem sem referência.

Remover do `app.json` o bloco `web` e o script `web`. Desinstalar o que ficar sem import: `react-dom`, `react-native-web`, `@expo/ui`, `expo-image`, `expo-symbols`, `expo-device`, `expo-web-browser`. Manter `expo-glass-effect`.

### 6. Testes

`jest-expo` conforme o guia de unit testing do Expo, com script `"test": "jest"` (sem `--watchAll`, para o comando terminar). `types: ["jest"]` no `tsconfig.json`. `transformIgnorePatterns` no padrão npm da doc, porque o lockfile é npm.

`src/domain/example.ts` exporta `identity(value: number): number`, sem regra de produto. `src/domain/example.test.ts` afirma `identity(2) === 2` e `identity(0) === 0`. Se o preset não enxergar `*.test.ts`, ajustar `testMatch` para incluir esse sufixo, que é o padrão do `AGENTS.md`. Não instalar React Native Testing Library nesta change.

`src/lib/` fica só com `.gitkeep`. Não criar `components/workout-plan`, `session`, `exercise` nem `dashboard`.

## Risks / Trade-offs

- [API `unstable-native-tabs`] → Usar o caminho documentado no SDK 57, sem inventar um alias estável.
- [`GlassView` não renderiza com `opacity` 0, e some betas do iOS 26 crasham] → Checar `isGlassEffectAPIAvailable()` e não animar opacidade no card nem num ancestral.
- [Migration SQL vazia derruba o `expo-sqlite`] → Journal sem entries; nenhum arquivo `.sql` vazio.
- [Android não parece um iPhone] → Aceito: barra e header nativos da plataforma; tokens e frase iguais.
- [Título grande só no iOS] → No Android o título da seção continua no header nativo.
- [`*.test.ts` ignorado pelo preset] → `testMatch` explícito se o primeiro run não achar o arquivo.

## Migration Plan

Não há dados de usuário nem binário publicado. A troca é só no código. Rollback é reverter o commit. Não existe base antiga para migrar.

## Decisões duráveis

Promover para `docs/architecture.md`:

- Linguagem visual: tab bar e header nativos, sem fundo opaco forçado, para o material do sistema. `Card` usa o material translúcido só quando a API está disponível; senão, superfície opaca com os tokens semânticos. Fonte do sistema, sem embarcar SF Pro. No Android a barra é a nativa da plataforma.
- Escala de espaçamento `xs`/`sm`/`md`/`lg` (4/8/16/24) e tipografia com os nomes dos estilos do HIG, no tamanho Large padrão, com `allowFontScaling` do sistema.
- A abertura aplica as migrations locais antes das seções. O journal começa sem SQL e sem tabela de domínio. A primeira tabela de domínio vem numa change posterior, com UUID e as colunas de sync, no mesmo cliente.
- A barra tem três seções: Início, Treinos e Dashboard. O catálogo de exercícios não é seção raiz. A lista completa entra na criação do plano e, depois, na troca de um exercício durante a sessão. No registro da sessão, a lista é só a dos exercícios alocados naquele treino.
