<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 text-black">
      <h1 :class="getClass()">
        <slot />
      </h1>
    </div>
  </header>
</template>
<script>
export default {
  name: 'Heading',
  props: {
    level: {
      type: Number,
      default: 1,
    },
    showBorder: Boolean,
  },
  methods: {
    getClass() {
      return {
        'text-3xl font-bold tracking-tight leading-loose': this.level == 1,
        'text-2xl font-bold tracking-tight leading-relaxed': this.level == 2,
        'text-xl font-bold tracking-tight leading-relaxed': this.level == 3,
        'text-lg font-bold tracking-tight leading-relaxed': this.level == 4,
        'text-base font-bold tracking-tight leading-relaxed': this.level ==5,
        'text-sm font-bold tracking-tight leading-relaxed': this.level ==6,
         'text-xs font-bold tracking-tight leading-relaxed': this.level ==7,
        'border-b-2 border-sp': this.showBorder,
      }
    },
  },
}
</script>
