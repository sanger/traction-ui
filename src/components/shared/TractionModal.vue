<template>
  <flagged-feature name="enable_custom_modal">
    <template #disabled>
      <b-modal v-bind="$attrs" ref="b-modal" :title="title" v-on="$listeners">
        <template v-for="(_, slot) of $scopedSlots" #[slot]="scope"
          ><slot :name="slot" v-bind="scope"
        /></template>
      </b-modal>
    </template>
    <div v-if="display" class="fixed z-20 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center pt-4 px-4 pb-20 text-center sm:block xl:p-0">
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-screen-md sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div
            class="border-b-2 border-gray-200 px-4 pb-4 sm:p-6 sm:pb-4 bg-gray-100 text-lg leading-6 font-medium text-gray-900"
          >
            <div class="flex items-end justify-end text-black">
              <button @click="close"><traction-close-icon /></button>
            </div>
            <template v-if="hasHeaderSlot"> <slot :name="`modal-header`" /></template>
            <template v-if="hasModalTitle"> <slot :name="`modal-title`" /></template>
            <label v-else>{{ title }}</label>
          </div>
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><slot /></div>
          <div class="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <slot :name="`modal-footer`" :ok="ok" :cancel="cancel"></slot>
          </div>
        </div>
      </div>
    </div>
  </flagged-feature>
</template>
<script>
import { BModal } from 'bootstrap-vue'
export default {
  /**
   *
   * v-slot:[slot]="scope" is same as #[slot]="scope"
   */
  name: 'TractionModal',
  components: { BModal },
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    //Create 'row' data based on initial data passed in through 'items' prop
    return {
      ok: () => {
        this.$emit('ok')
      },
      cancel: () => {
        this.$emit('cancel')
      },
      display: this.visible,
    }
  },
  computed: {
    hasHeaderSlot() {
      return !!this.$slots['modal-header']
    },
    hasModalTitle() {
      return !!this.$slots['modal-title']
    },
  },
  watch: {
    visible(newValue) {
      this.display = newValue
    },
  },

  methods: {
    close() {
      this.$emit('cancel')
    },
    showModal() {
      this.display = true
    },
  },
}
</script>
