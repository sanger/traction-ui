<template>
  <div class="PageNotFound">
    <br />
    <h2>Page not found</h2>
    <br />
    <h3>Some useful links:</h3>
    <router-link :to="{ name: 'Dashboard' }">
      <label id="backToDashboard">Dashboard</label>
    </router-link>
    |
    <router-link :to="{ name: 'SaphyrRuns' }">
      <label id="backToSaphyrRuns">Saphyr Runs</label>
    </router-link>
    |
    <router-link :to="{ name: 'PacbioRunIndex' }">
      <label id="backToPacbioRuns">Pacbio Runs</label>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound',
}
</script>
