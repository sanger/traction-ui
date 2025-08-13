import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from './../../src/api/JsonApi.js'

const AnnotationTypeFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'annotation_types',
        links: { self: 'http://localhost:3100/v1/annotation_types/1' },
        attributes: { name: 'Top up' },
      },
      {
        id: '2',
        type: 'annotation_types',
        links: { self: 'http://localhost:3100/v1/annotation_types/2' },
        attributes: { name: 'Sequencing only' },
      },
      {
        id: '3',
        type: 'annotation_types',
        links: { self: 'http://localhost:3100/v1/annotation_types/3' },
        attributes: { name: 'Non-barcoded' },
      },
      {
        id: '4',
        type: 'annotation_types',
        links: { self: 'http://localhost:3100/v1/annotation_types/4' },
        attributes: { name: 'R&D cell' },
      },
    ],
    meta: { page_count: null },
  }

  return { ...BaseFactory(data), storeData: dataToObjectById({ ...data }) }
}

export default AnnotationTypeFactory
