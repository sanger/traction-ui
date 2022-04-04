<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight leading-loose text-left">
        <slot />
      </h1>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Heading',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
}
</script>
