import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from './../../src/api/JsonApi'

const PacbioSmrtLinkVersionFactory = () => {
  const data = {
    data: [
      {
        id: '2',
        type: 'smrt_link_versions',
        links: {
          self: 'http://traction/v1/pacbio/smrt_link_versions/2',
        },
        attributes: {
          name: 'v11',
          default: true,
          active: true,
        },
        relationships: {
          smrt_link_option_versions: {
            links: {
              self: 'http://traction/v1/pacbio/smrt_link_versions/2/relationships/smrt_link_option_versions',
              related: 'http://traction/v1/pacbio/smrt_link_versions/2/smrt_link_option_versions',
            },
          },
        },
      },
      {
        id: '3',
        type: 'smrt_link_versions',
        links: {
          self: 'http://traction/v1/pacbio/smrt_link_versions/3',
        },
        attributes: {
          name: 'v12_revio',
          default: false,
          active: true,
        },
        relationships: {
          smrt_link_option_versions: {
            links: {
              self: 'http://traction/v1/pacbio/smrt_link_versions/3/relationships/smrt_link_option_versions',
              related: 'http://traction/v1/pacbio/smrt_link_versions/3/smrt_link_option_versions',
            },
          },
        },
      },
      {
        id: '4',
        type: 'smrt_link_versions',
        links: {
          self: 'http://traction/v1/pacbio/smrt_link_versions/4',
        },
        attributes: {
          name: 'v13_sequel_iie',
          default: false,
          active: true,
        },
        relationships: {
          smrt_link_option_versions: {
            links: {
              self: 'http://traction/v1/pacbio/smrt_link_versions/4/relationships/smrt_link_option_versions',
              related: 'http://traction/v1/pacbio/smrt_link_versions/4/smrt_link_option_versions',
            },
          },
        },
      },
      {
        id: '5',
        type: 'smrt_link_versions',
        links: {
          self: 'http://traction/v1/pacbio/smrt_link_versions/5',
        },
        attributes: {
          name: 'v13_revio',
          default: false,
          active: true,
        },
        relationships: {
          smrt_link_option_versions: {
            links: {
              self: 'http://traction/v1/pacbio/smrt_link_versions/5/relationships/smrt_link_option_versions',
              related: 'http://traction/v1/pacbio/smrt_link_versions/5/smrt_link_option_versions',
            },
          },
        },
      },
    ],
  }

  const storeSmrtLinkVersions = dataToObjectById({ ...data })

  return { ...BaseFactory(data), storeSmrtLinkVersions }
}

export default PacbioSmrtLinkVersionFactory
