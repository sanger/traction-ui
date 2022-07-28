<template>
  <div>
    <p>
      This page is a placeholder, it is intended to check the results of the ONT reception only.
    </p>
    <ul>
      <li v-for="(request, i) in requests" :key="i">{{ request }}</li>
    </ul>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/ont')

export default {
  name: 'ONTSampleIndex',
  computed: {
    ...mapGetters(['requests']),
  },
  created() {
    this.fetchOntRequests()
  },
  methods: {
    ...mapActions(['fetchOntRequests']),
  },
}
</script>
