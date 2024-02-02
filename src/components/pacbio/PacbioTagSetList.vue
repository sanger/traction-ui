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
          @update:modelValue="updateSelected"
        ></traction-select>
      </div>
    </traction-section>
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
