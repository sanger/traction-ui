import BaseFactory from './BaseFactory.js'

/**
 * Factory for creating Saphyr Enzymes
 * @returns a base factory object with the run data
 * store data object is for simulating the stored data in tests
 */
const SaphyrEnzymeFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'enzymes',
        attributes: {
          name: 'enz1',
        },
      },
      {
        id: '2',
        type: 'enzymes',
        attributes: {
          name: 'enz2',
        },
      },
      {
        id: '3',
        type: 'enzymes',
        attributes: {
          name: 'enz3',
        },
      },
    ],
  }

  return BaseFactory(data)
}

export default SaphyrEnzymeFactory
