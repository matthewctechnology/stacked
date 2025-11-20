import { defineConfig } from 'eslint/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import plugin from 'eslint-plugin-react';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'next'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: {
      react: plugin,
    },
    settings: {
      react: {
        version: 'detect',
        pragma: 'React',
        jsxPragma: 'React',
        runtime: 'automatic',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]);

export default eslintConfig;
