# Traction UI

A Vue front-end app to interact with the [Traction API](https://github.com/sanger/traction-service).

## Requirements

* Yarn; if using brew: `brew install yarn`
* Node

## Installation

Install the required libraries using yarn: `yarn install`

## Config using `.dotenv`

To specify the required config, use `.env` files by creating a `.env.<environment>.local` file and
add the config to it. The essential config required:

```bash
VUE_APP_TRACTION_BASE_URL=<url>
VUE_APP_PRINTMYBARCODE_BASE_URL=<url>
VUE_APP_SAMPLEEXTRACTION_BASE_URL=<url>
VUE_APP_LABEL_TEMPLATE_ID=<id>
VUE_APP_LOG=false
```

To enable logging and use the convenience method `this.log()` (from the `Helper.vue` mixin) instead
of `console.log()`, set `VUE_APP_LOG=true` in `.env.development.local`.

## Running

To run the app and have hot-reloads for development: `yarn run serve`

## Testing

### Lints and fixes files

```bash
yarn run lint
```

### Run your unit tests

```bash
yarn run test:unit
```

### Run your end-to-end tests

```bash
yarn run test:e2e
```

## Releases

#### UAT
On merging a pull request into develop, a release will be created with the tag/name `<branch>/<timestamp>`

#### PROD
Update `.release-version` with major/minor/patch. On merging a pull request into master, a release will be created with the release version as the tag/name 

See Confluence for further information