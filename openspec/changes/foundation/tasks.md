# Tasks

## 1. Runner e exemplo de domínio

- [ ] 1.1 Instalar `jest-expo`, `jest` e `@types/jest` com `npx expo install` (no Windows, `"--" --dev`) e configurar o preset `jest-expo`, o `transformIgnorePatterns` do guia de unit testing do Expo para npm, o script `"test": "jest"` e `"types": ["jest"]` no `tsconfig.json`. Verificar que `npx jest` termina sem ficar em watch (pode falhar só por ainda não haver teste).
- [ ] 1.2 Criar `src/domain/example.ts` com `identity` e `src/domain/example.test.ts` cobrindo `identity(2) === 2` e `identity(0) === 0`. Se o preset ignorar `*.test.ts`, ajustar `testMatch`. Verificar que `npx jest` passa esses dois casos.

## 2. Banco local

- [ ] 2.1 Instalar `expo-sqlite` e `drizzle-orm` com `npx expo install`, e `drizzle-kit` mais `babel-plugin-inline-import` em dev. Criar `babel.config.js` (preset `babel-preset-expo` e `inline-import` para `.sql`), `metro.config.js` (`sql` em `sourceExts`) e `drizzle.config.ts` (`dialect: 'sqlite'`, `driver: 'expo'`, schema `./src/db/schema.ts`, saída `./src/db/migrations`). Verificar que os três arquivos existem e que `npx tsc --noEmit` segue passando.
- [ ] 2.2 Criar `src/db/client.ts` (`openDatabaseSync('gym-training.db')`, `PRAGMA journal_mode = WAL`, cliente `drizzle-orm/expo-sqlite`), `src/db/schema.ts` sem tabelas e `src/db/migrations/migrations.js` com journal `entries: []` e `migrations: {}`. Não criar SQL vazio. Criar `src/lib/.gitkeep`. Verificar que não há arquivo `.sql` e que `npx tsc --noEmit` passa.
- [ ] 2.3 Criar `src/repositories/local-database.ts` com `prepareLocalDatabase()` chamando `migrate` de `drizzle-orm/expo-sqlite/migrator`, e `src/hooks/use-local-database.ts` com os estados `pending`, `ready` e `error`. Se `migrate` não existir na versão instalada, parar e atualizar `design.md` antes de chamar o banco pela tela. Verificar que a tela ainda não importa `src/db/` e que `npx tsc --noEmit` passa.

## 3. Tokens e primitivos

- [ ] 3.1 Reescrever `src/constants/theme.ts` com as escalas, as cores e `resolveScheme` do design, sem `global.css` e sem fonte embarcada. No mesmo passo, apagar ou deixar de importar os símbolos removidos para o tipo não quebrar. Verificar que `npx tsc --noEmit` passa.
- [ ] 3.2 Criar `Text`, `Button` (`filled`, `plain`, `destructive`) e `Screen` em `src/components/ui/`, só com imports de `react-native` e `@/constants/theme`. Verificar que `npx tsc --noEmit` passa.
- [ ] 3.3 Criar `Card` ( `GlassView` só com `isGlassEffectAPIAvailable()`, senão superfície opaca, sem `opacity`) e `ListItem` (título, subtítulo opcional, chevron opcional). Verificar que `npx tsc --noEmit` passa e que nenhum primitivo importa `hooks/`, `repositories/`, `domain/` ou `db/`.

## 4. Navegação e limpeza

- [ ] 4.1 Trocar `src/app/_layout.tsx`: splash até sair de `pending`; em `error`, a frase "Não foi possível preparar o armazenamento deste aparelho." e nenhuma seção; em `ready`, `NativeTabs` de `expo-router/unstable-native-tabs` com os grupos `(home)`, `(workouts)` e `(dashboard)`, ícones `sf`/`md` do design, `labelVisibilityMode="labeled"` e sem `backgroundColor` opaco. Não criar `(exercises)`. Verificar que `npx tsc --noEmit` passa.
- [ ] 4.2 Em cada grupo, um `Stack` com uma tela: título da seção (`headerLargeTitle: true`) e corpo "Nada por aqui ainda." dentro de `Screen` com edges só laterais. Apagar `src/app/explore.tsx` e `src/app/index.tsx` do template. Verificar que não existe rota Explore e que `npx tsc --noEmit` passa.
- [ ] 4.3 Apagar componentes de demo, CSS, arquivos `.web.tsx`/`.web.ts`, hooks `use-theme` e `use-color-scheme`, `scripts/reset-project.js`, o script `web`, o bloco `web` do `app.json` e PNGs de aba sem referência. Desinstalar `react-dom`, `react-native-web`, `@expo/ui`, `expo-image`, `expo-symbols`, `expo-device` e `expo-web-browser`. Manter `expo-glass-effect`. Verificar que uma busca no `src/` não acha esses imports e que `npx tsc --noEmit` passa.

## 5. Documentação e verificação

- [ ] 5.1 Atualizar `docs/architecture.md` com as decisões duráveis do design (linguagem visual, escala de espaçamento e tipografia do HIG, migrations na abertura sem tabela de domínio, e as três seções sem página de exercícios). Verificar que o registro de decisões cita essas quatro.
- [ ] 5.2 Rodar `npx expo lint`, `npx tsc --noEmit` e `npx jest`. Verificar que os três terminam com código 0.
