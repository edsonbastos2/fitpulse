import { describe, it, expect } from 'vitest'

describe('Vitest Configuration', () => {
  it('deve estar configurado corretamente', () => {
    // Testa que o Vitest está funcionando
    expect(typeof describe).toBe('function')
    expect(typeof it).toBe('function')
    expect(typeof expect).toBe('function')
  })

  it('deve suportar assertions básicas', () => {
    expect(true).toBe(true)
    expect(1 + 1).toBe(2)
    expect([1, 2, 3]).toContain(2)
  })
})
