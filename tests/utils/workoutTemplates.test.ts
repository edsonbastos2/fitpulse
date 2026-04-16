import { describe, it, expect } from 'vitest'
import type { WorkoutTemplate } from '../../utils/workoutTemplates'
import {
  fullBodyTemplate,
  pushPullLegsTemplate,
  upperLowerTemplate,
  allWorkoutTemplates,
  validateTemplate,
} from '../../utils/workoutTemplates'

// ==========================================
// Template Structure Tests
// ==========================================

describe('Workout Templates - Estrutura', () => {
  it('deve exportar 3 templates no array allWorkoutTemplates', () => {
    expect(allWorkoutTemplates).toHaveLength(3)
  })

  it('fullBodyTemplate deve ter estrutura válida', () => {
    expect(fullBodyTemplate).toBeDefined()
    expect(fullBodyTemplate.id).toBe('template_full_body_3x')
    expect(fullBodyTemplate.name).toContain('Full Body')
    expect(fullBodyTemplate.description_pt).toBeTruthy()
    expect(fullBodyTemplate.type).toBe('strength')
    expect(fullBodyTemplate.difficulty).toBe('beginner')
    expect(fullBodyTemplate.frequency_per_week).toBe(3)
    expect(fullBodyTemplate.exercises.length).toBeGreaterThan(0)
  })

  it('pushPullLegsTemplate deve ter estrutura válida', () => {
    expect(pushPullLegsTemplate).toBeDefined()
    expect(pushPullLegsTemplate.id).toBe('template_ppl_6x')
    expect(pushPullLegsTemplate.name).toContain('Push/Pull/Legs')
    expect(pushPullLegsTemplate.description_pt).toBeTruthy()
    expect(pushPullLegsTemplate.type).toBe('strength')
    expect(pushPullLegsTemplate.difficulty).toBe('advanced')
    expect(pushPullLegsTemplate.frequency_per_week).toBe(6)
    expect(pushPullLegsTemplate.exercises.length).toBeGreaterThan(0)
  })

  it('upperLowerTemplate deve ter estrutura válida', () => {
    expect(upperLowerTemplate).toBeDefined()
    expect(upperLowerTemplate.id).toBe('template_upper_lower_4x')
    expect(upperLowerTemplate.name).toContain('Upper/Lower')
    expect(upperLowerTemplate.description_pt).toBeTruthy()
    expect(upperLowerTemplate.type).toBe('strength')
    expect(upperLowerTemplate.difficulty).toBe('intermediate')
    expect(upperLowerTemplate.frequency_per_week).toBe(4)
    expect(upperLowerTemplate.exercises.length).toBeGreaterThan(0)
  })
})

// ==========================================
// Content Validation Tests (pt-BR)
// ==========================================

describe('Workout Templates - Conteúdo pt-BR', () => {
  it('todos os templates devem ter description_pt em português', () => {
    allWorkoutTemplates.forEach((template) => {
      expect(template.description_pt).toBeTruthy()
      expect(template.description_pt.length).toBeGreaterThan(20)
    })
  })

  it('todos os templates devem ter nomes em português ou reconhecíveis', () => {
    allWorkoutTemplates.forEach((template) => {
      expect(template.name.length).toBeGreaterThan(3)
    })
  })

  it('todos os exercícios devem ter nomes em português ou reconhecíveis', () => {
    allWorkoutTemplates.forEach((template) => {
      template.exercises.forEach((exercise) => {
        expect(exercise.exercise_name).toBeTruthy()
        expect(exercise.exercise_name.length).toBeGreaterThan(2)
      })
    })
  })

  it('fullBody deve ter grupos musculares abrangentes', () => {
    const groups = fullBodyTemplate.muscle_groups
    expect(groups).toContain('Peito')
    expect(groups).toContain('Costas')
    expect(groups).toContain('Pernas')
    expect(groups).toContain('Ombros')
  })

  it('PPL deve ter grupos musculares específicos', () => {
    const groups = pushPullLegsTemplate.muscle_groups
    expect(groups).toContain('Peito')
    expect(groups).toContain('Costas')
    expect(groups).toContain('Pernas')
    expect(groups).toContain('Bíceps')
    expect(groups).toContain('Tríceps')
  })
})

// ==========================================
// Template Exercises Validation
// ==========================================

