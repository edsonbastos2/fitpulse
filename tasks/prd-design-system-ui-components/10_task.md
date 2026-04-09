# Tarefa 10.0: Criar UiChart

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar `UiChart` como wrapper de `vue-chartjs` (instalado na tarefa 1.0), suportando tipos line, bar e doughnut com tema dark do design system, loading state, tooltips e legenda configurável.

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Cores do design system em gráficos, tema dark, tooltips estilizadas
- `ui-ux-pro-max` — Acessibilidade de gráficos: aria-label, fallback textual
- `web-design-guidelines` — Responsividade de canvas, data visualization best practices
</skills>

<requirements>
- Suporta tipos: line, bar, doughnut (RF-5.1)
- Aceita dados via props: datasets com labels, valores, cores (RF-5.2)
- Tooltip com valores ao hover/touch (RF-5.3)
- Usa cores do design system como paleta padrão (RF-5.4)
- Responsivo e redimensiona com container (RF-5.5)
- Estado de loading enquanto dados carregam (RF-5.6)
- Legenda configurável (posição, visibilidade) (RF-5.7)
- Acessível via aria-label e fallback textual (RF-5.8)
</requirements>

## Subtarefas

- [x] 10.1 Criar `components/ui/UiChart.vue` — renderiza Line, Bar ou Doughnut baseado na prop `type` via vue-chartjs
- [x] 10.2 Registrar Chart.js via `registerChartComponents()` do `utils/chart.ts` no `onMounted` (tree-shaking: somente Line, Bar, Doughnut)
- [x] 10.3 Tema dark: grid `#334155` (dark-700), ticks `#94a3b8` (dark-400), legend `#94a3b8`, cores default dos datasets (primary/secondary/accent)
- [x] 10.4 Loading state com skeleton `animate-pulse bg-dark-700` + texto "Carregando..."; estado "Sem dados" quando datasets vazios
- [x] 10.5 Legenda configurável via prop `legend: { position: 'top'|'bottom'|'left'|'right', display: boolean }`
- [x] 10.6 `aria-label` no canvas + tabela de dados oculta (`sr-only`) como fallback para screen readers
- [x] 10.7 Responsivo: `responsive: true`, `maintainAspectRatio: false`, container com `minHeight` configurável

## Detalhes de Implementação

Consultar **techspec.md** → Seções "Interfaces Principais" (ChartProps, ChartDataset), "Tratamento de Erros" e "Riscos Conhecidos" (bundle size). Usar componentes registrados de `vue-chartjs` com `defineChartComponent`. Tema dark via opções do Chart.js: `scales.grid.color = '#334155'`, `scales.ticks.color = '#94a3b8'`, `plugins.legend.labels.color = '#94a3b8'`. Cores padrão dos datasets: primary-500 (#6366f1), secondary-500 (#10b981), accent-500 (#f43f5e).

## Critérios de Sucesso

- UiChart renderiza line, bar e doughnut charts corretamente
- Tooltip exibe valores ao hover
- Tema dark consistente (grid, texto, legenda)
- Loading state exibe skeleton animado
- Legenda configurável via props
- aria-label presente; tabela de dados oculta como fallback
- Responsivo: redimensiona com container

## Testes da Tarefa

- [x] **Unit — UiChart (renderização):** Line/Bar/Doughnut renderizam via vue-chartjs; `processedDatasets` aplica cores do design system (primary/secondary/accent) automaticamente; line charts com `fill: true` e `tension: 0.3` (curva suave); doughnut sem scales
- [x] **Unit — UiChart (props):** Legenda configurável (`legend.display: false` oculta, `legend.position` muda posição); loading state exibe skeleton `animate-pulse`; `aria-label` aplicado; sem dados exibe "Sem dados"
- [x] **Unit — UiChart (reatividade):** `chartData` computed reage a mudanças em `datasets` e `labels`; mudar `type` troca componente (Line↔Bar↔Doughnut); `doughnutOptions` remove scales apropriadamente
- [x] **Acessibilidade:** `aria-label` no elemento chart (`role="img"`); tabela de dados oculta (`sr-only`) com `role="table"`, `caption`, labels e valores dos datasets
- [x] **Responsividade:** `responsive: true` + `maintainAspectRatio: false` permite que gráfico preencha container; `minHeight` configurável (default 250px)

## Arquivos relevantes

- `components/ui/UiChart.vue` — NOVO
- `utils/chart.ts` — Registro Chart.js (tarefa 1.0)
- `types/index.ts` — tipo ChartDataset
- `tailwind.config.ts` — Cores primary, secondary, accent, dark
- `pages/dashboard/index.vue` — Futuro consumidor de UiChart
