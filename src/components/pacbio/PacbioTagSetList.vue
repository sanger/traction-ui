<template>
  <div data-type="tag-set-list">
    <b-form-select v-model="selected" :options="tagSets" @change="updateSelected"></b-form-select>
  </div>
</template>

<script>
export default {
  name: 'PacbioTagSetList',
  data() {
    return {
      selected: null,
      tagSets: [],
    }
  },
  mounted() {
    this.tagSets = this.$store.getters['traction/pacbio/poolCreate/tagSetList'].map(
      ({ id: value, name: text }) => {
        return { value, text }
      },
    )
  },
  methods: {
    updateSelected() {
      this.$store.commit('traction/pacbio/poolCreate/selectTagSet', this.selected)
    },
  },
}
</script>
