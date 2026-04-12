/**
 * Testes manuais da Tarefa 1.0 — ExerciseCardCompact
 *
 * Como Vitest não está instalado no projeto, estes testes devem ser
 * verificados manualmente no navegador ou adicionados ao suite de testes futuro.
 *
 * Para cada teste: abrir a página no navegador, inspecionar o DOM e confirmar.
 */

import type { Exercise } from '~/types'

// ============================================================
// Mock Data para Testes
// ============================================================

const mockExerciseEasy: Exercise = {
  id: 'test-1',
  name: 'Bicep Curl',
  name_pt: 'Rosca Direta',
  description: 'Bicep curl exercise',
  description_pt: 'Exercício de rosca direta',
  instructions: ['Stand with dumbbells', 'Curl up'],
  instructions_pt: ['Fique em pé com halteres', 'Faça a rosca'],
  difficulty: 'easy',
  primary_muscles: ['muscle-biceps'],
  secondary_muscles: [],
  equipment_id: 'equip-dumbbell',
  is_compound: false,
  is_cardio: false,
  created_at: '2024-01-01T00:00:00Z',
}

const mockExerciseHard: Exercise = {
  id: 'test-2',
  name: 'Deadlift',
  name_pt: 'Levantamento Terra com Barra Pesada e Técnica Avançada',
  description: 'Deadlift',
  description_pt: 'Levantamento terra',
  instructions: ['Lift barbell'],
  instructions_pt: ['Levante a barra'],
  difficulty: 'hard',
  primary_muscles: ['muscle-back', 'muscle-legs'],
  secondary_muscles: ['muscle-core'],
  equipment_id: 'equip-barbell',
  is_compound: true,
  is_cardio: false,
  created_at: '2024-01-01T00:00:00Z',
}

// ============================================================
// ExerciseCardCompact — Testes Unitários Manuais
// ============================================================

/**
 * TESTE 1.1: Renderiza estrutura base do componente
 * Passos:
 *   1. Montar ExerciseCardCompact com mockExerciseEasy
 *   2. Inspecionar DOM
 * Esperado:
 *   - NuxtLink com href="/exercises/test-1"
 *   - Div com classes: flex, items-center, gap-3, p-3, h-24, card, card-hover
 *   - Thumbnail à esquerda (w-16 h-16 rounded-xl)
 *   - Conteúdo à direita (flex-1 min-w-0)
 */

/**
 * TESTE 1.2: Ícone de dificuldade exibe corretamente (fácil)
 * Passos:
 *   1. Montar com mockExerciseEasy (difficulty: 'easy')
 *   2. Inspecionar ícone
 * Esperado:
 *   - SparklesIcon visível
 *   - Classes de cor: bg-secondary-500/20 text-secondary-400 (verde)
 */

/**
 * TESTE 1.3: Ícone de dificuldade exibe corretamente (difícil)
 * Passos:
 *   1. Montar com mockExerciseHard (difficulty: 'hard')
 *   2. Inspecionar ícone
 * Esperado:
 *   - FireIcon visível
 *   - Classes de cor: bg-accent-500/20 text-accent-400 (vermelho)
 */

/**
 * TESTE 1.4: Nome do exercício truncado em 2 linhas
 * Passos:
 *   1. Montar com mockExerciseHard (nome longo)
 *   2. Inspecionar h3
 *   3. Verificar que texto não overflow
 * Esperado:
 *   - h3 com classe line-clamp-2
 *   - Texto truncado após 2 linhas com reticências
 *   - Sem overflow horizontal
 */

/**
 * TESTE 1.5: Badges renderizam corretamente
 * Passos:
 *   1. Montar com mockExerciseEasy + muscleGroupNames=['Bíceps']
 *   2. Inspecionar badges
 * Esperado:
 *   - UiBadge com variant="secondary" e texto "Fácil"
 *   - UiBadge com variant="default" outline e texto "Bíceps"
 */

/**
 * TESTE 1.6: Apenas 1 grupo muscular visível
 * Passos:
 *   1. Montar com muscleGroupNames=['Bíceps', 'Antebraço', 'Ombro']
 *   2. Contar badges de músculo
 * Esperado:
 *   - Apenas 1 badge de músculo visível ('Bíceps')
 */

/**
 * TESTE 1.7: Navegação ao clicar no card
 * Passos:
 *   1. Montar com mockExerciseEasy
 *   2. Clicar no card
 *   3. Verificar navegação
 * Esperado:
 *   - Navega para /exercises/test-1
 */

/**
 * TESTE 1.8: Hover funciona no desktop
 * Passos:
 *   1. Montar em viewport desktop (≥1024px)
 *   2. Passar mouse sobre card
 * Esperado:
 *   - Borda muda para primary-500/30
 *   - Sombra glow aparece
 *   - Card eleva levemente (-translate-y-1)
 */

/**
 * TESTE 1.9: Touch target mínimo de 44x44px
 * Passos:
 *   1. Montar em viewport mobile (375px)
 *   2. Medir dimensões do NuxtLink
 * Esperado:
 *   - Altura mínima de 96px (h-24 = 6rem = 96px)
 *   - Largura ocupa toda célula do grid
 */

/**
 * TESTE 1.10: aria-label correto para acessibilidade
 * Passos:
 *   1. Montar com mockExerciseEasy
 *   2. Inspecionar atributo aria-label do NuxtLink
 * Esperado:
 *   - aria-label="Ver detalhes de Rosca Direta"
 */

/**
 * TESTE 1.11: focus-visible mostra ring
 * Passos:
 *   1. Navegar com Tab até o card
 *   2. Verificar foco visível
 * Esperado:
 *   - Ring de 2px com cor primary-500
 *   - Ring offset de 2px com cor dark-900
 */

/**
 * TESTE 1.12: Renderiza corretamente em grid de 2 colunas
 * Passos:
 *   1. Montar 2 cards lado a lado em grid de 2 colunas (375px viewport)
 *   2. Verificar layout
 * Esperado:
 *   - Cada card ocupa 50% da largura menos gap
 *   - Cards alinhados horizontalmente
 *   - Sem overflow ou corte de conteúdo
 */

// ============================================================
// Instruções de Execução Manual
// ============================================================

/**
 * Para executar estes testes manualmente:
 *
 * 1. Criar um arquivo de teste temporário em pages/test-card.vue:
 *
 * ```vue
 * <template>
 *   <div class="p-4 space-y-4">
 *     <h2 class="text-xl font-bold">Teste ExerciseCardCompact</h2>
 *
 *     <div class="grid grid-cols-2 gap-2">
 *       <ExerciseCardCompact
 *         :exercise="mockExerciseEasy"
 *         :muscle-group-names="['Bíceps']"
 *       />
 *       <ExerciseCardCompact
 *         :exercise="mockExerciseHard"
 *         :muscle-group-names="['Costas', 'Pernas']"
 *       />
 *     </div>
 *   </div>
 * </template>
 *
 * <script setup lang="ts">
 * // Copiar mock data deste arquivo
 * </script>
 * ```
 *
 * 2. Acessar http://localhost:3000/test-card
 * 3. Redimensionar para 375px (mobile) e 1440px (desktop)
 * 4. Verificar cada teste acima inspecionando o DOM
 * 5. Remover arquivo de teste temporário após validação
 */

export { mockExerciseEasy, mockExerciseHard }
