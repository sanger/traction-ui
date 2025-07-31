import BaseFactory from './BaseFactory.js'

/*
 * Factory for creating a list of sequencescape labware
 * @returns a base factory object with the labware data
 */
const SequencescapeStudyFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'studies',
        attributes: {
          name: 'Study 1',
          // Note this is the external_study_id of the PacbioRequestFactory requests
          uuid: 'fec8a1fa-b9e2-11e9-9123-fa163e99b035',
        },
        relationships: {
          study_metadata: {
            data: {
              type: 'study_metadata',
              id: '1',
            },
          },
        },
      },
    ],
    included: [
      {
        id: '1',
        type: 'study_metadata',
        relationships: {
          faculty_sponsor: {
            data: {
              type: 'faculty_sponsors',
              id: '1',
            },
          },
        },
      },
      {
        id: '1',
        type: 'faculty_sponsors',
        attributes: {
          name: 'Faculty Sponsor 1',
        },
      },
    ],
  }

  return BaseFactory(data)
}

export default SequencescapeStudyFactory
