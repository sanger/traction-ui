<template>
  <div>
    <traction-table v-bind="$attrs" v-on="$listeners">
      <template v-for="(_, slot) of $scopedSlots" #[slot]="scope"
        ><slot :name="slot" v-bind="scope" width="" height=""
      /></template>
    </traction-table>
  </div>
</template>

<script>
export default {
  name: 'BTableWrapper',
}
</script>
