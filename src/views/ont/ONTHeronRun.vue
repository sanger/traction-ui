<template>
  <div class="run">
    <b-button class="float-right" variant="outline-success" id="create-run" @click="createRun()">
      Create Run
    </b-button>

    <ONTSVG>
      <OntFlowcell v-for="(flowcell, key) in flowcells" v-bind="flowcell" v-bind:key="key">
      </OntFlowcell>
    </ONTSVG>
  </div>
</template>

<script>
import ONTSVG from '@/components/svg/ONTSVG'
import OntFlowcell from '@/components/ont/OntFlowcell'
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
    OntFlowcell
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
        console.log(data)
        console.log("HERE")
      })

    }
  },
  apollo: {
    run: {
      query: ONT_HERON_RUN_QUERY
    }
  },
  created() {
    // if new
    // write data to cache
    // from apollo.js
  }
}
</script>

<style>
</style>
