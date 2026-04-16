/**
 * Workout Templates - Templates pré-definidos em pt-BR
 *
 * Contém 3 templates de treino:
 * 1. Full Body (3x/semana) - Ideal para iniciantes
 * 2. Push/Pull/Legs (6x/semana) - Para intermediários/avançados
 * 3. Upper/Lower (4x/semana) - Para intermediários
 *
 * NOTA: Os exercise_id são placeholders que devem ser substituídos
 * pelos IDs reais da tabela exercises do Supabase durante o seeding.
 */

export interface TemplateExercise {
  exercise_id: string // ID placeholder - substituir pelo ID real do Supabase
  exercise_name: string
  sets: number
  reps: number | string // string para ranges como "8-12"
  rest_seconds: number
  notes?: string
}

export interface WorkoutTemplate {
  id: string
  name: string
  description_pt: string
  type: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'mixed'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  frequency_per_week: number
  estimated_duration: number // minutos
  muscle_groups: string[]
  exercises: TemplateExercise[]
}

// ==========================================
// Template 1: Full Body (3x/semana)
// ==========================================

export const fullBodyTemplate: WorkoutTemplate = {
  id: 'template_full_body_3x',
  name: 'Full Body - Corpo Inteiro',
  description_pt:
    'Treino completo para todo o corpo, ideal para iniciantes ou quem tem menos tempo. Realize 3 vezes por semana com pelo menos 1 dia de descanso entre as sessões.',
  type: 'strength',
  difficulty: 'beginner',
  frequency_per_week: 3,
  estimated_duration: 45,
  muscle_groups: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core'],
  exercises: [
    {
      exercise_id: 'exercise_squat',
      exercise_name: 'Agachamento Livre',
      sets: 3,
      reps: 12,
      rest_seconds: 90,
      notes: 'Mantenha os joelhos alinhados com os pés',
    },
    {
      exercise_id: 'exercise_bench_press',
      exercise_name: 'Supino Reto',
      sets: 3,
      reps: 10,
      rest_seconds: 90,
    },
    {
      exercise_id: 'exercise_deadlift',
      exercise_name: 'Levantamento Terra',
      sets: 3,
      reps: 10,
      rest_seconds: 120,
      notes: 'Mantenha a coluna neutra',
    },
    {
      exercise_id: 'exercise_overhead_press',
      exercise_name: 'Desenvolvimento Militar',
      sets: 3,
      reps: 10,
      rest_seconds: 90,
    },
    {
      exercise_id: 'exercise_barbell_row',
      exercise_name: 'Remada Curvada',
      sets: 3,
      reps: 10,
      rest_seconds: 90,
    },
    {
      exercise_id: 'exercise_plank',
      exercise_name: 'Prancha Isométrica',
      sets: 3,
      reps: '30-60s',
      rest_seconds: 60,
      notes: 'Mantenha o core ativado',
    },
    {
      exercise_id: 'exercise_bicep_curl',
      exercise_name: 'Rosca Direta',
      sets: 2,
      reps: 12,
      rest_seconds: 60,
    },
    {
      exercise_id: 'exercise_tricep_extension',
      exercise_name: 'Tríceps Corda',
      sets: 2,
      reps: 12,
      rest_seconds: 60,
    },
  ],
}

// ==========================================
// Template 2: Push/Pull/Legs (6x/semana)
// ==========================================

