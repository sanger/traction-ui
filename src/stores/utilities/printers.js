const getPrintersOfType = (printers,labwareType)=> printers.filter((printer) => printer.labware_type === labwareType)

export { getPrintersOfType }


