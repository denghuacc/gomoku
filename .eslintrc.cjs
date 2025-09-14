module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "node_modules"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "@typescript-eslint"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-unused-vars": "off", // 关闭原生的，使用 TypeScript 版本
    "no-undef": "off", // TypeScript 会处理未定义变量
    "no-redeclare": "off", // 测试文件中经常重复声明
    "react-hooks/exhaustive-deps": "warn", // 降级为警告
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      // 测试文件的特殊规则
      files: ["**/__tests__/**/*", "**/*.test.*", "**/*.spec.*"],
      env: {
        jest: true,
      },
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        vi: "readonly",
        vitest: "readonly",
      },
      rules: {
        "no-redeclare": "off",
      },
    },
  ],
};
