# FitPulse - Contexto do Projeto

## Visão Geral

**FitPulse** é uma Progressive Web App (PWA) de gestão de treinos construída com **Nuxt 3** (Vue 3). O aplicativo oferece recomendações personalizadas de treinos, permitindo que usuários criem, gerenciem e acompanhem suas sessões de exercício.

### Tecnologias Principais

| Categoria | Tecnologia |
|-----------|-----------|
| Framework | Nuxt 3 (Vue 3 + TypeScript) |
| Backend/BaaS | Supabase (Auth + Database) |
| Estilização | Tailwind CSS |
| State Management | Vue composables + Pinia (se necessário) |
| Utilitários | VueUse |
| Linting | ESLint 9 + @nuxt/eslint-config |
| Formatação | Prettier |
| Package Manager | pnpm |

## Arquitetura do Projeto

```
fitpulse/
├── assets/css/          # Estilos globais e configurações Tailwind
├── components/          # Componentes Vue reutilizáveis
│   ├── layout/          # Layouts (navbar, sidebar, etc.)
│   └── ui/              # Componentes base (botões, inputs, toasts, etc.)
├── composables/         # Composables Vue reutilitários (lógica de negócio)
├── layouts/             # Layouts de página
├── middleware/          # Middlewares Nuxt (autenticação)
├── pages/               # Páginas da aplicação (roteamento)
│   ├── auth/            # Login/Registro
│   └── dashboard/       # Dashboard principal
├── public/              # Arquivos estáticos (ícones PWA, favicon)
├── types/               # Tipos TypeScript
└── utils/               # Funções utilitárias
```

### Composables (Camada de Lógica)

| Composable | Responsabilidade |
|------------|-----------------|
| `useAuth` | Autenticação, perfil do usuário, sign-out |
| `useWorkouts` | CRUD de treinos, sessões, logs de exercício |
| `useExercises` | Biblioteca de exercícios |
| `useRecommendations` | Recomendações personalizadas |
| `useToast` | Sistema de notificações toast |

### Middleware

| Middleware | Responsabilidade |
|------------|-----------------|
| `auth.ts` | Protege rotas que exig autenticação; redireciona usuários logados para fora de páginas de auth |

## Design System

Tema escuro com gradientes vibrantes, glassmorphism e animações suaves.
**Documentação completa:** [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)

### Cores Principais

| Token | Hex | Uso |
|-------|-----|-----|
| `primary-500` | `#6366f1` (Indigo) | Marca, ações principais, links |
| `secondary-500` | `#10b981` (Emerald) | Progresso, streaks, sucesso |
| `accent-500` | `#f43f5e` (Rose) | Alertas, conquistas, destaque |
| `dark-900` | `#0f172a` (Slate) | Background principal |
| `dark-800` | `#1e293b` (Slate) | Fundo de cards/superfícies |
| `dark-700` | `#334155` (Slate) | Bordas |

**Gradientes:** `bg-gradient-primary` (indigo→purple), `bg-gradient-secondary` (emerald→cyan), `bg-gradient-accent` (rose→orange)

### Tipografia

- **Sans:** Inter (corpo, labels)
- **Display:** Plus Jakarta Sans (títulos, números)

### Classes CSS Mais Usadas

| Categoria | Classes |
|-----------|---------|
| Cards | `.card`, `.card-hover`, `.card-gradient`, `.stat-card` |
| Botões | `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-icon` |
| Forms | `.input`, `.input-error`, `.label` |
| Badges | `.badge`, `.badge-primary`, `.badge-secondary`, `.badge-accent` |
| Nav | `.nav-link`, `.nav-link-active` |
| Efeitos | `.glass`, `.text-gradient`, `.text-gradient-secondary` |
| Utils | `.progress-bar`, `.progress-fill`, `.divider`, `.skeleton`, `.container-app`, `.hide-scrollbar` |

### Animações

`animate-fade-in`, `animate-fade-in-up`, `animate-slide-in-right`, `animate-scale-in`, `animate-pulse-glow`, `animate-bounce-in`, `animate-spin-slow`, `animate-gradient`

Delays: `.animation-delay-100` a `.animation-delay-500`

### Componentes Vue de UI

| Componente | Props principais |
|------------|-----------------|
| `UiButton` | `variant` (primary/secondary/ghost/danger/success), `size` (sm/md/lg), `loading` |
| `UiCard` | `variant` (default/gradient/bordered), `hoverable` |
| `UiInput` | `type`, `label`, `error`, `clearable`, `size` |
| `UiBadge` | — |
| `UiModal` | `modelValue`, `title` |
| `UiToast` | (via composable `useToast`) |

