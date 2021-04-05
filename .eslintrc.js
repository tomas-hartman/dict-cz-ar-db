module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true,
        'jest/globals': true
    },
    'plugins': ['jest'],
    'extends': [
        'eslint:recommended',
        'plugin:node/recommended'
    ],
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-unused-vars': [
            'error', 
            { 'varsIgnorePattern': '^_' }
        ],
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error'
    }
};
