# FitPulse — Design System

## Filosofia Visual

- **Tema:** Dark mode nativo (sem light mode no momento)
- **Background:** Slate escuro (`#0f172a`) com gradientes radiais sutis de fundo
- **Estilo:** Glassmorphism, glows neon, gradientes vibrantes
- **Tipografia:** Limpa e hierárquica com Inter + Plus Jakarta Sans
- **Interações:** Transições suaves (200–500ms), hover com glow e translate
- **Fonte dos tokens:** `tailwind.config.ts` e `assets/css/tailwind.css`

---

## Paleta de Cores

### Primary — Indigo (Energia e Tecnologia)

| Token | Hex | Uso |
|-------|-----|-----|
| `primary-50` | `#eef2ff` | Fundos muito claros |
| `primary-100` | `#e0e7ff` | — |
| `primary-200` | `#c7d2fe` | Bordas sutis |
| `primary-300` | `#a5b4fc` | Texto secundário |
| `primary-400` | `#818cf8` | Texto de destaque |
| **`primary-500`** | **`#6366f1`** | **Cor principal da marca** |
| `primary-600` | `#4f46e5` | Hover states |
| `primary-700` | `#4338ca` | Active states |
| `primary-800` | `#3730a3` | — |
| `primary-900` | `#312e81` | — |
| `primary-950` | `#1e1b4b` | — |

### Secondary — Emerald (Saúde e Progresso)

| Token | Hex | Uso |
|-------|-----|-----|
| `secondary-50` | `#ecfdf5` | — |
| `secondary-100` | `#d1fae5` | — |
| `secondary-200` | `#a7f3d0` | — |
| `secondary-300` | `#6ee7b7` | Texto de sucesso |
| `secondary-400` | `#34d399` | Ícones de sucesso |
| **`secondary-500`** | **`#10b981`** | **Progresso, streaks, saúde** |
| `secondary-600` | `#059669` | Hover |
| `secondary-700` | `#047857` | — |
| `secondary-800` | `#065f46` | — |
| `secondary-900` | `#064e3b` | — |
| `secondary-950` | `#022c22` | — |

### Accent — Rose (Alertas e Conquistas)

| Token | Hex | Uso |
|-------|-----|-----|
| `accent-50` | `#fff1f2` | — |
| `accent-100` | `#ffe4e6` | — |
| `accent-200` | `#fecdd3` | — |
| `accent-300` | `#fda4af` | — |
| `accent-400` | `#fb7185` | Texto de alerta |
| **`accent-500`** | **`#f43f5e`** | **Alertas, PRs, conquistas** |
| `accent-600` | `#e11d48` | Hover |
| `accent-700` | `#be123c` | — |
| `accent-800` | `#9f1239` | — |
| `accent-900` | `#881337` | — |
| `accent-950` | `#4c0519` | — |

### Dark — Slate (Backgrounds e Superfícies)

| Token | Hex | Uso |
|-------|-----|-----|
| `dark-50` | `#f8fafc` | — |
| `dark-100` | `#f1f5f9` | — |
| `dark-200` | `#e2e8f0` | — |
| `dark-300` | `#cbd5e1` | Bordas |
| `dark-400` | `#94a3b8` | Placeholder text |
| `dark-500` | `#64748b` | Texto secundário |
| `dark-600` | `#475569` | Bordas de inputs |
| `dark-700` | `#334155` | Bordas de cards, fundos secundários |
| `dark-800` | `#1e293b` | **Fundo de cards e superfícies** |
| **`dark-900`** | **`#0f172a`** | **Background principal da página** |
| `dark-950` | `#020617` | — |

### Gradientes Predefinidos

| Classe | Valor |
|--------|-------|
| `bg-gradient-primary` | `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)` |
| `bg-gradient-secondary` | `linear-gradient(135deg, #10b981 0%, #06b6d4 100%)` |
| `bg-gradient-accent` | `linear-gradient(135deg, #f43f5e 0%, #f97316 100%)` |
| `bg-gradient-dark` | `linear-gradient(180deg, #0f172a 0%, #1e293b 100%)` |
| `bg-gradient-mesh` | `linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f97316 100%)` |

---

## Tipografia

### Fontes

