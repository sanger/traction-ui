<template>
    <b-modal ref="well-modal" title="Add Library to Well">
      
      <alert ref='alert'></alert>

      Position: {{ this.position }}
      insertSize: {{ this.insertSize }}

      <b-form>
        <!-- <b-form-group
          id="libraryBarcode"
          label-cols-sm="4"
          label-cols-lg="3"
          label="Barcode:"
          label-for="libraryBarcode"
          >
          <b-form-input ref="libraryBarcode" id="libraryBarcode" v-model="libraryBarcode" @change="setBarcode"></b-form-input>
        </b-form-group> -->

        <!-- <b-form-group
          id="movieTime"
          label-cols-sm="4"
          label-cols-lg="3"
          label="Movie Time:"
          label-for="movieTime"
          >
          <b-form-select ref="movieTime" id="movieTime" v-model="movieTime" :options="movieTimeOptions"></b-form-select>
        </b-form-group> -->
        
        <!-- <b-form-group
          id="onPlateLoadingConc"
          label-cols-sm="4"
          label-cols-lg="3"
          label="Concentration:"
          description="On Plate Loading Concentration (mP)"
          label-for="onPlateLoadingConc"
          >
          <b-form-input ref="onPlateLoadingConc" id="onPlateLoadingConc" v-model="onPlateLoadingConc"></b-form-input>
        </b-form-group> -->

        <b-form-input ref="insertSize" id="insertSize" :value="insertSize" @change="updateInsertSize" placeholder="Insert Size"></b-form-input>
      </b-form>

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button @click="cancel()">
          Cancel
        </b-button>

        <b-button variant="success" @click="update()">
          Update Well
        </b-button>
      </template>
    </b-modal>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations, mapGetters} = createNamespacedHelpers('traction/pacbio/runs')

import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'

export default {
  name: 'WellModal',
  mixins: [Helper],
  props: {
    position: {
      type: [String],
      required: true,
    },
  },
  data () {
    return {
      movieTimeOptions: [15,20,30],
    }
  },
  methods: {
    showModalForPosition() {    
      this.$refs['well-modal'].show()
    },
    hide() {
      this.$refs['well-modal'].hide()
    },
    update() {
      this.hide()
      this.alert('Well updated', 'success')
    },
    updateInsertSize(insertSize) {
      this.setInsertSize({ position: this.position, insertSize: insertSize})
    },
    // async setBarcode(barcode) {
    //   let isValid = await this.isLibraryBarcodeValid(barcode)

    //   if (isValid) {
    //     let libraryTube = await this.getTubeForBarcode(barcode)
    //     let library = libraryTube.material
    //     let payload = { library: library, position: this.position}

    //     this.setLibraryBarcode(payload)
    //     this.showAlert('Library is valid', 'success')
    //   } else {
    //     this.showAlert('Library is not valid', 'danger')
    //   }
    // },
     ...mapActions([
      // 'isLibraryBarcodeValid',
      // 'getTubeForBarcode',
    ]),
    ...mapMutations([
      // 'setLibraryBarcode',
      'setInsertSize',
    ]),
    alert (message, type) {
      this.$emit('alert', message, type)
    },
  },
  computed: {
    ...mapGetters([
      'currentRun'
    ]),
    ...mapState({
      currentRun: state => state.currentRun,
      insertSize (state) {
        return state.currentRun.plate.wells.filter(well => well.position === this.position)[0].insert_size
      }
    })
  },
  components: {
    Alert
  },
}
</script>
