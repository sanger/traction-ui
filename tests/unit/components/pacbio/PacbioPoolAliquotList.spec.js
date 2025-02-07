import { mountWithStore } from '@support/testHelper.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import PacbioPoolAliquotList from '@/components/pacbio/PacbioPoolAliquotList.vue'

const aliquotAttributes = {
  template_prep_kit_box_barcode: 'ABC1',
  tag_id: '1',
  volume: '1.0',
  concentration: '10.0',
  insert_size: '100',
  run_suitability: {
    ready_for_run: true,
    errors: [],
  },
}

const requests = {
  1: { id: 1, well: '1', plate: '1' },
  2: { id: 2, well: '2', plate: '1' },
  3: { id: 3, well: '3', plate: '1' },
}

const used_aliquots = {
  _1: { source_id: '1', source_type: 'Pacbio::Request', request: '1', ...aliquotAttributes },
  _2: {
    source_id: '2',
    source_type: 'Pacbio::Request',
    request: '2',
    ...aliquotAttributes,
    tag_id: '2',
  },
  _3: {
    source_id: '3',
    source_type: 'Pacbio::Request',
    request: '3',
    ...aliquotAttributes,
    tag_id: '3',
  },
}

const tagSet = {
  id: '1',
  name: 'TagSet1',
  tags: ['1', '2', '3'],
}

const tags = {
  1: { id: '1', name: 'tag1' },
  2: { id: '2', name: 'tag2' },
  3: { id: '3', name: 'tag3' },
}

const wells = {
  1: { id: 1, position: 'A1' },
  2: { id: 2, position: 'B1' },
  3: { id: 3, position: 'C1' },
}

describe('PacbioPoolAliquotList.vue', () => {
  let wrapper
  beforeEach(() => {
    const poolCreateStoreDefaultState = {
      selected: {
        tagSet,
      },
      resources: {
        requests,
        wells,
      },
      used_aliquots,
    }
    ;({ wrapper } = mountWithStore(PacbioPoolAliquotList, {
      initialState: {
        pacbioRoot: {
          tagSets: { 1: tagSet },
          tags,
        },
        pacbioPoolCreate: { ...poolCreateStoreDefaultState },
      },
      props: {
        notify: () => {},
      },
      createStore: () => usePacbioPoolCreateStore(),
    }))
  })
  it('should have a list of aliquots', () => {
    expect(wrapper.findAll('[data-type=pool-aliquot-edit]').length).toEqual(
      Object.values(used_aliquots).length,
    )
  })

  it('emits aliquot-selected event with request', async () => {
    await wrapper.vm.notifyAliquotSelection(true, { id: 1 })
    expect(wrapper.emitted()).toHaveProperty('aliquot-selected')
    expect(wrapper.emitted()['aliquot-selected'][0]).toEqual([{ id: 1 }])
  })

  it('emits aliquot-selected event with request', async () => {
    await wrapper.vm.notifyAliquotSelection(false, { id: 1 })
    expect(wrapper.emitted()).toHaveProperty('aliquot-selected')
    expect(wrapper.emitted()['aliquot-selected'][0]).toEqual([null])
  })
})
