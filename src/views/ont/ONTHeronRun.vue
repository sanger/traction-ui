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
    }
  }
}
</script>

<style>
</style>
