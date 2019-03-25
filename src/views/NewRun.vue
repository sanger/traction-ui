<template>
  <div class="newrun">
    <alert ref='alert'></alert>

    <router-link :to="{name: 'Runs'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <b-button id="startRun" variant="success" class="float-right" @click="startRun" :disabled="state!=='pending'">Start Run</b-button>
    <b-button id="completeRun" variant="primary" class="float-right" @click="completeRun" :disabled="state==='completed' || state==='cancelled'">Complete Run</b-button>
    <b-button id="cancelRun" variant="danger" class="float-right" @click="cancelRun" :disabled="state==='completed' || state==='cancelled'">Cancel Run</b-button>

    <h1 class="runInfo" id="runId">Sequencing Run ID: {{ runId }}</h1>
    <h2 class="runInfo" id="runState">Run state: {{ state }}</h2>
    <b-form-input class="runInfo" id="chipBarcode" v-model="chipBarcode" type="text" placeholder="Chip barcode" @change="updateBarcode"/>

    <b-container class="chip">
      <b-row id="flowcellOne">
        <b-col>
          <libraryBarcodeScanner v-if="this.flowcellOne.id !== undefined" v-bind:flowcell="flowcellOne" @alert="showBarcodeScannerMessage"></libraryBarcodeScanner>
        </b-col>
      </b-row>
      <b-row id="flowcellTwo">
        <b-col>
          <libraryBarcodeScanner v-if="this.flowcellTwo.id !== undefined" v-bind:flowcell="flowcellTwo" @alert="showBarcodeScannerMessage"></libraryBarcodeScanner>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
import Alert from '@/components/Alert'
import LibraryBarcodeScanner from '@/components/LibraryBarcodeScanner'
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/Api'

export default {
  name: 'NewRun',
  mixins: [Api],
  props: {
    runId: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      flowcellOne: { library: {}},
      flowcellTwo: { library: {}},
      id: null,
      state: null,
      chipBarcode: null,
      chipId: null,
      message: ''
    }
  },
  methods: {
    async updateBarcode() {
      let requestBody = { data: { type: 'chips', id: this.chipId, attributes: { barcode: this.chipBarcode }} }

      let promises = this.chipsRequest.update(requestBody)
      let response = await handlePromise(promises[0])

      if (response.successful) {
        this.message = 'Chip barcode updated'
      } else {
        this.message = response.errors.message
      }
      this.showAlert
    },
    async getRun(id) {
      let promise = this.runRequest.find(id)
      let response = await handlePromise(promise)

      let run = response.deserialize.runs[0]

      if (response.successful) {
        let chipBarcode = ''
        if (run.chip.barcode) {
          chipBarcode = run.chip.barcode
        }

        this.id = run.id
        this.state = run.state
        this.chipId = run.chip.id
        this.chipBarcode = chipBarcode
        this.flowcellOne = run.chip.flowcells[0]
        this.flowcellTwo = run.chip.flowcells[1]
      } else {
        this.message = response.errors.message
        this.showAlert
      }
    },
    async startRun(){
      this.updateRunState('started')
    },
    async completeRun () {
      this.updateRunState('completed')
    },
    async cancelRun () {
      this.updateRunState('cancelled')
    },
    async updateRunState(state){
      let requestBody = { data: { type: 'runs', id: this.id, attributes: { state: state }} }

      let promises = this.runRequest.update(requestBody)
      let response = await handlePromise(promises[0])

      if (response.successful) {
        this.message = 'Sequencing Run ' + state
      } else {
        this.message = response.errors.message
      }
      this.showAlert
    },
    provider () {
      if (this.runId === undefined) {
        this.$router.push({name: 'Runs'})
      } else {
        this.getRun(this.runId)
      }
    },
    showBarcodeScannerMessage (message) {
      this.message = message
      this.showAlert
    }
  },
  components: {
    Alert,
    LibraryBarcodeScanner
  },
  computed: {
    runRequest () {
      return this.api.traction.runs
    },
    chipsRequest () {
      return this.api.traction.chips
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  },
  created() {
    this.provider()
  }
}
</script>


<style>

.container {
  border: 1px solid black;
  max-width: 50%;
  padding: 10px;
  margin-top: 50px;
}

.row {
  border: 1px solid #42b983;
  padding-top: .75rem;
  padding-bottom: .75rem;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 0px;
  margin-left: 0px;
}

.runInfo {
  text-align: left;
  margin-top: 5px;
}

#chipBarcode {
  max-width: 30%;
}

button {
  margin-right: 2px;
  margin-left: 2px;
}

</style>
