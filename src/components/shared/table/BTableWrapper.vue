<template>
  <b-table-simple v-if="simple" v-bind="$attrs" v-on="$listeners">
    <b-thead>
      <b-tr>
        <b-th
          v-for="(field, fieldIndex) in $attrs.fields"
          :key="fieldIndex"
          class="px-2 py-4 bg-gray-50 content-center select-none"
        >
          {{ fieldText(field) }}
        </b-th>
      </b-tr>
    </b-thead>
    <b-tbody>
      <slot />
    </b-tbody>
  </b-table-simple>
  <b-table v-else v-bind="$attrs" v-on="$listeners">
    <template v-for="(_, slot) of $scopedSlots" #[slot]="scope"
      ><slot :name="slot" v-bind="scope" width="" height=""
    /></template>
  </b-table>
</template>

<script>
import { BTable, BTableSimple, BTr, BThead, BTh, BTbody } from 'bootstrap-vue'
export default {
  name: 'BTableWrapper',
  components: { BTable, BTableSimple, BTr, BTh, BThead, BTbody },
  inheritAttrs: false,
  props: {
    simple: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    fieldText(field) {
      return typeof field === 'object' && 'label' in field
        ? field.label
        : typeof field == 'string'
        ? field
        : ''
    },
  },
}
</script>
