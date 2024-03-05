const baseURL = import.meta.env.VITE_TRACTION_BASE_URL

const flags = {
  flipper_id: 'User',
  features: {
    multiplexing_phase_2_aliquot: { enabled: true },
  },
}

const libraryTypes = {
  data: [
    {
      id: '1',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/1' },
      attributes: { name: 'Pacbio_HiFi', pipeline: 'pacbio' },
    },
    {
      id: '2',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/2' },
      attributes: { name: 'Pacbio_HiFi_mplx', pipeline: 'pacbio' },
    },
    {
      id: '3',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/3' },
      attributes: { name: 'Pacbio_Microbial_mplx', pipeline: 'pacbio' },
    },
    {
      id: '4',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/4' },
      attributes: { name: 'Pacbio_IsoSeq', pipeline: 'pacbio' },
    },
    {
      id: '5',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/5' },
      attributes: { name: 'PacBio_IsoSeq_mplx', pipeline: 'pacbio' },
    },
    {
      id: '6',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/6' },
      attributes: { name: 'PacBio_Ultra_Low_Input', pipeline: 'pacbio' },
    },
    {
      id: '7',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/7' },
      attributes: { name: 'PacBio_Ultra_Low_Input_mplx', pipeline: 'pacbio' },
    },
    {
      id: '8',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/8' },
      attributes: { name: 'ONT_GridIon', pipeline: 'ont' },
    },
    {
      id: '9',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/9' },
      attributes: { name: 'ONT_GridIon_mplx', pipeline: 'ont' },
    },
    {
      id: '10',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/10' },
      attributes: { name: 'ONT_PromethIon', pipeline: 'ont' },
    },
    {
      id: '11',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/11' },
      attributes: { name: 'ONT_PromethIon_mplx', pipeline: 'ont' },
    },
    {
      id: '12',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/12' },
      attributes: { name: 'ONT_PromethIon_High_Quality', pipeline: 'ont' },
    },
    {
      id: '13',
      type: 'library_types',
      links: { self: 'http://localhost:3100/v1/library_types/13' },
      attributes: { name: 'ONT_Ultralong', pipeline: 'ont' },
    },
  ],
}

const dataTypes = {
  data: [
    {
      id: '1',
      type: 'data_types',
      links: { self: 'http://localhost:3100/v1/data_types/1' },
      attributes: { name: 'basecalls', pipeline: 'ont' },
    },
    {
      id: '2',
      type: 'data_types',
      links: { self: 'http://localhost:3100/v1/data_types/2' },
      attributes: { name: 'basecalls and raw data', pipeline: 'ont' },
    },
    {
      id: '23',
      type: 'data_types',
      links: { self: 'http://localhost:3100/v1/data_types/3' },
      attributes: { name: 'dummy type', pipeline: 'dummy_for_testing_filters' },
    },
  ],
}
const mockStores = {
  [`${baseURL}/flipper/api/actors/User`]: flags,
  [`${baseURL}/v1/library_types?fields[library_types]=name,pipeline`]: libraryTypes,
  [`${baseURL}/v1/data_types?fields[data_types]=name,pipeline`]: dataTypes,
}
const swrv = (f) => ({ data: mockStores[f] })

export default swrv
