import { defineStore } from 'pinia'
import { handleResponse } from '@/api/ResponseHelper.js'
import useRootStore from '@/stores'
import { usePacbioPoolCreateStore } from './pacbioPoolCreate'
import {
  dataToObjectByPosition,
  extractAttributes,
  groupIncludedByResource,
} from '@/api/JsonApi.js'
import { parseMultiPoolFile } from '@/lib/csv/multiPool.js'
import { multiPoolPayload } from '@/stores/utilities/multiPool.js'
import { hasErrors } from '@/stores/utilities/pacbioPool.js'

export const useMultiPoolCreateStore = defineStore('multiPoolCreate', {
  state: () => ({
    multiPool: {
      pipeline: 'pacbio',
      pool_method: 'Plate',
    },
    multiPoolPositions: {},
  }),
  getters: {
    multiPoolPositionItems: (state) => {
      return Object.values(state.multiPoolPositions)
    },
  },
  actions: {
    /**
     * Fetches a multi pool by its id and populates the store state with the retrieved data.
     *
     * @param {*} multiPoolId the id of the multi pool to fetch
     * @returns {Promise<Object>} A promise that resolves to an object containing the success status and any errors.
     */
    async fetchMultiPool(multiPoolId) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.multi_pools
      const promise = request.find({
        id: multiPoolId,
        include: 'multi_pool_positions',
      })
      const response = await handleResponse(promise)
      const { success, body: { data, included = [] } = {}, errors = [] } = response

      if (success) {
        const { multi_pool_positions = [] } = groupIncludedByResource(included)

        //Populate multi pool attributes
        this.multiPool = extractAttributes(data)

        //Populate multi pool positions
        this.multiPoolPositions = dataToObjectByPosition({
          data: multi_pool_positions,
          includeRelationships: true,
        })
      }

      return { success, errors }
    },

    /**
     * Asynchronously creates a multi pool with the given pool positions and pools.
     *
     * @async
     * @returns {Promise<Object>} A promise that resolves to an object containing the success status, id, and any errors.
     *
     * @example
     * // Create a multi pool
     * const result = await createMultiPool();
     * console.log(result); // { success: true, id: '1', errors: [] }
     */
    async createMultiPool() {
      const { multiPool, multiPoolPositions } = this
      const rootStore = useRootStore()
      const request = rootStore.api.traction.multi_pools
      const promise = request.create({
        data: multiPoolPayload({ multiPool, multiPoolPositions }),
      })
      const { success, body: { data = {} } = {}, errors } = await handleResponse(promise)
      const { id = '' } = data
      return { success, id, errors }
    },

    /**
     * Sets the current multi pool. If it is a new multi pool it will be created.
     * If it is an existing multi pool it will be updated.
     * @param id The id of the multi pool. It will be new or existing
     * @returns { Object } { success, errors }.
     */
    async setMultiPool({ id }) {
      // If the multi pool data is already loaded, return success
      if (this.isValidPersisted(id)) {
        return { success: true }
      }

      // Initialize multiPool state defaults
      this.clearData()

      // If the id is not a number, it is a new multi pool
      if (isNaN(id)) {
        // if it is a new multi pool, return success
        return { success: true }
      }

      // if it is an existing multi pool, call the fetch multi pool action
      let { success, errors = [] } = await this.fetchMultiPool(id)
      // return the result from the fetchMultiPool
      return { success, errors }
    },

    /**
     * Populates the store state with the data from the provided multi pool csv file.
     * @param {*} file - The multi pool csv file
     */
    async parsePoolingCsvFile(file) {
      if (!file) {
        return { success: false, errors: 'file is required' }
      }
      try {
        let csv = await file.text()

        // Parse the multi pool file to extract the records and validate the necessary columns. If the file is not valid, return the errors.
        const { success, records, errors } = parseMultiPoolFile(csv)

        if (!success) {
          return { success, errors }
        }

        // Build the pool groups from the records based on the pool number
        const poolGroups = {}
        records.forEach(({ record }) => {
          poolGroups[record.pool_number] = poolGroups[record.pool_number] || []
          poolGroups[record.pool_number].push(record)
        })

        const pacbioPoolCreateStore = usePacbioPoolCreateStore()
        // Ensure we reset the pacbio pool create store state before building the pools in case there is any residual data from previous builds that could interfere with the new build process
        pacbioPoolCreateStore.$reset()
        // Transform the pool groups into the multi pool positions format
        for (const [poolNumber, records] of Object.entries(poolGroups)) {
          const { success: buildPoolSuccess, errors: buildPoolErrors } =
            await pacbioPoolCreateStore.buildPoolFromMultiPoolCsvRecords(records, poolNumber)
          if (!buildPoolSuccess) {
            // If there was an error building the pool, reset the multi pool positions to an empty object to avoid any partial data in the store and return the errors
            this.multiPoolPositions = {}
            // Reset the pacbio pool create store state to ensure it is cleared of any data from the failed build attempt
            pacbioPoolCreateStore.$reset()
            // Return the error message
            return {
              success: false,
              errors: [`Error building pool number ${poolNumber}: ${buildPoolErrors}`],
            }
          }

          // If the pool was successfully built, add it to the multi pool positions
          this.multiPoolPositions[poolNumber] = JSON.parse(
            JSON.stringify(pacbioPoolCreateStore.$state),
          )
          // Ensure we reset the pacbio pool create store state before building the next pool to avoid any data leakage between pools
          pacbioPoolCreateStore.$reset()
        }

        return { success, errors }
      } catch (error) {
        return { success: false, errors: [error.message] }
      }
    },

    /**
     * Get a pool by its position.
     * @param {String} position - The position of the pool.
     * @returns {Object} - The pool at the given position.
     */
    getPool(position) {
      const pool = this.multiPoolPositions[position]
      // Return a deep copy of the pool to prevent direct mutations to the store state
      // We use the JSON parse/stringify trick for deep copying as the pool has nested objects
      return pool ? JSON.parse(JSON.stringify(pool)) : null
    },

    // Reset the store data
    clearData() {
      this.$reset()
    },

    // Check if multi pool data is already loaded
    isValidPersisted(id) {
      // Check the store exists in storage
      const persisted = localStorage.getItem('multiPoolCreate')

      // Logic to check if the persisted store should be used
      if (persisted) {
        const parsed = JSON.parse(persisted)
        const parsedId = parsed.multiPool?.id

        // If it doesn't have an id it must be a new multi pool, so we can consider it valid
        if (!parsedId && isNaN(id)) {
          return true
        }

        // If the id matches the requested id, we can consider it valid
        if (id === parsedId) {
          return true
        }
      }

      return false
    },

    async updateMultiPoolPosition({ position, subPool }) {
      this.multiPoolPositions[position] = subPool
    },

    /**
     *
     * @param {*} position of the pool to be validated
     * @returns {Boolean} true if the pool is valid, false otherwise
     */
    isValidPool(position) {
      const poolPosition = this.getPool(position)
      // If there is no pool at the position, we consider it valid as there is no data to invalidate it
      if (!poolPosition) {
        return false
      }

      // We currently only support PacBio
      // But due to different architectures, ONT and PacBio pool validation is different
      if (this.multiPool.pipeline === 'pacbio') {
        const { used_aliquots, pool } = poolPosition
        return !hasErrors({ used_aliquots, pool })
      }
    },

    /**
     * Validates the entire multi pool by checking each pool position.
     *
     * Uses isValidPool on every position in multiPoolPositions.
     * Returns true only if all positions are valid and there is at least one position.
     * Returns false if there are no positions or any position is invalid.
     *
     * @returns {Boolean} true if all pool positions are valid, false otherwise
     */
    isValidMultiPool() {
      // Check if every pool position is valid using isValidPool
      const positions = Object.keys(this.multiPoolPositions)
      if (positions.length === 0) {
        // No positions to validate, consider as invalid
        return false
      }
      return positions.every((position) => this.isValidPool(position))
    },
  },
  persist: true,
})
