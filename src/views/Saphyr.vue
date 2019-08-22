<template>
  <div class="saphyr">
     <div id="nav">
      <router-link to="/dashboard" class="dashboard">Dashboard</router-link> |
      <router-link to="/saphyr/reception" class="reception">Reception</router-link> |
      <router-link to="/saphyr/samples" class="samples">Samples</router-link> |
      <router-link to="/saphyr/libraries" class="libraries">Libraries</router-link> |
      <router-link to="/saphyr/runs" class="runs">Runs</router-link>
    </div>
    <h4>Saphyr</h4>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'Saphyr',
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

<style lang="scss">
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
#traction-header {
  float: left;
}
</style>

