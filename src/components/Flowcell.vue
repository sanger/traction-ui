<template>
  <b-row class="flowcell">
    <b-col>
      <div class="position">{{ position }}</div>
      <library @updateLibrary="updateFlowcell" v-bind="library"></library>
    </b-col>
  </b-row>
</template>

<script>

import ComponentFactory from '@/mixins/ComponentFactory'
import Api from '@/api'
import Library from '@/components/Library'

export default {
  name: 'Flowcell',
  mixins: [ComponentFactory],
  props: {
    id: {
      type: [Number, String]
    },
    position: {
      type: [Number, String]
    },
    library: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    payload (library) {
      return {
        data: { 
          id: this.id,
          type: 'flowcells',
          attributes: {
            library_id: library.id
          }
        }
      }
    },
    async updateFlowcell (library) {
      let rawResponse = await this.request.update(this.payload(library))
      let response = new Api.Response(rawResponse[0])

      if (response.successful) {
        this.message = 'Library added to flowcell'
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
      return this.build(Api.Request, this.tractionConfig.resource('flowcells'))
    }
  },
  components: {
    Library
  }
}
</script>