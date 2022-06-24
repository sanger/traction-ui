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

### Setup Steps

Install the require dependencies:

    yarn install

## Running

In the project directory, you can run:

    yarn run start

To run the app and have hot-reloads for development:
*This internally run  serve and serve:css commands*

## Testing

### Running Tests

- Running unit tests:

        yarn run test:unit

- Running specific unit test files:

        yarn run test:unit <test_file_route> -t "<test_name>"

- Running end to end tests:

        yarn run test:e2e

    You will need to make the following changes to get it working:
    - if you don't already have one create `.env.production.local` in the root folder as a copy of `.env.production`
    - change `VUE_APP_TRACTION_BASE_URL=REPLACE_VUE_APP_TRACTION_BASE_URL` to `VUE_APP_TRACTION_BASE_URL=http://traction`
    - change `VUE_APP_SAMPLEEXTRACTION_BASE_URL=REPLACE_VUE_APP_SAMPLEEXTRACTION_BASE_URL` to `VUE_APP_SAMPLEEXTRACTION_BASE_URL=http://samples-extraction`
    - change to `VUE_APP_SEQUENCESCAPE_BASE_URL=REPLACE_VUE_APP_SEQUENCESCAPE_BASE_URL` to `VUE_APP_SEQUENCESCAPE_BASE_URL=http://sequencescape`

## CSS
- To generate Tailwind css independently you can run:
*This is not required mostly, as this will be run as part of 'yarn run start'*

yarn run serve:css

## Formatting and Linting

### Formatting

This project is formatted using [Prettier](https://github.com/prettier/prettier). To run formatting
checks, run:

    yarn run pretty

To fix errors locally run:

    yarn pretty --write

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
