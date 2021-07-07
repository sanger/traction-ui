<template>
  <div data-type="pool-library-edit">
    <div data-attribute="sample-name">
      {{ request.sample_name}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PacbioPoolLibraryEdit',
  props: {
    request: {
      type: Object,
      default() {
        return ''
      },
    },
  }
}
</script>