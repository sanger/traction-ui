import { flowCellType } from '@/stores/utilities/flowCell'

const buildFormatedOntRun = (instruments, pools, data, included) => {
  const instrument_name = instruments.find((i) => i.id == data.attributes.ont_instrument_id)?.name

  return {
    id: data.id,
    instrument_name: instrument_name,
    state: data.attributes.state,
    rebasecalling_process: data.attributes.rebasecalling_process,
    flowcell_attributes: included
      .filter((item) => item.type === 'flowcells')
      .map((fc) => {
        const pool = Object.values(pools).find((p) => p.id == fc.attributes.ont_pool_id)

        return {
          ...flowCellType(),
          flowcell_id: fc.attributes.flowcell_id,
          ont_pool_id: fc.attributes.ont_pool_id,
          position: fc.attributes.position,
          tube_barcode: pool?.tube_barcode,
        }
      }),
  }
}

export { buildFormatedOntRun }
