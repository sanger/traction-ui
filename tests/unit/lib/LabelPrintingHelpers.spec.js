import { getCurrentDate } from '@/lib/DateHelpers'
import {
  byAttribute,
  createWorkflowDropdownOptions,
  createWorkflowOptions,
  WorkflowItemType,
  WorkflowListType,
  createWorkflowTubeBarcodeLabel,
  createWorkflowPlateBarcodeLabel,
  createBasicTubeBarcodeLabel,
  createBarcodeLabels,
  PrintJobType,
  createPayload,
} from '@/lib/LabelPrintingHelpers'
import { describe, expect, it } from 'vitest'

const workflowList = [
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

const labelTypes = {
  tube2d: {
    text: 'Tube - 2d',
    value: 'tube2d',
    labwareType: 'tube',
    labelTemplateName: 'traction_tube_label_template',
  },
  plate1d: {
    text: '96-Well Plate - 1d',
    value: 'plate1d',
    labwareType: 'plate96',
    labelTemplateName: 'traction_plate_label_template_1d',
  },
}

const options = {
  sourceBarcodeList: ['SQSC-1', 'SQSC-2', 'SQSC-3'],
  numberOfLabels: 3,
  printerName: 'printer1',
  labelTypeKey: 'plate1d',
}

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

  describe('createWorkflowDropdownOptions', () => {
    it('creates an item for each workflow', () => {
      const items = createWorkflowDropdownOptions(workflowList)
      expect(items.length).toEqual(workflowList.length + 1)
    })

    it('creates a label for each workflow', () => {
      const items = createWorkflowDropdownOptions(workflowList)
      expect(items[0].label).toEqual('Workflow 1')
      expect(items[1].label).toEqual('Workflow 2')
    })

    it('creates an option for each stage', () => {
      const items = createWorkflowDropdownOptions(workflowList)
      expect(items[0].options.length).toEqual(3)
      const { text, value } = items[0].options[0]
      expect(text).toEqual('ST1 - Stage 1')
      expect(value).toEqual('ST1')
    })

    it('creates a no suffix option', () => {
      const items = createWorkflowDropdownOptions(workflowList)
      const { text, value } = items.slice(-1)[0]
      expect(text).toEqual('No suffix')
      expect(value).toBeNull()
    })
  })

  describe('#createWorkflowOptions', () => {
    it('creates a key for each suffix', () => {
      const items = createWorkflowOptions(workflowList)
      expect(Object.keys(items)).toEqual(['ST1', 'ST2', 'ST3', 'ST10', 'ST11', 'ST12'])
    })

    it('creates a list of options for each suffix', () => {
      const items = createWorkflowOptions(workflowList)
      expect(Object.values(items)[0]).toEqual(workflowList[0].options[0])
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
    const workflowItem = {
      stage: 'Stage1',
      suffix: 'ST1',
      text: 'ST1 - Stage1',
      value: 'ST1',
      workflow: 'Worflow 1',
    }
    const numberOfLabels = 3

    it('with no workflow stage', () => {
      const workflowListType = WorkflowListType({ sourceBarcodeList, date })
      const workflowBarcodeItems = workflowListType.createWorkflowBarcodeItemList(workflowListType)
      expect(workflowBarcodeItems.length).toEqual(5)
      expect(workflowBarcodeItems[0]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[0],
          date,
        }),
      )
      expect(workflowBarcodeItems[4]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[4],
          date,
        }),
      )
    })

    it('with a workflow stage', () => {
      const workflowListType = WorkflowListType({ sourceBarcodeList, date, workflowItem })
      const workflowBarcodeItems = workflowListType.createWorkflowBarcodeItemList(workflowListType)
      expect(workflowBarcodeItems.length).toEqual(5)
      expect(workflowBarcodeItems[0]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[0],
          date,
          stage: workflowItem.stage,
          suffixes: [workflowItem.suffix],
        }),
      )
      expect(workflowBarcodeItems[4]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[4],
          date,
          stage: workflowItem.stage,
          suffixes: [workflowItem.suffix],
        }),
      )
    })

    it('with a workflow stage and numbers', () => {
      const workflowListType = WorkflowListType({
        sourceBarcodeList,
        date,
        workflowItem,
        numberOfLabels,
      })
      const workflowBarcodeItems = workflowListType.createWorkflowBarcodeItemList(workflowListType)
      expect(workflowBarcodeItems.length).toEqual(15)
      expect(workflowBarcodeItems[0]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[0],
          date,
          stage: workflowItem.stage,
          suffixes: [workflowItem.suffix],
          number: 1,
        }),
      )
      expect(workflowBarcodeItems[14]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[4],
          date,
          stage: workflowItem.stage,
          suffixes: [workflowItem.suffix],
          number: 3,
        }),
      )
    })

    it('with numbers only', () => {
      const workflowListType = WorkflowListType({ sourceBarcodeList, date, numberOfLabels })
      const workflowBarcodeItems = workflowListType.createWorkflowBarcodeItemList(workflowListType)
      expect(workflowBarcodeItems.length).toEqual(15)
      expect(workflowBarcodeItems[0]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[0],
          date,
          number: 1,
        }),
      )
      expect(workflowBarcodeItems[14]).toEqual(
        WorkflowItemType({
          sourceBarcode: sourceBarcodeList[4],
          date,
          number: 3,
        }),
      )
    })
  })

  describe('barcode labels', () => {
    const workflowItemType = {
      sourceBarcode: 'SQSC-1234',
      date: getCurrentDate(),
      stage: 'ST1 - Stage 1',
      suffixes: ['ST1'],
      number: 1,
    }

    it('#createWorkflowTubeBarcodeLabel', () => {
      const {
        barcode,
        first_line,
        second_line,
        third_line,
        fourth_line,
        round_label_top_line,
        label_name,
      } = createWorkflowTubeBarcodeLabel(workflowItemType)

      expect(barcode).toEqual(workflowItemType.barcode)
      expect(first_line).toEqual(workflowItemType.date)
      expect(second_line).toEqual(workflowItemType.stage)
      expect(third_line).toEqual(workflowItemType.sourceBarcode)
      expect(fourth_line).toEqual(workflowItemType.parsedSuffixes)
      expect(round_label_top_line).toEqual(workflowItemType.number)
      expect(label_name).toEqual('main_label')
    })

    it('#createWorkflowPlateBarcodeLabel', () => {
      const { barcode, first_line, second_line, third_line, fourth_line, label_name } =
        createWorkflowPlateBarcodeLabel(workflowItemType)

      expect(barcode).toEqual(workflowItemType.barcode)
      expect(first_line).toEqual(workflowItemType.date)
      expect(second_line).toEqual(workflowItemType.stage)
      expect(third_line).toEqual(workflowItemType.sourceBarcode)
      expect(fourth_line).toEqual(workflowItemType.parsedSuffixes)
      expect(label_name).toEqual('main_label')
    })

    it('#createBasicTubeBarcodeLabel', () => {
      const barcodeItem = { barcode: workflowItemType.sourceBarcode, date: workflowItemType.date }
      const { barcode, first_line, second_line } = createBasicTubeBarcodeLabel(barcodeItem)
      expect(barcode).toEqual(workflowItemType.sourceBarcode)
      expect(first_line).toEqual(workflowItemType.date)
      expect(second_line).toEqual(workflowItemType.sourceBarcode)
    })
  })

  describe('#createBarcodeLabels', () => {
    const sourceBarcodeList = ['SQSC-1', 'SQSC-2', 'SQSC-3', 'SQSC-4', 'SQSC-5']
    const date = getCurrentDate()
    const workflowItem = {
      stage: 'Stage1',
      suffix: 'ST1',
      text: 'ST1 - Stage1',
      value: 'ST1',
      workflow: 'Worflow 1',
    }
    const numberOfLabels = 3
    const workflowListType = WorkflowListType({
      sourceBarcodeList,
      date,
      workflowItem,
      numberOfLabels,
    })
    const workflowBarcodeItems = workflowListType.createWorkflowBarcodeItemList(workflowListType)

    it('creates tube labels', () => {
      const tubeLabels = createBarcodeLabels({
        barcodeItems: workflowBarcodeItems,
        createLabelFn: createWorkflowTubeBarcodeLabel,
      })
      expect(tubeLabels.length).toEqual(15)
      expect(tubeLabels[0]).toEqual(createWorkflowTubeBarcodeLabel(workflowBarcodeItems[0]))
      expect(tubeLabels[14]).toEqual(createWorkflowTubeBarcodeLabel(workflowBarcodeItems[14]))
    })

    it('creates plate labels', () => {
      const plateLabels = createBarcodeLabels({
        barcodeItems: workflowBarcodeItems,
        createLabelFn: createWorkflowPlateBarcodeLabel,
      })
      expect(plateLabels.length).toEqual(15)
      expect(plateLabels[0]).toEqual(createWorkflowPlateBarcodeLabel(workflowBarcodeItems[0]))
      expect(plateLabels[14]).toEqual(createWorkflowPlateBarcodeLabel(workflowBarcodeItems[14]))
    })
  })

  describe('#PrintJobType', () => {
    it('returns a PrintJob object', () => {
      const printJob = PrintJobType()
      // dont want to do this but not sure best way to get tests to pass.
      const { payload, createLabels } = printJob
      expect(printJob).toEqual({
        sourceBarcodeList: null,
        numberOfLabels: null,
        printerName: null,
        copies: 1,
        labelType: null,
        labels: null,
        payload,
        createLabels,
      })
    })

    it('returns a print job type with options', () => {
      const printJob = PrintJobType(options)
      const { payload, createLabels } = printJob
      expect(printJob).toEqual({ ...PrintJobType(), ...options, payload, createLabels })
    })

    describe('#payload', () => {
      it('returns a payload object', () => {
        const labelType = labelTypes['plate1d']
        const labels = ['label1', 'label2']
        const printJob = PrintJobType({ ...options, labelType, labels })
        expect(printJob.payload()).toEqual({
          printerName: printJob.printerName,
          labels: printJob.labels,
          copies: printJob.copies,
          labelTemplateName: labelType.labelTemplateName,
        })
      })

      // this might seem like overkill but I wanted to know if the attributes were being updated
      it('creates the correct payload when we change the instance', () => {
        let labels = ['label1', 'label2']
        let labelType = labelTypes['plate1d']
        const printJob = PrintJobType({ ...options, labels })
        const payload = createPayload({ printJob, labelType })
        expect(payload).toEqual({
          printerName: printJob.printerName,
          labels,
          copies: printJob.copies,
          labelTemplateName: labelType.labelTemplateName,
        })

        labels = ['label3', 'label4']
        labelType = labelTypes['tube2d']
        printJob.labels = labels
        printJob.labelType = labelType
        expect(printJob.payload()).toEqual({
          printerName: printJob.printerName,
          labels,
          copies: printJob.copies,
          labelTemplateName: labelType.labelTemplateName,
        })
      })
    })

    describe('#createLabels', () => {
      it('creates some labels and adds them to the instance', () => {
        const createLabelFn = (barcodeItem) => {
          return { ...barcodeItem, label_name: 'main_label' }
        }
        const barcodeItems = [{ barcode: 'barcode1' }, { barcode: 'barcode2' }]
        const printJob = PrintJobType(options)
        printJob.createLabels({ barcodeItems, createLabelFn })
        expect(printJob.labels).toEqual([
          { barcode: 'barcode1', label_name: 'main_label' },
          { barcode: 'barcode2', label_name: 'main_label' },
        ])
      })
    })
  })

  describe('#createpayload', () => {
    it('returns a payload object', () => {
      const labels = ['label1', 'label2']
      const printJob = PrintJobType({ ...options, labels })
      const labelType = labelTypes['plate1d']
      const payload = createPayload({ printJob, labelType })
      expect(payload).toEqual({
        printerName: printJob.printerName,
        labels,
        copies: printJob.copies,
        labelTemplateName: labelType.labelTemplateName,
      })
    })
  })
})
