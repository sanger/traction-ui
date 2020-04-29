<template> 
  <div class="plate">
    <svg width="1158" height="568">
      <g transform="matrix(1,0,0,1,176,95)">
        <rect width="509" height="307"/>
      </g>

      <!-- Slot for a flowcell component -->
      <slot></slot>
    </svg>
  </div>
  
</template>

<script>

export default {
  name: 'GridionSVG',
}
</script>

<style scoped lang="scss">
  rect {
    stroke-width: 2;
    fill: rgb(255, 255, 255);
    fill-opacity: 1;
    stroke: rgb(27, 50, 128);
    stroke-opacity: 1;
  }
</style>
