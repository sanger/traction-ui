<template>
  <b-container class="chip">
    <b-form-input id="barcode" v-model="localBarcode" type="text" />
    <flowcell v-for="(flowcell, index) in flowcells" v-bind="flowcell" v-bind:key="index"></flowcell>
  </b-container>
</template>

<script>

import ComponentFactory from '@/mixins/ComponentFactory'
import Api from '@/api'
import Flowcell from '@/components/Flowcell'

export default {
  name: 'Chip',
  mixins: [ComponentFactory],
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
      let rawResponse = await this.request.update(this.payload)
      let response = new Api.Response(rawResponse[0])

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
    tractionConfig () {
      return this.build(Api.ConfigItem, Api.Config.traction)
    },
    request () {
      return this.build(Api.Request, this.tractionConfig.resource('chips'))
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