<template>
  <div class="run">
    <alert ref='alert'></alert>

    <router-link :to="{name: 'PacbioRuns'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <b-button class="float-right" :id="currentAction.id" :variant="currentAction.variant" @click="runAction">{{ currentAction.label}}</b-button>

    <br>
    <br>

    <div>
      <pacbioRunInfo></pacbioRunInfo>
      <br>
      <b-row>
        <b-col cols="6">
          <pacbioLibrariesList></pacbioLibrariesList>
        </b-col>
        <b-col>
          <Plate v-if="this.currentRun.id" @alert="showAlert"></Plate>
        </b-col>
      </b-row>
    </div>

  </div>
</template>

<script>
import PacbioRunInfo from '@/components/PacbioRunInfo'
import PacbioLibrariesList from '@/components/PacbioLibrariesList'
import Plate from '@/components/Plate'
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapActions } = createNamespacedHelpers('traction/pacbio/runs')

export default {
  name: 'Run',
  mixins: [Helper],
  props: {
    id: {
      type: [String, Number]
    },
    actions: {
      type: Object,
      default () {
        return {
          create: {
            id: 'create',
            variant: 'success',
            label: 'Create',
            method: 'createRun'
          },
          update: {
            id: 'update',
            variant: 'primary',
            label: 'Update',
            method: 'updateRun'
          }
        }
      }
    },
  },
  data () {
    return {
      newRecord: isNaN(this.id)
    }
  },
  methods: {
    async runAction () {
      let responses = await this[this.currentAction.method]()

      if (responses.length == 0) {
        this.redirectToRuns()
      } else {
          this.showAlert(responses, 'danger')
      }
    },
    ...mapActions([
      'createRun',
      'updateRun',
      'editRun',
      'newRun'
    ]),
    redirectToRuns() {
      this.$router.push({ name: 'PacbioRuns' })
    },
    async provider () {
      if (this.newRecord) {
        this.newRun()
      } else {
        await this.editRun(parseInt(this.$route.params.id))
      }
    }
  },
  components: {
    Alert,
    PacbioRunInfo,
    PacbioLibrariesList,
    Plate
  },
  computed: {
    currentAction () {
      return this.actions[this.newRecord ? 'create' : 'update']
    },
    ...mapGetters([
      'currentRun'
    ]),
    ...mapState({
      currentRun: state => state.currentRun
    })
  },
  created() {
    this.provider()
  }
}
</script>

<style>

button {
  margin-right: 2px;
  margin-left: 2px;
}

</style>
