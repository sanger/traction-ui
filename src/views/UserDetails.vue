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
<script setup>
import { onMounted, ref } from 'vue'
import oktaAuth from '@/lib/auth'

const name = ref('<Unknown User>')
const userClaims = ref([])
const claimFields = [
  { key: 'claimType', label: 'Properties' },
  { key: 'claimValue', label: 'Value' },
]

async function authClaims() {
  const authToken = await oktaAuth.tokenManager.get('idToken')
  return authToken?.claims || {}
}

async function userDetails() {
  const claims = await authClaims()
  name.value = claims.name || '<Unknown User>' // TODO: move this into a store or something, so we don't have to fetch the claims
  userClaims.value = Object.entries(claims).map(([claimType, claimValue]) => ({
    claimType,
    claimValue,
  }))
}

onMounted(userDetails)
</script>
