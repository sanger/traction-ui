<template>
  <div class="ont-heron-run">
    <alert ref='alert'></alert>

    <div>
      <b-row class="create-run-button">
        <b-button :id="currentAction.id" :variant="currentAction.variant" @click="runAction()">{{ currentAction.label}}</b-button>
      </b-row>
      <b-row class="clearboth">
        <b-col cols="4">
          <OntRunLibrariesList></OntRunLibrariesList>
        </b-col>
        <b-col cols="6">
          <ONTSVG>
            <OntFlowcell v-for="(flowcell, key) in flowcellsData" v-bind="flowcell" v-bind:key="key">
            </OntFlowcell>
          </ONTSVG>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

import ONTSVG from '@/components/svg/ONTSVG'
import OntFlowcell from '@/components/ont/OntFlowcell'
import OntRunLibrariesList from '@/components/ont/OntRunLibrariesList'
import GET_CLIENT_RUN from '@/graphql/queries/client/GetClientRun.query.gql'
import SET_CLIENT_RUN from '@/graphql/queries/client/SetClientRun.mutation.gql'
import GET_RUN from '@/graphql/queries/GetOntRun.query.gql'
import CREATE_RUN from '@/graphql/queries/CreateOntRun.mutation.gql'
import UPDATE_RUN from '@/graphql/queries/UpdateOntRun.mutation.gql'

import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'

export default {
  name: 'OntHeronRun',
  data () {
    return {
      flowcellsData: [
        { position: 1, xPos: 240 },
        { position: 2, xPos: 320 },
        { position: 3, xPos: 400 },
        { position: 4, xPos: 480 },
        { position: 5, xPos: 560 }
      ],
      run: {},
      actions: {
        create: {
          id: 'create-button',
          variant: 'success',
          label: 'Create Run',
          mutation: CREATE_RUN,
          response: 'createOntRun'
        },
        update: {
          id: 'update-button',
          variant: 'primary',
          label: 'Update Run',
          mutation: UPDATE_RUN,
          response: 'updateOntRun'
        }
      },
      newRecord: isNaN(this.id)
    }
  },
  props: {
    id: {
      type: [String, Number]
    }
  },
  components: {
    ONTSVG,
    OntFlowcell,
    OntRunLibrariesList,
    Alert
  },
  mixins: [Helper],
  methods: {
    runAction() {
      this.$apollo.mutate({
        mutation: this.currentAction.mutation,
        variables: this.runActionVariables()
      }).then(data => {
        let response = data.data[this.currentAction.response]
        if (response.errors.length > 0) {
          this.showAlert('Failure: ' + response.errors.join(', '), 'danger')
        } else {
          this.showAlert('Run successfully created', 'success')
        }
      })
    },
    runActionVariables () {
      let flowcells = this.run.flowcells
        .filter(fc => fc.library.name)
        .map((fc => {
          return { position: fc.position, libraryName: fc.library.name }
        }))

      return {
        ...(!this.newRecord) && { id: this.id},
        ...({}) && { flowcells: flowcells }
      }
    },
    buildRun () {
      this.setRun('', [])

      if (!this.newRecord) {
        this.$apollo.query({
          query: GET_RUN,
          variables: {
            id: this.id
          },
        }).then(data => {
          let existingRun = data.data.ontRun
          this.setRun(existingRun.id, existingRun.flowcells)
        })
      }
    },
    setRun(id, flowcells) {
      this.$apollo.mutate({
        mutation: SET_CLIENT_RUN,
        variables: {
          id: id,
          flowcells: flowcells
        }
      })
      .catch(error => {
        this.showAlert('Failure to build run: ' + error, 'danger')
      })
    },
    provider () {
      this.buildRun()
    }
  },
  apollo: {
    run: {
      query: GET_CLIENT_RUN,
      pollInterval: 100
    }
  },
  computed: {
    currentAction () {
      return this.actions[this.newRecord ? 'create' : 'update']
    }
  },
  created () {
    this.provider()
  },
}
</script>

<style>

.create-run-button {
  float: right;
}

.clearboth {
  clear: both;
}

</style>
