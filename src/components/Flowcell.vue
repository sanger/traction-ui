<template>
  <b-row class="flowcell">
    <b-col>
      <div class="position">{{ position }}</div>
      <b-form-input v-model="libraryBarcode" id="libraryBarcode" placeholder="Library barcode" type="text" />
    </b-col>
  </b-row>
</template>

<script>

import Api from '@/mixins/Api'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapActions } = createNamespacedHelpers('traction/saphyr/runs')

export default {
  name: 'Flowcell',
  mixins: [Api],
  props: {
    position: {
      type: [Number]
    },
    index: {
      type: [Number]
    }
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    // payload (library) {
    //   return {
    //     data: {
    //       id: this.id,
    //       type: 'flowcells',
    //       attributes: {
    //         library_id: library.id
    //       }
    //     }
    //   }
    // }, 
    // async updateFlowcell (library) {
      // let promise = this.flowcellRequest.update(this.payload(library))
      // let response = await handlePromise(promise[0])

      // if (response.successful) {
      //   this.alert('Library added to flowcell')
      //   return response
      // } else {
      //   this.alert('There was an error: ' + response.errors.message)
      // }
    // },
    alert (message) {
      this.$emit('alert', message)
    },
    ...mapActions([
      'updateLibraryBarcode',
    ]),
  },
  computed: {
    ...mapGetters([
      'currentRun'
    ]),
    ...mapState({
      barcode (state) {
        return state.currentRun.chip.flowcells[this.index].library.barcode
      }
    }),
    libraryBarcode: {
      get () {
        return this.barcode
      },
      set (value) {
        let payload = { barcode: value, flowcellIndex: this.index}
        this.updateLibraryBarcode(payload)
      }
    },
  }
}
</script>
