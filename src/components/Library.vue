<template>
  <div class="library">
     <b-form-input id="barcode" v-model="barcode" type="text" placeholder="barcode" @change="updateLibrary" />
  </div>
</template>

<script>

import Api from '@/mixins/Api'
import handlePromise from '@/api/PromiseHelper'

export default {
  name: 'Library',
  mixins: [Api],
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
    //TODO: horrible logic needs refactoring
    async updateLibrary () {
      if(!this.queryString) return

      let promise = await this.tubeRequest.get({filter: { barcode: this.queryString} })
      let response = await handlePromise(promise)

      if (response.successful) {
        if (response.empty) {
          this.message = 'There is no library'
          return response
        } else {
          let material = response.deserialize.tubes[0].material
          if (material.type === 'libraries') {
            this.message = 'Library updated'
            this.$emit('updateLibrary', response.deserialize.tubes[0].material)
            return response
          } else {
            this.message = 'This is not a library'
            return response
          }
        }
      } else {
        this.message = 'there was an error'
        return response
      }
    },
  },
  computed: {
    tubeRequest () {
      return this.api.traction.tubes
    },
    queryString () {
      return this.barcode.replace('\n','')
    }
  }
}
</script>
