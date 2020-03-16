<template>
  <div class="PageNotFound">
      <br>
      <h2>Page not found</h2>
      <br>
      <h3>Some useful links:</h3>
      <router-link :to="{name: 'Dashboard'}">
        <label id="backToDashboard">Dashboard</label>
      </router-link>
  </div>
</template>

<script>

export default {
  name: 'PageNotFound',
}
</script>

<style>

h3,label{
  font-size: 20px;
}

h2 {
  font-size: 30px;
}
</style>