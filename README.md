# Traction UI

A Vue front-end app to interact with the Traction API.

## Requirements

* Yarn; if using brew: `brew install yarn`
* Node

## Installation

Install the required libraries using yarn: `yarn install`

## Config using .dotenv

To specify the required config, use `.env` files by creating a `.env.development.local` file and
add the config to it. The esential config required:
```
VUE_APP_SEQUENCESCAPE_BASE_URL=
VUE_APP_TRACTION_BASE_URL=
VUE_APP_PRINTMYBARCODE_BASE_URL=
```

## Running

To run the app and have hot-reloads for development: `yarn run serve`

## Building a release for deployment

Before building a release for either UAT or production, make sure to create the `.env.uat.local` or
`.env.prod.local` files. Once they are created: `yarn run build`

## Testing

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```

### Run your end-to-end tests
```
yarn run test:e2e
```

## Miscellaneous

### Current process

To see how the UI and service work, follow this process to get a run created.

1. Generate manifest in SS (this creates samples in tubes with barcodes and metadata)

    * 6630/sdb/sample_manifests
    * create manifests for 1D tubes
    * use Saphyr template
    * use Saphyr purpose
    * select study
    * select supplier
    * number of tubes required

1. Download sample manifest from SS - manifest looks like exec we've created sample manifest for
Saphyr with minimal information

1. User adds data into sample manifest:
    * supplier
    * sample name
    * volume
    * common name (species)
    * etc.

1. Upload manifest in SS - creates the samples in SS within the tubes copy barcodes from SS
1. Import SS tubes in Traction UI
1. Paste barcodes in the text box 'Import SS tubes'
    * Goes gets sample meta data from SS
    * Creates samples in Traction in tubes with Traction barcode
    * redirected to samples table
    * shows the recently created sample
1. Create library from sample
    * select an enzyme
    * redirected to created library
    * creates a library
1. Print library tube barcode
1. Create a run
    * add a run name
    * scan in barcodes of library into each flowcell
