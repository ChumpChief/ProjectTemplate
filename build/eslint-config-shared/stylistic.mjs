import pluginStylistic from "@stylistic/eslint-plugin";

export const stylisticConfigs = [
    pluginStylistic.configs.recommended,
    {
        rules: {
            "@stylistic/array-bracket-newline": "error",
            // "@stylistic/array-bracket-spacing": "error", // Enabled in recommended
            // "@stylistic/array-element-newline": "error",
            // "@stylistic/arrow-parens": "error", // Enabled in recommended
            // "@stylistic/arrow-spacing": "error", // Enabled in recommended
            // "@stylistic/block-spacing": "error", // Enabled in recommended
            "@stylistic/brace-style": ["error", "1tbs", { "allowSingleLine": true }], // Enabled in recommended
            // "@stylistic/comma-dangle": "error", // Enabled in recommended
            // "@stylistic/comma-spacing": "error", // Enabled in recommended
            // "@stylistic/comma-style": "error", // Enabled in recommended
            // "@stylistic/computed-property-spacing": "error", // Enabled in recommended
            // "@stylistic/curly-newline": "error",
            // "@stylistic/dot-location": "error", // Enabled in recommended
            // "@stylistic/eol-last": "error", // Enabled in recommended
            "@stylistic/function-call-argument-newline": ["error", "consistent"],
            "@stylistic/function-call-spacing": "error",
            "@stylistic/function-paren-newline": ["error", "multiline-arguments"],
            // "@stylistic/generator-star-spacing": "error", // Enabled in recommended
            // "@stylistic/implicit-arrow-linebreak": "error",
            "@stylistic/indent": ["error", 4], // Enabled in recommended
            // "@stylistic/indent-binary-ops": "error", // Enabled in recommended
            // "@stylistic/jsx-child-element-spacing": "error",
            // "@stylistic/jsx-closing-bracket-location": "error", // Enabled in recommended
            // "@stylistic/jsx-closing-tag-location": "error", // Enabled in recommended
            // "@stylistic/jsx-curly-brace-presence": "error", // Enabled in recommended
            // "@stylistic/jsx-curly-newline": "error", // Enabled in recommended
            "@stylistic/jsx-curly-spacing": ["error", { "when": "always" }], // Enabled in recommended
            // "@stylistic/jsx-equals-spacing": "error", // Enabled in recommended
            // "@stylistic/jsx-first-prop-new-line": "error", // Enabled in recommended
            // "@stylistic/jsx-function-call-newline": "error", // Enabled in recommended
            // "@stylistic/jsx-indent": "error",
            "@stylistic/jsx-indent-props": ["error", 4], // Enabled in recommended
            // "@stylistic/jsx-max-props-per-line": "error", // Enabled in recommended
            // "@stylistic/jsx-newline": "error",
            "@stylistic/jsx-one-expression-per-line": "off", // Enabled in recommended
            // "@stylistic/jsx-pascal-case": "error",
            // "@stylistic/jsx-props-no-multi-spaces": "error",
            // "@stylistic/jsx-quotes": "error", // Enabled in recommended
            // "@stylistic/jsx-self-closing-comp": "error",
            // "@stylistic/jsx-sort-props": "error",
            // "@stylistic/jsx-tag-spacing": "error", // Enabled in recommended
            // "@stylistic/jsx-wrap-multilines": "error", // Enabled in recommended
            // "@stylistic/key-spacing": "error", // Enabled in recommended
            // "@stylistic/keyword-spacing": "error", // Enabled in recommended
            // "@stylistic/line-comment-position": "error",
            "@stylistic/linebreak-style": "error",
            // "@stylistic/lines-around-comment": "error",
            "@stylistic/lines-between-class-members": "off", // Enabled in recommended
            // "@stylistic/max-len": "error",
            "@stylistic/max-statements-per-line": "off", // Enabled in recommended
            "@stylistic/member-delimiter-style": [
                "error",
                {
                    "multiline": {
                        "delimiter": "semi",
                        "requireLast": true
                    },
                    "singleline": {
                        "delimiter": "semi",
                        "requireLast": false
                    },
                    "multilineDetection": "brackets"
                },
            ], // Enabled in recommended
            // "@stylistic/multiline-comment-style": "error",
            // "@stylistic/multiline-ternary": "error", // Enabled in recommended
            // "@stylistic/new-parens": "error", // Enabled in recommended
            // "@stylistic/newline-per-chained-call": "error",
            "@stylistic/no-confusing-arrow": "error",
            // "@stylistic/no-extra-parens": "error", // Enabled in recommended
            // "@stylistic/no-extra-semi": "error",
            // "@stylistic/no-floating-decimal": "error", // Enabled in recommended
            // "@stylistic/no-mixed-operators": "error", // Enabled in recommended
            // "@stylistic/no-mixed-spaces-and-tabs": "error", // Enabled in recommended
            // "@stylistic/no-multi-spaces": "error", // Enabled in recommended
            // "@stylistic/no-multiple-empty-lines": "error", // Enabled in recommended
            // "@stylistic/no-tabs": "error", // Enabled in recommended
            // "@stylistic/no-trailing-spaces": "error", // Enabled in recommended
            // "@stylistic/no-whitespace-before-property": "error", // Enabled in recommended
            // "@stylistic/nonblock-statement-body-position": "error",
            // "@stylistic/object-curly-newline": "error",
            // "@stylistic/object-curly-spacing": "error", // Enabled in recommended
            "@stylistic/object-property-newline": ["error", { "allowAllPropertiesOnSameLine": true }],
            // "@stylistic/one-var-declaration-per-line": "error",
            // "@stylistic/operator-linebreak": "error", // Enabled in recommended
            // "@stylistic/padded-blocks": "error", // Enabled in recommended
            // "@stylistic/padding-line-between-statements": "error",
            // "@stylistic/quote-props": "error", // Enabled in recommended
            "@stylistic/quotes": ["error", "double"], // Enabled in recommended
            // "@stylistic/rest-spread-spacing": "error", // Enabled in recommended
            "@stylistic/semi": ["error", "always"], // Enabled in recommended
            // "@stylistic/semi-spacing": "error", // Enabled in recommended
            "@stylistic/semi-style": "error",
            // "@stylistic/space-before-blocks": "error", // Enabled in recommended
            "@stylistic/space-before-function-paren": ["error", {"anonymous": "never", "named": "never", "asyncArrow": "always"}], // Enabled in recommended
            // "@stylistic/space-in-parens": "error", // Enabled in recommended
            // "@stylistic/space-infix-ops": "error", // Enabled in recommended
            // "@stylistic/space-unary-ops": "error", // Enabled in recommended
            // "@stylistic/spaced-comment": "error", // Enabled in recommended
            "@stylistic/switch-colon-spacing": "error",
            "@stylistic/template-curly-spacing": ["error", "always"], // Enabled in recommended
            // "@stylistic/template-tag-spacing": "error", // Enabled in recommended
            // "@stylistic/type-annotation-spacing": "error", // Enabled in recommended
            // "@stylistic/type-generic-spacing": "error", // Enabled in recommended
            // "@stylistic/type-named-tuple-spacing": "error", // Enabled in recommended
            "@stylistic/wrap-iife": ["error", "inside"], // Enabled in recommended
            // "@stylistic/wrap-regex": "error",
            // "@stylistic/yield-star-spacing": "error", // Enabled in recommended
        },
    },
];
