<template>
  <div data-type='tag-set-list'>
    <b-form-select v-model="selected" :options="tagSets"></b-form-select>
  </div>
</template>

<script>

export default {
  name: 'PacbioTagSetList',
  data() {
    return {
      selected: null,
      tagSets: []
    }
  },
  mounted() {
    this.tagSets = this.$store.getters['traction/pacbio/tagSetList'].map(({id: value, name: text}) => {
      return {value, text}
    })
  }
}
</script>
