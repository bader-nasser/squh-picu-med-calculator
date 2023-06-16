module.exports = {
	envs:	['es2022', 'browser', 'node'],
	extends: [
		'xo-react',
		'plugin:jsx-a11y/recommended',
		'plugin:jsx-a11y/strict',
	],
	rules: {
		'capitalized-comments': 'off',
		'react/react-in-jsx-scope': 'off',
		'import/extensions': 'warn',
	},
	overrides: [
		{
			files: '*.config.js',
			rules: {
				'unicorn/prefer-module': 'off',
			},
		},
	],
};
