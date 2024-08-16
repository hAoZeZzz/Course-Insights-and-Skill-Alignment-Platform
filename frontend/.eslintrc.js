module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        jest: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "standard",
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: [
        "react",
        "promise",
        "import"
    ],
    rules: {
      "linebreak-style": 0,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".ts", ".tsx"] }],
        "semi": 0,
        "comma-dangle": 0,
        "react/prop-types": 0,
        "space-before-function-paren": 0,  // 关闭space-before-function-paren规则
        "strict": 0,  // 关闭严格模式规则
        "no-unused-vars": 0,  // 关闭未使用变量检查
        "no-console": 0,  // 允许console语句
        "no-debugger": 0,  // 允许debugger语句
        "no-var": 0,  // 允许var声明
        "prefer-const": 0,  // 关闭对const的偏好
        "eqeqeq": 0,  // 允许==和!=
        "quotes": 0,  // 关闭引号检查
        "react/react-in-jsx-scope": 0,  // 关闭React必须在JSX范围内的检查
        "react/no-unknown-property": [1, { "ignore": ["stroke_width"] }],  // 忽略stroke_width属性
        "object-curly-spacing": 0,  // 关闭对象括号间距检查
        "no-trailing-spaces": 0,  // 关闭尾随空格检查
        "key-spacing": 0,  // 关闭键值间距检查
        "arrow-spacing": 0,  // 关闭箭头函数空格检查
        "block-spacing": 0,  // 关闭块级间距检查
        "object-curly-newline": 0,  // 关闭对象括号换行检查
        "eol-last": 0,  // 关闭文件末尾换行符检查
        "quote-props": 0,  // 关闭不必要的引号检查
        "no-extra-semi": 0,  // 关闭多余的分号检查
        "space-infix-ops": 0,  // 关闭操作符前后空格检查
        "func-call-spacing": 0,  // 关闭函数调用时的空格检查
        "keyword-spacing": 0,  // 关闭关键字后空格检查
        "comma-spacing": 0,  // 关闭逗号后空格检查
        "block-spacing": 0,  // 关闭块级间距检查
        "object-curly-newline": 0,  // 关闭对象括号换行检查
        "camelcase": 0,  // 关闭驼峰命名法检查
        "indent": 0,  // 关闭缩进检查
        "multiline-ternary": 0,  // 关闭多行三元运算符检查
        "dot-notation": 0,  // 关闭点号表示法检查
        "no-multiple-empty-lines": 0,  // 关闭多行空行检查
        "no-duplicates": 0,  // 关闭多次导入相同模块检查
        "padded-blocks": 0,  // 关闭块级填充检查
        "react/no-unescaped-entities": 0,  // 关闭React未转义实体检查
        "no-dupe-keys": 0  // 关闭重复键检查

    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
