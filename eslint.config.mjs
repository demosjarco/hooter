import eslint from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({
	ignores: ['dist', '**/worker-configuration.d.ts'],
	extends: [eslint.configs.recommended, tseslint.configs.recommendedTypeChecked, tseslint.configs.stylisticTypeChecked, eslintConfigPrettier],
	plugins: {
		'@typescript-eslint': tseslint.plugin,
		typescriptEslint,
	},
	languageOptions: {
		parser: tseslint.parser,
		parserOptions: {
			ecmaVersion: 'latest',
			jsDocParsingMode: 'type-info',
			lib: ['esnext'],
			projectService: {
				allowDefaultProject: ['eslint.config.mjs'],
				defaultProject: 'tsconfig.json',
			},
			tsconfigRootDir: import.meta.dirname,
		},
	},
	rules: {
		'no-async-promise-executor': 'off',
		'@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
		'@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
		'@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true, ignoreVoidOperator: true }],
		'@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
		'@typescript-eslint/restrict-plus-operands': 'warn',
		'@typescript-eslint/ban-ts-comment': 'warn',
		'@typescript-eslint/no-floating-promises': ['error', { checkThenables: true, ignoreIIFE: true }],
	},
});
