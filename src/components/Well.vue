<template>
    <div>
     Position: {{ this.position }}
      <b-form>
        <b-form-group
          id="libraryBarcode"
          label-cols-sm="4"
          label-cols-lg="3"
          label="Barcode:"
          label-for="libraryBarcode"
          >
          <b-form-input ref="libraryBarcode" id="libraryBarcode" v-model="libraryBarcode" :value="libraryBarcode" @change="setBarcode"></b-form-input>
        </b-form-group>

        <b-form-group
          id="movieTime"
          label-cols-sm="4"
          label-cols-lg="3"
          label="Movie Time:"
          label-for="movieTime"
          >
          <b-form-select ref="movieTime" id="movieTime" v-model="movieTime" :options="movieTimeOptions"></b-form-select>
        </b-form-group>
        
        <b-form-group
          id="onPlateLoadingConc"
          label-cols-sm="4"
          label-cols-lg="3"
          label="Concentration:"
          description="On Plate Loading Concentration (mP)"
          label-for="onPlateLoadingConc"
          >
          <b-form-input ref="onPlateLoadingConc" id="onPlateLoadingConc" v-model="onPlateLoadingConc"></b-form-input>
        </b-form-group>

        <b-form-group
          id="insertSize"
          label-cols-sm="4"
          label-cols-lg="3"
          label="Insert Size:"
          label-for="insertSize"
          >
          <b-form-input ref="insertSize" id="insertSize" v-model="insertSize"></b-form-input>
        </b-form-group>
      </b-form>

      <b-button @click="cancel()">
        Cancel
      </b-button>

      <b-button variant="success" @click="updateWell()">
        Create
      </b-button>
    </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapActions , mapMutations} = createNamespacedHelpers('traction/pacbio/runs')

export default {
  name: 'Well',
  props: {
    position: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      movieTimeOptions: [15,20,30],
      movieTime: null,
      insertSize: null,
      onPlateLoadingConc: null,
      libraryBarcode: null
    }
  },
  methods: {
    async setBarcode(barcode) {
      let isValid = await this.isLibraryBarcodeValid(barcode)

      if (isValid) {
        let libraryTube = await this.getTubeForBarcode(barcode)
        let library = libraryTube.material
        let payload = { library: library, position: this.position}

        this.setLibraryBarcode(payload)
      } else {
      }
    },
     ...mapActions([
      'isLibraryBarcodeValid',
      'getTubeForBarcode',
    ]),
    ...mapMutations([
      'setLibraryBarcode',
    ]),
  }
}
</script>
