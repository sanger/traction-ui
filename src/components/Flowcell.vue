<template>
  <b-row class="flowcell">
    <b-col>
      <div class="position">{{ position }}</div>
      <library @updateLibrary="updateFlowcell" v-bind="library"></library>
    </b-col>
  </b-row>
</template>

<script>


import Library from '@/components/Library'
import Api from '@/mixins/Api'
import handlePromise from '@/api/PromiseHelper'

export default {
  name: 'Flowcell',
  mixins: [Api],
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
      let promise = this.flowcellRequest.update(this.payload(library))
      let response = await handlePromise(promise[0])

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
    flowcellRequest () {
      return this.api.traction.flowcells
    }
  },
  components: {
    Library
  }
}
</script>
