<template>
  <div class="tag-set-list">
    <traction-section number="3" title="Tag Selection">
      <div class="text-left">
        Select tag set
        <traction-select
          v-if="!isEmpty"
          :model-value="selected"
          data-type="tag-set-list"
          :options="options"
          @update:model-value="updateSelected"
        ></traction-select>
      </div>
    </traction-section>
  </div>
</template>

<script>
/**
 * # OntTagSetList
 *
 * Displays a list of tagSets to select from for ont pooling
 */
// TODO: ONT store: Does this need to be moved to top level ONT?
export default {
  name: 'OntTagSetList',
  computed: {
    isEmpty() {
      return this.tagSets.length === 0
    },
    tagSets() {
      return this.$store.getters['traction/ont/pools/tagSetList'].map(
        ({ id: value, name: text }) => ({
          value,
          text,
        }),
      )
    },
    options() {
      return [{ value: null, text: 'Please select a tag set' }, ...this.tagSets]
    },
    selected() {
      const { id = null } = this.$store.getters['traction/ont/pools/selectedTagSet']
      return id
    },
  },
  methods: {
    updateSelected(id) {
      this.$store.commit('traction/ont/pools/selectTagSet', { id })
    },
  },
}
</script>
