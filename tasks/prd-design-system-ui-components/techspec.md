# Tech Spec — Módulo 2: Design System & UI Components

## Resumo Executivo

Este documento define a arquitetura técnica para auditoria, padronização e expansão da biblioteca de componentes UI do FitPulse. A abordagem central é: **(1)** extrair o layout monolítico `AppLayout` em subcomponentes independentes (`LayoutNavbar`, `LayoutSidebar`, `LayoutFooter`), **(2)** auditar componentes existentes (`UiButton`, `UiCard`, `UiInput`) contra o design system e corrigir gaps, **(3)** criar componentes novos — inputs (`UiSelect`, `UiToggle`, `UiDatePicker`, `UiRangeSlider`), cards especializados (`ExerciseCard`, `WorkoutCard`, `StatCard`), botão de ícone (`UiIconButton`) e wrapper de gráficos (`UiChart`) — e **(4)** refatorar `AppLayout` para compor os subcomponentes sem alterar comportamento visual.

Decisões chave: `vue-chartjs` + `Chart.js` para gráficos (tree-shaking, line/bar/doughnut nativos), `@vuepic/vue-datepicker` como base do `UiDatePicker` (dark mode, modular), e `UiRangeSlider` construído do zero com Vue + CSS puro para controle total do estilo.

## Arquitetura do Sistema

### Visão Geral dos Componentes

#### Componentes Novos

| Componente | Responsabilidade | Diretório |
|------------|-----------------|-----------|
| `LayoutNavbar` | Barra de navegação responsiva (desktop horizontal / mobile hamburger) | `components/layout/` |
| `LayoutSidebar` | Menu lateral desktop (256px) com navegação, active state, user section | `components/layout/` |
| `LayoutFooter` | Rodapé responsivo (compacto mobile / colunas desktop) | `components/layout/` |
| `UiIconButton` | Botão circular/quadrado somente com ícone (variants ghost, primary) | `components/ui/` |
| `UiSelect` | Dropdown de seleção com busca interna, option groups, keyboard nav | `components/ui/` |
| `UiToggle` | Toggle switch binário on/off com label e transição | `components/ui/` |
| `UiDatePicker` | Wrapper sobre `@vuepic/vue-datepicker` com estilização dark mode | `components/ui/` |
| `UiRangeSlider` | Slider de faixa com valor exibido, min/max/step, dual-handle opcional | `components/ui/` |
| `UiChart` | Wrapper sobre `vue-chartjs` com tipos line/bar/doughnut e tema dark | `components/ui/` |
| `ExerciseCard` | Card de exercício com nome, músculo, equipamento, dificuldade | `components/ui/` |
| `WorkoutCard` | Card de treino com título, duração, status, badge de progresso | `components/ui/` |
| `StatCard` | Card compacto de métrica com valor, label, ícone, tendência | `components/ui/` |

#### Componentes Modificados

| Componente | Modificação |
|------------|-------------|
| `AppLayout` | Refatorado para compor `LayoutNavbar`, `LayoutSidebar`, `LayoutFooter` como subcomponentes; comportamento visual inalterado |
| `UiButton` | Auditoria de conformidade com design system: focus ring, gradientes, acessibilidade |
| `UiCard` | Auditoria: padding, border-radius, hoverable, slots |
| `UiInput` | Auditoria: focus ring, error states, hint, clearable, password toggle |

#### Relacionamentos

```
AppLayout
├── LayoutSidebar (desktop only, ≥1024px)
├── LayoutNavbar (mobile <1024px, desktop como header opcional)
├── <slot /> (main content)
└── LayoutFooter

UiDatePicker
└── @vuepic/vue-datepicker (dep externa)

UiChart
└── vue-chartjs + Chart.js (deps externas)
    ├── LineChart (register)
    ├── BarChart (register)
    └── DoughnutChart (register)

ExerciseCard, WorkoutCard → UiCard (composição)
StatCard → UiCard (composição)
```

#### Fluxo de Dados

