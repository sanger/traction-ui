import { mount, localVue, store } from 'testHelper'
import PacbioPoolEdit from '@/components/pacbio/PacbioPoolEdit'

const pool = {
  id: null,
  template_prep_kit_box_barcode: null,
  volume: null,
  concentration: null,
  fragment_size: null
}

store.state.traction.pacbio.poolCreate.pool = pool

describe('pacbioPoolEdit', () => {
  let wrapper

  beforeEach(() => {

    wrapper = mount(PacbioPoolEdit, {
      localVue,
      store,
    })
  })

  it('works', () => {
    expect(wrapper.find('[data-type=pool-edit]')).toBeDefined()
  })

  describe('input', () => {
    it('template prep kit box barcode', async () => {
      const input = wrapper.find('[data-attribute=template-prep-kit-box-barcode]')
      await input.setValue('017865101789500022821')
      expect(
        store.state.traction.pacbio.poolCreate.pool.template_prep_kit_box_barcode,
      ).toEqual('017865101789500022821')
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

    it('fragment size', async () => {
      const input = wrapper.find('[data-attribute=fragment-size]')
      await input.setValue('100')
      expect(store.state.traction.pacbio.poolCreate.pool.fragment_size).toEqual('100')
    })
  })

})
