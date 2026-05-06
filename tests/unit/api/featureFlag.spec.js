import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkFeatureFlag } from '@/api/featureFlag.js'
vi.unmock('@/api/featureFlag.js')
import useRootStore from '@/stores'

describe('checkFeatureFlag', () => {
  let rootStore, mockGet

  beforeEach(() => {
    rootStore = useRootStore()

    mockGet = vi.fn()
    rootStore.api = { traction: { feature_flags: { get: mockGet } } }
  })

  it('should return true when feature flag is enabled', async () => {
    mockGet.mockResolvedValue({
      ok: true,
      json: async () => ({ features: { testFlag: { enabled: true } } }),
    })

    const result = await checkFeatureFlag('testFlag')
    expect(result).toBe(true)
  })

  it('should return false when feature flag is disabled', async () => {
    mockGet.mockResolvedValue({
      ok: true,
      json: async () => ({ features: { testFlag: { enabled: false } } }),
    })

    const result = await checkFeatureFlag('testFlag')
    expect(result).toBe(false)
  })

  it('should return false when flag does not exist', async () => {
    mockGet.mockResolvedValue({
      ok: true,
      json: async () => ({ features: {} }),
    })

    const result = await checkFeatureFlag('nonExistentFlag')
    expect(result).toBe(false)
  })

  it('should return false when the request fails', async () => {
    mockGet.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    })

    const result = await checkFeatureFlag('testFlag')
    expect(result).toBe(false)
  })
})
