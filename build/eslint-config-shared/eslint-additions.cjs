"use strict";

// This config includes rules that are not mentioned in the recommended rulesets but seem good.
// Only includes base eslint rules, not typescript-eslint - the latter are in typescript-eslint-additions.js

module.exports = {
    rules: {
        // "Possible Problems"
        "array-callback-return": "error",
        // Try to get this on
        // "no-await-in-loop": "error",
        "no-constant-binary-expression": "error",
        "no-constructor-return": "error",
        // Can't distinguish type vs. normal import statements
        // "no-duplicate-imports": "error",
        "no-new-native-nonconstructor": "error",
        "no-promise-executor-return": "error",
        "no-self-compare": "error",
        "no-template-curly-in-string": "error",
        "no-unmodified-loop-condition": "error",
        "no-unreachable-loop": "error",
        "no-unused-private-class-members": "error",
        // "no-use-before-define": "error", // Disabled by typescript-eslint
        "require-atomic-updates": "error",

        // "Suggestions"
        "accessor-pairs": "error",
        "arrow-body-style": "error", // formatting?
        "block-scoped-var": "error",
        "camelcase": "error", // formatting?
        // "capitalized-comments": "error", // formatting, and I don't care
        "class-methods-use-this": "warn", // Warn, so I can conform with interfaces
        "complexity": "error", // formatting?
        "consistent-return": "error",
        "consistent-this": "error",
        "curly": "error",
        "default-case": "error",
        "default-case-last": "error",
        // "default-param-last": "error", // Disabled by typescript-eslint
        // "dot-notation": "error", // Disabled by typescript-eslint
        "eqeqeq": "error",
        "func-name-matching": "error",
        // Try to get this on
        // "func-names": "error",
        "func-style": "error",
        "grouped-accessor-pairs": "error", // formatting?
        "guard-for-in": "error",
        "id-denylist": "error",
        "id-length": ["error", { "exceptions": ["x", "y", "z"] }],
        // Don't think I like this one anyway
        // "init-declarations": "error", // Disabled by typescript-eslint
        "logical-assignment-operators": "error",
        "new-cap": "error", // formatting
        "no-alert": "error",
        // "no-array-constructor": "error", // Disabled by typescript-eslint
        "no-bitwise": "error",
        "no-caller": "error",
        "no-confusing-arrow": "error",
        "no-continue": "error",
        "no-div-regex": "error",
        "no-else-return": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-label": "error",
        "no-floating-decimal": "error",
        "no-implicit-coercion": "error",
        "no-implicit-globals": "error",
        // "no-implied-eval": "error", // Disabled by typescript-eslint
        // "no-invalid-this": "error", // Disabled by typescript-eslint
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "error",
        // "no-loop-func": "error", // Disabled by typescript-eslint
        // "no-magic-numbers": "error", // Disabled by typescript-eslint
        "no-mixed-operators": "error",
        "no-multi-assign": "error",
        "no-multi-str": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-object": "error",
        "no-new-wrappers": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "error",
        // "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }] // Not sure I agree with this one
        "no-proto": "error",
        "no-return-assign": "error",
        "no-return-await": "error",
        "no-script-url": "error",
        "no-sequences": "error",
        // "no-shadow": "error", // Disabled by typescript-eslint
        // "no-throw-literal": "error", // Disabled by typescript-eslint
        "no-undef-init": "error",
        "no-unneeded-ternary": "error",
        "no-useless-call": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "object-shorthand": "error",
        // "prefer-arrow-callback": "error", // Probably try to get this on, or maybe omit tests?
        "prefer-const": "error",
        "prefer-destructuring": "error",
        "prefer-object-has-own": "error",
        "prefer-object-spread": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "radix": ["error", "as-needed"],
        // "sort-imports": ["error", { "ignoreDeclarationSort": true }], // Not sure about the right config here
        "spaced-comment": "error", // formatting
        "strict": "error",
        "symbol-description": "error",
        "yoda": "error",
    }
};
