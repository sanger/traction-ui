<template>
  <div class="flex flex-col min-h-screen">
    <!-- TODO: move this into a header component -->
    <div class="relative bg-gradient-to-tr from-sdb to-sdb-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div class="flex flex-row gap-x-2">
            <img class="w-8 h-8" src="./images/wsi-icon-16.png" alt="Traction logo" />
            <div class="text-sdb-100 text-xl">Traction</div>
          </div>
          <div class="flex justify-center">
            <Link name="Home" link="/dashboard" view-type="2" />
          </div>
        </div>
      </div>
    </div>
    <Heading level="1">{{ pipeline }} {{ page }}</Heading>
    <div class="flex flex-col mb-auto px-4 py-10">
      <router-view class="text-center" />
    </div>
    <Message
      v-for="(message, index) in messages"
      ref="alert"
      :key="index"
      v-bind="message"
      @dismissed="dismiss(index)"
    ></Message>
    <InfoFooter></InfoFooter>
  </div>
</template>

<script>
import InfoFooter from '@/components/InfoFooter'
import Message from '@/components/Message'
import Link from '@/components/Link'
import Heading from '@/components/Heading'
export default {
  components: {
    InfoFooter,
    Message,
    Link,
    Heading,
  },
  computed: {
    mergedRoute() {
      return Object.assign({}, ...this.$route.matched.map(({ meta }) => meta))
    },
    pipeline() {
      // Merge the route meta attributes and pull out the pipeline
      return this.mergedRoute.pipeline
    },
    page() {
      return this.mergedRoute.page
    },
    messages() {
      return this.$store.getters['traction/messages']
    },
  },
  methods: {
    dismiss(messageIndex) {
      this.$store.commit('traction/removeMessage', messageIndex)
    },
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  margin-bottom: 5px;
}
#nav {
  margin-bottom: 5px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
    &.router-link-active {
      color: #42b983;
    }
  }
}
a {
  color: black;
  &:hover {
    text-decoration: none;
    color: black;
  }
}
</style>
