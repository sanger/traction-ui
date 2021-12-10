import SaphyrRun from '@/views/saphyr/SaphyrRun'
import VueRouter from 'vue-router'
import { localVue, mount, store } from 'testHelper'

describe('Run.vue', () => {
  let wrapper, mockRun, saphyrRun, router, props

  beforeEach(() => {
    router = new VueRouter({
      routes: [
        { path: '/runs', name: 'SaphyrRuns', component: require('@/views/saphyr/SaphyrRuns') },
      ],
    })

    mockRun = {
      id: '1',
      name: '',
      state: 'pending',
      chip: {
        barcode: '',
        flowcells: [
          { position: 1, library: { barcode: '' } },
          { position: 2, library: { barcode: '' } },
        ],
      },
    }

    props = {
      id: '1',
    }

    store.commit('traction/saphyr/runs/setCurrentRun', mockRun)

    // create the mock of the method before mounting it for testing
    jest.spyOn(SaphyrRun.methods, 'provider').mockImplementation(() => {})

    wrapper = mount(SaphyrRun, {
      localVue,
      store,
      router,
      propsData: props,
    })
    saphyrRun = wrapper.vm
  })

  describe('displaying the data', () => {
    it('shows the current id of the run', () => {
      let id = wrapper.find('#id').text()
      expect(id).toEqual(`Run ID: ${mockRun.id}`)
    })

    it('shows the current state of the run', () => {
      let state = wrapper.find('#state').text()
      expect(state).toMatch(`State: ${mockRun.state}`)
    })
  })

  describe('back button', () => {
    it('will always show', () => {
      expect(wrapper.find('#backToRunsButton').exists()).toBeTruthy()
    })
  })

  describe('update button', () => {
    it('will only show if the record is existing', () => {
      expect(wrapper.find('#update').exists()).toBeTruthy()
    })
  })

  describe('create button', () => {
    beforeEach(() => {
      // create the mock of the method before mounting it for testing
      jest.spyOn(SaphyrRun.methods, 'provider').mockImplementation(() => {})

      wrapper = mount(SaphyrRun, {
        localVue,
        store,
        router,
        propsData: {
          id: 'new',
        },
      })
      saphyrRun = wrapper.vm
    })

    it('will only show if the record is new', () => {
      expect(wrapper.find('#create').exists()).toBeTruthy()
    })
  })

  describe('#create', () => {
    beforeEach(() => {
      saphyrRun.showAlert = jest.fn()
      saphyrRun.createRun = jest.fn()
      saphyrRun.redirectToRuns = jest.fn()
    })

    it('calls createRun', async () => {
      await saphyrRun.create()
      expect(saphyrRun.createRun).toBeCalled()
    })

    it('successful', async () => {
      await saphyrRun.create()
      expect(saphyrRun.createRun).toBeCalled()
      expect(saphyrRun.redirectToRuns).toBeCalled()
    })

    it('unsuccessful', async () => {
      saphyrRun.createRun.mockImplementation(() => {
        throw Error('Raise this error')
      })
      await saphyrRun.create()
      expect(saphyrRun.createRun).toBeCalled()
      expect(saphyrRun.showAlert).toBeCalled()
      expect(saphyrRun.redirectToRuns).not.toBeCalled()
    })
  })

  describe('#update', () => {
    beforeEach(() => {
      saphyrRun.showAlert = jest.fn()
      saphyrRun.updateRun = jest.fn()
      saphyrRun.redirectToRuns = jest.fn()
    })

    it('calls updateRun', async () => {
      await saphyrRun.update()
      expect(saphyrRun.updateRun).toBeCalled()
      expect(saphyrRun.redirectToRuns).toBeCalled()
    })

    it('successful', async () => {
      await saphyrRun.update()
      expect(saphyrRun.updateRun).toBeCalled()
      expect(saphyrRun.redirectToRuns).toBeCalled()
    })

    it('unsuccessful', async () => {
      saphyrRun.updateRun.mockImplementation(() => {
        throw Error('Raise this error')
      })
      await saphyrRun.update()
      expect(saphyrRun.updateRun).toBeCalled()
      expect(saphyrRun.showAlert).toBeCalled()
      expect(saphyrRun.redirectToRuns).not.toBeCalled()
    })
  })

  describe('#showAlert', () => {
    it('emits an event with the message', () => {
      saphyrRun.showAlert('show this message', 'success')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'success',
        message: 'show this message',
      })
    })
  })
})