| Fonte | Família | Uso |
|-------|---------|-----|
| **Sans** | `Inter, system-ui, -apple-system, sans-serif` | Corpo de texto, labels, parágrafos |
| **Display** | `Plus Jakarta Sans, Inter, system-ui, sans-serif` | Títulos, headings, números de destaque |

**Font Feature Settings:** `'cv02', 'cv03', 'cv04', 'cv11'`

### Escala de Texto

| Contexto | Tamanho | Peso | Exemplo |
|----------|---------|------|---------|
| Hero H1 | `text-4xl` → `text-7xl` (responsive) | `font-bold` (700) | "Treinos Personalizados" |
| Section H2 | `text-3xl` → `text-4xl` | `font-bold` | Seções da landing |
| Page H1 | `text-3xl` | `font-bold` | "Olá, Atleta! 👋" |
| Card H3 | `text-xl` | `font-bold` | Títulos de cards |
| Body | `text-base` (1rem) | normal | Parágrafos |
| Small/Caption | `text-sm` (0.875rem) | normal | Labels, hints |
| XS | `text-xs` (0.75rem) | normal | Badges, textos auxiliares |

---

## Espaçamento

| Token | Valor | Uso típico |
|-------|-------|-----------|
| `gap-2` | 8px | Elementos inline |
| `gap-3` | 12px | Ícones + texto |
| `gap-4` | 16px | Cards em grid |
| `gap-6` | 24px | Seções |
| `gap-8` | 32px | Blocos grandes |
| `py-6` / `py-8` | 24–32px | Padding de containers |
| `py-20` / `py-32` | 80–128px | Seções da landing page |

---

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-xl` | 12px | Cards, botões, inputs |
| `rounded-2xl` | 16px | Cards grandes |
| `rounded-3xl` | 24px | Containers de seção |
| `rounded-4xl` | 32px | Custom |
| `rounded-5xl` | 40px | Custom |
| `rounded-full` | 9999px | Avatares, badges |

---

## Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `shadow-card` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` | Cards padrão |
| `shadow-card-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` | Cards grandes |
| **`shadow-glow`** | `0 0 20px rgba(99, 102, 241, 0.3)` | **Hover primary** |
| **`shadow-glow-lg`** | `0 0 40px rgba(99, 102, 241, 0.4)` | **Hero CTA** |
| `shadow-glow-secondary` | `0 0 20px rgba(16, 185, 129, 0.3)` | Hover secondary |
| `shadow-inner-glow` | `inset 0 0 20px rgba(99, 102, 241, 0.1)` | Efeito interno |

---

## Animações

| Classe | Duração | Easing | Comportamento |
|--------|---------|--------|---------------|
| `animate-fade-in` | 0.5s | ease-out | Aparecer simples |
| `animate-fade-in-up` | 0.5s | ease-out | Aparecer subindo |
| `animate-fade-in-down` | 0.5s | ease-out | Aparecer descendo |
| `animate-slide-in-right` | 0.5s | ease-out | Entrar pela direita |
| `animate-slide-in-left` | 0.5s | ease-out | Entrar pela esquerda |
| `animate-scale-in` | 0.3s | ease-out | Crescer 0.9→1 |
| `animate-pulse-glow` | 2s | ease-in-out ∞ | Glow pulsante |
| `animate-bounce-in` | 0.6s | ease-out | Scale 0.3→1.05→0.9→1 |
| `animate-spin-slow` | 3s | linear ∞ | Spinner lento |
| `animate-gradient` | 3s | ease ∞ | Gradiente animado |

**Delays:** `.animation-delay-100` a `.animation-delay-500`

---

## Efeitos Especiais

| Classe | Descrição |
|--------|-----------|
| `.glass` | `bg-dark-800/60 backdrop-blur-lg border border-dark-700/50` |
| `.backdrop-blur-xs` | `backdrop-blur(2px)` |
| `.text-gradient` | Texto gradiente primary |
| `.text-gradient-secondary` | Texto gradiente secondary |
| `.container-app` | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| `.hide-scrollbar` | Scrollbar invisível |

---

## Componentes CSS (Tailwind)

### Cards