export const pushPullLegsTemplate: WorkoutTemplate = {
  id: 'template_ppl_6x',
  name: 'Push/Pull/Legs - Empurrar/Puxar/Pernas',
  description_pt:
    'Divisão clássica para hipertrofia. 6 dias por semana: Push (peito, ombros, tríceps), Pull (costas, bíceps, trapézio), Legs (quadríceps, posterior, glúteos, panturrilha).',
  type: 'strength',
  difficulty: 'advanced',
  frequency_per_week: 6,
  estimated_duration: 60,
  muscle_groups: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps', 'Glúteos'],
  exercises: [
    // --- PUSH DAY ---
    {
      exercise_id: 'exercise_incline_bench',
      exercise_name: 'Supino Inclinado com Halteres',
      sets: 4,
      reps: '8-10',
      rest_seconds: 90,
      notes: 'Dia Push',
    },
    {
      exercise_id: 'exercise_flat_bench',
      exercise_name: 'Supino Reto com Barra',
      sets: 4,
      reps: '8-10',
      rest_seconds: 90,
      notes: 'Dia Push',
    },
    {
      exercise_id: 'exercise_lateral_raise',
      exercise_name: 'Elevação Lateral',
      sets: 3,
      reps: 12,
      rest_seconds: 60,
      notes: 'Dia Push',
    },
    {
      exercise_id: 'exercise_cable_fly',
      exercise_name: 'Crossover na Polia',
      sets: 3,
      reps: 12,
      rest_seconds: 60,
      notes: 'Dia Push',
    },
    {
      exercise_id: 'exercise_skull_crusher',
      exercise_name: 'Tríceps Testa',
      sets: 3,
      reps: 10,
      rest_seconds: 60,
      notes: 'Dia Push',
    },

    // --- PULL DAY ---
    {
      exercise_id: 'exercise_pull_up',
      exercise_name: 'Barra Fixa',
      sets: 4,
      reps: '8-10',
      rest_seconds: 90,
      notes: 'Dia Pull',
    },
    {
      exercise_id: 'exercise_seated_row',
      exercise_name: 'Remada Sentada',
      sets: 4,
      reps: 10,
      rest_seconds: 90,
      notes: 'Dia Pull',
    },
    {
      exercise_id: 'exercise_lat_pulldown',
      exercise_name: 'Puxada Frontal',
      sets: 3,
      reps: 10,
      rest_seconds: 90,
      notes: 'Dia Pull',
    },
    {
      exercise_id: 'exercise_face_pull',
      exercise_name: 'Face Pull',
      sets: 3,
      reps: 12,
      rest_seconds: 60,
      notes: 'Dia Pull',
    },
    {
      exercise_id: 'exercise_barbell_curl',
      exercise_name: 'Rosca com Barra',
      sets: 3,
      reps: 10,
      rest_seconds: 60,
      notes: 'Dia Pull',
    },

    // --- LEGS DAY ---
    {
      exercise_id: 'exercise_back_squat',
      exercise_name: 'Agachamento Livre',
      sets: 4,
      reps: '8-10',
      rest_seconds: 120,
      notes: 'Dia Legs',
    },
    {
      exercise_id: 'exercise_leg_press',
      exercise_name: 'Leg Press 45°',
      sets: 4,
      reps: 10,
      rest_seconds: 90,
      notes: 'Dia Legs',
    },
    {
      exercise_id: 'exercise_romanian_deadlift',
      exercise_name: 'Stiff (Levantamento Terra Romeno)',
      sets: 3,
      reps: 10,
      rest_seconds: 90,
      notes: 'Dia Legs',
    },
    {
      exercise_id: 'exercise_leg_curl',
      exercise_name: 'Mesa Flexora',
      sets: 3,
      reps: 12,
      rest_seconds: 60,
      notes: 'Dia Legs',
    },
    {
      exercise_id: 'exercise_leg_extension',
      exercise_name: 'Cadeira Extensora',
      sets: 3,
      reps: 12,
      rest_seconds: 60,
      notes: 'Dia Legs',
    },
    {
      exercise_id: 'exercise_calf_raise',
      exercise_name: 'Panturrilha em Pé',
      sets: 4,
      reps: 15,
      rest_seconds: 45,
      notes: 'Dia Legs',
    },
  ],
}

// ==========================================
// Template 3: Upper/Lower (4x/semana)
// ==========================================

