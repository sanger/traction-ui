<template>
  <b-col class="tag-set-list">
    <h3>Select tag set</h3>
    <b-form-select
      v-if="!isEmpty"
      :value="selected"
      data-type="tag-set-list"
      :options="options"
      @change="updateSelected"
    ></b-form-select>
    <div>
      <alert ref="alert"></alert>
    </div>
  </b-col>
</template>

<script>
import Helper from '@/mixins/Helper'
import Alert from '@/components/Alert'

export default {
  name: 'PacbioTagSetList',
  components: { Alert },
  mixins: [Helper],
  computed: {
    isEmpty() {
      return this.tagSets.length === 0
    },
    tagSets() {
      return this.$store.getters[
        'traction/pacbio/poolCreate/tagSetList'
      ].map(({ id: value, name: text }) => ({ value, text }))
    },
    options() {
      return [{ value: null, text: 'Please select a tag set' }, ...this.tagSets]
    },
    selected() {
      const { id = null } = this.$store.getters['traction/pacbio/poolCreate/selectedTagSet']
      return id
    },
  },
  methods: {
    updateSelected(id) {
      this.$store.commit('traction/pacbio/poolCreate/selectTagSet', { id })
    },
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';
</style>
