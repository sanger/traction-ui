import { getCurrentDate } from '@/lib/DateHelpers'
import {
  createSuffixDropdownOptions,
  createSuffixItems,
  createBarcodeLabelItem,
} from '@/lib/LabelPrintingHelpers'
import { expect, it } from 'vitest'

const suffixList = [
  {
    workflow: 'Workflow 1',
    options: [
      {
        stage: 'Stage 1',
        suffix: 'ST1',
        text: 'ST1 - Stage 1',
        value: 'ST1',
        workflow: 'Workflow 1',
      },
      {
        stage: 'Stage 2',
        suffix: 'ST2',
        text: 'ST2 - Stage 2',
        value: 'ST2',
        workflow: 'Workflow 1',
      },
      {
        stage: 'Stage 3',
        suffix: 'ST3',
        text: 'ST3 - Stage 1',
        value: 'ST3',
        workflow: 'Workflow 1',
      },
    ],
  },
  {
    workflow: 'Workflow 2',
    options: [
      {
        stage: 'Stage 10',
        suffix: 'ST10',
        text: 'ST10 - Stage 10',
        value: 'ST10',
        workflow: 'Workflow 2',
      },
      {
        stage: 'Stage 11',
        suffix: 'ST11',
        text: 'ST11 - Stage 11',
        value: 'ST11',
        workflow: 'Workflow 2',
      },
      {
        stage: 'Stage 12',
        suffix: 'ST12',
        text: 'ST1 - Stage 12',
        value: 'ST12',
        workflow: 'Workflow 2',
      },
    ],
  },
]

describe('LabelPrintingHelpers.js', () => {
  describe('createSuffixDropdownOptions', () => {
    it('creates an item for each workflow', () => {
      const items = createSuffixDropdownOptions(suffixList)
      expect(items.length).toEqual(suffixList.length + 1)
    })

    it('creates a label for each workflow', () => {
      const items = createSuffixDropdownOptions(suffixList)
      expect(items[0].label).toEqual('Workflow 1')
      expect(items[1].label).toEqual('Workflow 2')
    })

    it('creates an option for each stage', () => {
      const items = createSuffixDropdownOptions(suffixList)
      expect(items[0].options.length).toEqual(3)
      const { text, value } = items[0].options[0]
      expect(text).toEqual('ST1 - Stage 1')
      expect(value).toEqual('ST1')
    })

    it('creates a no suffix option', () => {
      const items = createSuffixDropdownOptions(suffixList)
      const { text, value } = items.slice(-1)[0]
      expect(text).toEqual('No suffix')
      expect(value).toBeNull()
    })
  })

  describe('createSuffixItems', () => {
    it('creates a key for each suffix', () => {
      const items = createSuffixItems(suffixList)
      expect(Object.keys(items)).toEqual(['ST1', 'ST2', 'ST3', 'ST10', 'ST11', 'ST12'])
    })

    it('creates a list of options for each suffix', () => {
      const items = createSuffixItems(suffixList)
      expect(Object.values(items)[0]).toEqual(suffixList[0].options[0])
    })
  })

  describe('createBarcodeLabelItem', () => {
    const date = getCurrentDate()
    const sourceBarcode = 'SQSC-1234'
    const stage = 'ST1 - Stage 1'

    it('barcode only', () => {
      const { barcode, first_line, second_line, third_line, fourth_line } = createBarcodeLabelItem({
        sourceBarcode,
        date,
      })
      expect(barcode).toEqual(sourceBarcode)
      expect(first_line).toEqual(date)
      expect(second_line).toEqual('')
      expect(third_line).toEqual(sourceBarcode)
      expect(fourth_line).toEqual('')
    })

    it('barcode with a single suffix', () => {
      const suffixes = ['ST1']
      const { barcode, first_line, second_line, third_line, fourth_line } = createBarcodeLabelItem({
        sourceBarcode,
        stage,
        date,
        suffixes,
      })
      expect(barcode).toEqual(`${sourceBarcode}-${suffixes[0]}`)
      expect(first_line).toEqual(date)
      expect(second_line).toEqual(stage)
      expect(third_line).toEqual(sourceBarcode)
      expect(fourth_line).toEqual(suffixes[0])
    })

    // we could go on but not necessary
    it('barcode with 2 suffixes', () => {
      const suffixes = ['ST1', '1']
      const { barcode, first_line, second_line, third_line, fourth_line } = createBarcodeLabelItem({
        sourceBarcode,
        stage,
        date,
        suffixes,
      })
      expect(barcode).toEqual(`${sourceBarcode}-${suffixes[0]}-${suffixes[1]}`)
      expect(first_line).toEqual(date)
      expect(second_line).toEqual(stage)
      expect(third_line).toEqual(`${sourceBarcode}`)
      expect(fourth_line).toEqual(`${suffixes[0]}-${suffixes[1]}`)
    })
  })
})
