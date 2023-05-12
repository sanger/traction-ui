<!--/**
   * # TractionModal
   * Tailwind component to display an html modal dialog. The overall design of this component, in particular, the scoped slot design, 
     data structures, and event handling is based on how a bootstrap modal is working so as to make this compatible with b-modal 
     through 'enable_custom_modal' feature flag
   * The modal dialog includes  header, body and  footer
        header - displayed using 'modal-header' scoped slot, or if only requires title can either use 'title' prop or 'modal-title'
        body -   default slot is displyed as modal body
        footer - displayed using 'modal-footer' scoped slot 
        close button - dispalyed always in header,which closes the dialog on click
   */
   -->

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
            class="flex flex-row border-b-2 border-gray-200 p-4 pb-4 sm:p-6 sm:pb-4 bg-gray-100 text-lg leading-6 font-medium text-gray-900"
          >
            <div class="w-full mt-2">
              <template v-if="hasHeaderSlot"> <slot :name="`modal-header`" /></template>
              <template v-if="hasModalTitle"> <slot :name="`modal-title`" /></template>
              <label v-else>{{ title }}</label>
            </div>
            <div class="flex justify-end">
              <button class="text-gray-800 hover:text-black" data-attribute="close" @click="close">
                <traction-close-icon />
              </button>
            </div>
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
  name: 'TractionModal',
  components: { BModal },
  inheritAttrs: false,
  props: {
    /**Prop to make the dialog visible or not */
    visible: {
      type: Boolean,
      default: false,
    },
    /**Title to display in modal header, if don't want to use scoped slots */
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      /**'ok' event emitted from footer, if there is a corresponding button in 'modal-footer' scoped slot */
      ok: () => {
        this.$emit('ok')
      },
      /**'cancel' event emitted from footer, if there is a corresponding button in 'modal-footer' scoped slot */
      cancel: () => {
        this.$emit('cancel')
      },
      /**Mutable property to make the dialog visible or not */
      display: this.visible,
    }
  },
  computed: {
    /**Is there a scoped slot defined to display header? */
    hasHeaderSlot() {
      return !!this.$slots['modal-header']
    },
    /**Is there a scoped slot defined to display title? */
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
    /**Close button clicked, so hide the dialog */
    close() {
      this.$emit('cancel')
      this.display = false
    },
  },
}
</script>
