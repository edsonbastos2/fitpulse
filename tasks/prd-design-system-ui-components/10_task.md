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

- [ ] 10.1 Criar `components/ui/UiChart.vue` com wrapper que renderiza LineChart, BarChart ou DoughnutChart baseado na prop `type`
- [ ] 10.2 Registrar componentes Chart.js necessários (importar de `utils/chart.ts` criado na tarefa 1.0)
- [ ] 10.3 Aplicar tema dark: grid lines dark-700, texto dark-400, cores primary/secondary/accent
- [ ] 10.4 Implementar loading state (esqueleto animado enquanto dados não carregam)
- [ ] 10.5 Configurar legenda com props (position: top/bottom, display: boolean)
- [ ] 10.6 Implementar aria-label e tabela de dados oculta como fallback para screen readers
- [ ] 10.7 Verificar responsividade (redimensiona com container)

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

- [ ] **Unit — UiChart (renderização):** Renderiza line chart com dados de teste; renderiza bar chart; renderiza doughnut chart; datasets aplicam cores corretas
- [ ] **Unit — UiChart (props):** Legenda configurável (top/bottom/hidden); loading state exibe skeleton; aria-label aplicado; sem dados exibe estado vazio
- [ ] **Unit — UiChart (reatividade):** Atualizar dados via prop atualiza gráfico; mudar type re-renderiza tipo correto
- [ ] **Acessibilidade:** Verificar aria-label no canvas; tabela de dados oculta (visually-hidden) com valores dos datasets
- [ ] **Responsividade:** Redimensionar container verifica que gráfico ajusta tamanho

## Arquivos relevantes

- `components/ui/UiChart.vue` — NOVO
- `utils/chart.ts` — Registro Chart.js (tarefa 1.0)
- `types/index.ts` — tipo ChartDataset
- `tailwind.config.ts` — Cores primary, secondary, accent, dark
- `pages/dashboard/index.vue` — Futuro consumidor de UiChart
