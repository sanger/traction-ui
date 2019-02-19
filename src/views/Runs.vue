<template>
    <div class="runs">
      <router-link :to="{name: 'NewRun'}">
        <b-button id="newRun" class="float-right">Create New Run</b-button>
      </router-link>
    </div>
</template>

<script>

export default {
  name: 'Runs',
  props: {
  },
  data () {
    return {
    }
  },
  created: function () {
  },
  methods: {
  },
  components: {

  },
  computed: {

  }
}
</script>
