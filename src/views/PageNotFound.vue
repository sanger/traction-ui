<template>
  <div class="PageNotFound">
      <h2>Page not found</h2>
      <br>
      <router-link :to="{name: 'Dashboard'}">
        <label id="backToDashboard">Return to Dashboard</label>
      </router-link>
  </div>
</template>

<script>

export default {
  name: 'PageNotFound',
}
</script>

<style>

h2 {
  font-size: 20px;
}

label {
  font-size: 15px;
}
</style>