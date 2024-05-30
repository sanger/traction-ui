import { getCurrentDate } from '@/lib/DateHelpers'
import {
  byAttribute,
  createSuffixDropdownOptions,
  createSuffixItems,
  createBarcodeLabelItem,
  createLabelsFromBarcodes,
  WorkflowItemType,
  WorkflowListType,
} from '@/lib/LabelPrintingHelpers'
import { describe, expect, it } from 'vitest'

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
  describe('byAttribute', () => {
    it('returns each attribute', () => {
      const array = [
        { a: 1, b: 2 },
        { a: 3, b: 4 },
        { a: 5, b: 6 },
      ]
      expect(byAttribute(array, 'a')).toEqual([1, 3, 5])
    })
  })
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

  describe('#createSuffixItems', () => {
    it('creates a key for each suffix', () => {
      const items = createSuffixItems(suffixList)
      expect(Object.keys(items)).toEqual(['ST1', 'ST2', 'ST3', 'ST10', 'ST11', 'ST12'])
    })

    it('creates a list of options for each suffix', () => {
      const items = createSuffixItems(suffixList)
      expect(Object.values(items)[0]).toEqual(suffixList[0].options[0])
    })
  })

  describe('#createBarcodeLabelItem', () => {
    const date = getCurrentDate()
    const sourceBarcode = 'SQSC-1234'
    const stage = 'ST1 - Stage 1'

    it('barcode only', () => {
      const { barcode, first_line, second_line, third_line, fourth_line, label_name } =
        createBarcodeLabelItem({
          sourceBarcode,
          date,
        })
      expect(barcode).toEqual(sourceBarcode)
      expect(first_line).toEqual(date)
      expect(second_line).toEqual('')
      expect(third_line).toEqual(sourceBarcode)
      expect(fourth_line).toEqual('')
      expect(label_name).toEqual('main_label')
    })

    it('barcode with a single suffix', () => {
      const suffixes = ['ST1']
      const { barcode, first_line, second_line, third_line, fourth_line, label_name } =
        createBarcodeLabelItem({
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
      expect(label_name).toEqual('main_label')
    })

    // we could go on but not necessary
    it('barcode with 2 suffixes', () => {
      const suffixes = ['ST1', '1']
      const { barcode, first_line, second_line, third_line, fourth_line, label_name } =
        createBarcodeLabelItem({
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
      expect(label_name).toEqual('main_label')
    })
  })

  describe('#createLabelsFromBarcodes', () => {
    const sourceBarcodeList = ['SQSC-1', 'SQSC-2', 'SQSC-3', 'SQSC-4', 'SQSC-5']
    const date = getCurrentDate()
    const suffixItem = {
      stage: 'Stage1',
      suffix: 'ST1',
      text: 'ST1 - Stage1',
      value: 'ST1',
      workflow: 'Worflow 1',
    }
    const numberOfLabels = 3

    it('with no workflow stage', () => {
      const barcodeLabels = createLabelsFromBarcodes({ sourceBarcodeList, date })
      expect(barcodeLabels.length).toEqual(5)
      expect(byAttribute(barcodeLabels, 'barcode')).toEqual(sourceBarcodeList)
    })

    it('with a workflow stage', () => {
      const barcodeLabels = createLabelsFromBarcodes({ sourceBarcodeList, date, suffixItem })
      expect(barcodeLabels.length).toEqual(5)
      expect(byAttribute(barcodeLabels, 'barcode')).toEqual([
        'SQSC-1-ST1',
        'SQSC-2-ST1',
        'SQSC-3-ST1',
        'SQSC-4-ST1',
        'SQSC-5-ST1',
      ])
      expect(barcodeLabels[0]).toEqual({
        barcode: 'SQSC-1-ST1',
        first_line: date,
        second_line: suffixItem.stage,
        third_line: 'SQSC-1',
        fourth_line: 'ST1',
        label_name: 'main_label',
      })
    })

    it('with a workflow stage and numbers', () => {
      const barcodeLabels = createLabelsFromBarcodes({
        sourceBarcodeList,
        date,
        suffixItem,
        numberOfLabels,
      })
      expect(barcodeLabels.length).toEqual(15)
      expect(byAttribute(barcodeLabels, 'barcode')).toEqual([
        'SQSC-1-ST1-1',
        'SQSC-1-ST1-2',
        'SQSC-1-ST1-3',
        'SQSC-2-ST1-1',
        'SQSC-2-ST1-2',
        'SQSC-2-ST1-3',
        'SQSC-3-ST1-1',
        'SQSC-3-ST1-2',
        'SQSC-3-ST1-3',
        'SQSC-4-ST1-1',
        'SQSC-4-ST1-2',
        'SQSC-4-ST1-3',
        'SQSC-5-ST1-1',
        'SQSC-5-ST1-2',
        'SQSC-5-ST1-3',
      ])
      expect(barcodeLabels[0]).toEqual({
        barcode: 'SQSC-1-ST1-1',
        first_line: date,
        second_line: suffixItem.stage,
        third_line: 'SQSC-1',
        fourth_line: 'ST1-1',
        label_name: 'main_label',
      })
      expect(barcodeLabels.slice(-1)[0]).toEqual({
        barcode: 'SQSC-5-ST1-3',
        first_line: date,
        second_line: suffixItem.stage,
        third_line: 'SQSC-5',
        fourth_line: 'ST1-3',
        label_name: 'main_label',
      })
    })

    it('with numbers only', () => {
      const barcodeLabels = createLabelsFromBarcodes({ sourceBarcodeList, date, numberOfLabels })
      expect(barcodeLabels.length).toEqual(15)
      expect(byAttribute(barcodeLabels, 'barcode')).toEqual([
        'SQSC-1-1',
        'SQSC-1-2',
        'SQSC-1-3',
        'SQSC-2-1',
        'SQSC-2-2',
        'SQSC-2-3',
        'SQSC-3-1',
        'SQSC-3-2',
        'SQSC-3-3',
        'SQSC-4-1',
        'SQSC-4-2',
        'SQSC-4-3',
        'SQSC-5-1',
        'SQSC-5-2',
        'SQSC-5-3',
      ])
    })
  })

  describe('workflow step type', () => {
    const currentDate = getCurrentDate()
    const originalBarcode = 'SQSC-1234'
    const aStage = 'ST1 - Stage 1'

    it('barcode only', () => {
      const { barcode, date, sourceBarcode, parsedSuffixes, number, stage } = WorkflowItemType({
        sourceBarcode: originalBarcode,
        date: currentDate,
      })
      expect(barcode).toEqual(originalBarcode)
      expect(date).toEqual(date)
      expect(stage).toEqual('')
      expect(sourceBarcode).toEqual(originalBarcode)
      expect(parsedSuffixes).toEqual('')
      expect(number).toEqual(null)
    })

    it('with a single suffix', () => {
      const suffixes = ['ST1']
      const { barcode, date, stage, sourceBarcode, parsedSuffixes, number } = WorkflowItemType({
        sourceBarcode: originalBarcode,
        date: currentDate,
        stage: aStage,
        suffixes,
      })
      expect(barcode).toEqual(`${originalBarcode}-${suffixes[0]}`)
      expect(date).toEqual(date)
      expect(stage).toEqual(aStage)
      expect(sourceBarcode).toEqual(originalBarcode)
      expect(parsedSuffixes).toEqual(suffixes[0])
      expect(number).toEqual(null)
    })

    // we could go on but not necessary
    it('with multiple suffixes', () => {
      const suffixes = ['ST1', 'ST2']
      const { barcode, date, stage, sourceBarcode, parsedSuffixes, number } = WorkflowItemType({
        sourceBarcode: originalBarcode,
        date: currentDate,
        stage: aStage,
        suffixes,
      })
      expect(barcode).toEqual(`${originalBarcode}-${suffixes[0]}-${suffixes[1]}`)
      expect(date).toEqual(date)
      expect(stage).toEqual(aStage)
      expect(sourceBarcode).toEqual(`${originalBarcode}`)
      expect(parsedSuffixes).toEqual(`${suffixes[0]}-${suffixes[1]}`)
      expect(number).toEqual(null)
    })

    it('with suffixes and a number', () => {
      const suffixes = ['ST1', 'ST2']
      const aNumber = 1
      const { barcode, date, stage, sourceBarcode, parsedSuffixes, number } = WorkflowItemType({
        sourceBarcode: originalBarcode,
        date: currentDate,
        stage: aStage,
        suffixes,
        number: aNumber,
      })
      expect(barcode).toEqual(`${originalBarcode}-${suffixes[0]}-${suffixes[1]}-${aNumber}`)
      expect(date).toEqual(date)
      expect(stage).toEqual(aStage)
      expect(sourceBarcode).toEqual(`${originalBarcode}`)
      expect(parsedSuffixes).toEqual(`${suffixes[0]}-${suffixes[1]}-${aNumber}`)
      expect(number).toEqual(aNumber)
    })

    it('with a number only', () => {
      const aNumber = 1
      const { barcode, date, stage, sourceBarcode, parsedSuffixes, number } = WorkflowItemType({
        sourceBarcode: originalBarcode,
        date: currentDate,
        stage: aStage,
        number: aNumber,
      })
      expect(barcode).toEqual(`${originalBarcode}-${aNumber}`)
      expect(date).toEqual(date)
      expect(stage).toEqual(aStage)
      expect(sourceBarcode).toEqual(`${originalBarcode}`)
      expect(parsedSuffixes).toEqual(`${aNumber}`)
      expect(number).toEqual(aNumber)
    })
  })

  describe('#WorkflowListType', () => {
    const sourceBarcodeList = ['SQSC-1', 'SQSC-2', 'SQSC-3', 'SQSC-4', 'SQSC-5']
    const date = getCurrentDate()
    const suffixItem = {
      stage: 'Stage1',
      suffix: 'ST1',
      text: 'ST1 - Stage1',
      value: 'ST1',
      workflow: 'Worflow 1',
    }
    const numberOfLabels = 3

    it('with no workflow stage', () => {
      const barcodeLabels = WorkflowListType({ sourceBarcodeList, date })
      expect(barcodeLabels.length).toEqual(5)
      expect(byAttribute(barcodeLabels, 'barcode')).toEqual(sourceBarcodeList)
    })

    it('with a workflow stage', () => {
      const workflowList = WorkflowListType({ sourceBarcodeList, date, suffixItem })
      expect(workflowList.length).toEqual(5)
      expect(workflowList[0]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[0],
          date,
          stage: suffixItem.stage,
          suffixes: [suffixItem.suffix],
        }),
      )
      expect(workflowList[4]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[4],
          date,
          stage: suffixItem.stage,
          suffixes: [suffixItem.suffix],
        }),
      )
    })

    it('with a workflow stage and numbers', () => {
      const workflowList = WorkflowListType({
        sourceBarcodeList,
        date,
        suffixItem,
        numberOfLabels,
      })
      expect(workflowList.length).toEqual(15)
      expect(workflowList[0]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[0],
          date,
          stage: suffixItem.stage,
          suffixes: [suffixItem.suffix],
          number: 1,
        }),
      )
      expect(workflowList[14]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[4],
          date,
          stage: suffixItem.stage,
          suffixes: [suffixItem.suffix],
          number: 3,
        }),
      )
    })

    it('with numbers only', () => {
      const workflowList = WorkflowListType({ sourceBarcodeList, date, numberOfLabels })
      expect(workflowList.length).toEqual(15)
      expect(workflowList[0]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[0],
          date,
          number: 1,
        }),
      )
      expect(workflowList[14]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[4],
          date,
          number: 3,
        }),
      )
    })
  })
})