export const upperLowerTemplate: WorkoutTemplate = {
  id: 'template_upper_lower_4x',
  name: 'Upper/Lower - Superior/Inferior',
  description_pt:
    'Divisão equilibrada para ganho de força e hipertrofia. 4 dias por semana: Upper A, Lower A, descanso, Upper B, Lower B, descanso.',
  type: 'strength',
  difficulty: 'intermediate',
  frequency_per_week: 4,
  estimated_duration: 55,
  muscle_groups: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Glúteos'],
  exercises: [
    // --- UPPER A ---
    {
      exercise_id: 'exercise_bench_press_ul',
      exercise_name: 'Supino Reto com Barra',
      sets: 4,
      reps: 8,
      rest_seconds: 120,
      notes: 'Upper A',
    },
    {
      exercise_id: 'exercise_barbell_row_ul',
      exercise_name: 'Remada Curvada',
      sets: 4,
      reps: 8,
      rest_seconds: 90,
      notes: 'Upper A',
    },
    {
      exercise_id: 'exercise_ohp_ul',
      exercise_name: 'Desenvolvimento com Barra',
      sets: 3,
      reps: 10,
      rest_seconds: 90,
      notes: 'Upper A',
    },
    {
      exercise_id: 'exercise_pull_up_ul',
      exercise_name: 'Barra Fixa ou Graviton',
      sets: 3,
      reps: '8-10',
      rest_seconds: 90,
      notes: 'Upper A',
    },
    {
      exercise_id: 'exercise_dumbbell_curl_ul',
      exercise_name: 'Rosca Alternada',
      sets: 3,
      reps: 10,
      rest_seconds: 60,
      notes: 'Upper A',
    },
    {
      exercise_id: 'exercise_dips_ul',
      exercise_name: 'Mergulho em Paralelas',
      sets: 3,
      reps: '8-12',
      rest_seconds: 60,
      notes: 'Upper A',
    },

    // --- LOWER A ---
    {
      exercise_id: 'exercise_squat_ul',
      exercise_name: 'Agachamento Livre',
      sets: 4,
      reps: 8,
      rest_seconds: 120,
      notes: 'Lower A',
    },
    {
      exercise_id: 'exercise_deadlift_ul',
      exercise_name: 'Levantamento Terra',
      sets: 3,
      reps: 6,
      rest_seconds: 120,
      notes: 'Lower A',
    },
    {
      exercise_id: 'exercise_leg_press_ul',
      exercise_name: 'Leg Press',
      sets: 3,
      reps: 10,
      rest_seconds: 90,
      notes: 'Lower A',
    },
    {
      exercise_id: 'exercise_leg_curl_ul',
      exercise_name: 'Cadeira Flexora',
      sets: 3,
      reps: 12,
      rest_seconds: 60,
      notes: 'Lower A',
    },
    {
      exercise_id: 'exercise_calf_raise_ul',
      exercise_name: 'Panturrilha Sentado',
      sets: 3,
      reps: 15,
      rest_seconds: 45,
      notes: 'Lower A',
    },

    // --- UPPER B ---
    {
      exercise_id: 'exercise_incline_db_ul',
      exercise_name: 'Supino Inclinado com Halteres',
      sets: 4,
      reps: '8-10',
      rest_seconds: 90,
      notes: 'Upper B',
    },
    {
      exercise_id: 'exercise_lat_pulldown_ul',
      exercise_name: 'Puxada Frontal',
      sets: 4,
      reps: 10,
      rest_seconds: 90,
      notes: 'Upper B',
    },
    {
      exercise_id: 'exercise_lateral_raise_ul',
      exercise_name: 'Elevação Lateral',
      sets: 3,
      reps: 12,
      rest_seconds: 60,
      notes: 'Upper B',
    },
    {
      exercise_id: 'exercise_cable_row_ul',
      exercise_name: 'Remada Baixa',
      sets: 3,
      reps: 10,
      rest_seconds: 60,
      notes: 'Upper B',
    },
    {
      exercise_id: 'exercise_tricep_pushdown_ul',
      exercise_name: 'Tríceps Polia',
      sets: 3,
      reps: 12,
      rest_seconds: 60,
      notes: 'Upper B',
    },
    {
      exercise_id: 'exercise_hammer_curl_ul',
      exercise_name: 'Rosca Martelo',
      sets: 3,
      reps: 10,
      rest_seconds: 60,
      notes: 'Upper B',
    },

    // --- LOWER B ---
    {
      exercise_id: 'exercise_front_squat_ul',
      exercise_name: 'Agachamento Frontal',
      sets: 4,
      reps: 8,
      rest_seconds: 120,
      notes: 'Lower B',
    },
    {
      exercise_id: 'exercise_rdl_ul',
      exercise_name: 'Stiff (Terra Romeno)',
      sets: 4,
      reps: 8,
      rest_seconds: 90,
      notes: 'Lower B',
    },
    {
      exercise_id: 'exercise_bulgarian_split_ul',
      exercise_name: 'Agachamento Búlgaro',
      sets: 3,
      reps: 10,
      rest_seconds: 60,
      notes: 'Lower B (cada perna)',
    },
    {
      exercise_id: 'exercise_leg_extension_ul',
      exercise_name: 'Cadeira Extensora',
      sets: 3,
      reps: 12,
      rest_seconds: 60,
      notes: 'Lower B',
    },
    {
      exercise_id: 'exercise_seated_calf_ul',
      exercise_name: 'Panturrilha no Smith',
      sets: 4,
      reps: 12,
      rest_seconds: 45,
      notes: 'Lower B',
    },
  ],
}

