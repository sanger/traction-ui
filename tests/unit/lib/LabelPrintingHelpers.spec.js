import { getCurrentDate } from '@/lib/DateHelpers'
import { createSuffixDropdownOptions } from '@/lib/LabelPrintingHelpers'
import { expect } from 'vitest'

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
  it('works', () => {
    const date = getCurrentDate()
    expect(date).toBeDefined()
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

  describe('createSuffixItems', () => {
    it('works', () => {
      expect(true).toBeTruthy()
    })
  })

  describe('createBarcodeLabelItem', () => {
    it('works', () => {
      expect(true).toBeTruthy()
    })
  })
})
