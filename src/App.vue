<template>
  <b-container id="app" fluid>
    <br />
    <!-- TODO: move this into a header component and add pipeline to store -->
    <b-navbar ref="navbar" toggleable="md" type="dark" variant="info">
      <b-navbar-brand id="traction-header" to="/dashboard"><h2>Traction</h2></b-navbar-brand>
      <b-nav-text
        ><h2>{{ pipeline }}</h2></b-nav-text
      >
    </b-navbar>
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
  computed: {
    pipeline() {
      return localStorage.getItem('pipeline')
    },
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
nav {
  margin-bottom: 5px;
}
#nav {
  margin-bottom: 5px;
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
