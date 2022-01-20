<template>
  <b-container id="app" fluid>
    <br />
    <!-- TODO: move this into a header component -->
    <b-navbar ref="navbar" toggleable="md" type="dark" variant="info">
      <b-navbar-brand id="traction-header" to="/dashboard"><h2>Traction</h2></b-navbar-brand>
      <b-navbar-nav>
        <b-nav-text
          ><h2>{{ pipeline }} {{ page }}</h2></b-nav-text
        >
      </b-navbar-nav>
    </b-navbar>
    <Message
      v-for="(message, index) in messages"
      ref="alert"
      :key="index"
      v-bind="message"
      @dismissed="dismiss(index)"
    ></Message>
    <router-view />
    <InfoFooter></InfoFooter>
  </b-container>
</template>

<script>
import InfoFooter from '@/components/InfoFooter'
import Message from '@/components/Message'

export default {
  components: {
    InfoFooter,
    Message,
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