- **Navegação:** `LayoutSidebar` e `LayoutNavbar` recebem `NavigationItem[]` via props. Active state calculado via `useRoute()` interno.
- **Inputs:** Todos usam `v-model` (modelValue emit) para two-way binding. `UiSelect` gerencia estado interno de dropdown (open/close, search filter).
- **Gráficos:** `UiChart` recebe dados via props (`ChartDataset[]`), registra componentes Chart.js no `onMounted`, renderiza reativamente.
- **Cards especializados:** Compoem `UiCard` internamente; recebem dados de domínio via props tipadas.

## Design de Implementação

### Interfaces Principais

```ts
// Navegação (compartilhada entre Navbar e Sidebar)
interface NavItem {
  label: string
  icon: string // nome do ícone no iconMap
  to: string
  badge?: string | number
}

// UiSelect
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
  group?: string
}

// UiChart
interface ChartDataset {
  label: string
  data: number[]
  borderColor?: string
  backgroundColor?: string
}

interface ChartProps {
  type: 'line' | 'bar' | 'doughnut'
  datasets: ChartDataset[]
  labels: string[]
  legend?: { position: 'top' | 'bottom'; display: boolean }
  loading?: boolean
}

// ExerciseCard
interface ExerciseCardProps {
  exercise: Pick<Exercise, 'name' | 'name_pt' | 'primary_muscles' | 'equipment_id' | 'difficulty'>
  // ou dados soltos: name, muscleGroup, equipment, difficulty
}

// WorkoutCard
interface WorkoutCardProps {
  title: string
  description?: string
  exerciseCount: number
  estimatedDuration: number
  status: 'planned' | 'in_progress' | 'completed' | 'scheduled'
  progress?: number // 0-100
}
```

### Modelos de Dados

Novos tipos a adicionar em `types/index.ts`:

```ts
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
  group?: string
}

export interface ChartDataset {
  label: string
  data: number[]
  borderColor?: string
  backgroundColor?: string
}

export interface TrendIndicator {
  direction: 'up' | 'down' | 'neutral'
  value?: number
  label?: string
}
```

### Endpoints de API

N/A — este módulo é puramente frontend. Componentes consomem dados via props.

## Pontos de Integração

### Dependências Externas

| Dependência | Versão | Uso | Instalação |
|-------------|--------|-----|------------|
| `vue-chartjs` | ^5.x | Wrapper Vue 3 para Chart.js | `pnpm add vue-chartjs chart.js` |
| `@vuepic/vue-datepicker` | ^11.x | Base do UiDatePicker | `pnpm add @vuepic/vue-datepicker` |

### Tratamento de Erros

- **Chart.js:** Registrar apenas os controllers necessários (Line, Bar, Doughnut) para minimizar bundle. Envolver em `try/catch` no `onMounted` com fallback para estado de erro visual.
- **DatePicker:** `@vuepic/vue-datepicker` é maduro; envolver com wrapper para padronizar tema dark via CSS variables.
- **Todos os inputs:** Validar props no componente (required, ranges) com warnings em dev.

## Abordagem de Testes

### Testes Unidade

| Componente | Cenários Críticos |
|------------|-------------------|
| `LayoutSidebar` | Active state por route, itens renderizados, user info, mobile hidden |
| `LayoutNavbar` | Toggle hamburger menu, responsividade, slots renderizados |
| `UiSelect` | Abertura/fechamento, busca filtra opções, seleção emite modelValue, Escape fecha, clic-fora fecha |
| `UiToggle` | Toggle on/off, disabled state, label, v-model binding |
| `UiRangeSlider` | Valor min/max/step, dual-handle mode, emit correto, keyboard arrows |
| `UiChart` | Renderiza 3 tipos, dados reativos atualizam gráfico, loading state, erro sem dados |
| `UiIconButton` | Variants ghost/primary, sizes, disabled state |
| `ExerciseCard` | Dados renderizados, slot ações, responsive |
| `WorkoutCard` | Status badge correto, click handler, progresso visual |
| `StatCard` | Valor formatado, tendência up/down/neutral, ícone colorido |

