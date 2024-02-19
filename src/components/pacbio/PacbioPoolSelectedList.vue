<template>
  <div>
    <tube v-for="pool in poolsArray" :key="pool.id" v-bind="pool"> </tube>
  </div>
</template>

<script>
import Tube from '@/components/pacbio/PacbioPoolTubeItem'
import { mapState } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'

export default {
  name: 'PacbioPoolSelectedList',
  components: {
    Tube,
  },
  computed: {
    ...mapState(usePacbioRunCreateStore, ['poolsArray']),
  },
}
</script>
