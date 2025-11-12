/**
 * PacbioRunWellSmrtLinkOptions
 * The options are used to generate the form fields for the Pacbio Run Well Defaults and Pacbio Run Well Edit.
 *
 * @description
 * key: The version of SMRT Link that the options are for.
 * value: An array of objects that contain the options for the form fields.
 *
 * TODO: Some special properties like events are not included in the options but instead are handled in the components.
 *
 * Value Object Properties:
 * name: {String} The name of the form field.
 * component: {String} The name of the component that will be used to render the form field.
 * value: {String} The value of the form field.
 * label: {String} The label for the form field.
 * description: {String} The description for the well default form field.
 * required: {Boolean} If the form field is required.
 * default: {Boolean} If the form field is included in the well defaults section.
 * props: {Object} The props that will be passed to the component.
 * wellProps: {Object} The props that will be passed to the well component (not the default component).
 *
 * return {Object{Array[{Object}]}} An Object of objects that contain the options for the form fields.
 */
const PacbioRunWellSmrtLinkOptions = {
  v10: [],
  v11: [
    {
      name: 'movie_time',
      component: 'traction-select',
      value: 'movie_time',
      label: 'Movie time',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Movie Time',
            disabled: true,
          },
          '10.0',
          '15.0',
          '20.0',
          '24.0',
          '30.0',
        ],
        dataAttribute: 'movie-time',
      },
    },
    {
      name: 'on_plate_loading_concentration',
      component: 'traction-input',
      value: 'on_plate_loading_concentration',
      label: 'On Plate Loading Concentration (pM)',
      required: true,
      props: {
        placeholder: 'On Plate Loading Concentration (pM)',
        dataAttribute: 'on-plate-loading-concentration',
      },
    },
    {
      name: 'pre-extension-time',
      component: 'traction-input',
      value: 'pre_extension_time',
      label: 'Pre-extension time (hours)',
      default: true,
      required: false,
      props: {
        placeholder: 'Pre-extension time',
        dataAttribute: 'pre-extension-time',
      },
    },
    {
      name: 'loading_target_p1_plus_p2',
      component: 'traction-input',
      value: 'loading_target_p1_plus_p2',
      label: 'Loading Target (0 to 1)',
      required: false,
      description: '(P1 + P2)',
      default: true,
      props: {
        type: 'number',
        step: 0.05,
        min: 0,
        max: 1,
        dataAttribute: 'loading-target-p1-plus-p2',
        placeholder: 'Adaptive loading disabled - Add loading target to enable',
      },
    },
    {
      name: 'binding_kit_box_barcode',
      component: 'traction-input',
      value: 'binding_kit_box_barcode',
      label: 'Binding Kit Box Barcode',
      required: true,
      default: true,
      props: {
        dataAttribute: 'binding-kit-box-barcode',
        placeholder: 'Binding Kit Box Barcode',
      },
    },
    {
      name: 'ccs_analysis_output_include_kinetics_information',
      component: 'traction-select',
      value: 'ccs_analysis_output_include_kinetics_information',
      label: 'Include Kinetics Information',
      description: 'In CCS analysis output',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'ccs-analysis-output-include-kinetics-information',
      },
    },
    {
      name: 'ccs_analysis_output_include_low_quality_reads',
      component: 'traction-select',
      value: 'ccs_analysis_output_include_low_quality_reads',
      label: 'Include Low Quality Reads',
      description: 'In CCS analysis output',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'ccs-analysis-output-include-low-quality-reads',
      },
    },
    {
      name: 'demultiplex_barcodes',
      component: 'traction-select',
      value: 'demultiplex_barcodes',
      label: 'Demultiplex barcodes',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Please select a value',
            value: '',
            disabled: true,
          },
          'In SMRT Link',
          'Do Not Generate',
          'On Instrument',
        ],
        dataAttribute: 'demultiplex-barcodes',
      },
    },
    {
      name: 'include_fivemc_calls_in_cpg_motifs',
      component: 'traction-select',
      value: 'include_fivemc_calls_in_cpg_motifs',
      attribute: 'include_fivemc_calls_in_cpg_motifs',
      label: 'Include 5mc Calls In CpG Motifs',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'include-fivemc-calls-in-cpg-motifs',
      },
    },
    {
      name: 'disableAdaptiveLoadingBtn',
      component: 'traction-button',
      value: 'disable_adaptive_loading',
      props: {
        text: 'Disable Adaptive Loading',
        theme: 'default',
      },
    },
  ],
  v12_revio: [
    {
      name: 'movie_acquisition_time',
      component: 'traction-select',
      value: 'movie_acquisition_time',
      label: 'Movie Acquisition Time (hrs)',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Movie Acquisition Time',
            value: '',
            disabled: true,
          },
          '24.0',
        ],
        dataAttribute: 'movie-acquisition-time',
      },
    },
    {
      name: 'include_base_kinetics',
      component: 'traction-select',
      value: 'include_base_kinetics',
      label: 'Include Base Kinetics',
      required: true,
      default: true,
      props: {
        options: ['True', 'False'],
        dataAttribute: 'include-base-kinetics',
      },
    },
    {
      name: 'library_concentration',
      component: 'traction-input',
      value: 'library_concentration',
      label: 'Library Concentration (pM)',
      required: true,
      default: true,
      props: {
        type: 'number',
        dataAttribute: 'library-concentration',
        placeholder: 'Library Concentration',
      },
    },
    {
      name: 'polymerase_kit',
      component: 'traction-input',
      value: 'polymerase_kit',
      label: 'Polymerase Kit ',
      required: true,
      default: true,
      props: {
        dataAttribute: 'polymerase-kit',
        placeholder: 'Polymerase Kit',
      },
    },
    {
      name: 'pre-extension-time',
      component: 'traction-input',
      value: 'pre_extension_time',
      label: 'Pre-extension time (hrs)',
      required: true,
      default: true,
      props: {
        placeholder: 'Pre-extension time',
        dataAttribute: 'pre-extension-time',
      },
    },
    {
      name: 'library_type',
      component: 'traction-select',
      value: 'library_type',
      label: 'Library Type',
      required: true,
      default: true,
      props: {
        options: ['Standard', 'Kinnex', 'Adeno-associated Virus'],
        dataAttribute: 'library-type',
      },
    },
  ],
  v12_sequel_iie: [
    {
      name: 'movie_time',
      component: 'traction-select',
      value: 'movie_time',
      label: 'Movie time',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Movie Time',
            disabled: true,
          },
          '10.0',
          '15.0',
          '20.0',
          '24.0',
          '30.0',
        ],
        dataAttribute: 'movie-time',
      },
    },
    {
      name: 'on_plate_loading_concentration',
      component: 'traction-input',
      value: 'on_plate_loading_concentration',
      label: 'On Plate Loading Concentration (pM)',
      required: true,
      props: {
        placeholder: 'On Plate Loading Concentration (pM)',
        dataAttribute: 'on-plate-loading-concentration',
      },
    },
    {
      name: 'pre-extension-time',
      component: 'traction-input',
      value: 'pre_extension_time',
      label: 'Pre-extension time (hours)',
      required: false,
      default: true,
      props: {
        placeholder: 'Pre-extension time',
        dataAttribute: 'pre-extension-time',
      },
    },
    {
      name: 'loading_target_p1_plus_p2',
      component: 'traction-input',
      value: 'loading_target_p1_plus_p2',
      label: 'Loading Target (0 to 1)',
      description: '(P1 + P2)',
      required: false,
      default: true,
      props: {
        type: 'number',
        step: 0.05,
        min: 0,
        max: 1,
        dataAttribute: 'loading-target-p1-plus-p2',
        placeholder: 'Adaptive loading disabled - Add loading target to enable',
      },
    },
    {
      name: 'binding_kit_box_barcode',
      component: 'traction-input',
      value: 'binding_kit_box_barcode',
      label: 'Binding Kit Box Barcode',
      required: true,
      default: true,
      props: {
        dataAttribute: 'binding-kit-box-barcode',
        placeholder: 'Binding Kit Box Barcode',
      },
    },
    {
      name: 'ccs_analysis_output_include_kinetics_information',
      component: 'traction-select',
      value: 'ccs_analysis_output_include_kinetics_information',
      label: 'Include Kinetics Information',
      description: 'In CCS analysis output',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'ccs-analysis-output-include-kinetics-information',
      },
    },
    {
      name: 'ccs_analysis_output_include_low_quality_reads',
      component: 'traction-select',
      value: 'ccs_analysis_output_include_low_quality_reads',
      label: 'Include Low Quality Reads',
      description: 'In CCS analysis output',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'ccs-analysis-output-include-low-quality-reads',
      },
    },
    {
      name: 'demultiplex_barcodes',
      component: 'traction-select',
      value: 'demultiplex_barcodes',
      label: 'Demultiplex barcodes',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Please select a value',
            value: '',
            disabled: true,
          },
          'In SMRT Link',
          'Do Not Generate',
          'On Instrument',
        ],
        dataAttribute: 'demultiplex-barcodes',
      },
    },
    {
      name: 'include_fivemc_calls_in_cpg_motifs',
      component: 'traction-select',
      value: 'include_fivemc_calls_in_cpg_motifs',
      attribute: 'include_fivemc_calls_in_cpg_motifs',
      label: 'Include 5mc Calls In CpG Motifs',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'include-fivemc-calls-in-cpg-motifs',
      },
    },
    {
      name: 'disableAdaptiveLoadingBtn',
      component: 'traction-button',
      value: 'disable_adaptive_loading',
      props: {
        text: 'Disable Adaptive Loading',
        theme: 'default',
      },
    },
  ],
  v13_revio: [
    {
      name: 'movie_acquisition_time',
      component: 'traction-select',
      value: 'movie_acquisition_time',
      label: 'Movie Acquisition Time (hrs)',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Movie Acquisition Time',
            value: '',
            disabled: true,
          },
          '24.0',
        ],
        dataAttribute: 'movie-acquisition-time',
      },
    },
    {
      name: 'include_base_kinetics',
      component: 'traction-select',
      value: 'include_base_kinetics',
      label: 'Include Base Kinetics',
      required: true,
      default: true,
      props: {
        options: ['True', 'False'],
        dataAttribute: 'include-base-kinetics',
      },
    },
    {
      name: 'library_concentration',
      component: 'traction-input',
      value: 'library_concentration',
      label: 'Library Concentration (pM)',
      required: true,
      default: true,
      props: {
        type: 'number',
        dataAttribute: 'library-concentration',
        placeholder: 'Library Concentration',
      },
    },
    {
      name: 'polymerase_kit',
      component: 'traction-input',
      value: 'polymerase_kit',
      label: 'Polymerase Kit ',
      required: true,
      default: true,
      props: {
        dataAttribute: 'polymerase-kit',
        placeholder: 'Polymerase Kit',
      },
    },
    {
      name: 'pre-extension-time',
      component: 'traction-input',
      value: 'pre_extension_time',
      label: 'Pre-extension time (hrs)',
      required: false,
      default: true,
      props: {
        placeholder: 'Pre-extension time',
        dataAttribute: 'pre-extension-time',
      },
    },
    {
      name: 'library_type',
      component: 'traction-select',
      value: 'library_type',
      label: 'Library Type',
      required: true,
      default: true,
      props: {
        options: ['Standard', 'Kinnex', 'Adeno-associated Virus'],
        dataAttribute: 'library-type',
      },
    },
  ],
  v13_sequel_iie: [
    {
      name: 'movie_time',
      component: 'traction-select',
      value: 'movie_time',
      label: 'Movie time',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Movie Time',
            disabled: true,
          },
          '10.0',
          '15.0',
          '20.0',
          '24.0',
          '30.0',
        ],
        dataAttribute: 'movie-time',
      },
    },
    {
      name: 'on_plate_loading_concentration',
      component: 'traction-input',
      value: 'on_plate_loading_concentration',
      label: 'On Plate Loading Concentration (pM)',
      required: true,
      props: {
        placeholder: 'On Plate Loading Concentration (pM)',
        dataAttribute: 'on-plate-loading-concentration',
      },
    },
    {
      name: 'pre-extension-time',
      component: 'traction-input',
      value: 'pre_extension_time',
      label: 'Pre-extension time (hours)',
      required: false,
      default: true,
      props: {
        placeholder: 'Pre-extension time',
        dataAttribute: 'pre-extension-time',
      },
    },
    {
      name: 'loading_target_p1_plus_p2',
      component: 'traction-input',
      value: 'loading_target_p1_plus_p2',
      label: 'Loading Target (0 to 1)',
      description: '(P1 + P2)',
      required: false,
      default: true,
      props: {
        type: 'number',
        step: 0.05,
        min: 0,
        max: 1,
        dataAttribute: 'loading-target-p1-plus-p2',
        placeholder: 'Adaptive loading disabled - Add loading target to enable',
      },
    },
    {
      name: 'binding_kit_box_barcode',
      component: 'traction-input',
      value: 'binding_kit_box_barcode',
      label: 'Binding Kit Box Barcode',
      required: true,
      default: true,
      props: {
        dataAttribute: 'binding-kit-box-barcode',
        placeholder: 'Binding Kit Box Barcode',
      },
    },
    {
      name: 'ccs_analysis_output_include_kinetics_information',
      component: 'traction-select',
      value: 'ccs_analysis_output_include_kinetics_information',
      label: 'Include Kinetics Information',
      description: 'In CCS analysis output',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'ccs-analysis-output-include-kinetics-information',
      },
    },
    {
      name: 'ccs_analysis_output_include_low_quality_reads',
      component: 'traction-select',
      value: 'ccs_analysis_output_include_low_quality_reads',
      label: 'Include Low Quality Reads',
      description: 'In CCS analysis output',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'ccs-analysis-output-include-low-quality-reads',
      },
    },
    {
      name: 'demultiplex_barcodes',
      component: 'traction-select',
      value: 'demultiplex_barcodes',
      label: 'Demultiplex barcodes',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Please select a value',
            value: '',
            disabled: true,
          },
          'In SMRT Link',
          'Do Not Generate',
          'On Instrument',
        ],
        dataAttribute: 'demultiplex-barcodes',
      },
    },
    {
      name: 'include_fivemc_calls_in_cpg_motifs',
      component: 'traction-select',
      value: 'include_fivemc_calls_in_cpg_motifs',
      attribute: 'include_fivemc_calls_in_cpg_motifs',
      label: 'Include 5mc Calls In CpG Motifs',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'include-fivemc-calls-in-cpg-motifs',
      },
    },
    {
      name: 'disableAdaptiveLoadingBtn',
      component: 'traction-button',
      value: 'disable_adaptive_loading',
      props: {
        text: 'Disable Adaptive Loading',
        theme: 'default',
      },
    },
  ],
  v13_1_sequel_iie: [
    {
      name: 'movie_time',
      component: 'traction-select',
      value: 'movie_time',
      label: 'Movie time',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Movie Time',
            disabled: true,
          },
          '10.0',
          '15.0',
          '20.0',
          '24.0',
          '30.0',
        ],
        dataAttribute: 'movie-time',
      },
    },
    {
      name: 'on_plate_loading_concentration',
      component: 'traction-input',
      value: 'on_plate_loading_concentration',
      label: 'On Plate Loading Concentration (pM)',
      required: true,
      props: {
        placeholder: 'On Plate Loading Concentration (pM)',
        dataAttribute: 'on-plate-loading-concentration',
      },
    },
    {
      name: 'pre-extension-time',
      component: 'traction-input',
      value: 'pre_extension_time',
      label: 'Pre-extension time (hours)',
      required: false,
      default: true,
      props: {
        placeholder: 'Pre-extension time',
        dataAttribute: 'pre-extension-time',
      },
    },
    {
      name: 'loading_target_p1_plus_p2',
      component: 'traction-input',
      value: 'loading_target_p1_plus_p2',
      label: 'Loading Target (0 to 1)',
      description: '(P1 + P2)',
      required: false,
      default: true,
      props: {
        type: 'number',
        step: 0.05,
        min: 0,
        max: 1,
        dataAttribute: 'loading-target-p1-plus-p2',
        placeholder: 'Adaptive loading disabled - Add loading target to enable',
      },
    },
    {
      name: 'binding_kit_box_barcode',
      component: 'traction-input',
      value: 'binding_kit_box_barcode',
      label: 'Binding Kit Box Barcode',
      required: true,
      default: true,
      props: {
        dataAttribute: 'binding-kit-box-barcode',
        placeholder: 'Binding Kit Box Barcode',
      },
    },
    {
      name: 'ccs_analysis_output_include_kinetics_information',
      component: 'traction-select',
      value: 'ccs_analysis_output_include_kinetics_information',
      label: 'Include Kinetics Information',
      description: 'In CCS analysis output',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'ccs-analysis-output-include-kinetics-information',
      },
    },
    {
      name: 'ccs_analysis_output_include_low_quality_reads',
      component: 'traction-select',
      value: 'ccs_analysis_output_include_low_quality_reads',
      label: 'Include Low Quality Reads',
      description: 'In CCS analysis output',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'ccs-analysis-output-include-low-quality-reads',
      },
    },
    {
      name: 'demultiplex_barcodes',
      component: 'traction-select',
      value: 'demultiplex_barcodes',
      label: 'Demultiplex barcodes',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Please select a value',
            value: '',
            disabled: true,
          },
          'In SMRT Link',
          'Do Not Generate',
          'On Instrument',
        ],
        dataAttribute: 'demultiplex-barcodes',
      },
    },
    {
      name: 'include_fivemc_calls_in_cpg_motifs',
      component: 'traction-select',
      value: 'include_fivemc_calls_in_cpg_motifs',
      attribute: 'include_fivemc_calls_in_cpg_motifs',
      label: 'Include 5mc Calls In CpG Motifs',
      required: true,
      default: true,
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'include-fivemc-calls-in-cpg-motifs',
      },
    },
    {
      name: 'disableAdaptiveLoadingBtn',
      component: 'traction-button',
      value: 'disable_adaptive_loading',
      props: {
        text: 'Disable Adaptive Loading',
        theme: 'default',
      },
    },
  ],
  v13_1_revio: [
    {
      name: 'movie_acquisition_time',
      component: 'traction-select',
      value: 'movie_acquisition_time',
      label: 'Movie Acquisition Time (hrs)',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Movie Acquisition Time',
            value: '',
            disabled: true,
          },
          '12.0',
          '24.0',
        ],
        dataAttribute: 'movie-acquisition-time',
      },
    },
    {
      name: 'include_base_kinetics',
      component: 'traction-select',
      value: 'include_base_kinetics',
      label: 'Include Base Kinetics',
      required: true,
      default: true,
      props: {
        options: ['True', 'False'],
        dataAttribute: 'include-base-kinetics',
      },
    },
    {
      name: 'library_concentration',
      component: 'traction-input',
      value: 'library_concentration',
      label: 'Library Concentration (pM)',
      required: true,
      default: true,
      props: {
        type: 'number',
        dataAttribute: 'library-concentration',
        placeholder: 'Library Concentration',
      },
    },
    {
      name: 'polymerase_kit',
      component: 'traction-input',
      value: 'polymerase_kit',
      label: 'Polymerase Kit ',
      required: true,
      default: true,
      props: {
        dataAttribute: 'polymerase-kit',
        placeholder: 'Polymerase Kit',
      },
    },
    {
      name: 'library_type',
      component: 'traction-select',
      value: 'library_type',
      label: 'Library Type',
      required: true,
      default: true,
      props: {
        options: ['Standard', 'Kinnex', 'Adeno-associated Virus'],
        dataAttribute: 'library-type',
      },
    },
    {
      name: 'use_adaptive_loading',
      component: 'traction-select',
      value: 'use_adaptive_loading',
      description: 'Global setting (overrides individual well settings)',
      label: 'Use Adaptive Loading',
      required: true,
      default: true,
      props: {
        options: ['True', 'False'],
        dataAttribute: 'use-adaptive-loading',
      },
      wellProps: {
        disabled: true,
      },
    },
    {
      name: 'full_resolution_base_qual',
      component: 'traction-select',
      value: 'full_resolution_base_qual',
      label: 'Full Resolution Base Qual',
      required: true,
      default: true,
      props: {
        options: ['True', 'False'],
        dataAttribute: 'full_resolution_base_qual',
      },
    },
  ],
  v25_1_revio: [
    {
      name: 'movie_acquisition_time',
      component: 'traction-select',
      value: 'movie_acquisition_time',
      label: 'Movie Acquisition Time (hrs)',
      required: true,
      default: true,
      props: {
        options: [
          {
            text: 'Movie Acquisition Time',
            value: '',
            disabled: true,
          },
          '12.0',
          '24.0',
        ],
        dataAttribute: 'movie-acquisition-time',
      },
    },
    {
      name: 'include_base_kinetics',
      component: 'traction-select',
      value: 'include_base_kinetics',
      label: 'Include Base Kinetics',
      required: true,
      default: true,
      props: {
        options: ['True', 'False'],
        dataAttribute: 'include-base-kinetics',
      },
    },
    {
      name: 'library_concentration',
      component: 'traction-input',
      value: 'library_concentration',
      label: 'Library Concentration (pM)',
      required: true,
      default: true,
      props: {
        type: 'number',
        dataAttribute: 'library-concentration',
        placeholder: 'Library Concentration',
      },
    },
    {
      name: 'library_type',
      component: 'traction-select',
      value: 'library_type',
      label: 'Library Type',
      required: true,
      default: true,
      props: {
        options: ['Standard', 'Kinnex', 'Adeno-associated Virus'],
        dataAttribute: 'library-type',
      },
    },
    {
      name: 'use_adaptive_loading',
      component: 'traction-select',
      value: 'use_adaptive_loading',
      label: 'Use Adaptive Loading',
      description: 'Global setting (overrides individual well settings)',
      required: true,
      default: true,
      props: {
        options: ['True', 'False'],
        dataAttribute: 'use-adaptive-loading',
      },
      wellProps: {
        disabled: true,
      },
    },
    {
      name: 'full_resolution_base_qual',
      component: 'traction-select',
      value: 'full_resolution_base_qual',
      label: 'Full Resolution Base Qual',
      required: true,
      default: true,
      props: {
        options: ['True', 'False'],
        dataAttribute: 'full-resolution-base-qual',
      },
    },
  ],
}