// ==========================================
// Exportação de todos os templates
// ==========================================

export const allWorkoutTemplates: WorkoutTemplate[] = [
  fullBodyTemplate,
  pushPullLegsTemplate,
  upperLowerTemplate,
]

// ==========================================
// Função de validação
// ==========================================

export interface TemplateValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Valida a estrutura de um template de treino
 */
export function validateTemplate(template: WorkoutTemplate): TemplateValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validação de campos obrigatórios
  if (!template.id) errors.push('ID é obrigatório')
  if (!template.name) errors.push('Nome é obrigatório')
  if (!template.description_pt) errors.push('Descrição em português é obrigatória')
  if (!template.type) errors.push('Tipo é obrigatório')
  if (!template.difficulty) errors.push('Dificuldade é obrigatória')
  if (!template.frequency_per_week || template.frequency_per_week <= 0) {
    errors.push('Frequência semanal deve ser maior que zero')
  }
  if (!template.estimated_duration || template.estimated_duration <= 0) {
    errors.push('Duração estimada deve ser maior que zero')
  }
  if (!template.muscle_groups || template.muscle_groups.length === 0) {
    warnings.push('Template não possui grupos musculares definidos')
  }

  // Validação de exercícios
  if (!template.exercises || template.exercises.length === 0) {
    errors.push('Template deve ter pelo menos 1 exercício')
  } else {
    template.exercises.forEach((ex, index) => {
      if (!ex.exercise_id) {
        errors.push(`Exercício ${index + 1}: ID é obrigatório`)
      }
      if (!ex.exercise_name) {
        errors.push(`Exercício ${index + 1}: Nome é obrigatório`)
      }
      if (!ex.sets || ex.sets <= 0) {
        errors.push(`Exercício ${index + 1}: Número de séries deve ser maior que zero`)
      }
      if (!ex.reps) {
        warnings.push(`Exercício ${index + 1}: Repetições não definidas`)
      }
      if (!ex.rest_seconds || ex.rest_seconds <= 0) {
        warnings.push(`Exercício ${index + 1}: Descanso não definido`)
      }
    })
  }

  // Warn se frequência alta para iniciantes
  if (template.difficulty === 'beginner' && template.frequency_per_week > 4) {
    warnings.push(
      `Frequência de ${template.frequency_per_week}x/semana pode ser alta para iniciantes`
    )
  }

  // Warn se duração muito longa
  if (template.estimated_duration > 90) {
    warnings.push(
      `Duração de ${template.estimated_duration}min pode ser excessiva para um único treino`
    )
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