### Layout

- **Sidebar desktop:** 256px (`w-64`), offset `lg:ml-64`
- **Header mobile:** 64px (`h-16`), fixed z-50
- **Container:** `.container-app` = `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Fonte dos tokens:** `tailwind.config.ts` + `assets/css/tailwind.css`

## Comandos Principais

```bash
# Instalação de dependências
pnpm install

# Desenvolvimento
pnpm dev              # Inicia servidor em http://localhost:3000

# Build para produção
pnpm build            # Build completo
pnpm generate         # Gera site estático
pnpm preview          # Preview do build

# Qualidade de código
pnpm lint             # Verifica com ESLint
pnpm lint:fix         # Corrige automaticamente (se possível)
```

## Variáveis de Ambiente

O arquivo `.env` é necessário para conectar ao Supabase. Veja `.env.example`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_PUBLIC_APP_NAME=FitPulse
```

## Autenticação

- **Provedor:** Supabase Auth
- **Métodos:** Email/Password, OAuth (Google, GitHub)
- **Proteção de rotas:** Middleware `auth.ts` protege rotas como `/dashboard`, `/workouts`, `/profile`, etc.
- **Redirects:** Usuários não autenticados são redirecionados para `/auth/login`; usuários logados são redirecionados para `/dashboard` ao tentar acessar `/auth/login` ou `/auth/register`

## Banco de Dados (Supabase)

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `users` | Perfis de usuário (gerenciado pelo Supabase Auth) |
| `user_profiles` | Preferências, objetivos, stats corporais |
| `exercises` | Biblioteca de exercícios com músculos, equipamentos |
| `workouts` | Treinos criados pelo usuário ou templates |
| `workout_exercises` | Relacionamento treino-exercício (sets, reps, descanso) |
| `workout_sessions` | Sessões de treino (in_progress, completed, skipped) |
| `workout_logs` | Logs individuais de sets (peso, reps, RPE) |
| `scheduled_workouts` | Treinos agendados com lembretes |

## TypeScript

- **Strict mode:** Ativado (`strict: true`)
- **Type check no build:** Desativado (`typeCheck: false`) até gerar tipos tipados do Supabase
- **Types:** Definidos em `types/index.ts` com interfaces para todas as entidades do banco e UI
- **Path aliases:** `~/*` e `@/*` apontam para a raiz do projeto (configurado via `.nuxt/tsconfig.json`)

## Convenções de Código

### ESLint

- **Formato:** Flat config (`eslint.config.js`) com `createConfigForNuxt` de `@nuxt/eslint-config/flat`
- **Ordem de tags Vue:** `script → template → style`
- **Type imports:** Preferir `import type { X }` sobre `import { X }`
- **Unused vars:** Warn com prefix `_`

### Padrões Observados

- Composables usam `export const useXxx = () => { ... }`
- Componentes Vue usam `<script setup lang="ts">`
- Tipagem forte com interfaces TypeScript em `types/index.ts`
- Estado global gerenciado via `useState()` do Nuxt dentro de composables
- Supabase client acessado via `useSupabaseClient()` e `useSupabaseUser()`
- **`useSupabaseUser()`** retorna `Ref<User | null>` — acessar diretamente: `const user = useSupabaseUser()` (não desestruturar)

### Dependências Adicionais

- `@heroicons/vue` — Ícones para componentes de layout (usar `WrenchScrewdriverIcon` para exercícios/treinos, já que `DumbbellIcon` não existe)
- `@vite-pwa/nuxt` — Módulo PWA (config `pwa` no `nuxt.config.ts`, adicionar ao array `modules`)

## PWA

- Service Worker com cache offline (Workbox)
- Manifest para instalação no celular
- Cache de assets do Supabase e Google Fonts
- Prompt de instalação habilitado (via `beforeinstallprompt`)

## Estrutura de Rotas

| Rota | Descrição | Auth |
|------|-----------|------|
| `/` | Landing page / Home | Não |
| `/auth/login` | Login | Não (redireciona se logado) |
| `/auth/register` | Registro | Não (redireciona se logado) |
| `/auth/confirm` | Confirmação de auth | Não |
| `/dashboard` | Dashboard principal | Sim |
| `/exercises/*` | Biblioteca de exercícios | Parcialmente (excluído do redirect) |
