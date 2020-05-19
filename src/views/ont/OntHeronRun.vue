<template>
  <div class="ont-heron-run">
    {{ run }}
    <alert ref='alert'></alert>

    <div>
      <b-row class="create-run-button">
        <b-button variant="outline-success" id="create-run" @click="createRun()">
          Create Run
        </b-button>
      </b-row>
      <br>
      <b-row>
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
import GET_CLIENT_RUN from '@/graphql/client/queries/GetClientRun.query.gql'
import SET_CLIENT_RUN from '@/graphql/client/queries/SetClientRun.mutation.gql'
import CREATE_RUN from '@/graphql/queries/CreateRun.mutation.gql'
import GET_COVID_RUN from '@/graphql/queries/GetCovidRun.query.gql'

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
      loadedData: false
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
    createRun () {
      let flowcells = this.run.flowcells
        .filter(fc => fc.library.name)
        .map((fc => {
          return { position: fc.position, libraryName: fc.library.name }
        }))

      this.$apollo.mutate({
        mutation: CREATE_RUN,
        variables: {
          flowcells: flowcells
        }
      }).then(data => {
        let response = data.data.createCovidRun
        if (response.errors.length > 0) {
          this.showAlert('Failure: ' + data.data.createCovidRun.errors.join(', '), 'danger')
        } else {
          this.redirectToRuns()
        }
      })
    },
    setRun () {
      if (this.id === "new") {
        this.buildNewRun()
      } else {
        this.buildExistingRun()
      }
    },
    buildNewRun () {
      this.$apollo.mutate({
        mutation: SET_CLIENT_RUN,
        variables: {
          id: 'new',
          flowcells: this.buildFlowcells()
        },
        // Update the cache with the result
        update: (store, { data: { setRun } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: GET_CLIENT_RUN })
          // Update the data with our mutation response
          data.run = setRun
          // Write our data back to the cache
          store.writeQuery({ query: GET_CLIENT_RUN, data })
        }
      }).then(() => {
        this.loadedData = true
      }).catch(error => {
        this.showAlert('Failure to build run: ' + error, 'danger')
      })
    },
    async buildExistingRun (){
      this.$apollo.query({
        query: GET_COVID_RUN,
        variables: {
          id: this.id
        },
      }).then(data => {
        let existingRun = data.data.ontRun

        this.$apollo.mutate({
          mutation: SET_CLIENT_RUN,
          variables: {
            id: existingRun.id,
            flowcells: existingRun.flowcells
          },
          // Update the cache with the result
          update: (store, { data: { setRun } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: GET_CLIENT_RUN })
            // Update the data with our mutation response
            data.run = setRun
            // Write our data back to the cache
            store.writeQuery({ query: GET_CLIENT_RUN, data })
          }
        }).then(() => {
          this.loadedData = true
        }).catch(error => {
          this.showAlert('Failure to build run: ' + error, 'danger')
        })
      })
    },
    buildFlowcells() {
      let flowcells = []
      for (let position of [1,2,3,4,5]) {
        flowcells.push({
          position: position,
          library: {
            name: '',
          }
        })
      }
      return flowcells
    },
    redirectToRuns() {
      this.$router.push({ name: 'OntHeronRuns' })
    }
  },
  apollo: {
    run: {
      query: GET_CLIENT_RUN,
      // Disable the query when run has already been loaded
      skip () {
        return this.loadedData
      },
    }
  },
  created () {
    this.setRun()
  },
}
</script>

<style>

.create-run-button {
  float: right;
}

</style>
