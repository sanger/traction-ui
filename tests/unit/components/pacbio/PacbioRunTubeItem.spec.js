import Tube from '@/components/pacbio/PacbioRunTubeItem.vue'
import { mountWithStore, router } from '@support/testHelper.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { expect } from 'vitest'

describe('PacbioRunTubeItem.vue', () => {
  let tube, wrapper, props

  const unknownField = 'Unknown'

  describe('when given a pool', () => {
    describe('when valid', () => {
      beforeEach(() => {
        props = {
          id: '1',
          type: 'pools',
          barcode: 'TRAC-1',
          samples: ['Sample1:TAG_1', 'Sample1:TAG_2'],
          volume: 10.2,
          concentration: 13.1,
          template_prep_kit_box_barcode: 'BB1',
          insert_size: 100,
          source_identifier: 'DN1S:A1',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        }
        ;({ wrapper } = mountWithStore(Tube, {
          props,
          createStore: () => usePacbioRunCreateStore(),
        }))

        tube = wrapper.vm
      })

      it('must have a barcode and a type', () => {
        expect(tube.barcode).toEqual(props.barcode)
        expect(wrapper.find('[data-attribute=barcode]').text()).toContain(props.barcode)
        expect(wrapper.find('[data-attribute=type]').text()).toContain(props.type)
      })

      it('must have a source identifier', () => {
        expect(wrapper.find('[data-attribute=source-identifier]').text()).toContain('DN1S:A1')
      })

      it('must have a source volume', () => {
        expect(wrapper.find('[data-attribute=volume]').text()).toContain('10.2')
      })

      it('must have a concentration', () => {
        expect(wrapper.find('[data-attribute=concentration]').text()).toContain('13.1')
      })

      it('must have a template prep kit box barcode', () => {
        expect(wrapper.find('[data-attribute=template-prep-kit-box-barcode]').text()).toContain(
          'BB1',
        )
      })

      it('must have a insert-size', () => {
        expect(wrapper.find('[data-attribute=insert-size]').text()).toContain('100')
      })

      it('must have some samples', () => {
        expect(tube.samples).toEqual(props.samples)
      })

      it('must have an edit button', () => {
        expect(wrapper.find('#editPool-1').text()).toEqual('Edit')
      })
    })

    describe('when invalid', () => {
      beforeEach(() => {
        props = {
          id: '1',
          type: 'pools',
          barcode: 'TRAC-1',
          samples: ['Sample1:TAG_1', 'Sample1:TAG_2'],
          source_identifier: 'DN1S:A1',
          run_suitability: {
            ready_for_run: false,
            formattedErrors: [
              "Pool insert_size - can't be blank",
              "Library 1 (Sample1) insert_size - can't be blank",
            ],
            errors: [
              {
                title: "can't be blank",
                detail: "insert_size - can't be blank",
                code: '100',
                source: {
                  pointer: '/data/attributes/insert_size',
                },
              },
              {
                title: 'is invalid',
                detail: 'libraries - is invalid',
                code: '100',
                source: {
                  pointer: '/data/relationships/libraries',
                },
              },
            ],
          },
        }
        ;({ wrapper } = mountWithStore(Tube, {
          props,
          createStore: () => usePacbioRunCreateStore(),
        }))

        tube = wrapper.vm
      })

      it('reports the pool is invalid', () => {
        expect(wrapper.text()).toContain('Pool invalid. Click for more information')
      })

      it('reports more information when clicked', async () => {
        await wrapper.trigger('click')
        expect(wrapper.find('[data-attribute=volume]').text()).toContain(unknownField)
        expect(wrapper.text()).toContain("Pool insert_size - can't be blank")
        expect(wrapper.text()).toContain("Library 1 (Sample1) insert_size - can't be blank")
      })

      it('has an edit button per pool', async () => {
        router.push = vi.fn()
        const button = wrapper.find('#editPool-1')
        expect(button.text()).toEqual('Edit')
        await button.trigger('click')
        expect(router.push).toHaveBeenCalledTimes(1)
        expect(router.push).toHaveBeenCalledWith({ name: 'PacbioPoolCreate', params: { id: '1' } })
      })
    })
  })

  describe('when given a library', () => {
    let wrapper
    describe('when valid', () => {
      beforeEach(() => {
        props = {
          id: '1',
          type: 'libraries',
          barcode: 'TRAC-1',
          samples: ['Sample1:TAG_1'],
          volume: 10.2,
          concentration: 13.1,
          template_prep_kit_box_barcode: 'BB1',
          insert_size: 100,
          source_identifier: 'DN1S:A1',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        }
        ;({ wrapper } = mountWithStore(Tube, {
          props,
          createStore: () => usePacbioRunCreateStore(),
        }))
        tube = wrapper.vm
      })

      it('must have a barcode and a type', () => {
        expect(tube.barcode).toEqual(props.barcode)
        expect(wrapper.find('[data-attribute=barcode]').text()).toContain(props.barcode)
      })

      it('must have a source identifier', () => {
        expect(wrapper.find('[data-attribute=source-identifier]').text()).toContain('DN1S:A1')
      })

      it('must have a source volume', () => {
        expect(wrapper.find('[data-attribute=volume]').text()).toContain('10.2')
      })

      it('must have a concentration', () => {
        expect(wrapper.find('[data-attribute=concentration]').text()).toContain('13.1')
      })

      it('must have a template prep kit box barcode', () => {
        expect(wrapper.find('[data-attribute=template-prep-kit-box-barcode]').text()).toContain(
          'BB1',
        )
      })

      it('must have a insert-size', () => {
        expect(wrapper.find('[data-attribute=insert-size]').text()).toContain('100')
      })

      it('must have a sample', () => {
        expect(wrapper.find('[data-attribute=samples]').text()).toContain('Sample1:TAG_1')
      })

      it('does not have an edit button', () => {
        expect(wrapper.find('#editPool-1').exists()).toBeFalsy()
      })
    })

    describe('when invalid', () => {
      beforeEach(() => {
        props = {
          id: '1',
          type: 'libraries',
          barcode: 'TRAC-1',
          samples: ['Sample1:TAG_1'],
          run_suitability: {
            ready_for_run: false,
            errors: [
              {
                title: "can't be blank",
                detail: "insert_size - can't be blank",
                code: '100',
                source: {
                  pointer: '/data/attributes/insert_size',
                },
              },
            ],
          },
          source_identifier: 'DN1S:A1',
        }
        ;({ wrapper } = mountWithStore(Tube, {
          props,
          createStore: () => usePacbioRunCreateStore(),
        }))

        tube = wrapper.vm
      })

      it('reports the library is invalid', () => {
        expect(wrapper.text()).toContain('Library invalid. Click for more information')
      })

      it('reports more information when clicked', async () => {
        await wrapper.trigger('click')
        expect(wrapper.text()).toContain("insert_size - can't be blank")
      })
    })
  })
})
