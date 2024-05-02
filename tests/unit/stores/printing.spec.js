import { createPinia, setActivePinia } from '@support/testHelper.js'
import { usePrintingStore } from '@/stores/printing.js'
import { beforeEach, describe } from 'vitest'

describe('usePrintingStore', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should create the store', () => {
    const store = usePrintingStore()
    expect(store.printers).toEqual([])
  })
})
