import useRootStore from '@/stores'
import PlateMap from '@/config/PlateMap.json'
import { expect } from 'vitest'
import { successfulResponse, failedResponse } from '@tests/support/testHelper.js'
import DataTypeFactory from '@tests/factories/DataTypeFactory.js'

const dataTypeFactory = DataTypeFactory()

describe('index', () => {
  describe('state', () => {
    it('has api state', () => {
      const store = useRootStore()
      expect(store.api).toBeDefined()
    })

    it('has a plate map', () => {
      const store = useRootStore()
      expect(store.plateMap).toEqual(PlateMap)
    })
  })

  describe('actions', () => {
    describe('clearMessages', () => {
      it('clears all messages', () => {
        const store = useRootStore()
        store.messages = [
          { type: 'warning', message: 'foo' },
          { type: 'danger', message: 'bar' },
        ]
        store.clearMessages()
        expect(store.messages).toEqual({})
      })
    })

    describe('addMessage', () => {
      it('adds a message to the store', () => {
        const store = useRootStore()
        store.addMessage({
          type: 'warning',
          message: 'foo',
        })
        expect(Object.values(store.messages)).toEqual([{ type: 'warning', message: 'foo' }])
      })
    })

    describe('removeMessage', () => {
      it('removes a message from the store', () => {
        const store = useRootStore()
        store.messages = {
          1: { type: 'warning', message: 'foo' },
          2: { type: 'danger', message: 'bar' },
        }
        store.removeMessage(1)
        expect(store.messages).toEqual({
          2: { type: 'danger', message: 'bar' },
        })
      })
    })

    describe('fetchTagSets', () => {
      it('fetches pacbio tag sets by default', async () => {
        const store = useRootStore()
        store.api.traction.pacbio.tag_sets.get = vi
          .fn()
          .mockResolvedValue(
            successfulResponse({ data: [{ id: 1, attributes: { name: 'foo' }, type: 'tag_set' }] }),
          )
        await store.fetchTagSets()
        expect(store.tagSets).toEqual({ 1: { id: 1, name: 'foo', type: 'tag_set' } })
      })

      it('fetches ont tag sets when called with ont', async () => {
        const store = useRootStore()
        store.api.traction.ont.tag_sets.get = vi
          .fn()
          .mockResolvedValue(
            successfulResponse({ data: [{ id: 1, attributes: { name: 'foo' }, type: 'tag_set' }] }),
          )
        await store.fetchTagSets('ont')
        expect(store.tagSets).toEqual({ 1: { id: 1, name: 'foo', type: 'tag_set' } })
      })

      it('returns an error if an invalid pipeline is passed', async () => {
        const store = useRootStore()
        const result = await store.fetchTagSets('foo')
        expect(result).toEqual({
          success: false,
          errors: ['Tag sets cannot be retrieved for pipeline foo'],
        })
      })
    })

    describe('Data Types', () => {
      describe('fetchDataTypes', () => {
        it('fetches data types successfully', async () => {
          const store = useRootStore()
          store.api.traction.data_types.get = vi
            .fn()
            .mockResolvedValue(dataTypeFactory.responses.fetch)
          const { success } = await store.fetchDataTypes()
          expect(success).toBe(true)
          expect(store.dataTypes).toEqual(dataTypeFactory.storeData)
        })

        it('returns an error if the fetch is unsuccessful', async () => {
          const store = useRootStore()
          store.api.traction.data_types.get = vi.fn().mockResolvedValue(failedResponse())
          const { success } = await store.fetchDataTypes()
          expect(success).toBe(false)
        })
      })
    })
  })
})
