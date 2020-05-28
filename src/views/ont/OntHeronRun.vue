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
            <OntFlowcell v-for="(flowcellData, key) in flowcellsData" v-bind="flowcellData" v-bind:key="key" @updateFlowcell="updateFlowcell">
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
import SET_CLIENT_RUN from '@/graphql/queries/client/SetClientRun.mutation.gql'
import GET_RUN from '@/graphql/queries/GetOntRun.query.gql'
import CREATE_RUN from '@/graphql/queries/CreateOntRun.mutation.gql'
import UPDATE_RUN from '@/graphql/queries/UpdateOntRun.mutation.gql'
import UPDATE_CLIENT_FLOWCELL from '@/graphql/queries/client/UpdateClientFlowcell.mutation.gql'

import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'

export default {
  name: 'OntHeronRun',
  data () {
    return {
      flowcellsData: [
        { position: 1, library: { name: '' } },
        { position: 2, library: { name: '' } },
        { position: 3, library: { name: '' } },
        { position: 4, library: { name: '' } },
        { position: 5, library: { name: '' } }
      ],
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
        // update here is not required as the cache is already up to date
        // with the run that we have mutated the server with
      })
      .then(data => {
        let response = data.data[this.currentAction.response]
        if (response.errors.length > 0) {
          this.showAlert('Failure: ' + response.errors.join(', '), 'danger')
        } else {
          this.redirectToRuns()
        }
      })
    },
    runActionVariables () {
      let flowcells = this.flowcellsData
        .filter(fc => fc.library.name)
        .map((fc => {
          return { position: fc.position, libraryName: fc.library.name }
        }))

      // Spread operator and short-circuit evaluation
      // {
      //    ...(condition) && { someprop: propvalue },
      //    ...otherprops
      // }
      return {
        ...(!this.newRecord) && { id: this.id},
        ...{ flowcells: flowcells }
      }
    },
    buildRun () {
      if (this.newRecord) {
        this.setRun('', [])
      } else {
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
      .then( ({ data: { setRun } }) => {
        setRun.flowcells.map(flowcell => {
          let index = this.flowcellsData.findIndex(x => x.position === flowcell.position)
          this.flowcellsData[index].library = flowcell.library
        })
      })
      .catch(error => {
        this.showAlert('Failure to build run: ' + error, 'danger')
      })
    },
    redirectToRuns() {
      this.$router.push({ name: 'OntHeronRuns' })
    },
    updateFlowcell (position, libraryName) {
      this.$apollo.mutate({
        mutation: UPDATE_CLIENT_FLOWCELL,
        variables: {
          position: position,
          libraryName: libraryName
        }
      })
      .then( ({ data: { updateFlowcell } }) => {
        let index = this.flowcellsData.findIndex(x => x.position === updateFlowcell.position)
        this.flowcellsData[index].library.name = updateFlowcell.libraryName
      })
    },
    provider () {
      this.buildRun()
    }
  },
  computed: {
    currentAction () {
      let create = {
        id: 'create-button',
        variant: 'success',
        label: 'Create Run',
        mutation: CREATE_RUN,
        response: 'createOntRun'
      }
      let update= {
        id: 'update-button',
        variant: 'primary',
        label: 'Update Run',
        mutation: UPDATE_RUN,
        response: 'updateOntRun'
      }
      return this.newRecord ? create : update
    },
    newRecord () {
      return isNaN(this.id)
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
