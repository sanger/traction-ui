<template>
  <div class="run">
    <GridionSVG>
      <OntFlowcell v-for="(flowcell, key) in flowcells" v-bind="flowcell" v-bind:key="key">
      </OntFlowcell>
    </GridionSVG>
  </div>
</template>

<script>
import GridionSVG from '@/components/svg/GridionSVG'
import OntFlowcell from '@/components/ont/OntFlowcell'

export default {
  name: 'OntRun',
  data () {
    return {
      flowcells: [ {xPos: 240}, {xPos: 320}, {xPos: 400}, {xPos: 480}, {xPos: 560}]
    }
  },
  components: {
    GridionSVG,
    OntFlowcell
  }
}
</script>

<style>
</style>
