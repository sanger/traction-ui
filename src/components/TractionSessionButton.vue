<template>
  <div class="flex flex-row items-center">
    <div :class="menuClasses" tabindex="0" @click="showMenu = !showMenu" @focusout="hideMenu">
      <div class="relative">
        <div
          class="flex flex-row items-center text-gray-400 gap-x-2 p-2"
          data-attribute="account-identifier"
        >
          <p v-if="authState && authState.isAuthenticated" class="text-sm">{{ userInfo.name }}</p>
          <TractionAccountIcon class="h-8 w-8" />
        </div>
        <div
          v-show="showMenu"
          class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg"
          style="opacity: 1; transform: none"
        >
          <div
            class="rounded-md bg-white shadow-xs focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            <button
              v-if="authState && authState.isAuthenticated"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-sp-400 active:text-white w-full text-left rounded-md cursor-pointer"
              role="menuitem"
              data-discover="true"
              data-action="logout"
              @click="logout"
            >
              Logout
            </button>
            <button
              v-else
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-sp-400 active:text-white w-full text-left rounded-md cursor-pointer"
              role="menuitem"
              data-discover="true"
              data-action="login"
              @click="login"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAuth } from '@okta/okta-vue'

const auth = useAuth()

const login = async () => {
  await auth.signInWithRedirect()
}

const logout = async () => {
  await auth.signOut()
}

const hideMenu = (event) => {
  // Check if the newly focused element is outside the menu
  if (!event.currentTarget.contains(event.relatedTarget)) {
    showMenu.value = false
  }
}

const menuClasses = computed(() => {
  let classes =
    'flex flex-row items-center cursor-pointer rounded-md hover:backdrop-brightness-80 transition-all duration-200'
  classes += showMenu.value ? ' backdrop-brightness-80' : ''
  return classes
})

const userInfo = ref({ name: 'Unknown' })
const showMenu = ref(false)

onMounted(async () => {
  if (await auth.isAuthenticated()) {
    userInfo.value = await auth.getUser()
  }
})
</script>
