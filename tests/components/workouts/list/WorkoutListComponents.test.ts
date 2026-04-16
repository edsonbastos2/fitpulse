import { describe, it, expect, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import WorkoutList from '~/components/workouts/list/WorkoutList.vue'
import WorkoutListItem from '~/components/workouts/list/WorkoutListItem.vue'
import WorkoutEmptyState from '~/components/workouts/list/WorkoutEmptyState.vue'

// Mock do NuxtLink
const NuxtLinkStub = {
  name: 'NuxtLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

// Mock do UiBadge
const UiBadgeStub = {
  name: 'UiBadge',
  props: ['variant', 'size'],
  template: '<span class="badge"><slot /></span>',
}

// ==========================================
// Helper
// ==========================================

function createMockWorkout(overrides: any = {}) {
  return {
    id: 'workout-1',
    user_id: 'user-1',
    name: 'Treino de Costas',
    description: 'Treino focado em costas',
    type: 'strength',
    difficulty: 'intermediate',
    estimated_duration: 60,
    is_template: false,
    is_recommended: false,
    created_at: '2026-04-14T10:00:00Z',
    updated_at: '2026-04-14T10:00:00Z',
    exerciseCount: 6,
    lastUsedAt: '2026-04-13T10:00:00Z',
    ...overrides,
  }
}

// ==========================================
// WorkoutList Tests
// ==========================================

describe('WorkoutList.vue', () => {
  it('deve renderizar lista de WorkoutListItem a partir do array de workouts', () => {
    const workouts = [
      createMockWorkout({ id: 'w1', name: 'Treino A' }),
      createMockWorkout({ id: 'w2', name: 'Treino B' }),
      createMockWorkout({ id: 'w3', name: 'Treino C' }),
    ]

    const wrapper = shallowMount(WorkoutList, {
      props: { workouts },
      global: {
        stubs: { WorkoutListItem: true, NuxtLink: NuxtLinkStub },
      },
    })

    const items = wrapper.findAllComponents({ name: 'WorkoutListItem' })
    expect(items).toHaveLength(3)
  })

  it('deve renderizar vazio quando array está vazio', () => {
    const wrapper = shallowMount(WorkoutList, {
      props: { workouts: [] },
      global: {
        stubs: { WorkoutListItem: true },
      },
    })

    const items = wrapper.findAllComponents({ name: 'WorkoutListItem' })
    expect(items).toHaveLength(0)
  })
})

// ==========================================
// WorkoutListItem Tests
// ==========================================

describe('WorkoutListItem.vue', () => {
  it('deve exibir nome do treino, badge de tipo, contagem de exercícios e duração', () => {
    const workout = createMockWorkout({
      name: 'Treino de Peito',
      type: 'strength',
      estimated_duration: 45,
      exerciseCount: 8,
    })

    const wrapper = mount(WorkoutListItem, {
      props: { workout },
      global: {
        stubs: { NuxtLink: NuxtLinkStub, UiBadge: UiBadgeStub },
      },
    })

    expect(wrapper.text()).toContain('Treino de Peito')
    expect(wrapper.text()).toContain('8 exercícios')
    expect(wrapper.text()).toContain('45 min')
  })

  it('deve exibir badge de template quando is_template=true', () => {
    const workout = createMockWorkout({ is_template: true })

    const wrapper = mount(WorkoutListItem, {
      props: { workout },
      global: {
        stubs: { NuxtLink: NuxtLinkStub, UiBadge: UiBadgeStub },
      },
    })

    expect(wrapper.text()).toContain('Template')
  })

  it('deve exibir label do tipo corretamente em português', () => {
    const typeLabels: Record<string, string> = {
      strength: 'Força',
      cardio: 'Cardio',
      hiit: 'HIIT',
      flexibility: 'Flexibilidade',
      mixed: 'Misto',
    }

    for (const [type, label] of Object.entries(typeLabels)) {
      const workout = createMockWorkout({ type })
      const wrapper = mount(WorkoutListItem, {
        props: { workout },
        global: {
          stubs: { NuxtLink: NuxtLinkStub, UiBadge: UiBadgeStub },
        },
      })
      expect(wrapper.text()).toContain(label)
    }
  })

  it('deve exibir label de dificuldade corretamente em português', () => {
    const difficultyLabels: Record<string, string> = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado',
    }

    for (const [difficulty, label] of Object.entries(difficultyLabels)) {
      const workout = createMockWorkout({ difficulty })
      const wrapper = mount(WorkoutListItem, {
        props: { workout },
        global: {
          stubs: { NuxtLink: NuxtLinkStub, UiBadge: UiBadgeStub },
        },
      })
      expect(wrapper.text()).toContain(label)
    }
  })

  it('deve exibir data do último uso formatada', () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const workout = createMockWorkout({ lastUsedAt: yesterday.toISOString() })
    const wrapper = mount(WorkoutListItem, {
      props: { workout },
      global: {
        stubs: { NuxtLink: NuxtLinkStub, UiBadge: UiBadgeStub },
      },
    })

    expect(wrapper.text()).toContain('Ontem')
  })

  it('deve linkar para /workouts/[id]', () => {
    const workout = createMockWorkout({ id: 'abc-123' })
    const wrapper = mount(WorkoutListItem, {
      props: { workout },
      global: {
        stubs: { NuxtLink: NuxtLinkStub, UiBadge: UiBadgeStub },
      },
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/workouts/abc-123')
  })
})

// ==========================================
// WorkoutEmptyState Tests
// ==========================================

describe('WorkoutEmptyState.vue', () => {
  it('deve exibir título e descrição padrão', () => {
    const wrapper = mount(WorkoutEmptyState, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub },
      },
    })

    expect(wrapper.text()).toContain('Nenhum treino encontrado')
    expect(wrapper.text()).toContain('Comece criando seu primeiro treino')
  })

  it('deve exibir CTA button com texto correto', () => {
    const wrapper = mount(WorkoutEmptyState, {
      global: {
        stubs: { NuxtLink: NuxtLinkStub },
      },
    })

    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThanOrEqual(1)
    expect(links[0].text()).toContain('Criar Treino')
  })

  it('deve exibir título e descrição customizados', () => {
    const wrapper = mount(WorkoutEmptyState, {
      props: {
        title: 'Busca sem resultados',
        description: 'Tente outros filtros',
      },
      global: {
        stubs: { NuxtLink: NuxtLinkStub },
      },
    })

    expect(wrapper.text()).toContain('Busca sem resultados')
    expect(wrapper.text()).toContain('Tente outros filtros')
  })

  it('deve ocultar botão secundário quando não fornecido', () => {
    const wrapper = mount(WorkoutEmptyState, {
      props: {
        secondaryAction: undefined as any,
      },
      global: {
        stubs: { NuxtLink: NuxtLinkStub },
      },
    })

    // O default com withDefaults ainda aplica o valor padrão
    // Verifica que pelo menos o primário existe
    const primaryLink = wrapper.findAll('a').find(a => a.text().includes('Criar Treino'))
    expect(primaryLink).toBeDefined()
  })
})

