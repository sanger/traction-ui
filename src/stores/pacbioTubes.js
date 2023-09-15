import { defineStore } from 'pinia'
import handlePromise from '@/api/PromiseHelper'
import store from '@/store'

export const usePacbioTubesStore = defineStore('pacbioTubes', {
  state: () => {
    return {
      tractionTubes: [],
    }
  },
  getters: {
    //Pinia_migration_todo: This is migrated from the VueX store, but it needs to be changed to  Pinia store once the VueX store is removed
    tubeRequest: () => store.state.api.traction.pacbio.tubes,
    //Pinia_migration_todo: This is migrated from the VueX store, but it needs to be changed to  Pinia store once the VueX store is removed
    requestsRequest: () => store.state.traction.pacbio.requests,
  },

  actions: {
    async isLibraryBarcodeValid(barcode) {
      if (!barcode) {
        return false
      }
      const libraryTube = await this.getTubeForBarcode(barcode)
      return this.validateLibraryTube(libraryTube)
    },
    async getTubeForBarcode(barcode) {
      const request = this.tubeRequest
      const promise = request.get({ filter: { barcode: barcode }, include: 'pools' })
      const response = await handlePromise(promise)
      if (response.successful && !response.empty) {
        return response.deserialize.tubes[0]
      }
    },
    validForRunCreation(pool) {
      return (
        pool.volume &&
        pool.concentration &&
        pool.template_prep_kit_box_barcode &&
        pool.insert_size &&
        true
      )
    },
    validateLibraryTube({ pools = [] } = {}) {
      if (pools.length < 1) {
        return false
      }
      return pools.every(this.validForRunCreation)
    },
  },
})
