import { createPinia, setActivePinia } from '@support/testHelper.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import { dataToObjectById } from '@/api/JsonApi.js'
import { beforeEach } from 'vitest'
import useRootStore from '@/stores'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'

const pacbioTagSetFactory = PacbioTagSetFactory()

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
        store.tagSets = pacbioTagSetFactory.storeData.tagSets
        expect(store.tagSetList).toEqual(Object.values(pacbioTagSetFactory.storeData.tagSets))
      })
    })

    describe('tagList', () => {
      it('returns a list of all fetched tagSet', () => {
        store.tags = pacbioTagSetFactory.storeData.tags
        expect(store.tagList()).toEqual(pacbioTagSetFactory.storeData.tags.values)
      })
      it('when ids are included', () => {
        store.tags = pacbioTagSetFactory.storeData.tags
        const ids = Object.keys(pacbioTagSetFactory.storeData.tags)
        expect(store.tagList(ids).length).toEqual(ids.length)
      })
    })
    it('returns tagSetChoicesArray and tagChoicesForId from state.tagSetChoices', async () => {
      store.$state = {
        tagSets: pacbioTagSetFactory.storeData.tagSets,
        tags: pacbioTagSetFactory.storeData.tags,
      }

      expect(store.tagSetChoices.length).toEqual(
        Object.values(pacbioTagSetFactory.storeData.tagSets).length,
      )
      expect(store.tagChoicesForId(pacbioTagSetFactory.storeData.selected.tagSet.id)).toHaveLength(
        pacbioTagSetFactory.storeData.selected.tagSet.tags.length,
      )
      expect(
        store
          .tagChoicesForId(pacbioTagSetFactory.storeData.selected.tagSet.id)
          .some(
            (tag) =>
              tag.text === pacbioTagSetFactory.storeData.selected.tag.group_id &&
              tag.value === pacbioTagSetFactory.storeData.selected.tag.id,
          ),
      ).toBe(true)
      expect(store.tagsetForTagId(pacbioTagSetFactory.storeData.selected.tag.id).name).toEqual(
        pacbioTagSetFactory.storeData.selected.tagSet.name,
      )
    })
  })
  describe('actions', () => {
    describe('fetchPacbioTagSets', () => {
      let rootStore, store
      const get = vi.fn()
      beforeEach(() => {
        rootStore = useRootStore()
        store = usePacbioRootStore()
        rootStore.api.v2.traction.pacbio.tag_sets = { get }
      })
      it('handles success', async () => {
        // mock dependencies
        get.mockResolvedValue(pacbioTagSetFactory.responses.fetch)
        // apply action
        const { success } = await store.fetchPacbioTagSets()
        // assert result
        const data = dataToObjectById({
          data: pacbioTagSetFactory.content.data,
          includeRelationships: true,
        })
        expect(store.tagSets).toEqual(data)
        expect(success).toEqual(true)
      })

      it('handles failure', async () => {
        // mock dependencies
        const get = vi.fn()
        rootStore.api.v2.traction.pacbio.tag_sets = { get }
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