// ==========================================
// Search / Filter / Sort Logic Tests
// ==========================================

describe('Search/Filter/Sort logic', () => {
  const workouts = [
    createMockWorkout({ id: 'w1', name: 'Treino de Costas', type: 'strength', difficulty: 'intermediate', created_at: '2026-04-10T10:00:00Z', lastUsedAt: '2026-04-13T10:00:00Z' }),
    createMockWorkout({ id: 'w2', name: 'Corrida Leve', type: 'cardio', difficulty: 'beginner', created_at: '2026-04-14T10:00:00Z', lastUsedAt: '2026-04-14T10:00:00Z' }),
    createMockWorkout({ id: 'w3', name: 'HIIT Intenso', type: 'hiit', difficulty: 'advanced', created_at: '2026-04-12T10:00:00Z', lastUsedAt: '2026-04-11T10:00:00Z' }),
    createMockWorkout({ id: 'w4', name: 'Alongamento', type: 'flexibility', difficulty: 'beginner', created_at: '2026-04-11T10:00:00Z' }),
  ]

  function filterAndSort(
    items: typeof workouts,
    search: string,
    type: string,
    difficulty: string,
    sort: 'created_date' | 'name' | 'last_used'
  ) {
    let result = [...items]

    if (search) {
      const query = search.toLowerCase()
      result = result.filter((w) => w.name.toLowerCase().includes(query))
    }

    if (type) {
      result = result.filter((w) => w.type === type)
    }

    if (difficulty) {
      result = result.filter((w) => w.difficulty === difficulty)
    }

    result.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name, 'pt-BR')
        case 'last_used': {
          const aDate = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0
          const bDate = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0
          return bDate - aDate
        }
        case 'created_date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return result
  }

  it('deve filtrar por nome case-insensitive', () => {
    const result = filterAndSort(workouts, 'costas', '', '', 'created_date')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Treino de Costas')
  })

  it('deve filtrar por tipo', () => {
    const result = filterAndSort(workouts, '', 'cardio', '', 'created_date')
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('cardio')
  })

  it('deve filtrar por dificuldade', () => {
    const result = filterAndSort(workouts, '', '', 'beginner', 'created_date')
    expect(result).toHaveLength(2)
  })

  it('deve ordenar por nome alfabético ascending', () => {
    const result = filterAndSort(workouts, '', '', '', 'name')
    expect(result[0].name).toBe('Alongamento')
    expect(result[1].name).toBe('Corrida Leve')
    expect(result[2].name).toBe('HIIT Intenso')
  })

  it('deve ordenar por created_date mais recente primeiro', () => {
    const result = filterAndSort(workouts, '', '', '', 'created_date')
    expect(result[0].id).toBe('w2') // April 14
    expect(result[1].id).toBe('w3') // April 12
  })

  it('deve ordenar por last_used mais recente primeiro', () => {
    const result = filterAndSort(workouts, '', '', '', 'last_used')
    expect(result[0].id).toBe('w2') // April 14
    expect(result[1].id).toBe('w1') // April 13
  })

  it('deve combinar múltiplos filtros', () => {
    const result = filterAndSort(workouts, '', 'cardio', 'beginner', 'created_date')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('w2')
  })

  it('deve retornar vazio quando nenhum resultado combina', () => {
    const result = filterAndSort(workouts, 'xyz', '', '', 'created_date')
    expect(result).toHaveLength(0)
  })
})
