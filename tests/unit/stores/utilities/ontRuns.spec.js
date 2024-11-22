import { describe, expect, it } from 'vitest'
import { buildFormatedOntRun } from '@/stores/utilities/ontRuns.js'

describe('buildFormatedOntRun', () => {
  const instruments = [
    { id: '1', name: 'Instrument 1' },
    { id: '2', name: 'Instrument 2' },
  ]

  const pools = [
    { id: '1', barcode: 'Tube 1' },
    { id: '2', barcode: 'Tube 2' },
  ]

  const fetchResponse = {
    data: {
      id: '1',
      attributes: {
        ont_instrument_id: '1',
        state: 'active',
      },
    },
    included: [
      {
        attributes: {
          flowcell_id: 'fc1',
          ont_pool_id: '1',
          position: 'A1',
        },
      },
      {
        attributes: {
          flowcell_id: 'fc2',
          ont_pool_id: '2',
          position: 'B1',
        },
      },
    ],
  }

  it('returns the formatted run object', () => {
    const result = buildFormatedOntRun(
      instruments,
      pools,
      fetchResponse.data,
      fetchResponse.included,
    )

    expect(result).toEqual({
      id: '1',
      instrument_name: 'Instrument 1',
      state: 'active',
      flowcell_attributes: [
        {
          flowcell_id: 'fc1',
          ont_pool_id: '1',
          position: 'A1',
          tube_barcode: 'Tube 1',
        },
        {
          flowcell_id: 'fc2',
          ont_pool_id: '2',
          position: 'B1',
          tube_barcode: 'Tube 2',
        },
      ],
    })
  })

  it('handles missing instrument gracefully', () => {
    const invalidInstruments = []
    const result = buildFormatedOntRun(
      invalidInstruments,
      pools,
      fetchResponse.data,
      fetchResponse.included,
    )

    expect(result).toEqual({
      id: '1',
      instrument_name: undefined,
      state: 'active',
      flowcell_attributes: [
        {
          flowcell_id: 'fc1',
          ont_pool_id: '1',
          position: 'A1',
          tube_barcode: 'Tube 1',
        },
        {
          flowcell_id: 'fc2',
          ont_pool_id: '2',
          position: 'B1',
          tube_barcode: 'Tube 2',
        },
      ],
    })
  })

  it('handles missing pool gracefully', () => {
    const invalidPools = []
    const result = buildFormatedOntRun(
      instruments,
      invalidPools,
      fetchResponse.data,
      fetchResponse.included,
    )

    expect(result).toEqual({
      id: '1',
      instrument_name: 'Instrument 1',
      state: 'active',
      flowcell_attributes: [
        {
          flowcell_id: 'fc1',
          ont_pool_id: '1',
          position: 'A1',
          tube_barcode: undefined,
        },
        {
          flowcell_id: 'fc2',
          ont_pool_id: '2',
          position: 'B1',
          tube_barcode: undefined,
        },
      ],
    })
  })
})
