<template>
  <div class="flex flex-col min-h-screen">
    <!-- TODO: move this into a header component -->
    <div class="relative bg-gradient-to-tr from-sdb to-sdb-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div class="flex flex-row gap-x-2">
            <img class="w-8 h-8" src="./images/traction-logo.svg" alt="Traction logo" />
            <div class="text-white text-2xl">Traction</div>
            <TractionLink name="Home" link="/dashboard" view-type="2" />
            <TractionLink name="Label Printing" link="/label-printing" view-type="2" />
            <TractionLink name="QC Results Upload" link="/qc-results-upload" view-type="2" />
            <TractionLink name="Reception" link="/reception" view-type="2" />
          </div>
        </div>
      </div>
    </div>
    <TractionHeading level="1" shadow>{{ pipeline }} {{ page }}</TractionHeading>
    <div class="flex flex-col mb-auto px-4 pt-4 pb-10">
      <router-view class="text-center" />
    </div>
    <div
      v-show="hasMessages"
      class="bottom-0 fixed right-0 -top-2 z-[1051] p-2 bg-white/75 backdrop-blur-sm rounded-md border shadow m-2"
    >
      <div class="flex justify-end mb-2 border-sp border-b-2 tracking-tight leading-relaxed">
        <traction-button class="mb-2" @click="clearAlerts()">Clear</traction-button>
      </div>
      <div class="max-h-[500px] overflow-y-scroll w-full max-w-[500px] break-words">
        <TractionMessage
          v-for="(message, index) in messages"
          ref="alert"
          :key="index"
          v-bind="message"
          @dismissed="dismiss(index)"
        ></TractionMessage>
      </div>
    </div>
    <InfoFooter></InfoFooter>
  </div>
</template>

<script>
import InfoFooter from '@/components/InfoFooter'
import TractionMessage from '@/components/TractionMessage'
import TractionLink from '@/components/TractionLink'
import TractionHeading from '@/components/TractionHeading'

export default {
  components: {
    InfoFooter,
    TractionMessage,
    TractionLink,
    TractionHeading,
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
    hasMessages() {
      return !!Object.keys(this.messages).length
    },
  },
  methods: {
    dismiss(messageIndex) {
      this.$store.commit('traction/removeMessage', messageIndex)
    },
    clearAlerts() {
      this.$store.commit('traction/clearMessages')
    },
  },
}
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
