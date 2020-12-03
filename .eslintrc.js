module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  globals: { // 通过webpack引入的全局变量需在此处添加否则会报错
    _: true,
    Dayjs: true,
  },
  rules: {},
  parserOptions: {
    parser: 'babel-eslint',
  },
};
