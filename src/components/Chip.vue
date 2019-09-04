<template>
  <b-container class="chip">
    <b-form-input id="barcode" v-model="localBarcode" type="text" placeholder="Chip barcode" @change="updateChip" />
    <flowcell v-for="(flowcell, index) in flowcells" v-bind="flowcell" v-bind:key="index" v-bind:runId="runId" @alert="alert"></flowcell>
  </b-container>
</template>

<script>
import Flowcell from '@/components/Flowcell'
import Api from '@/mixins/Api'
import handlePromise from '@/api/PromiseHelper'
import * as Run from '@/api/Run'
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
      type: [Array],
      default: () => {
        return [ {}, {} ]
      }
    },
    runId: {
      type: [Number, String]
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
      let run = this.$store.getters.run(this.runId)
      let updatedRun = Run.updateChip(run, this.localBarcode)
      this.$store.commit('addRun', updatedRun)
      if (this.existingRecord) {
        let promise = this.chipRequest.update(this.payload)
        let response = await handlePromise(promise[0])
        if (response.successful) {
          this.alert('Chip updated')
        } else {
          this.alert('There was an error: ' + response.errors.message)
        }
      }
    },
    alert (message) {
      this.$emit('alert', message)
    },
  },
  computed: {
    existingRecord () {
      return !isNaN(this.runId)
    },
    chipRequest () {
      return this.api.traction.saphyr.chips
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
