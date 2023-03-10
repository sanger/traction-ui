import PacbioRunInfoEdit from '@/components/pacbio/PacbioRunInfoEdit'
import { localVue, mount, store } from '@support/testHelper'
import { beforeEach, describe, expect } from 'vitest'

// required as suggestion to remove the deprecated function
// https://vue-test-utils.vuejs.org/api/options.html#attachtodocument
const elem = document.createElement('div')
if (document.body) {
  document.body.appendChild(elem)
}
const buildWrapper = () =>
  mount(PacbioRunInfoEdit, {
    localVue,
    store,
    sync: false,
    attachTo: elem,
  })

describe('PacbioRunInfoEdit', () => {
  const smrtLinkVersions = [
    {
      id: '1',
      name: 'v1',
      default: true,
    },
    {
      id: '2',
      name: 'v2',
      default: false,
    },
  ]

  //below tests need to be integrated to the #new and #edit run tests

  // it.todo('must have systemName data', () => {
  //   expect(runInfo.systemNameOptions).toEqual(['Sequel I', 'Sequel II', 'Sequel IIe'])
  // })

  // describe.todo('smrt link versions', () => {
  //   it('returns the correct versions', () => {
  //     expect(runInfo.smrtLinkVersionList.length).toEqual(2)
  //   })

  //   it('can return the selected version', () => {
  //     runInfo.smrtLinkVersionList.forEach(function (version) {
  //       runInfo.setSmrtLinkVersionId(version.id)
  //       expect(runInfo.selectedSmrtLinkVersion).toEqual(version)
  //     })
  //   })

  //   it('returns smrt link version select options', () => {
  //     const options = runInfo.smrtLinkVersionList.map(({ id, name }) => ({ value: id, text: name }))
  //     expect(runInfo.smrtLinkVersionSelectOptions).toEqual(options)
  //   })
  // })

  describe.todo('pacbioRunInfoEdit#new', () => {
    const run = {
      id: 'new',
      system_name: 'Sequel IIe',
      sequencing_kit_box_barcode: null,
      dna_control_complex_box_barcode: null,
      comments: null,
      smrt_link_version_id: null,
    }

    let wrapper
    beforeEach(() => {
      wrapper = buildWrapper()
      store.state.traction.pacbio.runCreate.run = run
      store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions
    })

    describe('input', () => {
      it('run name', () => {
        const name = 'run-name'
        expect(wrapper.find('label[for="' + name + '"]').exists()).toBe(true)
        expect(wrapper.find('input[id="' + name + '"]').exists()).toBe(true)
      })
      it('sequencing kit box barcode', async () => {
        const input = wrapper.find(['data-attribute=sequencing_kit_box_barcode'])
        await input.setValue('SKB1')
        expect(store.state.traction.pacbio.runCreate.run.sequencing_kit_box_barcode).toEqual('SKB1')
      }),
        it('dna control complex box barcode', async () => {
          const input = wrapper.find(['data-attribute=dna_control_complex_box_barcode'])
          await input.setValue('DCCB1')
          expect(store.state.traction.pacbio.runCreate.run.dna_control_complex_box_barcode).toEqual(
            'DCCB1',
          )
        }),
        it('system name', async () => {
          expect(store.state.traction.pacbio.runCreate.run.system_name).toEqual('Sequel IIe')
        }),
        it('smrt_link_version_id', async () => {
          const options = wrapper.find(['data-attribute=smrt_link_version']).findAll('option')
          await options.at(1).setSelected()
          expect(store.state.traction.pacbio.runCreate.run.smrt_link_version_id).toEqual(1)
        }),
        it('comments', async () => {
          const input = wrapper.find(['data-attribute=comments'])
          await input.setValue('example comment')
          expect(store.state.traction.pacbio.runCreate.run.comments).toEqual('example comment')
        })
    })
  })

  describe.todo('pacbioRunInfoEdit#edit', () => {
    const run = {
      id: '4',
      system_name: 'Sequel II',
      sequencing_kit_box_barcode: 'SKB4',
      dna_control_complex_box_barcode: 'DCCB4',
      comments: 'PacbioSample3000',
      smrt_link_version_id: 1,
    }

    let wrapper

    beforeEach(() => {
      wrapper = buildWrapper()
      store.state.traction.pacbio.runCreate.run = run
      store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions
    })

    describe('input', () => {
      it('run name', () => {
        const name = 'run-name'
        expect(wrapper.find('label[for="' + name + '"]').exists()).toBe(true)
        expect(wrapper.find('input[id="' + name + '"]').exists()).toBe(true)
      })
      it('sequencing kit box barcode', async () => {
        const input = wrapper.find(['data-attribute=sequencing_kit_box_barcode'])
        expect(input.element.value).toEqual('SKB4')
      }),
        it('dna control complex box barcode', async () => {
          const input = wrapper.find(['data-attribute=dna_control_complex_box_barcode'])
          expect(input.element.value).toEqual('DCCB4')
        }),
        it('system name', async () => {
          const input = wrapper.find(['id=system-name'])
          expect(input.element.value).toEqual('Sequel II')
        }),
        it('smrt_link_version_id', async () => {
          const options = wrapper.find(['id=smrt_link_version']).findAll('option')
          expect(options.element.value).toEqual(1)
        }),
        it('comments', async () => {
          const input = wrapper.find(['data-attribute=comments'])
          expect(input.element.value).toEqual('PacbioSample3000')
        })
    })
  })
})
