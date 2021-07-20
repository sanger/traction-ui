import PacbioPoolLibraryList from '@/components/pacbio/PacbioPoolLibraryList'
import { mount, store, localVue } from 'testHelper'

const libraryAttributes = {
  template_prep_kit_box_barcode: 'ABC1',
  tag_id: '1',
  volume: '1.0',
  concentration: '10.0',
  fragment_size: '100',
}

const requests = {
  '1': { id: 1 },
  '2': { id: 2 },
  '3': { id: 3 },
}

const libraries = {
  _1: { pacbio_request_id: '1', ...libraryAttributes },
  _2: { pacbio_request_id: '2', ...libraryAttributes, tag_id: '2' },
  _3: { pacbio_request_id: '3', ...libraryAttributes, tag_id: '3' },
}

// TODO: This is a definite smell. We should not need this here.
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

store.state.traction.pacbio.poolCreate.selected.tagSet = tagSet
store.state.traction.pacbio.poolCreate.resources.tagSets = { 1: tagSet }
store.state.traction.pacbio.poolCreate.resources.tags = tags
store.state.traction.pacbio.poolCreate.resources.requests = requests

describe('PacbioPoolLibraryList.vue', () => {
  it('should have a list of libraries', () => {
    store.state.traction.pacbio.poolCreate.libraries = libraries
    const wrapper = mount(PacbioPoolLibraryList, {
      store,
      localVue,
    })
    expect(wrapper.findAll('[data-type=pool-library-edit]').length).toEqual(
      Object.values(libraries).length,
    )
  })

  describe('pooling message', () => {
    describe('when pool creation is successful', () => {
      const result = { success: true, message: 'Pool successfully created' }

      it('message', () => {
        store.state.traction.pacbio.poolCreate.result = result
        const wrapper = mount(PacbioPoolLibraryList, {
          store,
          localVue,
        })
        const message = wrapper.find('[data-type=pool-create-message]')
        expect(message.text()).toMatch('Pool successfully created')
      })

      it('alert variant', () => {
        store.state.traction.pacbio.poolCreate.result = result
        const wrapper = mount(PacbioPoolLibraryList, {
          store,
          localVue,
        })
        const message = wrapper.find('[data-type=pool-create-message]')
        expect(message.html()).toMatch('alert-success')
      })
    })

    describe('when pool creation fails', () => {
      const result = { success: false, message: 'There was a problem' }

      it('message', () => {
        store.state.traction.pacbio.poolCreate.result = result
        const wrapper = mount(PacbioPoolLibraryList, {
          store,
          localVue,
        })
        const message = wrapper.find('[data-type=pool-create-message]')
        expect(message.text()).toMatch('There was a problem')
      })

      it('alert variant', () => {
        store.state.traction.pacbio.poolCreate.result = result
        const wrapper = mount(PacbioPoolLibraryList, {
          store,
          localVue,
        })
        const message = wrapper.find('[data-type=pool-create-message]')
        expect(message.html()).toMatch('alert-danger')
      })
    })
  })

  // seems to be a problem when updating the store
  // not reflected in the component
  // e2e test?
  describe.skip('creating a pool', () => {
    // create a mock success response
    // mock the pools create request
    // press the create pool button
    // expect to see a success message
    it('successfully', async () => {
      store.state.traction.pacbio.poolCreate.libraries = libraries
      const {
        state: {
          api: {
            traction: {
              pacbio: { pools },
            },
          },
        },
      } = store
      pools.create = jest.fn(() => ({ status: 201, data: { data: { id: 1 } } }))
      const wrapper = mount(PacbioPoolLibraryList, {
        store,
        localVue,
      })
      const button = wrapper.find('[data-action=create-pool]')
      await button.trigger('click')
    })

    // create a mock failure response
    // mock the pools create request
    // press the create pool button
    // expect to see a failure message
    it('unsuccessfully', () => {})

    // create an invalid library
    // press the create pool button
    // there should be no message
    // but there should be some validation errors
    it('when the libraries are not valid', () => {})
  })
})
