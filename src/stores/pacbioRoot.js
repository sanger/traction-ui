import { defineStore } from 'pinia'
import { handleResponse } from '@/api/v1/ResponseHelper.js'
import { dataToObjectById } from '@/api/JsonApi.js'
import useRootStore from '@/stores'

export const usePacbioRootStore = defineStore('pacbioRoot', {
  state: () => ({
    /**
     * @property {Object} tagSets - An object to store all tag-sets which are indexed by id
     */
    tagSets: {},
    /**
     * @property {Object} tags - An object to store all tags, each of which belongs to a tag set.
     */
    tags: {},
  }),

  getters: {
    /**
     * Returns a list of all fetched tagSet
     * @param {Object} state The Pinia state object
     */
    tagSetList: (state) => {
      return Object.values(state.tagSets)
    },
    /**
     * Returns a list of all fetched tagSet
     * @param {Object} state The Pinia state object
     */
    tagList: (state) => (ids) => {
      const tags = state.tags
      if (ids) {
        return ids.map((id) => tags[id])
      } else {
        return tags.values
      }
    },
    /**
     * Returns an array of tag choices for a given tag set ID.
     *
     * @function tagChoicesForId
     * @param {Object} state - The state object containing tagSets and tags.
     * @param {string} tagSetId - The ID of the tag set to get choices for.
     * @returns {Array<{value: string, text: string}>} - An array of tag choices, each represented as an object with a value and text property.
     */
    tagChoicesForId: (state) => (tagSetId) => {
      if (!tagSetId) return []
      const values =
        state.tagSets[tagSetId].tags
          .map((tagId) => state.tags[tagId])
          .map(({ id: value, group_id: text }) => ({ value, text })) || []
      return values
    },
    tagsetForTagId: (state) => (tagId) => {
      if (!tagId) return null
      return Object.values(state.tagSets).find((tagSet) => tagSet.tags.includes(String(tagId)))
    },
    /**
     * Returns an array of tag set choices from the state.
     *
     * @function tagSetChoices
     * @param {Object} state - The state object containing tagSets.
     * @returns {Array<{value: string, text: string}>} - An array of tag set choices, each represented as an object with a value and text property.
     */
    tagSetChoices: (state) => {
      return Object.values(state.tagSets).map(({ id, name }) => ({
        value: id,
        text: name,
      }))
    },
  },
  actions: {
    /**
     * Fetches Pacbio tag sets from the root store and formats them by ID.
     * @function fetchPacbioTagSets
     * @returns {Promise<{success: boolean, errors: Array, response: Object}>} - A promise that resolves to an object containing a success boolean, or an error string.
     * @throws {Error} - Throws an error if the request fails.
     */
    async fetchPacbioTagSets() {
      const rootStore = useRootStore()
      const promise = rootStore.api.traction.pacbio.tag_sets.get({ include: 'tags' })
      const response = await handleResponse(promise)
      const { success, data: { data, included = [] } = {}, errors = [] } = response
      if (success && data.length > 0) {
        this.tagSets = dataToObjectById({ data, includeRelationships: true })
        this.tags = dataToObjectById({ data: included })
      }
      return { success, errors, response }
    },
  },
})
