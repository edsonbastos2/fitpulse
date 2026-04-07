module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config',
  ],
  rules: {
    // Vue specific rules
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'off',
    'vue/component-tags-order': ['error', {
      order: ['script', 'template', 'style'],
    }],

    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/consistent-type-imports': ['error', {
      prefer: 'type-imports',
    }],

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
}
