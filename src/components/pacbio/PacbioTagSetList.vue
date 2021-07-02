<template>
  <b-col class="tag-set-list">
    <b-form-select
      v-if="!isEmpty"
      v-model="selected"
      data-type="tag-set-list"
      :options="options"
      @change="updateSelected"
    ></b-form-select>
    <div>
      <b-alert :show="isEmpty" data-type="error-message" dismissible variant="danger">
        There was a problem retrieving the tag sets
      </b-alert>
    </div>
  </b-col>
</template>

<script>
export default {
  name: 'PacbioTagSetList',
  data() {
    return {
      selected: null,
    }
  },
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
  },
  methods: {
    updateSelected() {
      this.$store.commit('traction/pacbio/poolCreate/selectTagSet', { id: this.selected })
    },
  },
}
</script>

<style scoped lang="scss">
.tag-set-list {
  padding: 0;
}
</style>
