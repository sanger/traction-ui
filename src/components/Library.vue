<template>
  <div class="library">
     <b-form-input id="barcode" v-model="libraryBarcode" type="text" placeholder="barcode" @change="updateLibrary" />
  </div>
</template>

<script>

import Api from '@/mixins/Api'
import * as Run from '@/api/Run'

export default {
  name: 'Library',
  mixins: [Api],
  props: {
    id: {
      type: [Number, String]
    },
    barcode: {
      type: [Number, String]
    },
    runId: {
      type: [Number, String]
    },
    flowcellPosition: {
      type: [Number, String]
    }
  },
  data () {
    return {
      libraryBarcode: this.barcode,
      libraryId: this.id,
      message: ''
    }
  },
  methods: {
    async updateLibrary () {
      if(!this.libraryBarcode) return

      let material = await Run.getLibrary(this.libraryBarcode, this.tractionSaphyrTubeRequest)

      if (material !== undefined) {
        this.libraryId = material.id
        let run = this.$store.getters.run(this.runId)
        let updatedRun = Run.updateFlowcell(run, this.flowcellPosition, this.libraryId)
        this.$store.commit('addRun', updatedRun)
        if (this.existingRecord) {
          this.$emit('updateLibrary', material)
        }
      } else {
        this.libraryId = undefined
      }
    },
    alert (message) {
      this.$emit('alert', message)
    }
  },
  computed: {
    tractionSaphyrTubeRequest () {
      return this.api.traction.saphyr.tubes
    },
    existingRecord () {
      return !isNaN(this.runId)
    }
  }
}
</script>
