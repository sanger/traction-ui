<template>
  <div class="library">
     <b-form-input id="barcode" v-model="libraryBarcode" type="text" placeholder="barcode" @change="updateLibrary" />
  </div>
</template>

<script>

import Api from '@/mixins/Api'
import getTubesForBarcodes from '@/api/TubeRequests'

export default {
  name: 'Library',
  mixins: [Api],
  props: {
    id: {
      type: [Number, String]
    },
    barcode: {
      type: [Number, String]
    }
  },
  data () {
    return {
      libraryBarcode: this.barcode,
      message: ''
    }
  },
  methods: {
    async updateLibrary () {
      if(!this.libraryBarcode) return

      let response = await getTubesForBarcodes(this.libraryBarcode, this.tractionTubeRequest)

      if (response.successful && !response.empty) {
        let material = response.deserialize.tubes[0].material
        if (material.type === 'libraries') {
          this.$emit('updateLibrary', material)
        } else {
          this.alert('This is not a library')
        }
      } else {
        this.alert('There was an error')
      }
    },
    alert (message) {
      this.$emit('alert', message)
    }
  },
  computed: {
    tractionTubeRequest () {
      return this.api.traction.tubes
    }
  }
}
</script>
