<template>
  <div class="flex flex-row">
    <traction-input
      id="data-type"
      v-model="searchValue"
      type="search"
      placeholder="Type to Search"
      label="Search value"
      class="w-full"
    />
    <traction-button @click="search()"> Search </traction-button>
  </div>
</template>

<script>
export default {
  name: 'LabwareFinder',
  components: {},
  props: {
    fetcher: {
      type: Function,
      required: true,
    },
    filter: {
      type: String,
      required: false,
      default() {
        return ''
      },
    },
  },
  data() {
    return {
      searchValue: '',
    }
  },
  methods: {
    clearSearch() {
      this.searchValue = ''
    },
    async search() {
      await this.fetcher({ [this.filter]: this.searchValue }).then((res) => {
        if (res.success) {
          this.searchValue = ''
        } else {
          this.showAlert(res.errors, 'danger')
        }
      })
    },
  },
}
</script>
