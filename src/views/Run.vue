<template>
  <div class="run">
    <alert ref='alert'></alert>

    <router-link :to="{name: 'Runs'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <h1 class="runInfo" id="id">Run ID: {{ id }}</h1>
    <h2 class="runInfo" id="state">state: {{ state }}</h2>

    <b-form-input class="runInfo" id="name" v-model="name" placeholder="name" type="text" @change="updateName(id, name)" />

    <chip v-if="Boolean(this.chip)" v-bind="chip" @alert="alert"></chip>

  </div>
</template>

<script>
import RunMixin from '@/mixins/RunMixin'
import Chip from '@/components/Chip'
import Alert from '@/components/Alert'

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
      name: this.name,
      state: null,
      chip: null,
      message: ''
    }
  },
  methods: {
    async provider () {
      let data = await this.getRun(this.id)
      this.name = data.name
      this.state = data.state
      this.chip = data.chip
    },
    alert (message) {
      this.message = message
      this.showAlert()
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  },
  components: {
    Chip,
    Alert
  },
  computed: {
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
