<template>
  <div id="app">
    <b-container>
      <h1 class="text-left">Traction</h1>
      <h4 class="text-left"><span style="text-decoration: underline;">Saphyr</span> pipeline</h4>
      <div id="nav">
        <router-link to="/reception">Reception</router-link> |
        <router-link to="/samples">Samples</router-link> |
        <router-link to="/libraries">Libraries</router-link> |
        <router-link to="/runs">Runs</router-link>
      </div>
      <router-view/>
    </b-container>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px;
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
</style>
