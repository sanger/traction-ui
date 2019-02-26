<template>
  <div class="newrun">
    <alert ref='alert'></alert>

    <router-link :to="{name: 'Runs'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <b-button id="startRun" variant="success" class="float-right" @click="onStartRun">Start Run</b-button>

    <h1>Sequencing Run ID: {{ runId }}</h1>
    <v-container grid-list-md>
      <v-layout justify-space-around>
        <v-flex xs12 sm6 md4 offset-xs1>
          <label for="barcode">Chip barcode:</label>
          <b-form-input id="barcode" v-model="chipBarcode" type="text" placeholder="Chip barcode" @change="onBarcodeInput"/>
        </v-flex>
      </v-layout>

      <v-layout justify-space-around>

        <v-flex d-flex xs12 sm6 md6 offset-xs1>
          <v-card>
            <v-card-title primary class="title">Libraries</v-card-title>

            <v-card-text>
              <v-list two-line>
                <template v-for="item in libraries">
                  <draggable v-bind:key="item.id" v-model="libraries" :options="{group:'people'}" style="min-height: 10px" @end="onDrop($event, item)">

                    <v-list-tile :key="item.id" >

                      <v-list-tile-content>
                        <v-list-tile-title>Barcode: {{ item.barcode }}</v-list-tile-title>
                        <v-list-tile-sub-title>
                          Enzyme: {{ item.enzyme_name }}
                          Sample: {{ item.sample_name }}
                        </v-list-tile-sub-title>
                      </v-list-tile-content>

                    </v-list-tile>
                  </draggable>

                </template>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex d-flex xs12 sm6 md4>
          <v-layout column wrap>
            <v-flex d-flex>
              <v-card>
                <v-card-title primary class="title">Flowcell 1</v-card-title>
                <v-card-text>
                  <v-list two-line>

                    <draggable id="flowcell1" v-model="flowcell1" :options="{group:'people'}" style="min-height: 10px">
                      <template v-for="item in flowcell1">
                        <v-list-tile :key="item.id">
                          <v-list-tile-content v-if="item.library">
                            <v-list-tile-title>Barcode: {{ item.library.barcode }}</v-list-tile-title>
                            <v-list-tile-sub-title>
                              Enzyme: {{ item.library.enzyme_name }}
                              Sample: {{ item.library.sample_name }}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </template>
                    </draggable>

                  </v-list>

                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex d-flex>
              <v-card>
                <v-card-title primary class="title">Flowcell 2</v-card-title>

                <v-card-text>
                  <v-list two-line>

                    <draggable id="flowcell2" v-model="flowcell2" :options="{group:'people'}" style="min-height: 10px">
                      <template v-for="item in flowcell2">
                        <v-list-tile :key="item.id">
                          <v-list-tile-content v-if="item.library">
                            <v-list-tile-title>Barcode: {{ item.library.barcode }}</v-list-tile-title>
                            <v-list-tile-sub-title>
                              Enzyme: {{ item.library.enzyme_name }}
                              Sample: {{ item.library.sample_name }}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </template>
                    </draggable>

                  </v-list>

                </v-card-text>
              </v-card>
            </v-flex>

          </v-layout>
        </v-flex>

      </v-layout>
    </v-container>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
import ApiConfig from '@/api/Config'
import ConfigItem from '@/api/ConfigItem'
import ComponentFactory from '@/mixins/ComponentFactory'
import Request from '@/mixins/Request'
import Response from '@/api/Response'
import Alert from '@/components/Alert'

