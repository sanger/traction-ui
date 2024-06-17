import { Data, createPinia, setActivePinia } from '@support/testHelper.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import { dataToObjectById } from '@/api/JsonApi.js'
import { beforeEach } from 'vitest'
import useRootStore from '@/stores'

const tagSets = {
  1: {
    id: '1',
    name: 'tagSet1',
    pipeline: 'pipeline1',
    tags: [],
  },
  2: {
    id: '2',
    name: 'tagSet2',
    pipeline: 'pipeline1',
    tags: [],
  },
}

describe('usePacbioRootStore', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })
  describe('getters', () => {
    let store
    beforeEach(() => {
      store = usePacbioRootStore()
    })
    describe('tagSetList', () => {
      it('returns a list of all fetched tagSet', () => {
        store.tagSets = tagSets
        expect(store.tagSetList).toEqual(Object.values(tagSets))
      })
    })

    describe('tagList', () => {
      const tags = {
        1: { id: '1', name: 'tag1' },
        2: { id: '2', name: 'tag2' },
        3: { id: '3', name: 'tag3' },
        4: { id: '4', name: 'tag4' },
        5: { id: '5', name: 'tag5' },
      }
      it('returns a list of all fetched tagSet', () => {
        store.tags = tags
        expect(store.tagList()).toEqual(tags.values)
      })
      it('when ids are included', () => {
        store.tags = tags
        const ids = ['1', '2', '3']
        expect(store.tagList(ids).length).toEqual(ids.length)
      })
    })
    it('returns tagSetChoicesArray and tagChoicesForId from state.tagSetChoices', async () => {
      const data = dataToObjectById({
        data: Data.TractionPacbioTagSets.data.data,
        includeRelationships: true,
      })
      store.$state = {
        tagSets: { ...data },
        tags: { ...dataToObjectById({ data: Data.TractionPacbioTagSets.data.included }) },
      }
      const expectedTagSetChoices = [
        {
          text: 'Sequel_16_barcodes_v3',
          value: '3',
        },
        {
          text: 'IsoSeq_v1',
          value: '4',
        },
      ]
      expect(store.tagSetChoices).toEqual(Object.values(expectedTagSetChoices))
      expect(store.tagChoicesForId('3')).toHaveLength(16)
      expect(
        store
          .tagChoicesForId('3')
          .some((tag) => tag.text === 'bc1001_BAK8A_OA' && tag.value === '113'),
      ).toBe(true)
      expect(store.tagsetForTagId('113').name).toEqual('Sequel_16_barcodes_v3')
    })
  })
  describe('actions', () => {
    describe('fetchPacbioTagSets', () => {
      let rootStore, store
      const get = vi.fn()
      beforeEach(() => {
        rootStore = useRootStore()
        store = usePacbioRootStore()
        rootStore.api.v1.traction.pacbio.tag_sets = { get }
      })
      it('handles success', async () => {
        // mock dependencies
        get.mockResolvedValue(Data.TractionPacbioTagSets)
        // apply action
        const { success } = await store.fetchPacbioTagSets()
        // assert result
        const data = dataToObjectById({
          data: Data.TractionPacbioTagSets.data.data,
          includeRelationships: true,
        })
        expect(store.tagSets).toEqual(data)
        expect(success).toEqual(true)
      })

      it('handles failure', async () => {
        // mock dependencies
        const get = vi.fn()
        rootStore.api.v1.traction.pacbio.tag_sets = { get }
        get.mockRejectedValue({
          data: { data: [] },
          status: 500,
          statusText: 'Internal Server Error',
        })
        // apply action
        const { success } = await store.fetchPacbioTagSets()
        expect(store.tagSets).toEqual({})
        expect(store.tags).toEqual({})
        expect(success).toEqual(false)
      })
    })
  })
})
