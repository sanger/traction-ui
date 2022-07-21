# ![logo](/public/traction-logo.svg) Traction UI

A Vue front-end app to interact with the [Traction API](https://github.com/sanger/traction-service).

## Requirements for Development

The following tools are required for development:

- Node, install the version matching that in `.nvmrc` file.
- npm, should be installed with node

[nvm](https://github.com/nvm-sh/nvm) is very helpful when managing multiple versions of node.

## Getting Started

### Configuring Environment

This project uses dotenv library for environmental config. To specify the required config, use
`.env` files by creating a `.env.<environment>.local` file and add the config to it. The essential
config required:

    VITE_TRACTION_BASE_URL=<url>
    VITE_PRINTMYBARCODE_BASE_URL=<url>
    VITE_SAMPLEEXTRACTION_BASE_URL=<url>
    VITE_LABEL_TEMPLATE_ID=<id>
    VITE_LOG=false

### Setup Steps

Install the require dependencies:

    npm install --include=dev

## Running

In the project directory, you can run:

    npm run start

To run the app and have hot-reloads for development:
*This internally run serve and serve:css commands*

## Testing

### Running Tests

- Running unit tests:

        npm run test:unit

- Running specific unit test files:

        npm run test:unit <test_file_route> -t "<test_name>"

- Running end to end tests:

        npm run test:e2e

- Running individual end to end tests, this will spawn an interactive cypress session:

        npm run test:e2e:one

    You will need to make the following changes to get it working:
    - if you don't already have one create `.env.production.local` in the root folder as a copy of `.env.production`
    - change `VITE_TRACTION_BASE_URL=REPLACE_VITE_TRACTION_BASE_URL` to `VITE_TRACTION_BASE_URL=http://traction`
    - change `VITE_SAMPLEEXTRACTION_BASE_URL=REPLACE_VITE_SAMPLEEXTRACTION_BASE_URL` to `VITE_SAMPLEEXTRACTION_BASE_URL=http://samples-extraction`
    - change to `VITE_SEQUENCESCAPE_BASE_URL=REPLACE_VITE_SEQUENCESCAPE_BASE_URL` to `VITE_SEQUENCESCAPE_BASE_URL=http://sequencescape`

## CSS

- To modify Tailwind configuration
 Tailwind styles used in this project is from `@sanger/ui-styling` npm module. Any further modifications required for the project can be done in `tailwind.config.js` file in root directory.

- To generate Tailwind css independently you can run:
*This is not required mostly, as this will be run as part of 'npm run start'*

npm run serve:css

## Formatting and Linting

### Formatting

This project is formatted using [Prettier](https://github.com/prettier/prettier). To run formatting
checks, run:

    npm run pretty

To fix errors locally run:

    npx prettier --write .

### Linting

This project is linted using [ESLint](https://github.com/eslint/eslint). To lint the code,
run:

    npm run lint

## Deployment

This project is built into a static archive for deployment. To trigger the creation of a new image, increment the `.release-version` version with the corresponding change according to
[semver](https://semver.org/).

## Miscellaneous

### Updating the Table of Contents

To update the table of contents after adding things to this README you can use the [markdown-toc](https://github.com/jonschlinkert/markdown-toc)
node module. To run:

    npx markdown-toc -i README.md
