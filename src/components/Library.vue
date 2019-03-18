<template>
  <div class="library">
     <input id="barcode" v-model="barcode" type="text" @change="updateLibrary" />
  </div>
</template>

<script>

import ComponentFactory from '@/mixins/ComponentFactory'
import Api from '@/api'

export default {
  name: 'Library',
  mixins: [ComponentFactory],
  props: {
    id: {
      type: [Number, String]
    },
    tube: {
      type: Object,
      default: () => {
        return { id: '', barcode: '' }
      }
    }
  },
  data () {
    return {
      barcode: this.tube.barcode,
      message: ''
    }
  },
  methods: {
    async updateLibrary () {
      if(!this.queryString) return
      let rawResponse = await this.tubeRequest.get({filter: { barcode: this.queryString} })
      let response = new Api.Response(rawResponse)
      if (response.successful) {
        if (response.empty) {
          this.message = 'There is no library'
          return response
        } else {
          this.message = 'Library updated'
          this.$emit('updateLibrary', response.deserialize.tubes[0].material)
          return response
        }
      } else {
        this.message = 'there was an error'
        return response
      }
    },
  },
  computed: {
    tractionConfig () {
      return this.build(Api.ConfigItem, Api.Config.traction)
    },
    tubeRequest () {
      return this.build(Api.Request, this.tractionConfig.resource('tubes'))
    },
    queryString () {
      return this.barcode.replace('\n','')
    }
  }
}
</script>