<template>
  <div class="flex-col text-xl">
    <img class="w-32 h-32 mx-auto" src="../images/traction-logo.svg" alt="Traction logo" />
    <h2 class="text-3xl my-5">Page not found</h2>
    <h3>Some useful links:</h3>
    <div class="my-5">
      <router-link id="dashboard-link" :to="{ name: 'Dashboard' }" class="border-r-2 px-2">
        Dashboard
      </router-link>
      <router-link id="pacbio-link" :to="{ name: 'PacbioRunIndex' }" class="border-r-2 px-2">
        Pacbio Runs
      </router-link>
      <router-link id="ont-link" :to="{ name: 'ONTRunIndex' }" class="px-2"> Ont Runs </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound',
}
</script>