export default {
  name: 'NewRun',
  mixins: [ComponentFactory],
  props: {
    runId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      libraries: [],
      flowcell1: [],
      flowcell2: [],
      id: null,
      state: null,
      chipBarcode: null,
      chipId: null
    }
  },
  methods: {
    onDrop(event, item) {
      let library = item
      let flowcell = event.to.id

      this.updateFlowcell(flowcell, library)
      this.getLibraries()
    },
    updateFlowcell(flowcell, library) {
      if (flowcell === 'flowcell1') {
        let oldFlowcellWithLibrary = this.flowcell1.filter(e => e.type=='flowcells')[0]
        oldFlowcellWithLibrary.library = library

        let newFlowcellToRemove = this.flowcell1.filter(e => e.type=='libraries')[0]
        let indexOfNewFlowcellToRemove = this.flowcell1.indexOf(newFlowcellToRemove)

        this.flowcell1.splice(indexOfNewFlowcellToRemove, 1)
        this.updateFlowcellInTraction(this.flowcell1[0].id, this.flowcell1[0].library.id)
      }
      if (flowcell === 'flowcell2') {
        let oldFlowcellWithLibrary = this.flowcell2.filter(e => e.type=='flowcells')[0]
        oldFlowcellWithLibrary.library = library
        let newFlowcellToRemove = this.flowcell2.filter(e => e.type=='libraries')[0]
        let indexOfNewFlowcellToRemove = this.flowcell2.indexOf(newFlowcellToRemove)
        this.flowcell2.splice(indexOfNewFlowcellToRemove, 1)
        this.updateFlowcellInTraction(this.flowcell2[0].id, this.flowcell2[0].library.id)
      }
    },
    async updateFlowcellInTraction(flowcellId, libraryId){
      let requestBody = { data: { type: 'flowcells', id: flowcellId, attributes: { library_id: libraryId }} }

      let rawResponse = await this.flowcellsRequest.update(requestBody)
      let response = new Response(rawResponse[0])

      if (Object.keys(response.errors).length === 0) {
        this.message = 'Library added to flowcell'
        this.showAlert
      } else {
        this.message = response.errors.message
        throw this.message
      }
    },
    async onBarcodeInput () {
      try {
        await this.updateBarcode()
      } catch (error) {
        // log error
      } finally {
        this.showAlert
      }
    },
    async updateBarcode(){
      let requestBody = { data: { type: 'chips', id: this.chipId, attributes: { barcode: this.chipBarcode }} }

      let rawResponse = await this.chipsRequest.update(requestBody)
      let response = new Response(rawResponse[0])

      if (Object.keys(response.errors).length === 0) {
        this.message = 'Chip barcode updated'
      } else {
        this.message = response.errors.message
        throw this.message
      }
    },
    async getRun(id) {
      try {
        let rawRun = await this.runRequest.find(id)
        let run = new Response(rawRun).deserialize.runs[0]

        let chipBarcode = ''
        if (run.chip.barcode) {
          chipBarcode = run.chip.barcode
        }

        this.id = run.id
        this.state = run.state
        this.chipId = run.chip.id
        this.chipBarcode = chipBarcode
        this.flowcell1 = [run.chip.flowcells[0]]
        this.flowcell2 = [run.chip.flowcells[1]]
      } catch(error) {
        return error
      }
    },
    async getLibraries() {
      try {
        let rawLibraries = await this.librariesRequest.get()
        let libraries = new Response(rawLibraries).deserialize.libraries
        this.libraries = libraries
      } catch(error) {
        return error
      }
    },
    async onStartRun () {
      try {
        await this.startRun()
      } catch (error) {
        // log error
      } finally {
        this.showAlert
      }
    },
    async startRun(){
      let requestBody = { data: { type: 'runs', id: this.id, attributes: { state: 'started' }} }

      let rawResponse = await this.runRequest.update(requestBody)
      let response = new Response(rawResponse[0])

      if (Object.keys(response.errors).length === 0) {
        this.message = 'Sequencing Run started'
      } else {
        this.message = response.errors.message
        throw this.message
      }
    },
  },
  components: {
    draggable,
    Alert
  },
  computed: {
    runRequest () {
      return this.build(Request, this.tractionConfig.resource('runs'))
    },
    librariesRequest () {
      return this.build(Request, this.tractionConfig.resource('libraries'))
    },
    chipsRequest () {
      return this.build(Request, this.tractionConfig.resource('chips'))
    },
    flowcellsRequest () {
      return this.build(Request, this.tractionConfig.resource('flowcells'))
    },
    tractionConfig () {
      return this.build(ConfigItem, ApiConfig.traction)
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  },
  created() {
    if (this.runId === undefined) {
      this.$router.push({name: 'Runs'})
    } else {
      this.getRun(this.runId)
      this.getLibraries()
    }
  }
}
</script>
