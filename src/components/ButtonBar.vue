<template>
  <div
    class="border border-t-2 border-gray-200 w-full py-4 px-4 sm:px-6 lg:px-8 bg-gray-100 flex-shrink-0 "
  >
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-row items-center justify-end space-x-2">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ButtonBar',
}
</script>
