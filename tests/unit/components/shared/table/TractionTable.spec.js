import { localVue, mount } from '@support/testHelper'
import TractionTable from '@/components/shared/table/TractionTable'
import TractionTableRow from '@/components/shared/table/TractionTableRow'
import TractionTableColumn from '@/components/shared/table/TractionTableColumn'
import TractionButton from '@/components/shared/TractionButton'
import { describe, expect, it, vi } from 'vitest'

describe('TractionTableColumn', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionTable, {
      localVue,
      propsData: props,
      components: {
        TractionTableColumn,
        TractionTableRow,
      },
    })
  }
  describe('Default table display', () => {
    describe('Without any props', () => {
      const wrapper = buildWrapper({})
      it('displays the table element', () => {
        const table = wrapper.find('table')
        expect(table.exists()).toBe(true)
      })
      it('displays header element', () => {
        const thead = wrapper.find('thead')
        expect(thead.exists()).toBe(true)
      })
    })
    describe('Header fields', () => {
      let fields = [
        { key: 'column1', label: 'Column1' },
        { key: 'column2', label: 'Column2' },
        { key: 'column3', label: 'Column3' },
      ]
      const wrapper = buildWrapper({ fields: fields })
      it('displays all header columns', () => {
        const thElems = wrapper.findAll('th')
        expect(thElems).toHaveLength(3)
        expect(wrapper.find('[data-testid=header-div-0]').text()).toContain('Column1')
        expect(wrapper.find('[data-testid=header-div-1]').text()).toContain('Column2')
        expect(wrapper.find('[data-testid=header-div-2]').text()).toContain('Column3')
      })
      it('sort buttons should not be visible', () => {
        expect(wrapper.find('[data-testid=column1-sort-button]').exists()).toBe(false)
        expect(wrapper.find('[data-testid=column2-sort-button]').exists()).toBe(false)
        expect(wrapper.find('[data-testid=column3-sort-button]').exists()).toBe(false)
      })
      describe('Header fields with sort property enabled', () => {
        fields = [
          { key: 'column1', label: 'Column1', sortable: true },
          { key: 'column2', label: 'Column2' },
          { key: 'column3', label: 'Column3', sortable: true },
        ]
        const wrapper = buildWrapper({ fields: fields })
        // const sortButtonClick = vi.fn()
        it('displays sort button for columns with sortable enabled', () => {
          expect(wrapper.find('[data-testid=column1-sort-button]').exists()).toBe(true)
          expect(wrapper.find('[data-testid=column2-sort-button]').exists()).toBe(false)
          expect(wrapper.find('[data-testid=column3-sort-button]').exists()).toBe(true)
        })
      })
    })
    describe('Items props', () => {
      const fields = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'age', label: 'Age', sortable: true },
        { key: 'gender', label: 'Gender' },
      ]
      const items = [
        { name: 'Person2', age: '20', gender: 'female' },
        { name: 'Person1', age: '30', gender: 'male' },
        { name: 'Person3', age: '40', gender: 'female' },
      ]
      const wrapper = buildWrapper({ fields: fields, items: items })
      it('displays tbody', () => {
        expect(wrapper.find('tbody').exists()).toBe(true)
      })
      it('displays table data', () => {
        expect(wrapper.findAll('[data-testid=column]')).toHaveLength(9)
        expect(wrapper.findAll('[data-testid=column]').at(0).text()).toContain('Person2')
        expect(wrapper.findAll('[data-testid=column]').at(1).text()).toContain('20')
        expect(wrapper.findAll('[data-testid=column]').at(2).text()).toContain('female')
      })
      it('sorts first column on clicking sort button of first column', async () => {
        await wrapper.find('[data-testid=name-sort-button]').trigger('click')
        expect(wrapper.findAll('[data-testid=column]').at(0).text()).toContain('Person1')
        expect(wrapper.findAll('[data-testid=column]').at(1).text()).toContain('30')
      })
      it('sorts second column on clicking sort button of second column', async () => {
        await wrapper.find('[data-testid=age-sort-button]').trigger('click')
        expect(wrapper.findAll('[data-testid=column]').at(0).text()).toContain('Person2')
        expect(wrapper.findAll('[data-testid=column]').at(1).text()).toContain('20')
      })
    })
    describe('selectable props', () => {
      const fields = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'age', label: 'Age', sortable: true },
        { key: 'gender', label: 'Gender' },
      ]
      const items = [
        { name: 'Person2', age: '20', gender: 'female' },
        { name: 'Person1', age: '30', gender: 'male' },
        { name: 'Person3', age: '40', gender: 'female' },
      ]

      it('set table as non selectable by default', async () => {
        const wrapper = buildWrapper({ fields: fields, items: items })
        await wrapper.findAll('[data-testid=column]').at(0).trigger('click')
        expect(wrapper.emitted()).not.toHaveProperty('row-selected')
      })
      it('allows selection in table when selectable prop is given', async () => {
        const wrapper = buildWrapper({ fields: fields, items: items, selectable: true })
        await wrapper.findAll('[data-testid=column]').at(0).trigger('click')
        expect(wrapper.emitted()).toHaveProperty('row-selected')
        expect(wrapper.emitted('row-selected')[0][0]).toEqual([
          { name: 'Person2', age: '20', gender: 'female' },
        ])
        expect(wrapper.findAll('[data-testid=column]').at(0).attributes('class')).toContain(
          'bg-gray-400',
        )
      })
      it('allows single selection by default', async () => {
        const wrapper = buildWrapper({ fields: fields, items: items, selectable: true })
        await wrapper.findAll('[data-testid=column]').at(0).trigger('click')
        expect(wrapper.findAll('[data-testid=column]').at(0).attributes('class')).toContain(
          'bg-gray-400',
        )
        await wrapper.findAll('[data-testid=column]').at(3).trigger('click')
        expect(wrapper.findAll('[data-testid=column]').at(3).attributes('class')).toContain(
          'bg-gray-400',
        )
        expect(wrapper.findAll('[data-testid=column]').at(0).attributes('class')).not.toContain(
          'bg-gray-400',
        )
      })
      it('allows multiple selection in table when multiple value is given for selectMode prop', async () => {
        const wrapper = buildWrapper({
          fields: fields,
          items: items,
          selectable: true,
          selectMode: 'multiple',
        })
        await wrapper.findAll('[data-testid=column]').at(0).trigger('click')
        await wrapper.findAll('[data-testid=column]').at(3).trigger('click')
        expect(wrapper.emitted()).toHaveProperty('row-selected')
        expect(wrapper.findAll('[data-testid=column]').at(0).attributes('class')).toContain(
          'bg-gray-400',
        )
        expect(wrapper.findAll('[data-testid=column]').at(3).attributes('class')).toContain(
          'bg-gray-400',
        )
      })
    })
    describe('Custom field components', () => {
      const fields = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'age', label: 'Age', sortable: true },
        { key: 'gender', label: 'Gender' },
        { key: 'edit', label: 'Edit' },
      ]
      const items = [
        { name: 'Person2', age: '20', gender: 'female' },
        { name: 'Person1', age: '30', gender: 'male' },
        { name: 'Person3', age: '40', gender: 'female' },
      ]

      const tableWrapper = mount(TractionTable, {
        localVue,
        propsData: { fields, items },
        components: {
          TractionTableColumn,
          TractionTableRow,
        },
        slots: {
          'cell(edit)': '<div><button data-testid="editButton"></button></div>',
        },
      })
      it('displays button in all edit rows', () => {
        expect(tableWrapper.findAll('[data-testid=editButton]')).toHaveLength(3)
      })
      it('invokes action on button click', async () => {
        const editButton = tableWrapper.findAll('[data-testid=editButton]').at(0)
        await editButton.trigger('click')
        expect(tableWrapper.emitted).toBeTruthy()
      })
    }),
      describe('Show details property', () => {
        const fields = [
          { key: 'name', label: 'Name', sortable: true },
          { key: 'age', label: 'Age', sortable: true },
          { key: 'gender', label: 'Gender' },
          { key: 'edit', label: 'Edit' },
          { key: 'show_details', label: '' },
        ]
        const items = [
          { name: 'Person2', age: '20', gender: 'female' },
          { name: 'Person1', age: '30', gender: 'male' },
          { name: 'Person3', age: '40', gender: 'female' },
        ]

        const tableWrapper = mount(TractionTable, {
          localVue,
          propsData: { fields, items },
          components: {
            TractionTableColumn,
            TractionTableRow,
            TractionButton,
          },

          slots: {
            'cell(show_details)': `<button data-testid="showDetailsButton" />`,
            'row-details': `<div data-testid="details"></div>`,
          },
        })
        it('displays show details button in all row', () => {
          expect(tableWrapper.findAll('[data-testid=showDetailsButton]')).toHaveLength(3)
        })
        it('should emit on scoped slot button click', async () => {
          const showDetailsButton = tableWrapper.findAll('[data-testid=showDetailsButton]').at(0)
          await showDetailsButton.trigger('click')
          expect(tableWrapper.emitted()).toBeTruthy()
        })
        it('should display and hide the scoped slot (row-details) component on detailsShowing property', async () => {
          expect(tableWrapper.vm.rows[0].detailsShowing).toBe(false)
          expect(tableWrapper.find('[data-testid=details]').exists()).toBe(false)
          await tableWrapper.vm.rows[0].toggleDetails()
          expect(tableWrapper.vm.rows[0].detailsShowing).toBe(true)
          expect(tableWrapper.find('[data-testid=details]').exists()).toBe(true)
        })
      })

    describe('Show details property-1', () => {
      const fields = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'age', label: 'Age', sortable: true },
        { key: 'gender', label: 'Gender' },
        { key: 'edit', label: 'Edit' },
        { key: 'show_details', label: '' },
      ]
      const items = [
        { name: 'Person2', age: '20', gender: 'female' },
        { name: 'Person1', age: '30', gender: 'male' },
        { name: 'Person3', age: '40', gender: 'female' },
      ]

      let capturedApi
      const tableWrapper = mount(TractionTable, {
        localVue,
        propsData: { fields, items },
        components: {
          TractionTableColumn,
          TractionTableRow,
          TractionButton,
        },

        scopedSlots: {
          'cell(show_details)': (api) => {
            capturedApi = api
            return `<button data-testid="showDetailsButton" />`
          },
        },
      })
      it('displays show details button in all row', async () => {
        console.log(capturedApi)
        expect(capturedApi.toggleDetails).toBeDefined()
        expect(tableWrapper.vm.rows[0].detailsShowing).toBe(false)
        await capturedApi.toggleDetails()
        expect(tableWrapper.vm.rows[0].detailsShowing).toBe(true)
      })
    })
  })
})