describe('Workout Templates - Exercícios', () => {
  it('cada exercício deve ter ID válido', () => {
    allWorkoutTemplates.forEach((template) => {
      template.exercises.forEach((exercise) => {
        expect(exercise.exercise_id).toBeTruthy()
        expect(exercise.exercise_id).toMatch(/^exercise_/)
      })
    })
  })

  it('cada exercício deve ter sets > 0', () => {
    allWorkoutTemplates.forEach((template) => {
      template.exercises.forEach((exercise) => {
        expect(exercise.sets).toBeGreaterThan(0)
      })
    })
  })

  it('cada exercício deve ter reps definidas (número ou string)', () => {
    allWorkoutTemplates.forEach((template) => {
      template.exercises.forEach((exercise) => {
        expect(exercise.reps).toBeDefined()
        expect(
          typeof exercise.reps === 'number' || typeof exercise.reps === 'string'
        ).toBe(true)
      })
    })
  })

  it('cada exercício deve ter rest_seconds > 0', () => {
    allWorkoutTemplates.forEach((template) => {
      template.exercises.forEach((exercise) => {
        expect(exercise.rest_seconds).toBeGreaterThan(0)
      })
    })
  })

  it('fullBody deve ter pelo menos 6 exercícios', () => {
    expect(fullBodyTemplate.exercises.length).toBeGreaterThanOrEqual(6)
  })

  it('PPL deve ter pelo menos 12 exercícios (divididos entre push/pull/legs)', () => {
    expect(pushPullLegsTemplate.exercises.length).toBeGreaterThanOrEqual(12)
  })

  it('Upper/Lower deve ter pelo menos 15 exercícios (divididos entre upper/lower)', () => {
    expect(upperLowerTemplate.exercises.length).toBeGreaterThanOrEqual(15)
  })
})

// ==========================================
// validateTemplate Function Tests
// ==========================================

describe('validateTemplate', () => {
  it('deve validar template fullBody como válido', () => {
    const result = validateTemplate(fullBodyTemplate)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('deve validar template PPL como válido', () => {
    const result = validateTemplate(pushPullLegsTemplate)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('deve validar template Upper/Lower como válido', () => {
    const result = validateTemplate(upperLowerTemplate)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('deve retornar erro quando ID está faltando', () => {
    const invalidTemplate = {
      ...fullBodyTemplate,
      id: '',
    }
    const result = validateTemplate(invalidTemplate as unknown as WorkoutTemplate)
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('ID'))).toBe(true)
  })

  it('deve retornar erro quando nome está faltando', () => {
    const invalidTemplate = {
      ...fullBodyTemplate,
      name: '',
    }
    const result = validateTemplate(invalidTemplate as unknown as WorkoutTemplate)
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('Nome'))).toBe(true)
  })

  it('deve retornar erro quando description_pt está faltando', () => {
    const invalidTemplate = {
      ...fullBodyTemplate,
      description_pt: '',
    }
    const result = validateTemplate(invalidTemplate as unknown as WorkoutTemplate)
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('Descrição'))).toBe(true)
  })

  it('deve retornar erro quando não há exercícios', () => {
    const invalidTemplate = {
      ...fullBodyTemplate,
      exercises: [],
    }
    const result = validateTemplate(invalidTemplate as unknown as WorkoutTemplate)
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('exercício'))).toBe(true)
  })

  it('deve retornar erro quando exercício não tem ID', () => {
    const invalidTemplate = {
      ...fullBodyTemplate,
      exercises: [
        {
          exercise_id: '',
          exercise_name: 'Teste',
          sets: 3,
          reps: 10,
          rest_seconds: 60,
        },
      ],
    }
    const result = validateTemplate(invalidTemplate as unknown as WorkoutTemplate)
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('ID'))).toBe(true)
  })

  it('deve retornar warning quando frequência alta para iniciantes', () => {
    const beginnerHighFreq: WorkoutTemplate = {
      ...fullBodyTemplate,
      difficulty: 'beginner',
      frequency_per_week: 6,
    }
    const result = validateTemplate(beginnerHighFreq)
    expect(result.warnings.some((w) => w.includes('alta para iniciantes'))).toBe(true)
  })

  it('deve retornar warning quando duração > 90min', () => {
    const longTemplate: WorkoutTemplate = {
      ...fullBodyTemplate,
      estimated_duration: 120,
    }
    const result = validateTemplate(longTemplate)
    expect(result.warnings.some((w) => w.includes('excessiva'))).toBe(true)
  })

  it('deve retornar warning quando exercício não tem reps', () => {
    const invalidTemplate = {
      ...fullBodyTemplate,
      exercises: [
        {
          exercise_id: 'exercise_test',
          exercise_name: 'Teste',
          sets: 3,
          reps: 0,
          rest_seconds: 60,
        },
      ],
    }
    const result = validateTemplate(invalidTemplate as unknown as WorkoutTemplate)
    expect(result.warnings.some((w) => w.includes('Repetições'))).toBe(true)
  })
})

// ==========================================
// Integration Test
// ==========================================

describe('Workout Templates - Integração', () => {
  it('todos os templates devem passar na validação sem erros', () => {
    allWorkoutTemplates.forEach((template) => {
      const result = validateTemplate(template)
      expect(result.valid).toBe(true)
    })
  })

  it('todos os templates devem ter IDs únicos', () => {
    const ids = allWorkoutTemplates.map((t) => t.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('todos os templates devem ter pelo menos um grupo muscular', () => {
    allWorkoutTemplates.forEach((template) => {
      expect(template.muscle_groups.length).toBeGreaterThan(0)
    })
  })
})
