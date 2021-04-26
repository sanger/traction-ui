<template>
  <svg width="700" height="450">
    <g>
      <rect width="500" height="300" />
    </g>

    <!-- Slot for a flowcell component -->
    <slot></slot>
  </svg>
</template>

<script>
export default {
  name: 'ONTSVG',
}
</script>

<style scoped lang="scss">
rect {
  transform: matrix(1, 0, 0, 1, 176, 95);
  fill: rgb(255, 255, 255);
  stroke: rgb(0, 0, 0);
}
</style>
