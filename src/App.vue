<template>
  <div class="flex flex-col min-h-screen">
    <TractionHeader></TractionHeader>
    <div class="flex flex-col mb-auto px-4 pt-4 pb-10">
      <router-view class="text-center" />
    </div>
    <div
      v-show="hasMessages"
      class="fixed bottom-0 right-0 z-[1051] p-2 bg-white/75 backdrop-blur-sm rounded-md border shadow m-2 max-w-[500px] max-h-[500px] overflow-y-auto"
    >
      <div class="flex justify-end mb-2 border-sp border-b-2 tracking-tight leading-relaxed">
        <traction-button class="mb-2" data-testid="clear-alerts" @click="clearAlerts()"
          >Clear</traction-button
        >
      </div>
      <div class="w-full break-words">
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
import InfoFooter from '@/components/InfoFooter.vue'
import TractionMessage from '@/components/TractionMessage.vue'
import TractionHeader from '@/components/TractionHeader.vue'
import useRootStore from '@/stores'

export default {
  components: {
    InfoFooter,
    TractionMessage,
    TractionHeader,
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
      // Access the messages from the root store
      const rootStore = useRootStore()
      // Return the messages from the traction module
      return rootStore.messages || {}
    },
    hasMessages() {
      return !!Object.keys(this.messages).length
    },
  },
  methods: {
    dismiss(messageIndex) {
      const rootStore = useRootStore()
      rootStore.removeMessage(messageIndex)
    },
    clearAlerts() {
      const rootStore = useRootStore()
      rootStore.clearMessages()
    },
  },
}
</script>
