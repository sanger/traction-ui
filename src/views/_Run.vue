<template>
  <div class="run">

    <b-button id="startRun" variant="success" class="float-right" @click="startRun" :disabled="localState!=='pending'">Start Run</b-button>
    <b-button id="completeRun" variant="primary" class="float-right" @click="completeRun" :disabled="localState==='completed' || localState==='cancelled'">Complete Run</b-button>
    <b-button id="cancelRun" variant="danger" class="float-right" @click="cancelRun" :disabled="localState==='completed' || localState==='cancelled'">Cancel Run</b-button>

    <h1 class="runInfo">Run</h1>
    <h1 class="runInfo" id="id">ID: {{ id }}</h1>
    <h2 class="runInfo" id="state">state: {{ state }}</h2>

    <b-form-input class="runInfo" id="name" v-model="localName" type="text" @change="updateName" />

    <chip v-bind="chip"></chip>

  </div>
</template>

<script>
import ComponentFactory from '@/mixins/ComponentFactory'
import Api from '@/api'
import Chip from '@/components/Chip'

export default {
  name: 'Run',
  mixins: [ComponentFactory],
  props: {
    id: {
      type: [Number, String]
    }
  },
  data () {
    return {
      name: this.id,
      state: null, 
      chip: {}
    }
  },
  methods: {
    async updateRun (attributes) {
      let rawResponse = await this.request.update(this.payload(attributes))
      let response = new Api.Response(rawResponse[0])

      if (response.successful) {
        this.message = 'Run updated'
        return response
      } else {
        this.message = 'There was an error'
        return response
      }
    },
    async getRun (id) {
      let rawResponse = await this.request.find(id)
      let response = new Api.Response(rawResponse)
      let run = response.deserialize.runs[0]

      if (response.successful) {
        this.state = run.state
        this.chip = run.chip
      }
    },
    updateName () {
      this.updateRun({name: this.localName})
    },
    startRun() {
      this.updateRun({state: 'started'})
    },
    completeRun () {
      this.updateRun({state: 'completed'})
    },
    cancelRun () {
      this.updateRun({state: 'cancelled'})
    },
    payload (attributes) {
      return {
        data: { 
          id: this.id,
          type: 'runs',
          attributes: attributes
        }
      }
    }
  },
  components: {
    Chip
  },
  computed: {
    tractionConfig () {
      return this.build(Api.ConfigItem, Api.Config.traction)
    },
    request () {
      return this.build(Api.Request, this.tractionConfig.resource('runs'))
    }
  },
  created () {
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

button {
  margin-right: 2px;
  margin-left: 2px;
}

</style>
