<template>
  <header class="bg-white">
    <div class="max-w-7xl mx-auto py-2 sm:px-6 lg:px-8 text-black text-left">
      <div :class="getClass">
        <slot />
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: 'Heading',
  props: {
    /**
     * Level specifies the size of the heading text displayed.
     * level = 1' is the largest size and text size decreases as level values increses
     */
    level: {
      type: [Number, String],
      default: 1,
    },
    showBorder: Boolean,
    shadow: Boolean,
  },
  computed: {
    getClass() {
      return {
        'text-3xl font-bold tracking-tight leading-loose': this.level == 1,
        'text-2xl font-bold tracking-tight leading-relaxed': this.level == 2,
        'text-xl font-bold tracking-tight leading-relaxed': this.level == 3,
        'text-lg font-bold tracking-tight leading-relaxed': this.level == 4,
        'text-base font-bold tracking-tight leading-relaxed': this.level == 5,
        'text-sm font-bold tracking-tight leading-relaxed': this.level == 6,
        'text-xs font-bold tracking-tight leading-relaxed': this.level == 7,
        'border-b-2 border-sp': this.showBorder,
        shadow: this.shadow,
      }
    },
  },
}
</script>
