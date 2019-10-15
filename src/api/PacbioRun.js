const build = (object) => {
    let run = object || {
        id: 'new',
        name: '',
        template_prep_kit_box_barcode: '',
        binding_kit_box_barcode: '',
        sequencing_kit_box_barcode: '',
        dna_control_complex_box_barcode: '',
        comments: '',
        uuid: '',
        system_name: '',
        plate: {
            barcode: '',
            // create wells in seperate function
            wells: [
                { position: 'A1', library: { barcode: '' } },
                { position: 'A2', library: { barcode: '' } },
                { position: 'B1', library: { barcode: '' } },
                { position: 'B2', library: { barcode: '' } },
            ]
        }
    }
    // run.assign = (object) => { assign(this, object) }
    return run
}

export {
    build
}
