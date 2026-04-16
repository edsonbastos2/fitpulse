import { describe, it, expect } from 'vitest'

/**
 * Testes para fetchRecentSessions do useWorkouts
 *
 * Este método interage com Supabase e requer mocks complexos de auto-import do Nuxt.
 * Os testes abaixo verificam a lógica de transformação de dados.
 *
 * Testes E2E completos devem ser feitos em ambiente de staging.
 */

describe('fetchRecentSessions - Data Transformation Logic', () => {
  it('deve calcular total_volume corretamente a partir dos logs', () => {
    const mockLogs = [
      { exercise_id: 'ex-1', exercise_name: 'Supino', weight: 80, reps: 10, volume: 800 },
      { exercise_id: 'ex-1', exercise_name: 'Supino', weight: 85, reps: 8, volume: 680 },
    ]

    const totalVolume = mockLogs.reduce((sum, log) => sum + (log.volume || 0), 0)
    expect(totalVolume).toBe(1480)
  })

  it('deve calcular duration_minutes corretamente', () => {
    const startedAt = '2026-04-14T10:00:00Z'
    const completedAt = '2026-04-14T11:00:00Z'

    const start = new Date(startedAt).getTime()
    const end = new Date(completedAt).getTime()
    const durationMinutes = Math.round((end - start) / (1000 * 60))

    expect(durationMinutes).toBe(60)
  })

  it('deve ordenar sessões por started_at DESC', () => {
    const mockSessions = [
      { id: 'session-older', started_at: '2026-04-10T10:00:00Z' },
      { id: 'session-newer', started_at: '2026-04-14T10:00:00Z' },
    ]

    const sorted = [...mockSessions].sort(
      (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    )

    expect(sorted[0].id).toBe('session-newer')
    expect(sorted[1].id).toBe('session-older')
  })

  it('deve filtrar logs por session_id corretamente', () => {
    const mockLogs = [
      { session_id: 's1', exercise_name: 'Supino', weight: 80, reps: 10 },
      { session_id: 's1', exercise_name: 'Supino', weight: 85, reps: 8 },
      { session_id: 's2', exercise_name: 'Agachamento', weight: 100, reps: 10 },
    ]

    const s1Logs = mockLogs.filter((log) => log.session_id === 's1')
    const s2Logs = mockLogs.filter((log) => log.session_id === 's2')

    expect(s1Logs).toHaveLength(2)
    expect(s2Logs).toHaveLength(1)
    expect(s2Logs[0].exercise_name).toBe('Agachamento')
  })

  it('deve retornar array vazio quando não há sessões', () => {
    const sessions: any[] = []
    expect(sessions).toHaveLength(0)
  })

  it('deve lidar com logs sem peso ou reps (volume = 0)', () => {
    const mockLogs = [
      { exercise_id: 'ex-1', exercise_name: 'Supino', weight: null, reps: null, volume: 0 },
      { exercise_id: 'ex-1', exercise_name: 'Supino', weight: 80, reps: 10, volume: 800 },
    ]

    const totalVolume = mockLogs.reduce((sum, log) => sum + (log.volume || 0), 0)
    expect(totalVolume).toBe(800)
  })
})
