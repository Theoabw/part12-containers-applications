const globals = require("globals")
const pluginJs = require("@eslint/js")

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2021,
      globals: globals.node},
    rules: {
      "constructor-super": "error"
    },
  },

  pluginJs.configs.recommended,
];