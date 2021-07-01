<template>
  <div>
    <div v-if="!isEmpty">
      <b-form-select v-model="selected" data-type="tag-set-list" :options="tagSets" @change="updateSelected"></b-form-select>
    </div>
    <div>
      <b-alert :show="isEmpty" data-type="error-message" dismissible variant="danger">
        There was a problem retrieving the tag sets
      </b-alert>
    </div>
  </div>
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
      return this.$store.getters['traction/pacbio/poolCreate/tagSetList'].map(
        ({ id: value, name: text }) => ({ value, text })
      )
    }
  },
  methods: {
    updateSelected() {
      this.$store.commit('traction/pacbio/poolCreate/selectTagSet', { id: this.selected })
    },
  },
}
</script>
