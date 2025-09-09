const config = [
  {
    name: 'traction',
    apiNamespace: 'v1',
    rootURL: import.meta.env['VITE_TRACTION_BASE_URL'],
    resources: [
      {
        name: 'samples',
      },
      {
        name: 'tags',
      },
      {
        name: 'receptions',
      },
      {
        name: 'qc_results_uploads',
      },
      {
        name: 'printers',
      },
      {
        name: 'workflows',
      },
      {
        name: 'annotation_types',
      },
      {
        name: 'library_types',
      },
    ],
    urls: [
      {
        name: 'feature_flags',
        url: '/flipper/api/actors/User',
      },
    ],
    pipelines: [
      {
        name: 'pacbio',
        resources: [
          {
            name: 'libraries',
          },
          {
            name: 'request_library',
          },
          {
            name: 'requests',
          },
          {
            name: 'tubes',
          },
          {
            name: 'runs',
            resources: [
              {
                name: 'plates',
              },
              {
                name: 'wells',
              },
            ],
          },
          {
            name: 'plates',
          },
          {
            name: 'wells',
          },
          {
            name: 'tag_sets',
          },
          {
            name: 'pools',
          },
          {
            name: 'smrt_link_versions',
          },
          {
            name: 'library_batches',
          },
        ],
      },
      {
        name: 'ont',
        resources: [
          {
            name: 'requests',
          },
          {
            name: 'plates',
          },
          {
            name: 'tubes',
          },
          {
            name: 'tag_sets',
          },
          {
            name: 'pools',
          },
          {
            name: 'instruments',
          },
          {
            name: 'runs',
          },
        ],
      },
    ],
  },
  {
    name: 'printMyBarcode',
    apiNamespace: 'v2',
    rootURL: import.meta.env['VITE_PRINTMYBARCODE_BASE_URL'],
    resources: [
      {
        name: 'print_jobs',
      },
    ],
  },
  {
    name: 'sequencescape',
    apiNamespace: 'api/v2',
    rootURL: import.meta.env['VITE_SEQUENCESCAPE_BASE_URL'],
    headers: {
      'X-Sequencescape-Client-Id': import.meta.env['VITE_SEQUENCESCAPE_API_KEY'],
    },
    resources: [
      {
        name: 'plates',
      },
      {
        name: 'labware',
      },
      {
        name: 'studies',
      },
    ],
  },
]

export default config
