<template>
  <div class="sample-table">

    <table>
      <tr v-for="sample in samples" v-bind:key="sample.name">
        <td>{{ sample.id }}</td> 
        <td>{{ sample.name }}</td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  name: 'SampleTable',

  data () {
    return {
    }
  },
  props: {
    samples: {
      type: Array,
      default: function () {
        return []
      }
    }
  }
}
</script>
