import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from '@/api/JsonApi.js'

const createStoreData = (data) => {
  return {
    workflows: Object.values(dataToObjectById({ data: data.data, includeRelationships: true })),
    steps: dataToObjectById({ data: data.included }),
  }
}
/**
 * Factory for creating a list of workflows
 * @returns {Object} { workflows, storeData }
 * store data object is for simulating the stored data in tests
 */
const WorkflowFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'workflows',
        attributes: {
          name: 'pacbio',
        },
        relationships: {
          workflow_steps: {
            data: [
              { id: '1', type: 'workflow_steps' },
              { id: '2', type: 'workflow_steps' },
              { id: '5', type: 'workflow_steps' },
            ],
          },
        },
      },
      {
        id: '2',
        type: 'workflows',
        attributes: {
          name: 'bioNano',
        },
        relationships: {
          workflow_steps: {
            data: [
              { id: '3', type: 'workflow_steps' },
              { id: '4', type: 'workflow_steps' },
              { id: '5', type: 'workflow_steps' },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '1',
        type: 'workflow_steps',
        attributes: {
          code: 'step1',
          stage: 'initial',
        },
      },
      {
        id: '2',
        type: 'workflow_steps',
        attributes: {
          code: 'step2',
          stage: 'middle',
        },
      },
      {
        id: '3',
        type: 'workflow_steps',
        attributes: {
          code: 'BDLE',
          stage: 'Extraction',
        },
      },
      {
        id: '4',
        type: 'workflow_steps',
        attributes: {
          code: 'BEXT',
          stage: 'Labelling',
        },
      },
      {
        id: '5',
        type: 'workflow_steps',
        attributes: {
          code: 'FINAL',
          stage: 'Concluding',
        },
      },
    ],
  }

  return { ...BaseFactory(data), storeData: createStoreData(data) }
}

export default WorkflowFactory
