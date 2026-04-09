<template>
  <div class="relative w-full" :style="{ minHeight: minHeight + 'px' }">
    <!-- Loading Skeleton -->
    <div v-if="loading || !hasData" class="absolute inset-0 animate-pulse bg-dark-700 rounded-xl" />
    <div v-if="loading || !hasData" class="absolute inset-0 flex items-center justify-center">
      <p class="text-sm text-slate-500">{{ loading ? 'Carregando...' : 'Sem dados' }}</p>
    </div>

    <!-- Chart -->
    <div v-show="hasData && !loading" class="w-full h-full" :style="{ minHeight: minHeight + 'px' }">
      <Line v-if="type === 'line'" :data="chartData" :options="chartOptions" :aria-label="ariaLabel || title" role="img" />
      <Bar v-else-if="type === 'bar'" :data="chartData" :options="chartOptions" :aria-label="ariaLabel || title" role="img" />
      <Doughnut v-else-if="type === 'doughnut'" :data="chartData" :options="doughnutOptions" :aria-label="ariaLabel || title" role="img" />
    </div>

    <!-- Accessible Data Table (visually hidden) -->
    <table v-if="hasData" class="sr-only" role="table" :aria-label="ariaLabel || title || 'Dados do gráfico'">
      <caption>{{ ariaLabel || title || 'Dados do gráfico' }}</caption>
      <thead>
        <tr>
          <th v-for="label in labels" :key="label" scope="col">{{ label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(dataset, di) in datasets" :key="di">
          <td v-for="(val, vi) in dataset.data" :key="vi">
            {{ dataset.label }}: {{ val }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import type { ChartDataset } from '~/types'
import { registerChartComponents, chartDarkOptions, DESIGN_SYSTEM_CHART_COLORS } from '~/utils/chart'

// Register Chart.js components at module load time so they're ready before first render
registerChartComponents()

interface Props {
  type: 'line' | 'bar' | 'doughnut'
  datasets: ChartDataset[]
  labels: string[]
  title?: string
  ariaLabel?: string
  loading?: boolean
  legend?: {
    position?: 'top' | 'bottom' | 'left' | 'right'
    display?: boolean
  }
  minHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'line',
  title: undefined,
  ariaLabel: undefined,
  loading: false,
  legend: () => ({ position: 'top', display: true }),
  minHeight: 250,
})

const hasData = computed(() => {
  return props.datasets.length > 0 && props.datasets.some(d => d.data.length > 0)
})

/** Apply default colors to datasets if not provided */
const processedDatasets = computed(() => {
  const colorKeys = Object.keys(DESIGN_SYSTEM_CHART_COLORS) as Array<keyof typeof DESIGN_SYSTEM_CHART_COLORS>
  return props.datasets.map((ds, i) => {
    const colorKey = colorKeys[i % colorKeys.length]
    const colors = DESIGN_SYSTEM_CHART_COLORS[colorKey]

    if (props.type === 'doughnut') {
      return {
        ...ds,
        backgroundColor: ds.backgroundColor || colors.border,
        borderColor: ds.borderColor || colors.border,
      }
    }

    return {
      ...ds,
      borderColor: ds.borderColor || colors.border,
      backgroundColor: ds.backgroundColor || colors.background,
      fill: props.type === 'line',
      tension: props.type === 'line' ? 0.3 : undefined,
      pointBackgroundColor: colors.border,
      pointBorderColor: '#1e293b',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }
  })
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: processedDatasets.value,
}))

/** Base dark options with configurable legend */
const chartOptions = computed(() => {
  const base = JSON.parse(JSON.stringify(chartDarkOptions)) // deep clone

  if (props.legend?.display === false) {
    base.plugins.legend.display = false
  } else if (props.legend?.position) {
    base.plugins.legend.position = props.legend.position
  }

  // Hide y-axis grid for cleaner look
  if (props.type === 'line' || props.type === 'bar') {
    base.scales.y.grid.color = 'rgba(51, 65, 85, 0.5)'
  }

  return base
})

/** Doughnut has different scale requirements */
const doughnutOptions = computed(() => {
  const base = JSON.parse(JSON.stringify(chartDarkOptions))

  // Remove scales for doughnut (it doesn't use x/y scales)
  delete base.scales

  if (props.legend?.display === false) {
    base.plugins.legend.display = false
  } else if (props.legend?.position) {
    base.plugins.legend.position = props.legend.position
  }

  return base
})
</script>
