<template>
  <div class="ont-heron-run">
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
            <OntFlowcell v-for="(flowcell, key) in flowcells" v-bind="flowcell" v-bind:key="key">
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
import ONT_HERON_RUN_QUERY from '@/graphql/client/queries/OntHeronRun.query.gql'
import CREATE_COVID_RUN from '@/graphql/queries/CreateCovidRun.mutation.gql'

export default {
  name: 'OntHeronRun',
  data () {
    return {
      flowcells: [
        { position: 1, xPos: 240 },
        { position: 2, xPos: 320 },
        { position: 3, xPos: 400 },
        { position: 4, xPos: 480 },
        { position: 5, xPos: 560 }
      ]
    }
  },
  components: {
    ONTSVG,
    OntFlowcell,
    OntRunLibrariesList
  },
  methods: {
    createRun () {
      const flowcells = this.run.flowcells
        .filter(fc => fc.libraryName)
        // eslint-disable-next-line
        .map(({__typename, ...keepAttrs}) => keepAttrs)

      this.$apollo.mutate({
        mutation: CREATE_COVID_RUN,
        variables: {
          flowcells: flowcells
        }
      }).then(data => {
        let response = data.data.createCovidRun
        if (response.errors.length > 0) {
          this.$emit('alert', 'Failure: ' + data.data.createCovidRun.errors.join(', '), 'danger')
        } else {
          this.redirectToRuns()
        }
      })

    },
    redirectToRuns() {
      this.$router.push({ name: 'OntHeronRuns' })
    },
  },
  apollo: {
    run: {
      query: ONT_HERON_RUN_QUERY
    }
  }
}
</script>

<style>

.create-run-button {
  float: right;
}

</style>
