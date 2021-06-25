<template>
  <div>
    Pool
    <PacbioTagSetList></PacbioTagSetList>
    <PacbioTagSetShow></PacbioTagSetShow>
  </div>
</template>

<script>

import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList'
import PacbioTagSetShow from '@/components/pacbio/PacbioTagSetShow'

export default {
  name: 'PacbioPoolCreate',
  components: {
    PacbioTagSetList,
    PacbioTagSetShow
  },
  data() {
    return {
    }
  },
}
</script>
