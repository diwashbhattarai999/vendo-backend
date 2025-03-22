import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginSecurity from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.browser },
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
    plugins: { security: eslintPluginSecurity, 'simple-import-sort': simpleImportSort },

    rules: {
      // General Best Practices
      'no-console': 'error', // Allow warnings and errors
      'no-duplicate-imports': 'error',
      'no-use-before-define': 'off', // TypeScript handles this
      'no-await-in-loop': 'error',
      'require-atomic-updates': 'error',
      'no-useless-catch': 'off',

      // TypeScript-Specific Rules
      // '@typescript-eslint/no-floating-promises': ['error'], // Avoid unhandled promises
      // '@typescript-eslint/no-misused-promises': 'error', // Prevent incorrect usage of promises
      // '@typescript-eslint/return-await': 'error', // Enforce proper `await` usage
      '@typescript-eslint/no-explicit-any': 'warn', // Discourage `any` usage
      '@typescript-eslint/consistent-type-imports': 'error', // Enforce consistent `import type`
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Ignore unused vars starting with `_`
      'no-throw-literal': 'error', // Prevent unsafe `throw` usage
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      // Security Best Practices
      'security/detect-object-injection': 'off', // May produce false positives in backend code
      'security/detect-non-literal-fs-filename': 'warn', // Warn on dynamic file access

      // Import Sorting (Better Readability)
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['module-alias/register$'], // Module alias registration
            ['^node:'], // Node.js built-in modules (fs, path, etc.)
            ['^express$', '^@?\\w'], // External npm packages (express, axios, etc.)
            ['^@/config'], // Configuration files (dotenv, app settings)
            ['^@/constant'], // Constants
            ['^@/types'], // TypeScript types and interfaces
            ['^@/error'], // Error handling
            ['^@/utils'], // Utility functions/helpers
            ['^@/services'], // Services (business logic)
            ['^@/controllers'], // Controllers (route handlers)
            ['^@/middlewares'], // Middleware functions
            ['^@/routes'], // Express routes
            ['^@/schema'], // Validation schemas
            ['^\\.'], // Relative imports (./, ../, etc.)
          ],
        },
      ],
    },
  },
];
