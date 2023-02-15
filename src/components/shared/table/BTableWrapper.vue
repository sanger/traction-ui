<template>
  <div>
    <b-table v-bind="$attrs" v-on="$listeners">
      <template v-for="(_, slot) of $scopedSlots" #[slot]="scope"
        ><slot :name="slot" v-bind="scope" width="" height=""
      /></template>
    </b-table>
  </div>
</template>

<script>
import { BTable } from 'bootstrap-vue'
export default {
  name: 'BTableWrapper',
  components: { BTable },
}
</script>
