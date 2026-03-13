<template>
  <router-link to="/" tag="button" id="home-button"> Home </router-link>
  <button v-if="authState && authState.isAuthenticated" v-on:click="logout" id="logout-button">
    Logout
  </button>
  <button v-else v-on:click="login" id="login-button">Login</button>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TractionSessionButton',
  methods: {
    async login() {
      await this.$auth.signInWithRedirect()
    },
    async logout() {
      await this.$auth.signOut()
    },
  },
})
</script>
