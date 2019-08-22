<template>
   <div class="pacbio">
     <div id="nav">
      <router-link to="/dashboard" class="dashboard">Dashboard</router-link> |
      <router-link to="/pacbio/reception" class="reception">Reception</router-link> |
      <router-link to="/pacbio/samples" class="samples">Samples</router-link> |
      <router-link to="/pacbio/libraries" class="libraries">Libraries</router-link> |
      <router-link to="/pacbio/runs" class="runs">Runs</router-link>
    </div>
    <h4>PacBio</h4>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'Pacbio',
  mixins: [],
  props: {
  },
  data () {
    return {
    }
  },
  methods: {
  },
  components: {
  },
  computed: {
  },
  created () {
  }
}
</script>

<style>
</style>
