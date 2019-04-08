<template>
  <b-container class="chip">
    <b-form-input id="barcode" v-model="localBarcode" type="text" placeholder="Chip barcode" @change="updateChip" />
    <flowcell v-for="(flowcell, index) in flowcells" v-bind="flowcell" v-bind:key="index"></flowcell>
  </b-container>
</template>

<script>

import Flowcell from '@/components/Flowcell'
import Api from '@/mixins/Api'
import handlePromise from '@/api/PromiseHelper'

export default {
  name: 'Chip',
  mixins: [Api],
  props: {
    id: {
      type: [Number, String]
    },
    barcode: {
      type: String
    },
    flowcells: {
      type: Array,
      default: () => {
        return [ {}, {} ]
      }
    }
  },
  data () {
    return {
      localBarcode: this.barcode,
      message: ''
    }
  },
  methods: {
    async updateChip () {
      let promise = this.chipRequest.update(this.payload)
      let response = await handlePromise(promise[0])

      if (response.successful) {
        this.message = 'Chip updated'
        return response
      } else {
        this.message = 'There was an error'
        return response
      }
    }
  },
  computed: {
    chipRequest () {
      return this.api.traction.chips
    },
    payload () {
      return {
        data: {
          id: this.id,
          type: 'chips',
          attributes: {
            barcode: this.localBarcode
          }
        }
      }
    }
  },
  components: {
    Flowcell
  }

}
</script>
