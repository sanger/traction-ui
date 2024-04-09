<template>
  <div class="flex flex-row">
    <traction-input
      id="labware-finder-input"
      ref="search"
      v-model="searchValue"
      type="search"
      placeholder="Type to Search"
      label="Search value"
      class="w-full"
      @enter-key-press="search()"
    />
    <traction-button data-action="find-labware" :disabled="searchValue == ''" @click="search()">
      Search
    </traction-button>
  </div>
</template>

<script>
/**
 * # LabwareFinder
 *
 * This component contains elements required to perform a search to traction-service.
 * This is typically used when finding specific labware e.g. plates
 *
 * @example
 * <template>
 *     <LabwareFinder :fetcher="findOntPlate" filter="barcode"/>
 * </template>
 */
export default {
  name: 'LabwareFinder',
  components: {},
  props: {
    // A method that performs the required data fetch
    fetcher: {
      type: Function,
      required: true,
    },
    // The filter to apply the fetcher
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
    async search() {
      await this.fetcher({ [this.filter]: this.searchValue }).then((res) => {
        if (res.success) {
          this.searchValue = ''
        } else {
          this.showAlert(res.errors, 'danger')
        }
      })
      // redirecting the focus to the input after searching
      this.$refs.search.$refs.inputRef.focus()
    },
  },
}
</script>
