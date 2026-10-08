# Proposal

## Why

O repositório ainda é o template de exemplo do Expo: a navegação, os componentes e o estilo não servem o app, e não existe armazenamento local nem runner de testes. As próximas changes (catálogo, planos, sessões, dashboard) precisam dessa base antes de qualquer regra de domínio.

## What Changes

- **BREAKING:** some a rota Explore, os arquivos específicos de web (`.web.tsx`, `.web.ts`, CSS), o alvo web (`app.json`, script `web`, `react-dom`, `react-native-web`) e os componentes e pacotes de demo que ficarem sem uso.
- Navegação nativa com três seções, nesta ordem: Início, Treinos, Dashboard. Cada uma mostra o próprio nome e a frase "Nada por aqui ainda." Não há seção nem página de Exercícios.
- Aparência segue o sistema (claro ou escuro). Quando o aparelho oferece o material translúcido do iPhone atual, a barra de abas e as superfícies o usam; caso contrário, a mesma estrutura fica com superfícies opacas. No Android a barra de abas é a nativa da plataforma.
- Tokens de espaçamento com os nomes `xs`, `sm`, `md` e `lg`, mais tipografia (estilos do HIG, do Large Title ao Caption), cores claro/escuro e raios.
- Primitivos visuais: Text, Button (filled, plain, destructive), Card, Screen (safe area) e ListItem (título, subtítulo opcional, chevron opcional).
- Estrutura de camadas (`app`, `components/ui`, `domain`, `db`, `repositories`, `hooks`, `constants`, `lib`). Pastas de componentes de domínio não são criadas vazias.
- Banco local aberto na inicialização, com migrations aplicadas antes de mostrar as seções. Nenhuma tabela de domínio. Se a preparação falhar, o app mostra um erro em pt-BR e não mostra as seções.
- Runner `jest-expo` e um teste de exemplo ao lado de uma função pura em `src/domain`, sem regra de produto.

## Capabilities

### New Capabilities

- `app-shell`: as três seções principais, conteúdo vazio e aparência (claro/escuro e material translúcido quando o aparelho oferece). O catálogo de exercícios não é seção da barra.
- `local-storage`: preparação do armazenamento local antes das seções, inclusive falha e ausência de dados do usuário.

### Modified Capabilities

- Nenhuma. Não há specs publicadas.

## Impact

- Rotas em `src/app/`, primitivos em `src/components/ui/`, tokens em `src/constants/theme.ts`.
- Novas camadas `src/db/`, `src/repositories/`, `src/hooks/`, `src/domain/`, `src/lib/`.
- Dependências: entram `expo-sqlite`, Drizzle e `jest-expo`; saem o alvo web e os pacotes de demo sem uso.
- `docs/architecture.md` recebe as decisões duráveis desta base (linguagem visual, tokens e preparação do banco na abertura).

## Fora de escopo

- Catálogo de exercícios, planos de treino, sessões, séries e dashboard com métricas.
- Página ou seção de Exercícios. A lista de exercícios não aparece nesta change.
- Sync, autenticação e qualquer tabela de domínio.
- Toggle manual de tema, tabela completa de Dynamic Type e stacks com telas além do placeholder de cada seção.

## Depois

- `exercise-catalog`, `workout-plans`, `session-logging`, `training-dashboard` e `cloud-sync`, na ordem do roadmap.
- O catálogo de exercícios não vira seção da barra. A lista completa entra na criação do plano, para escolher os exercícios daquele dia de treino. No registro da sessão, a lista é só a dos exercícios alocados naquele treino. Numa change posterior, a lista completa volta na troca de um exercício durante a sessão.
- Insights por regras, papel de admin/coach, RPE/RIR e unidades em lb.
- Remover o módulo de exemplo em `src/domain` quando existir a primeira função de domínio real.
