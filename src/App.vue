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
            <flagged-feature name="dpl_478_enable_qc_results_upload">
              <TractionLink name="QC Results Upload" link="/qc-results-upload" view-type="2" />
            </flagged-feature>
            <flagged-feature name="dpl_277_enable_general_reception">
              <TractionLink name="Reception" link="/reception" view-type="2" />
            </flagged-feature>
          </div>
        </div>
      </div>
    </div>
    <TractionHeading level="1" shadow>{{ pipeline }} {{ page }}</TractionHeading>
    <div class="flex flex-col mb-auto px-4 py-10">
      <router-view class="text-center" />
    </div>
    <div class="message-container">
      <TractionMessage
        v-for="(message, index) in messages"
        ref="alert"
        :key="index"
        v-bind="message"
        @dismissed="dismiss(index)"
      ></TractionMessage>
    </div>
    <InfoFooter></InfoFooter>
  </div>
</template>

<script>
import InfoFooter from '@/components/InfoFooter'
import TractionMessage from '@/components/TractionMessage'
import TractionLink from '@/components/TractionLink'
import TractionHeading from '@/components/TractionHeading'

import PipelinesConfig from '@/config/PipelinesConfig'
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
    pipelines: () => PipelinesConfig,
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
.message-container {
  position: fixed;
  bottom: 0;
  right: 1em;
  width: 30em;
  z-index: 1051;
  word-break: break-word;
}
</style>
