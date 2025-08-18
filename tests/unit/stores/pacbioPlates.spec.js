import { failedResponse } from '@support/testHelper.js'
import { usePacbioPlatesStore } from '@/stores/pacbioPlates.js'
import { describe, expect } from 'vitest'
import useRootStore from '@/stores'
import PacbioPlateFactory from '@tests/factories/PacbioPlateFactory.js'

const pacbioPlateFactory = PacbioPlateFactory()
const pacbioPlateFactorySingle = PacbioPlateFactory({ count: 1 })

describe('pacbioPlates', () => {
  let get, rootStore, store

  beforeEach(() => {
    rootStore = useRootStore()
    store = usePacbioPlatesStore()
    get = vi.fn()
  })

  describe('actions', () => {
    describe('fetchPlates', () => {
      it('handles success and adds plates to the store', async () => {
        get.mockResolvedValue(pacbioPlateFactory.responses.fetch)
        rootStore.api = { traction: { pacbio: { plates: { get } } } }

        const { success } = await store.fetchPlates()

        expect(success).toBeTruthy()
        expect(store.plates).toEqual(pacbioPlateFactory.storeData.resources.plates)
      })

      it('handles errors fetching the plates', async () => {
        get.mockResolvedValue(failedResponse())
        rootStore.api = { traction: { pacbio: { plates: { get } } } }

        const { success } = await store.fetchPlates()
        expect(store.plates).toEqual({})
        expect(success).toBeFalsy()
      })
    })

    describe('findPlate', () => {
      it('handles success', async () => {
        get.mockResolvedValue(pacbioPlateFactorySingle.responses.fetch)
        rootStore.api = { traction: { pacbio: { plates: { get } } } }

        const plate = await store.findPlate({
          barcode: pacbioPlateFactorySingle.storeData.plate.barcode,
        })

        expect(plate).toEqual(pacbioPlateFactorySingle.storeData.plate)
      })

      it('handles errors', async () => {
        get.mockResolvedValue(failedResponse())
        rootStore.api = { traction: { pacbio: { plates: { get } } } }

        const plate = await store.findPlate({
          barcode: pacbioPlateFactorySingle.storeData.plate.barcode,
        })

        expect(plate).toEqual({})
      })
    })

    describe('getters', () => {
      it('plates', () => {
        const store = usePacbioPlatesStore()
        store.plates = pacbioPlateFactory.storeData.resources.plates
        expect(store.getPlates).toEqual(
          Object.values(pacbioPlateFactory.storeData.resources.plates),
        )
      })
    })
  })
})
