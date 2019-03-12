<template>
  <div class="dataTable">
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'DataTable',
  data () {
    return {
      message: '',
    }
  },
  methods: {
  },
  props: {
  },
  computed: {
  }
}
</script>