| Classe | Definição |
|--------|-----------|
| `.card` | `bg-dark-800/80 backdrop-blur-sm border border-dark-700 rounded-2xl shadow-card transition-all duration-300` |
| `.card-hover` | `hover:border-primary-500/30 hover:shadow-glow hover:-translate-y-1` |
| `.card-gradient` | `bg-gradient-to-br from-dark-800 to-dark-900 border-dark-700` |
| `.stat-card` | `card p-6 flex flex-col` |
| `.stat-value` | `text-3xl font-bold text-white font-display` |
| `.stat-label` | `text-sm text-slate-400 mt-1` |

### Botões

| Classe | Definição |
|--------|-----------|
| `.btn` | Base: `inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50` |
| `.btn-primary` | Gradiente indigo + glow + scale hover |
| `.btn-secondary` | Emerald + glow hover |
| `.btn-ghost` | Transparente com borda, hover dark-700 |
| `.btn-icon` | `p-3 rounded-xl bg-dark-700/50 border border-dark-600` |

**UiButton props:** `variant` (primary|secondary|ghost|danger|success), `size` (sm|md|lg), `type`, `disabled`, `loading`, `fullWidth`

### Formulários

| Classe | Definição |
|--------|-----------|
| `.input` | `w-full bg-dark-800/50 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20` |
| `.input-error` | `border-red-500 focus:border-red-500 focus:ring-red-500/20` |
| `.label` | `block text-sm font-medium text-slate-300 mb-2` |

### Badges

| Classe | Definição |
|--------|-----------|
| `.badge` | `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium` |
| `.badge-primary` | `bg-primary-500/20 text-primary-400 border border-primary-500/30` |
| `.badge-secondary` | `bg-secondary-500/20 text-secondary-400 border border-secondary-500/30` |
| `.badge-accent` | `bg-accent-500/20 text-accent-400 border border-accent-500/30` |

### Navegação

| Classe | Definição |
|--------|-----------|
| `.nav-link` | `flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-dark-700/50 hover:text-white transition-all` |
| `.nav-link-active` | `bg-primary-500/10 text-primary-400 border border-primary-500/20 hover:bg-primary-500/15` |

### Utilitários

| Classe | Definição |
|--------|-----------|
| `.progress-bar` | `h-2 bg-dark-700 rounded-full overflow-hidden` |
| `.progress-fill` | `h-full bg-gradient-primary rounded-full transition-all duration-500` |
| `.divider` | `border-t border-dark-700 my-6` |
| `.skeleton` | `animate-pulse bg-dark-700 rounded-lg` |

---

## Background da Página

```css
body {
  background-image:
    radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(16, 185, 129, 0.06) 0%, transparent 50%);
  background-attachment: fixed;
}
```

### Scrollbar

```css
::-webkit-scrollbar       { width: 8px }
::-webkit-scrollbar-track { bg-dark-800 rounded-full }
::-webkit-scrollbar-thumb { bg-dark-600 hover:bg-dark-500 rounded-full }
::selection               { bg-primary-500/30 text-white }
```

---

## Componentes Vue

| Componente | Props | Descrição |
|------------|-------|-----------|
| `UiButton` | `variant`, `size`, `type`, `disabled`, `loading`, `fullWidth` | Botão com spinner |
| `UiCard` | `title?`, `subtitle?`, `variant`, `hoverable`, `padding`, `rounded` | Card com header |
| `UiInput` | `modelValue`, `type`, `label?`, `placeholder?`, `hint?`, `error?`, `disabled`, `readonly`, `required`, `clearable`, `size` | Input completo |
| `UiBadge` | — | Badge colorido |
| `UiModal` | `modelValue`, `title?`, `subtitle?` | Modal com overlay |
| `UiToast` | (via `useToast`) | Toast com auto-dismiss |

---

## Layout

### Sidebar Desktop (`LayoutAppLayout`)

- Largura: `w-64` (256px)
- Background: `dark-900/50 backdrop-blur-sm`
- Borda: `border-r border-dark-800`

### Header Mobile

- Altura: `h-16` (64px)
- Fixo: `fixed top-0 left-0 right-0 z-50`
- Background: `glass border-b border-dark-700`

### Main Content

- Desktop offset: `lg:ml-64`
- Container: `container-app py-6 lg:py-8`
