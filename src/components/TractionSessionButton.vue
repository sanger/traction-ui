<template>
  <button v-if="authState && authState.isAuthenticated" id="logout-button" @:click="logout">
    Logout
  </button>
  <button v-else id="login-button" @:click="login">Login</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TractionSessionButton',
  methods: {
    async login() {
      console.log('Logging in')
      await this.$auth.signInWithRedirect()
    },
    async logout() {
      console.log('Logging out')
      await this.$auth.signOut()
    },
  },
})
</script>
