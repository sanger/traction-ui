<template>
  <div id="app">
    <h1 id="traction-header">Traction</h1>
    <div id="nav">
      <router-link to="/reception">Reception</router-link> |
      <router-link to="/samples">Samples</router-link> |
      <router-link to="/libraries">Libraries</router-link>
    </div>
    <router-view/>
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
