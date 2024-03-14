<template>
  <div>
    <div
      :class="wellClassNames"
      data-attribute="traction-well"
      @mouseover.prevent="hover = true"
      @mouseleave.prevent="hover = false"
      @drop.prevent="drop"
      @dragenter.prevent
      @dragover.prevent="hover = true"
      @dragleave.prevent="hover = false"
      @click="onClick"
    >
      <p v-if="position" class="truncate font-light">{{ position }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TractionWell',
  props: {
    position: {
      type: String,
      required: false,
      default: '',
    },
    interactive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  emits: ['click','drop'],
  data() {
    return {
      hover: false,
    }
  },
  computed: {
    wellClassNames() {
      return [
        this.status,
        this.hover && this.interactive
          ? 'ring ring-pink-600 ring-offset-1'
          : 'border border-gray-800',
        this.interactive ? 'cursor-pointer' : '',
        'flex flex-col justify-center mx-auto rounded-full text-xs font-semibold aspect-square w-full select-none transition duration-200 ease-out',
      ]
    },
  },
  methods: {
    onClick() {
      this.$emit('click', this.position, this.plateNumber)
    },
    async drop(event) {
      this.hover = false
      this.$emit('drop', event)
    },
  },
}
</script>
