<template>
  <b-col class="tag-set-list">
    <h3>Select tag set</h3>
    <b-form-select
      v-if="!isEmpty"
      v-model="selected"
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
@import 'src/styles/components.scss';
</style>
