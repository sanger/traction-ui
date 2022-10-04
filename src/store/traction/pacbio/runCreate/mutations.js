import { populateById } from '@/api/JsonApi'

// Mutations handle synchronous update of state.
export default {
  populateSmrtLinkVersions: populateById('smrtLinkVersions'),
}
