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

import gql from 'graphql-tag'
import ONTSVG from '@/components/svg/ONTSVG'
import OntFlowcell from '@/components/ont/OntFlowcell'
import OntRunLibrariesList from '@/components/ont/OntRunLibrariesList'
// import GET_CLIENT_RUN from '@/graphql/client/queries/GetClientRun.query.gql'
import SET_CLIENT_RUN from '@/graphql/client/queries/SetClientRun.mutation.gql'
import CREATE_RUN from '@/graphql/queries/CreateRun.mutation.gql'
import GET_RUN from '@/graphql/queries/GetCovidRun.query.gql'

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
      run: {}
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
      this.$apollo.mutate({
        mutation: SET_CLIENT_RUN,
        variables: {
          id: '',
          flowcells: []
        }
      })

      if (this.id === "new") {
        this.buildRun("new", this.buildFlowcells())
      } else {
        this.$apollo.query({
          query: GET_RUN,
          variables: {
            id: this.id
          },
        }).then(data => {
          let existingRun = data.data.ontRun
          this.buildRun(existingRun.id, existingRun.flowcells)
        })
      }
    },
    buildRun(id, flowcells) {
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
    buildFlowcells() {
      let flowcells = []
      for (let position of [1,2,3,4,5]) {
        flowcells.push({ position: position, library: { name: '' } })
      }
      return flowcells
    },
    redirectToRuns() {
      this.$router.push({ name: 'OntHeronRuns' })
    }
  },
  apollo: {
    run: gql`query {
      run @client {
        id 
        flowcells
      }
    }`
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
