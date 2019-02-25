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
                  <draggable v-model="libraries" :options="{group:'people'}" style="min-height: 10px">
                  <template v-for="item in libraries">
                    <v-list-tile :key="item.id" >

                      <v-list-tile-content>
                        <v-list-tile-title>Barcode: {{ item.barcode }}</v-list-tile-title>
                        <v-list-tile-sub-title>
                          Enzyme: {{ item["enzyme-name"] }}
                          Sample: {{ item["sample-name"] }}
                        </v-list-tile-sub-title>
                      </v-list-tile-content>

                    </v-list-tile>
                  </template>
                </draggable>
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

                    <draggable v-model="flowcell1" :options="{group:'people'}" style="min-height: 10px">
                      <template v-for="item in flowcell1">
                        <v-list-tile :key="item.id">
                          <v-list-tile-content>
                            <v-list-tile-title>Position: {{ item.position }}</v-list-tile-title>
                            <v-list-tile-sub-title>ID: {{ item.id }}</v-list-tile-sub-title>
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

                    <draggable v-model="flowcell2" :options="{group:'people'}" style="min-height: 10px">
                      <template v-for="item in flowcell2">
                        <v-list-tile :key="item.id">
                          <v-list-tile-content>
                            <v-list-tile-title>Position: {{ item.position }}</v-list-tile-title>
                            <v-list-tile-sub-title>ID: {{ item.id }}</v-list-tile-sub-title>
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
        this.id = run.id
        this.state = run.state
        this.chipId = run.chip.id
        this.chipBarcode = run.chip.barcode
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
