<template>
  <div class="run">
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
  name: 'GridIONRun',
  data () {
    return {
      flowcells: [ {xPos: 240}, {xPos: 320}, {xPos: 400}, {xPos: 480}, {xPos: 560}]
    }
  },
  components: {
    ONTSVG,
    OntFlowcell
  }
}
</script>

<style>
</style>
