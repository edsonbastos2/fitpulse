import { describe, it, expect } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, getActivePinia } from 'pinia'

describe('Pinia Setup', () => {
  it('deve criar uma instância do Pinia', () => {
    const pinia = createTestingPinia()
    setActivePinia(pinia)
    
    expect(getActivePinia()).toBeDefined()
    expect(pinia).toBeDefined()
  })

  it('deve criar um store de teste vazio', () => {
    const pinia = createTestingPinia()
    setActivePinia(pinia)
    
    // Verifica que o Pinia foi configurado corretamente
    expect(pinia.state.value).toEqual({})
  })
})
