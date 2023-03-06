import { dataToObjectById } from '@/api/JsonApi'

const mutations = {
  setPlates(state, plates) {
    state.plates = dataToObjectById({ data: plates, includeRelationships: true })
  },
}

export default mutations
