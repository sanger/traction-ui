import { mount, localVue, store } from 'testHelper'
import PacbioPoolEdit from '@/components/pacbio/PacbioPoolEdit'

describe('pacbioPoolEdit#new', () => {
  const pool = {
    id: null,
    template_prep_kit_box_barcode: null,
    volume: null,
    concentration: null,
    insert_size: null,
  }

  let wrapper
  beforeEach(() => {
    wrapper = mount(PacbioPoolEdit, {
      localVue,
      store,
    })
    store.state.traction.pacbio.poolCreate.pool = pool
  })

  describe('input', () => {
    it('template prep kit box barcode', async () => {
      const input = wrapper.find('[data-attribute=template-prep-kit-box-barcode]')
      await input.setValue('017865101789500022821')
      expect(store.state.traction.pacbio.poolCreate.pool.template_prep_kit_box_barcode).toEqual(
        '017865101789500022821',
      )
    })

    it('volume', async () => {
      const input = wrapper.find('[data-attribute=volume]')
      await input.setValue('10.0')
      expect(store.state.traction.pacbio.poolCreate.pool.volume).toEqual('10.0')
    })

    it('concentration', async () => {
      const input = wrapper.find('[data-attribute=concentration]')
      await input.setValue('2.4')
      expect(store.state.traction.pacbio.poolCreate.pool.concentration).toEqual('2.4')
    })

    it('insert size', async () => {
      const input = wrapper.find('[data-attribute=insert-size]')
      await input.setValue('100')
      expect(store.state.traction.pacbio.poolCreate.pool.insert_size).toEqual('100')
    })
  })

  describe('submit button', () => {
    it('says Create pool', () => {
      const button = wrapper.find('[data-action=create-pool]')
      expect(button.text()).toContain('Create Pool')
    })

    it('does not have an update pool button', () => {
      const button = wrapper.find('[data-action=update-pool]')
      expect(button.exists()).toBe(false)
    })
  })
})

describe('pacbioPoolEdit#edit', () => {
  const pool = {
    id: '1',
    template_prep_kit_box_barcode: '017865101789500022821',
    volume: 10,
    concentration: 2.4,
    insert_size: 100,
  }

  let wrapper

  beforeEach(() => {
    wrapper = mount(PacbioPoolEdit, {
      localVue,
      store,
    })
    store.state.traction.pacbio.poolCreate.pool = pool
  })

  describe('input', () => {
    it('template prep kit box barcode', async () => {
      const input = wrapper.find('[data-attribute=template-prep-kit-box-barcode]')
      expect(input.element.value).toEqual('017865101789500022821')
    })

    it('volume', async () => {
      const input = wrapper.find('[data-attribute=volume]')
      expect(input.element.value).toEqual('10')
    })

    it('concentration', async () => {
      const input = wrapper.find('[data-attribute=concentration]')
      expect(input.element.value).toEqual('2.4')
    })

    it('insert size', async () => {
      const input = wrapper.find('[data-attribute=insert-size]')
      expect(input.element.value).toEqual('100')
    })
  })

  describe('submit button', () => {
    it('says Update pool', () => {
      const button = wrapper.find('[data-action=update-pool]')
      expect(button.text()).toContain('Update Pool')
    })

    it('does not have a create pool button', () => {
      const button = wrapper.find('[data-action=create-pool]')
      expect(button.exists()).toBe(false)
    })
  })
})