**Mocks:** Não requeridos — componentes são puros, sem chamadas de API.

### Testes de Integração

| Combinação | O que testar |
|------------|-------------|
| `AppLayout` composto com `LayoutSidebar` + `LayoutNavbar` + `LayoutFooter` | Comportamento visual idêntico ao atual; responsividade; navegação funcional |
| `UiSelect` dentro de formulário com `UiInput`, `UiToggle`, `UiDatePicker` | v-model encadeado, submit com valores corretos |
| `StatCard` + `UiChart` no dashboard | Dados compartilhados, responsividade |

### Testes de E2E (Playwright)

Fluxos críticos:

1. **Navegação responsiva:** Desktop (sidebar visível) → redimensionar para mobile (hamburger) → abrir menu → navegar para seção
2. **Formulário completo:** Preencher UiInput + UiSelect + UiDatePicker + UiRangeSlider + UiToggle → submeter → verificar valores
3. **Acessibilidade keyboard:** Tab através de todos os componentes interativos → Enter/Espaço para ativar → Escape para fechar overlays

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Dependências externas** (`vue-chartjs`, `@vuepic/vue-datepicker`) — desbloqueia UiChart e UiDatePicker
2. **Layout subcomponents** (`LayoutSidebar`, `LayoutNavbar`, `LayoutFooter`) — base para toda a UI, extraídos do AppLayout existente
3. **Refatorar `AppLayout`** para compor subcomponentes — garante zero regressão visual antes de prosseguir
4. **Auditoria de componentes existentes** (`UiButton`, `UiCard`, `UiInput`) — correções rápidas de conformidade
5. **Novos inputs** (`UiSelect`, `UiToggle`, `UiDatePicker`, `UiRangeSlider`) — dependem apenas do design system
6. **UiIconButton** — componente simples, desbloqueia cards especializados
7. **Cards especializados** (`ExerciseCard`, `WorkoutCard`, `StatCard`) — compoem UiCard, precisam de UiIconButton
8. **UiChart** — wrapper de gráficos, pode ser feito em paralelo com inputs
9. **Integração e verificação** — testar todos componentes juntos, responsividade, acessibilidade

### Dependências Técnicas

| Bloqueante | Impacto |
|------------|---------|
| Instalação de `vue-chartjs` + `chart.js` | Necessário antes de UiChart |
| Instalação de `@vuepic/vue-datepicker` | Necessário antes de UiDatePicker |
| Extração de LayoutSidebar/Navbar/Footer | Necessário antes de refatorar AppLayout |
| AppLayout refatorado | Deve passar verificação visual antes de prosseguir |

## Monitoramento e Observabilidade

Como este módulo é puramente UI/frontend, não há métricas Prometheus ou logs de servidor. A observabilidade se concentra em:

- **Runtime errors:** Capturar erros de renderização de componentes via `onErrorCaptured` do Vue ou handler global `app.config.errorHandler`
- **Chart.js loading:** Estado de erro visual no UiChart com mensagem para o usuário
- **Performance:** Monitorar bundle size no CI com `size-limit` ou `rollup-plugin-visualizer`. Meta: incremento total < 150KB gzip (excluindo Chart.js ~100KB gzip)
- **DevTools:** Componentes nomeados consistentemente (`UiButton`, `LayoutSidebar`) para facilitar debug no Vue DevTools

## Considerações Técnicas

### Decisões Principais

