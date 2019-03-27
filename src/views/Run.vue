<template>
  <div class="run">

    <router-link :to="{name: 'Runs'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <b-button id="startRun" variant="success" class="float-right" @click="startRun" :disabled="state!=='pending'">Start Run</b-button>
    <b-button id="completeRun" variant="primary" class="float-right" @click="completeRun" :disabled="state==='completed' || state==='cancelled'">Complete Run</b-button>
    <b-button id="cancelRun" variant="danger" class="float-right" @click="cancelRun" :disabled="state==='completed' || state==='cancelled'">Cancel Run</b-button>

    <h1 class="runInfo">Run</h1>
    <h1 class="runInfo" id="id">ID: {{ id }}</h1>
    <h2 class="runInfo" id="state">state: {{ state }}</h2>

    <b-form-input class="runInfo" id="name" v-model="name" placeholder="name" type="text" @change="updateName" />

    <chip v-if="Boolean(this.chip)" v-bind="chip"></chip>

  </div>
</template>

<script>
import Api from '@/mixins/Api'
import handlePromise from '@/api/PromiseHelper'
import Chip from '@/components/Chip'

export default {
  name: 'Run',
  mixins: [Api],
  props: {
    id: {
      type: [Number, String]
    }
  },
  data () {
    return {
      name: this.name,
      state: null,
      chip: null,
      message: ''
    }
  },
  methods: {
    async updateRun (attributes) {
      let promise = await this.runsRequest.update(this.payload(attributes))
      let response = await handlePromise(promise[0])

      if (response.successful) {
        this.message = 'Run updated'
        return response
      } else {
        this.message = 'There was an error'
        return response
      }
    },
    async getRun (id) {
      let promise = await this.runsRequest.find(id)
      let response = await handlePromise(promise)

      if (response.successful) {
        return response.deserialize.runs[0]
      } else {
        this.message = 'There was an error'
        return { state: null, chip: null }
      }
    },
    updateName () {
      this.updateRun({name: this.name})
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
    },
    async provider () {
      let data = await this.getRun(this.id)
      this.name = data.name
      this.state = data.state
      this.chip = data.chip
    }
  },
  components: {
    Chip
  },
  computed: {
    runsRequest () {
      return this.api.traction.runs
    }
  },
  created () {
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

button {
  margin-right: 2px;
  margin-left: 2px;
}

</style>
