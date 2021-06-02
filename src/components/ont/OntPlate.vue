<template>
  <div>
    <b-button
      :id="'pool-btn-' + plate.barcode"
      size="sm"
      variant="outline-success"
      @click="poolSamples"
    >
      Pool Samples
    </b-button>

    <Plate96SVG v-if="wells" ref="plate96Svg" :height="'30%'" :width="'30%'">
      <OntWell
        v-for="(well, position) in plateMap.wells"
        :key="position"
        ref="ontWell"
        v-bind="well"
        :well_info="getWellAt(position)"
      >
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
  components: {
    Plate96SVG,
    OntWell,
  },
  props: {
    plate: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  apollo: {
    wells: {
      query: WELLS_ALL_FOR_PLATE_QUERY,
      variables() {
        return {
          plateId: parseInt(this.plate.id),
        }
      },
    },
  },
  computed: {
    plateMap() {
      return PlateMap
    },
  },
  methods: {
    getWellAt(position) {
      let well = this.wells.filter((well) => well.position == position)[0]
      return well ? well : { position: position, materials: [] }
    },
    poolSamples() {
      this.$apollo
        .mutate({
          mutation: POOL_SAMPLES,
          variables: {
            plate_barcode: this.plate.barcode,
          },
        })
        .then((data) => {
          let response = data.data.createOntLibraries
          if (response.errors.length > 0) {
            this.$emit(
              'alert',
              'Failure: ' + data.data.createOntLibraries.errors.join(', '),
              'danger',
            )
          } else {
            let libraryNames = response.tubes
              .flatMap((t) => t.materials.map((m) => m.name))
              .join(', ')
            this.$emit('alert', 'Library(s) were created with names: ' + libraryNames, 'success')
          }
        })
    },
  },
}
</script>
<style>
.b-table-sticky-header {
  max-height: 500px;
}
</style>
