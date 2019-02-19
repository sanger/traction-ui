<template>
  <div class="flowcell">
    <b-container>
      <b-row>
        <flowcellLibrary></flowcellLibrary>
      </b-row>
      <b-row>
        <flowcellLibrary></flowcellLibrary>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import FlowcellLibrary from '@/components/FlowcellLibrary'

export default {
  name: 'Flowcell',
  data () {
    return {
    }
  },
  components: {
    FlowcellLibrary,
  },
  methods: {
  },
  props: {
  },
  computed: {
  }
}
</script>
