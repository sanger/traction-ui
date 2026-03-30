<template>
  <div v-if="!authState?.isAuthenticated">
    <button id="login-button" v-on:click="userLogin">Login</button>
  </div>
  <div v-else>
    <button class="logoutBtn" v-on:click="userLogout">Logout</button>
  </div>

  <div v-if="authState?.isAuthenticated">
    <h1>Welcome {{ userData && userData.name }}!</h1>
    <br />
    <p>
      🎉 Congratulations! 🎉 You're now successfully logged in to your account. We're thrilled to
      have you as part of our community. Your journey starts here, and we're here to support you
      every step of the way. Below are your account details. 🔍 🌟🔐
    </p>
    <br />
    <div>
      <h1>User Information</h1>
      <br />
      <table class="detail-table">
        <thead>
          <tr>
            <th>Properties</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(x, index) in userClaims" :key="index">
            <td>{{ x.claimType }}</td>
            <td :id="'id-' + x.claimType">{{ x.claimValue }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HomeView',
  data: function () {
    return {
      userData: null,
      userClaims: [],
    }
  },
  async created() {
    this.userDetails()
  },
  methods: {
    async userDetails() {
      if (this.authState?.isAuthenticated) {
        const authToken = await this.$auth.tokenManager.get('idToken')
        this.userArray = await this.$auth.getUser()
        this.userClaims = Object.entries(authToken.claims).map(([claimType, claimValue]) => ({
          claimType,
          claimValue,
        }))
      }
    },
    async userLogout() {
      await this.$auth.signOut()
    },
    async userLogin() {
      await this.$auth.signInWithRedirect()
    },
  },
}
</script>
