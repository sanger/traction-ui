# Traction UI

A Vue front-end app to interact with the [Traction API](https://github.com/sanger/traction-service).

## Requirements for Development

The following tools are required for development:

- Yarn; if using brew:
    brew install yarn
- Node, install the version matching that in `.nvmrc` file.

[nvm](https://github.com/nvm-sh/nvm) is very helpful when managing multiple versions of node.

## Getting Started

### Configuring Environment

This project uses dotenv library for environmental config. To specify the required config, use
`.env` files by creating a `.env.<environment>.local` file and add the config to it. The essential
config required:

    VUE_APP_TRACTION_BASE_URL=<url>
    VUE_APP_PRINTMYBARCODE_BASE_URL=<url>
    VUE_APP_SAMPLEEXTRACTION_BASE_URL=<url>
    VUE_APP_LABEL_TEMPLATE_ID=<id>
    VUE_APP_LOG=false

To enable logging and use the convenience method `this.log()` (from the `Helper.vue` mixin) instead
of `console.log()`, set `VUE_APP_LOG=true` in `.env.development.local`.

### Setup Steps

Install the require dependencies:

    yarn install

## Running

To run the app and have hot-reloads for development:

    yarn run serve

## Testing

### Running Tests

- Running unit tests:

      yarn run test:unit

- Running specific unit test files:

      yarn run test:unit <test_file_route> -t "<test_name>"

- Running end to end tests:

      yarn run test:e2e

## Formatting and Linting

### Formatting

This project is formatted using [Prettier](https://github.com/prettier/prettier). To run formatting
checks, run:

    yarn run pretty

### Linting

This project is linted using [ESLint](https://github.com/eslint/eslint). To lint the code,
run:

    yarn run lint

## Deployment

This project is built into a static archive for deployment. To trigger the creation of a new image, increment the `.release-version` version with the corresponding change according to
[semver](https://semver.org/).

## Miscellaneous

### Updating the Table of Contents

To update the table of contents after adding things to this README you can use the [markdown-toc](https://github.com/jonschlinkert/markdown-toc)
node module. To run:

    npx markdown-toc -i README.md
