<template>
  <b-container id="app" fluid>
    <br />
    <router-link to="/dashboard">
      <h1 id="traction-header">Traction</h1>
    </router-link>
    <router-view />
    <InfoFooter></InfoFooter>
  </b-container>
</template>

<script>
import InfoFooter from '@/components/InfoFooter'
export default {
  components: {
    InfoFooter,
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding-bottom: 20px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
    &.router-link-active {
      color: #42b983;
    }
  }
}
a {
  color: black;
  &:hover {
    text-decoration: none;
    color: black;
  }
}
</style>
