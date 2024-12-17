import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
    {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
    {languageOptions: { globals: globals.node }},
    pluginJs.configs.recommended,
    {
        rules: {
            semi: "error",
            "no-unused-vars": "warn",
            quotes: ["error", "double"],
            "no-multi-spaces": "error",
            "space-in-parens": ["error", "never"],
            "no-trailing-spaces": "error",
            "indent": ["error", 4]
        }
    }
];