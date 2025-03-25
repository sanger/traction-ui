// This is the main configuration file for ESLint. It is a JavaScript file that exports an ESLint configuration object.
// https://eslint.org/docs/user-guide/configuring
import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...pluginVue.configs['flat/recommended'],
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.js,**/*.vue,**/*.cjs'],
    // removed rules that seem to have no effect
    rules: {},
  },
  {
    ignores: ['dist/**/*.js', 'docs/**/*.js', 'documentation/**/*.js'],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        // TODO: we are using vitest and there is a plugin e.g. it, expect, describe
        ...globals.jest,
        // e.g. document, alert, window
        ...globals.browser,
        // Global vitest and Cypress variables so they don't violate no-undef
        vi: 'readonly',
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
  },
])
