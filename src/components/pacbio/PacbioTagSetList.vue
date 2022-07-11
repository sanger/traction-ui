<template>
  <div class="tag-set-list">
    <h3>Select tag set</h3>
    <traction-select
      v-if="!isEmpty"
      :value="selected"
      data-type="tag-set-list"
      :options="options"
      @change="updateSelected"
    ></traction-select>
  </div>
</template>

<script>
export default {
  name: 'PacbioTagSetList',
  computed: {
    isEmpty() {
      return this.tagSets.length === 0
    },
    tagSets() {
      return this.$store.getters['traction/pacbio/poolCreate/tagSetList'].map(
        ({ id: value, name: text }) => ({ value, text }),
      )
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
