<template>
  <div class="space-y-12 animate-fade-in">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-display font-bold text-white">UI Components Demo</h1>
      <p class="text-slate-400 mt-2">Módulo 2 — Design System & UI Components. Todos os componentes renderizados juntos para validação.</p>
    </div>

    <!-- Buttons -->
    <section>
      <h2 class="text-xl font-display font-bold text-white mb-4">Botões</h2>
      <div class="flex flex-wrap gap-3 items-center">
        <UiButton variant="primary">Primary</UiButton>
        <UiButton variant="secondary">Secondary</UiButton>
        <UiButton variant="ghost">Ghost</UiButton>
        <UiButton variant="danger">Danger</UiButton>
        <UiButton variant="success">Success</UiButton>
        <UiButton variant="primary" loading>Loading</UiButton>
        <UiButton variant="primary" disabled>Disabled</UiButton>
        <UiIconButton ariaLabel="Adicionar" variant="primary">
          <PlusIcon class="w-4 h-4" />
        </UiIconButton>
        <UiIconButton ariaLabel="Configurações" variant="ghost">
          <Cog6ToothIcon class="w-4 h-4" />
        </UiIconButton>
      </div>
    </section>

    <!-- Inputs -->
    <section>
      <h2 class="text-xl font-display font-bold text-white mb-4">Inputs</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <UiInput v-model="demoInput" label="Texto" placeholder="Digite algo" hint="Helper text" />
        <UiInput v-model="demoEmail" label="Email" type="email" placeholder="email@exemplo.com" />
        <UiInput v-model="demoError" label="Com erro" error="Campo obrigatório" />
        <UiSelect v-model="demoSelect" label="Select" :options="selectOptions" placeholder="Selecione" />
        <UiToggle v-model="demoToggle" label="Notificações ativadas" hint="Receber alertas por email" />
        <UiDatePicker v-model="demoDate" label="Data" placeholder="Selecione uma data" />
        <UiRangeSlider v-model="demoRange" :min="0" :max="100" :step="5" label="Intensidade" />
        <UiRangeSlider v-model="demoRangeDual" :min="0" :max="100" :step="5" label="Intervalo" :range="true" />
      </div>
    </section>

    <!-- Cards -->
    <section>
      <h2 class="text-xl font-display font-bold text-white mb-4">Cards</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <!-- StatCards -->
        <StatCard value="1.250" label="Calorias queimadas" icon="fire" color="accent" :trend="{ direction: 'up', value: 12, label: 'vs semana passada' }" />
        <StatCard value="7" label="Dias em sequência" icon="trophy" color="secondary" :trend="{ direction: 'up', value: 3 }" />
        <StatCard value="48" label="Treinos concluídos" icon="chart" color="primary" :trend="{ direction: 'neutral' }" />
      </div>
    </section>

    <!-- Specialized Cards -->
    <section>
      <h2 class="text-xl font-display font-bold text-white mb-4">Cards Especializados</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <ExerciseCard name="Supino Reto" muscle-group="Peito" equipment="Barra" difficulty="hard" />
        <ExerciseCard name="Agachamento Livre" muscle-group="Quadríceps" equipment="Barra" difficulty="medium" />
        <ExerciseCard name="Elevação Lateral" muscle-group="Ombros" equipment="Halteres" difficulty="easy" />
        <WorkoutCard title="Treino de Costas" description="Foco em hipertrofia" :exercise-count="8" :estimated-duration="60" status="planned" :progress="35" />
        <WorkoutCard title="Treino de Pernas" :exercise-count="10" :estimated-duration="75" status="completed" :progress="100" />
      </div>
    </section>

    <!-- Chart -->
    <section>
      <h2 class="text-xl font-display font-bold text-white mb-4">Gráficos</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <UiCard title="Progresso Semanal" padding="md">
          <UiChart type="line" :datasets="lineDatasets" :labels="chartLabels" />
        </UiCard>
        <UiCard title="Volume por Grupo Muscular" padding="md">
          <UiChart type="bar" :datasets="barDatasets" :labels="chartLabels" />
        </UiCard>
        <UiCard title="Distribuição de Treinos" padding="md">
          <UiChart type="doughnut" :datasets="doughnutDatasets" :labels="doughnutLabels" />
        </UiCard>
      </div>
    </section>

    <!-- Modal Demo -->
    <section>
      <h2 class="text-xl font-display font-bold text-white mb-4">Modal</h2>
      <UiButton variant="primary" @click="showModal = true">Abrir Modal</UiButton>
      <UiModal v-model="showModal" title="Modal de Teste" subtitle="Verificando abertura e fechamento">
        <p class="text-slate-300">Este é um modal existente. Pressione Escape ou clique fora para fechar.</p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UiButton variant="ghost" @click="showModal = false">Cancelar</UiButton>
            <UiButton variant="primary" @click="showModal = false">Confirmar</UiButton>
          </div>
        </template>
      </UiModal>
    </section>

    <!-- Badge -->
    <section>
      <h2 class="text-xl font-display font-bold text-white mb-4">Badges</h2>
      <div class="flex flex-wrap gap-2">
        <UiBadge variant="primary">Primary</UiBadge>
        <UiBadge variant="secondary">Secondary</UiBadge>
        <UiBadge variant="success">Success</UiBadge>
        <UiBadge variant="warning">Warning</UiBadge>
        <UiBadge variant="danger">Danger</UiBadge>
        <UiBadge variant="gradient">Gradient</UiBadge>
      </div>
    </section>

    <!-- Accessibility Checklist -->
    <section>
      <h2 class="text-xl font-display font-bold text-white mb-4">Checklist de Acessibilidade</h2>
      <UiCard padding="md">
        <ul class="space-y-2 text-sm text-slate-300">
          <li class="flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4 text-secondary-400" />
            Focus ring visível em todos elementos interativos (UiButton, UiInput, UiSelect, UiToggle, UiRangeSlider)
          </li>
          <li class="flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4 text-secondary-400" />
            role="alert" em mensagens de erro (UiInput, UiSelect, UiRangeSlider)
          </li>
          <li class="flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4 text-secondary-400" />
            aria-invalid em inputs com erro
          </li>
          <li class="flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4 text-secondary-400" />
            aria-label obrigatório em UiIconButton
          </li>
          <li class="flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4 text-secondary-400" />
            role="switch" + aria-checked em UiToggle
          </li>
          <li class="flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4 text-secondary-400" />
            role="listbox" + role="option" em UiSelect
          </li>
          <li class="flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4 text-secondary-400" />
            aria-current="page" em links de navegação ativos
          </li>
          <li class="flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4 text-secondary-400" />
            Tabela de dados oculta (sr-only) em UiChart para screen readers
          </li>
          <li class="flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4 text-secondary-400" />
            Contraste WCAG AA: branco/dark-900 = 16.5:1, slate-400/dark-900 = 7.3:1
          </li>
          <li class="flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4 text-secondary-400" />
            Keyboard: Tab navega, Enter/Espaço ativa, Escape fecha, Arrow keys em Select
          </li>
        </ul>
      </UiCard>
    </section>

    <!-- Gaps Documentados -->
    <section>
      <h2 class="text-xl font-display font-bold text-white mb-4">Gaps Documentados (Issues Futuras)</h2>
      <UiCard padding="md">
        <ul class="space-y-2 text-sm text-slate-300">
          <li class="flex items-start gap-2">
            <ExclamationTriangleIcon class="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <span>Tests unitários com Vitest — framework não instalado no projeto atual</span>
          </li>
          <li class="flex items-start gap-2">
            <ExclamationTriangleIcon class="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <span>Testes E2E com Playwright — pendente de configuração</span>
          </li>
          <li class="flex items-start gap-2">
            <ExclamationTriangleIcon class="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <span>UiRangeSlider keyboard em dual mode — depende de drag nativo do browser (acessibilidade parcial)</span>
          </li>
          <li class="flex items-start gap-2">
            <ExclamationTriangleIcon class="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <span>Documentação Storybook/Docs — fora de escopo, módulo futuro de DX</span>
          </li>
          <li class="flex items-start gap-2">
            <ExclamationTriangleIcon class="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <span>Internacionalização (i18n) — textos em português, módulo futuro</span>
          </li>
        </ul>
      </UiCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, Cog6ToothIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import type { ChartDataset } from '~/types'

