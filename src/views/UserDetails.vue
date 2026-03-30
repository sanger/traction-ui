<template>
  <h2 class="text-2xl">Welcome {{ name }}!</h2>
  <br />
  <p>
    🎉 Congratulations! 🎉 You're now successfully logged in to your account. We're thrilled to have
    you as part of our community. Your journey starts here, and we're here to support you every step
    of the way. Below are your account details. 🔍 🌟🔐
  </p>
  <br />
  <div>
    <h2 class="text-2xl">User Information</h2>
    <br />

    <traction-table
      id="user-claims-table"
      :items="userClaims"
      :fields="claimFields"
      empty-text="No user claims available"
    />
  </div>
</template>
<script>
export default {
  name: 'UserDetails',
  data() {
    return {
      name: '<Unknown User>',
      userClaims: [],
      claimFields: [
        { key: 'claimType', label: 'Properties' },
        { key: 'claimValue', label: 'Value' },
      ],
    }
  },
  async created() {
    await this.userDetails()
  },
  methods: {
    async authClaims() {
      if (!this.authState?.isAuthenticated) return {}
      const authToken = await this.$auth.tokenManager.get('idToken')
      return authToken?.claims || {}
    },
    async userDetails() {
      const claims = await this.authClaims()
      this.name = claims.name // TODO: move this into a store or something, so we don't have to fetch the claims multiple times across different components
      this.userClaims = Object.entries(claims).map(([claimType, claimValue]) => ({
        claimType,
        claimValue,
      }))
    },
  },
}
</script>
