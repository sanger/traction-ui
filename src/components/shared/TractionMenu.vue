<template>
  <menu :class="['list-none inline-flex m-0 p-0 space-x-2 font-light', border ? `border-b-2` : ``]">
    <slot />
  </menu>
</template>
<script>
export default {
  /**
   * # TractionMenu
   *
   * This component provides a tailwind component to display a top level
   * menu.
   *
   * @example
   * <template>
   *   <div>
   *      <traction-menu :border="true">
   *         <traction-menu-item/>
   *      </traction-menu>
   *   </div>
   * </template>
   */
  name: 'TractionMenu',
  props: {
    border: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