definePageMeta({
  layout: 'authenticated',
})

// Form state
const demoInput = ref('')
const demoEmail = ref('')
const demoError = ref('com erro')
const demoSelect = ref('')
const demoToggle = ref(true)
const demoDate = ref('')
const demoRange = ref(50)
const demoRangeDual = ref<[number, number]>([20, 80])
const showModal = ref(false)

const selectOptions = [
  { label: 'Hipertrofia', value: 'hypertrophy', group: 'Objetivo' },
  { label: 'Força', value: 'strength', group: 'Objetivo' },
  { label: 'Resistência', value: 'endurance', group: 'Objetivo' },
  { label: 'Peito', value: 'chest', group: 'Grupo Muscular' },
  { label: 'Costas', value: 'back', group: 'Grupo Muscular' },
  { label: 'Pernas', value: 'legs', group: 'Grupo Muscular' },
]

// Chart data
const chartLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const lineDatasets: ChartDataset[] = [
  { label: 'Volume (kg)', data: [1200, 1800, 1500, 2200, 1900, 800, 400] },
]
const barDatasets: ChartDataset[] = [
  { label: 'Séries', data: [24, 20, 16, 12, 8] },
]
const doughnutLabels = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços']
const doughnutDatasets: ChartDataset[] = [
  { label: 'Treinos', data: [25, 20, 30, 15, 10] },
]
</script>
