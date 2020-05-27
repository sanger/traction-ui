<template>
  <div class="ont-run-libraries" v-on:drop="drop" v-on:dragover="allowDrop" v-bind:class="{active: hover}">
    <b-list-group class="ont-run-libraries-list-group" >
      <OntTube v-for="library in libraries" v-bind:key="library.id" v-bind="library">
      </OntTube>
    </b-list-group>
  </div>
</template>

<script>
import LIBRARIES_ALL_QUERY from '@/graphql/queries/LibrariesAll.query.gql'
import OntTube from '@/components/ont/OntTube'

export default {
  name: 'OntRunLibrariesList',
  components: {
    OntTube
  },
  data () {
    return {
      hover: false,
    }
  },
  apollo: {
    libraries: {
      query: LIBRARIES_ALL_QUERY,
       variables () {
        return {
          unassignedToFlowcells: true,
        }
      },
    }
  },
  methods: {
    allowDrop (event) {
      event.preventDefault()
      this.hover = true
    },
    endDrop (event) {
      event.preventDefault()
      this.hover = false
    },
    drop (event) {
      event.preventDefault()
      console.log('dropping ...')
      const name = event.dataTransfer.getData('name')
      let el = document.getElementById(event.dataTransfer.getData('name'))
      el.parentNode.hidden = false
      this.hover = false

      el = document.getElementById(`${name}-img`)
      el.parentNode.removeChild(el)
    },
  }
}
</script>

<style scoped lang="scss">

.ont-run-libraries {
  border: solid;
  border-width: 1px;
  padding: 20px;

}

.active {
  background-color: gray;
}

.ont-run-libraries-list-group {
  max-height: 400px;
  overflow: scroll;
}

</style>