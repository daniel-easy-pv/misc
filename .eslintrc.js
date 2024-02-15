// eslint-disable-next-line no-undef
module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: 'eslint:recommended',
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        'quotes': [
            'error',
            'single',
            {
                'allowTemplateLiterals': true,
            }
        ],
        'semi': [
            'warn',
            'never'
        ],
        'no-unused-vars': [
            'error',
            {
                'argsIgnorePattern': '^_',
            }
        ],
        'no-var': 'warn',
        'array-callback-return': 'error',
        'eqeqeq': [
            'warn',
            'always',
        ],
        'space-before-blocks': [
            'warn',
            'always',
        ],
        'indent': ['warn', 4, { 'SwitchCase': 1 }],
        'max-len': [
            'warn', 
            { 
                'code': 120,
                'tabWidth': 4,
                'ignoreTrailingComments': true,
                'ignoreUrls': true,
                'ignoreStrings': true,
                'ignoreTemplateLiterals': true,
            }
        ],
        'space-before-function-paren': ['warn', 'never'],
        'object-curly-spacing': ['warn', 'always'],
        'key-spacing': ['warn', { 'beforeColon': false }],
        'prefer-const': 'warn',
    }
}
