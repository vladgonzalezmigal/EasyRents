import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'build', 'node_modules'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      // React-specific rules
      'react/jsx-uses-react': 'off', // not needed in React 17+
      'react/react-in-jsx-scope': 'off', // not needed in React 17+
      'react-hooks/rules-of-hooks': 'error', // checks correct usage of hooks
      'react-hooks/exhaustive-deps': 'warn', 
      'react-refresh/only-export-components': 'warn', // Next.js / Vite safety
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
];
