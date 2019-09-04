<template>
  <div class="run">
    <alert ref='alert'></alert>

    {{ this.currentRun }}

    <router-link :to="{name: 'Runs'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <b-button v-if="newRecord" class="float-right" id="create" variant="success" @click="create">Create</b-button>

    <h1 class="runInfo" id="id">Run ID: {{ this.currentRun.id }}</h1>
    <h2 class="runInfo" id="state">State: {{ this.currentRun.state }}</h2>

    <b-form-input class="runInfo" id="name" :value="name" @input="updateName" placeholder="name" type="text" />

    <chip :value="chip" v-bind:runId="id" @alert="alert"></chip>

  </div>
</template>

<script>
import RunMixin from '@/mixins/RunMixin'
import Chip from '@/components/Chip'
import Alert from '@/components/Alert'
import * as RunApi from '@/api/Run'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapState, mapMutations } = createNamespacedHelpers('traction/saphyr')

export default {
  name: 'Run',
  mixins: [RunMixin],
  props: {
    id: {
      type: [Number, String]
    }
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    alert (message) {
      this.message = message
      this.showAlert()
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    },
    async create () {
      let responses = await this.createRun()

      if (responses.every(r => r.successful)) {
        this.$router.push({name: 'Runs'})
      } else {
        let errors = responses.map(r => r.errors.message).join(',')
        this.message = 'Failed to create run: ' + errors
        this.showAlert()
      }
    },
    ...mapActions([
      'createRun',
    ]),
    ...mapMutations([
      'updateName',
    ]),
  },
  components: {
    Chip,
    Alert
  },
  computed: {
     newRecord () {
      return isNaN(this.id)
    },
    ...mapGetters([
      'currentRun'
    ]),
    ...mapState({
      name: state => state.currentRun.name,
      chip: state => state.currentRun.chip,
      // currentRun: state => state.currentRun,
    })
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
