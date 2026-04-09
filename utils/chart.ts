import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js'

/**
 * Registra somente os componentes Chart.js necessários para
 * Line, Bar e Doughnut charts — minimiza bundle size.
 *
 * Deve ser chamado uma única vez antes de qualquer gráfico renderizar.
 * O Nuxt auto-import torna esta função disponível em toda a app.
 */
export function registerChartComponents(): void {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
  )
}

/**
 * Opções padrão do tema dark para todos os gráficos.
 * Aplicar via `:options="chartDarkOptions"` no UiChart.
 */
export const chartDarkOptions: ChartOptions<'line' | 'bar' | 'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8', // dark-400
        font: { family: 'Inter, system-ui, sans-serif' },
      },
    },
    tooltip: {
      backgroundColor: '#1e293b', // dark-800
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: { color: '#334155' }, // dark-700
      ticks: { color: '#94a3b8' }, // dark-400
    },
    y: {
      grid: { color: '#334155' },
      ticks: { color: '#94a3b8' },
    },
  },
}

/**
 * Cores padrão do design system para datasets.
 * Usar quando o consumidor não fornecer cores explícitas.
 */
export const DESIGN_SYSTEM_CHART_COLORS = {
  primary: {
    border: '#6366f1',  // primary-500
    background: 'rgba(99, 102, 241, 0.15)',
  },
  secondary: {
    border: '#10b981',  // secondary-500
    background: 'rgba(16, 185, 129, 0.15)',
  },
  accent: {
    border: '#f43f5e',  // accent-500
    background: 'rgba(244, 63, 95, 0.15)',
  },
} as const
