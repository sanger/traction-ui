import { describe, it, expect, vi } from 'vitest'
import { useLocationFetcher } from '@/composables/useLocationFetcher.js'
import { getLabwhereLocations } from '@/services/labwhere/client.js'
import { formatLocations } from '@/services/labwhere/helpers.js'

vi.mock('@/services/labwhere/client', () => ({
  getLabwhereLocations: vi.fn(),
}))

vi.mock('@/services/labwhere/helpers', () => ({
  formatLocations: vi.fn(),
}))

describe('useLocationFetcher', () => {
  const { fetchLocations } = useLocationFetcher()

  it('returns default locations if no barcodes are provided', async () => {
    const result = await fetchLocations([])
    expect(result).toEqual([])
  })

  it('returns formatted locations on successful fetch', async () => {
    const barcodes = ['barcode1', 'barcode2']
    const apiResponse = [
      { barcode: 'barcode1', name: 'Location 1' },
      { barcode: 'barcode2', name: 'Location 2' },
    ]
    const formattedLocations = [
      { barcode: 'barcode1', name: 'Location 1' },
      { barcode: 'barcode2', name: 'Location 2' },
    ]

    getLabwhereLocations.mockResolvedValue(apiResponse)
    formatLocations.mockResolvedValue(formattedLocations)

    const result = await fetchLocations(barcodes)
    expect(getLabwhereLocations).toHaveBeenCalledWith(barcodes)
    expect(formatLocations).toHaveBeenCalledWith(apiResponse)
    expect(result).toEqual(formattedLocations)
  })

  it('returns default locations on fetch error', async () => {
    const barcodes = ['barcode1', 'barcode2']
    const defaultLocations = [
      { barcode: 'barcode1', name: '-' },
      { barcode: 'barcode2', name: '-' },
    ]

    getLabwhereLocations.mockRejectedValue(new Error('Fetch error'))

    const result = await fetchLocations(barcodes)
    expect(result).toEqual(defaultLocations)
  })
})
