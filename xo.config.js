module.exports = {
	envs:	['es2022', 'browser', 'node'],
	extends: ['xo-react'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'import/extensions': 'warn',
	},
	overrides: [
		{
			files: '**/*.js',
			rules: {
				'capitalized-comments': 'off',
				'unicorn/prefer-module': 'warn',
			},
		},
	],
};
