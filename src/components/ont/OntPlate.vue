<template>
  <div>
    <b-button size="sm" variant="outline-success" :id="'pool-btn-'+plate.barcode" @click="poolSamples">
      Pool Samples
    </b-button>

    <Plate96SVG v-if="wells" v-bind:height="'30%'" v-bind:width="'30%'">
      <OntWell v-for="(well, position) in plateMap.wells" v-bind="well" v-bind:key="position" v-bind:well_info="getWellAt(position)">
      </OntWell>
    </Plate96SVG>
  </div>
</template>

<script>

import Plate96SVG from '@/components/svg/Plate96SVG'
import PlateMap from '@/config/PlateMap'
import OntWell from '@/components/ont/OntWell'
import WELLS_ALL_FOR_PLATE_QUERY from '@/graphql/queries/WellsAllForPlate.query.gql'
import POOL_SAMPLES from '@/graphql/queries/PoolSamples.mutation.gql'

export default {
  name: 'OntPlate',
  props: ['plate'],
  components: {
    Plate96SVG,
    OntWell,
  },
  apollo: {
    wells: {
      query: WELLS_ALL_FOR_PLATE_QUERY,
      variables () {
        return {
          plateId: parseInt(this.plate.id),
        }
      },
    }
  },
  methods: {
    getWellAt(position) {
      let well = this.wells.filter(well => well.position == position)[0]
      return well ? well : { position: position, materials: [] }
    },
    poolSamples () {
      this.$apollo.mutate({
        mutation: POOL_SAMPLES,
        variables: {
          plate_barcode: this.plate.barcode
        }
      }).then(data => {
        let response = data.data.createOntLibraries
        if (response.errors.length > 0) {
          this.$emit('alert', 'Failure: ' + data.data.createOntLibraries.errors.join(', '), 'danger')
        } else {
          let libraryNames = response.tubes.map(t => t.materials.map(m => m.name).join(', ')).join(', ')
          this.$emit('alert', 'Library(s) were created with names: ' + libraryNames, 'success')
        }
      })
    }
  },
  computed: {
    plateMap () {
      return PlateMap
    }
  }
}

</script>