<template>
  <div class="w-full mx-auto max-w-screen">
    <!-- TODO: move this into a header component -->

    <div class="flex flex-col">
      <div class="relative bg-gradient-to-tr from-sdb to-sdb-400">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            <div class="flex w-full justify-start min-w-screen">
              <TractionLink name="Traction" link="/dashboard"></TractionLink>
            </div>
          </div>
        </div>
      </div>
      <Header>{{ pipeline }} {{ page }}</Header>
      <Message
        v-for="(message, index) in messages"
        ref="alert"
        :key="index"
        v-bind="message"
        @dismissed="dismiss(index)"
      ></Message>
      <div class="flex flex-grow-1 mt-8">
        <router-view class="text-center"/>
      </div>
      <InfoFooter></InfoFooter>
    </div>

    
  </div>
</template>

<script>
import InfoFooter from '@/components/InfoFooter'
import Message from '@/components/Message'
import TractionLink from '@/components/TractionLink'
import Header from '@/components/Header'

export default {
  components: {
    InfoFooter,
    Message,
    TractionLink,
    Header,
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
