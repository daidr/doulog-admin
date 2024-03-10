import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      '.vscode',
      'public',
      'pnpm-lock.yaml',
      'README.md',
      'CHANGELOG.md',
    ],
    unocss: true,
  },
  {
    rules: {
      // 允许单行if不换行
      // if (condition) doSomething();
      'antfu/if-newline': 'off',

      // 仅单行if允许不使用大括号
      'curly': ['error', 'multi-line'],

      // 允许使用 console.warn 和 console.error，但使用 console.log 警告
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // 使用 2 个空格缩进
      'style/indent': ['error', 2],
      'jsonc/indent': ['error', 2],

      // 允许 while 条件内赋值操作
      'no-cond-assign': ['error', 'except-parens'],

      'style/brace-style': ['error', '1tbs'],
    },
  },
)