/**
 * defaultSmrtLinkAttributes
 * The default attributes for the Pacbio Run Well Defaults.
 *
 * @param {Object} run The run object.
 * @returns {Object} An object that contains the default attributes for the Pacbio Run Well Defaults.
 */
const defaultSmrtLinkAttributes = (run = {}) => {
  return {
    movie_time: null,
    ccs_analysis_output: 'Yes',
    pre_extension_time: 2,
    loading_target_p1_plus_p2: 0.85,
    generate_hifi: 'On Instrument',
    binding_kit_box_barcode: null,
    on_plate_loading_concentration: null,
    ccs_analysis_output_include_kinetics_information: 'Yes',
    ccs_analysis_output_include_low_quality_reads: 'No',
    demultiplex_barcodes: 'On Instrument',
    include_fivemc_calls_in_cpg_motifs: 'Yes',
    movie_acquisition_time: '24.0',
    include_base_kinetics: 'False',
    library_concentration: null,
    polymerase_kit: null,
    library_type: 'Standard',
    // Compute adaptive loading default based on run setting
    use_adaptive_loading: run.adaptive_loading ? 'True' : 'False',
    full_resolution_base_qual: 'False',
  }
}

export { PacbioRunWellSmrtLinkOptions, defaultSmrtLinkAttributes }
