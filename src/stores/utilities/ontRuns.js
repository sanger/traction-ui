
const buildFormatedOntRun = (instruments, pools, data, included) => {
  const instrument_name = instruments.find((i) => i.id == data.attributes.ont_instrument_id)?.name

  return {
    id: data.id,
    instrument_name: instrument_name,
    state: data.attributes.state,
    flowcell_attributes: included.map((fc) => {
      const tube_barcode = pools.find((p) => p.id == fc.attributes.ont_pool_id)?.barcode

      return {
        flowcell_id: fc.attributes.flowcell_id,
        ont_pool_id: fc.attributes.ont_pool_id,
        position: fc.attributes.position,
        tube_barcode: tube_barcode,
      }
    }),
  }
}

export { buildFormatedOntRun }