| Decisão | Justificativa | Alternativas Rejeitadas |
|---------|---------------|------------------------|
| **vue-chartjs + Chart.js** para gráficos | Wrapper oficial, tree-shaking, documentação excelente, line/bar/doughnut nativos, bundle razoável (~100KB gzip Chart.js) | **ApexCharts:** wrapper Vue menos maduro. **ECharts:** bundle muito grande. **SVG puro:** limitado em tooltips e interatividade |
| **@vuepic/vue-datepicker** como base do UiDatePicker | Maduro, dark mode nativo via CSS vars, modular, range support, ~50KB gzip | **Construir do zero:** esforço significativo para calendário, navegação meses/anos, keyboard nav. **vue3-datepicker:** menos funcionalidades |
| **UiRangeSlider puro Vue + CSS** | Controle total do estilo para seguir design system, zero deps extras, componente simples o suficiente para justificar construção própria | **Bibliotecas externas:** difícil customizar para dark mode + gradientes do design system |
| **Layout como subcomponentes** | Reusabilidade máxima (Navbar pode ser usada em landing page, modais), teste isolado, composição flexível | **Manter monolítico:** impede reuso, dificulta teste unitário |
| **Cards especializados compoem UiCard** | DRY, consistência visual, herdam hoverable/variants do UiCard | **Cards independentes:** duplicação de estilos de card base |
| **Auditoria em vez de reescrita** | UiButton, UiCard, UiInput já funcionam; auditoria corrige gaps sem risco de regressão | **Reescrever do zero:** risco alto de regressão visual, esforço desnecessário |

### Riscos Conhecidos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Chart.js adiciona >100KB ao bundle final | Alta | Médio | Usar imports seletivos (somente Line, Bar, Doughnut controllers), tree-shaking, lazy load em páginas que usam UiChart |
| @vuepic/vue-datepicker conflita com tema dark do Tailwind | Média | Baixo | Wrapper com CSS variables customizadas, sobrescrever estilos via `:deep()` scoped CSS |
| Refatoração do AppLayout introduz regressão visual | Média | Alto | Comparar screenshot antes/depois manualmente em desktop e mobile; manter comportamento idêntico |
| UiSelect com busca interna tem performance ruim com >100 opções | Baixa | Baixo | Virtualizar lista se necessário (futuro); para uso atual do FitPulse, lista direta é suficiente |
| Acessibilidade de gráficos (screen reader) | Média | Médio | Incluir `aria-label` + tabela de dados oculta como fallback semântico (RF-5.8) |

### Conformidade com Skills Padrões

Skills aplicáveis a esta Tech Spec:

| Skill | Aplicação |
|-------|-----------|
| `frontend-design` | Diretrizes de UI/UX, responsividade, glassmorphism, gradientes, animações |
| `ui-ux-pro-max` | Paleta de cores, tipografia, acessibilidade WCAG AA, componentes interativos |
| `web-design-guidelines` | Review de conformidade de UI dos componentes (contraste, keyboard nav, ARIA) |

### Arquivos relevantes e dependentes

| Arquivo | Relação |
|---------|---------|
| `components/layout/AppLayout.vue` | **Modificado** — será refatorado para compor LayoutSidebar, LayoutNavbar, LayoutFooter |
| `components/ui/UiButton.vue` | **Modificado** — auditoria de conformidade |
| `components/ui/UiCard.vue` | **Modificado** — auditoria de conformidade |
| `components/ui/UiInput.vue` | **Modificado** — auditoria de conformidade |
| `components/ui/UiBadge.vue` | Referência — já conforme |
| `components/ui/UiModal.vue` | Referência — já conforme |
| `components/ui/UiToast.vue` | Referência — já conforme |
| `tailwind.config.ts` | **Possível modificação** — estender animações/config se necessário |
| `assets/css/tailwind.css` | **Possível modificação** — adicionar estilos do datepicker, custom CSS para range slider |
| `types/index.ts` | **Modificado** — adicionar tipos SelectOption, ChartDataset, TrendIndicator |
| `docs/DESIGN_SYSTEM.md` | Referência — fonte de verdade visual |
| `pages/dashboard/index.vue` | **Modificado** — usará StatCard, UiChart em vez de HTML inline |
| `package.json` | **Modificado** — adicionar vue-chartjs, chart.js, @vuepic/vue-datepicker |
| `nuxt.config.ts` | **Possível modificação** — configurar transpilação de deps se necessário |
