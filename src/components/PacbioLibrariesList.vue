<template>
  <div class="libraries">
    <b-list-group class="list-group">
      <tube v-for="library in libraries" v-bind:key="library.id" v-bind="library">
      </tube>
    </b-list-group>
  </div>
</template>

<script>
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/tubes')
import Tube from '@/components/Tube'

export default {
  name: 'PacbioLibrariesList',
  mixins: [Helper, TableHelper],
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'libraries'
    ])
  },
  methods: {
    async provider() {
        try {
        await this.setLibraries()
      } catch (error) {
        this.showAlert("Failed to get libraries: " + error.message, 'danger')
      }
    },
    ...mapActions([
      'setLibraries'
    ])
  },
  created() {
    this.provider()
  },
  components: {
    Tube
  }
}
</script>

<style>

.libraries {
  border: solid;
  border-width: 1px;
  padding: 20px;
}

.list-group {
    max-height: 400px;
    overflow: scroll;
}

</style>