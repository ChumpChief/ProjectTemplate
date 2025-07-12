import js from "@eslint/js";

export const jsConfigs = [
    js.configs.recommended,
    {
        rules: {
            "accessor-pairs": "error",
            "array-callback-return": "error",
            "arrow-body-style": "error",
            "block-scoped-var": "error",
            "camelcase": "error",
            // "capitalized-comments": "error",
            // "class-methods-use-this": "error", // Disabled by tseslint's class-methods-use-this
            "complexity": "error",
            "consistent-return": "error",
            "consistent-this": "error",
            // "constructor-super": "error", // Disabled by tseslint's eslint-recommended-raw
            "curly": "error",
            "default-case": "error",
            "default-case-last": "error",
            // "default-param-last": "error", // Disabled for @typescript-eslint/default-param-last
            // "dot-notation": "error", // Disabled by tseslint's stylistic-type-checked
            "eqeqeq": "error",
            // "for-direction": "error", // Enabled in recommended
            "func-name-matching": "error",
            // "func-names": "error",
            "func-style": "error",
            // "getter-return": "error", // Disabled by tseslint's eslint-recommended-raw
            "grouped-accessor-pairs": "error",
            "guard-for-in": "error",
            "id-denylist": "error",
            // "id-length": "error",
            // "id-match": "error",
            // "init-declarations": "error", // Disabled for @typescript-eslint/init-declarations
            "logical-assignment-operators": "error",
            // "max-classes-per-file": "error",
            // "max-depth": "error",
            // "max-lines": "error",
            // "max-lines-per-function": "error",
            // "max-nested-callbacks": "error",
            // "max-params": "error",
            // "max-statements": "error",
            "new-cap": "error",
            "no-alert": "error",
            // "no-array-constructor": "error", // Disabled by tseslint's recommended-type-checked
            // "no-async-promise-executor": "error", // Enabled in recommended
            // "no-await-in-loop": "error",
            "no-bitwise": "error",
            "no-caller": "error",
            // "no-case-declarations": "error", // Enabled in recommended
            // "no-class-assign": "error", // Disabled by tseslint's eslint-recommended-raw
            // "no-compare-neg-zero": "error", // Enabled in recommended
            // "no-cond-assign": "error", // Enabled in recommended
            // "no-console": "error",
            // "no-const-assign": "error", // Disabled by tseslint's eslint-recommended-raw
            // "no-constant-binary-expression": "error", // Enabled in recommended
            // "no-constant-condition": "error", // Enabled in recommended
            "no-constructor-return": "error",
            "no-continue": "error",
            // "no-control-regex": "error", // Enabled in recommended
            // "no-debugger": "error", // Enabled in recommended
            // "no-delete-var": "error", // Enabled in recommended
            "no-div-regex": "error",
            // "no-dupe-args": "error", // Disabled by tseslint's eslint-recommended-raw
            // "no-dupe-class-members": "error", // Disabled by tseslint's eslint-recommended-raw
            // "no-dupe-else-if": "error", // Enabled in recommended
            // "no-dupe-keys": "error", // Disabled by tseslint's eslint-recommended-raw
            // "no-duplicate-case": "error", // Enabled in recommended
            "no-duplicate-imports": "error",
            "no-else-return": "error",
            // "no-empty": "error", // Enabled in recommended
            // "no-empty-character-class": "error", // Enabled in recommended
            // "no-empty-function": "error", // Disabled by tseslint's stylistic-type-checked
            // "no-empty-pattern": "error", // Enabled in recommended
            // "no-empty-static-block": "error", // Enabled in recommended
            // "no-eq-null": "error",
            "no-eval": "error",
            // "no-ex-assign": "error", // Enabled in recommended
            "no-extend-native": "error",
            "no-extra-bind": "error",
            // "no-extra-boolean-cast": "error", // Enabled in recommended
            "no-extra-label": "error",
            // "no-fallthrough": "error", // Enabled in recommended
            // "no-func-assign": "error", // Disabled by tseslint's eslint-recommended-raw
            // "no-global-assign": "error", // Enabled in recommended
            "no-implicit-coercion": "error",
            "no-implicit-globals": "error",
            // "no-implied-eval": "error", // Disabled by tseslint's recommended-type-checked
            // "no-import-assign": "error", // Disabled by tseslint's eslint-recommended-raw
            // "no-inline-comments": "error",
            // "no-inner-declarations": "error",
            // "no-invalid-regexp": "error", // Enabled in recommended
            // "no-invalid-this": "error",
            // "no-irregular-whitespace": "error", // Enabled in recommended
            "no-iterator": "error",
            "no-label-var": "error",
            "no-labels": "error",
            "no-lone-blocks": "error",
            "no-lonely-if": "error",
            // "no-loop-func": "error",
            // "no-loss-of-precision": "error", // Enabled in recommended
            // "no-magic-numbers": "error",
            // "no-misleading-character-class": "error", // Enabled in recommended
            "no-multi-assign": "error",
            "no-multi-str": "error",
            // "no-negated-condition": "error",
            // "no-nested-ternary": "error",
            "no-new": "error",
            "no-new-func": "error",
            // "no-new-native-nonconstructor": "error", // Disabled by tseslint's eslint-recommended-raw
            "no-new-wrappers": "error",
            // "no-nonoctal-decimal-escape": "error", // Enabled in recommended
            // "no-obj-calls": "error", // Disabled by tseslint's eslint-recommended-raw
            "no-object-constructor": "error",
            // "no-octal": "error", // Enabled in recommended
            "no-octal-escape": "error",
            "no-param-reassign": "error",
            // "no-plusplus": "error",
            "no-promise-executor-return": "error",
            "no-proto": "error",
            // "no-prototype-builtins": "error", // Enabled in recommended
            // "no-redeclare": "error", // Disabled by tseslint's eslint-recommended-raw
            // "no-regex-spaces": "error", // Enabled in recommended
            // "no-restricted-exports": "error",
            // "no-restricted-globals": "error",
            // "no-restricted-imports": "error",
            // "no-restricted-properties": "error",
            // "no-restricted-syntax": "error",
            "no-return-assign": "error",
            "no-script-url": "error",
            // "no-self-assign": "error", // Enabled in recommended
            "no-self-compare": "error",
            "no-sequences": "error",
            // "no-setter-return": "error", // Disabled by tseslint's eslint-recommended-raw
            // "no-shadow": "error",
            // "no-shadow-restricted-names": "error", // Enabled in recommended
            // "no-sparse-arrays": "error", // Enabled in recommended
            "no-template-curly-in-string": "error",
            // "no-ternary": "error",
            // "no-this-before-super": "error", // Disabled by tseslint's eslint-recommended-raw
            // "no-throw-literal": "error", // Disabled by tseslint's recommended-type-checked
            // "no-unassigned-vars": "error",
            // "no-undef": "error", // Disabled by tseslint's eslint-recommended-raw
            "no-undef-init": "error",
            // "no-undefined": "error",
            // "no-underscore-dangle": "error",
            // "no-unexpected-multiline": "error", // Enabled in recommended
            "no-unmodified-loop-condition": "error",
            "no-unneeded-ternary": "error",
            // "no-unreachable": "error", // Disabled by tseslint's eslint-recommended-raw
            "no-unreachable-loop": "error",
            // "no-unsafe-finally": "error", // Enabled in recommended
            // "no-unsafe-negation": "error", // Disabled by tseslint's eslint-recommended-raw
            // "no-unsafe-optional-chaining": "error", // Enabled in recommended
            // "no-unused-expressions": "error", // Disabled by tseslint's recommended-type-checked
            // "no-unused-labels": "error", // Enabled in recommended
            // "no-unused-private-class-members": "error", // Enabled in recommended
            // "no-unused-vars": "error", // Disabled by tseslint's recommended-type-checked
            // "no-use-before-define": "error",
            // "no-useless-assignment": "error",
            // "no-useless-backreference": "error", // Enabled in recommended
            "no-useless-call": "error",
            // "no-useless-catch": "error", // Enabled in recommended
            "no-useless-computed-key": "error",
            "no-useless-concat": "error",
            // "no-useless-constructor": "error", // Disabled by tseslint's strict-type-checked
            // "no-useless-escape": "error", // Enabled in recommended
            "no-useless-rename": "error",
            "no-useless-return": "error",
            // "no-var": "error", // Enabled by tseslint's eslint-recommended-raw
            // "no-void": "error",
            // "no-warning-comments": "error",
            // "no-with": "error", // Disabled by tseslint's eslint-recommended-raw
            "object-shorthand": "error",
            // "one-var": "error",
            // "operator-assignment": "error",
            // "prefer-arrow-callback": "error",
            // "prefer-const": "error", // Enabled by tseslint's eslint-recommended-raw
            "prefer-destructuring": "error",
            // "prefer-exponentiation-operator": "error",
            // "prefer-named-capture-group": "error",
            // "prefer-numeric-literals": "error",
            "prefer-object-has-own": "error",
            "prefer-object-spread": "error",
            // "prefer-promise-reject-errors": "error", // Disabled by tseslint's recommended-type-checked
            // "prefer-regex-literals": "error",
            // "prefer-rest-params": "error", // Enabled by tseslint's eslint-recommended-raw
            // "prefer-spread": "error", // Enabled by tseslint's eslint-recommended-raw
            "prefer-template": "error",
            "radix": ["error", "as-needed"],
            "require-atomic-updates": "error",
            // "require-await": "error", // Disabled by tseslint's recommended-type-checked
            // "require-unicode-regexp": "error",
            // "require-yield": "error", // Enabled in recommended
            // "sort-imports": "error",
            // "sort-keys": "error",
            // "sort-vars": "error",
            "strict": "error",
            "symbol-description": "error",
            "unicode-bom": "error",
            // "use-isnan": "error", // Enabled in recommended
            // "valid-typeof": "error", // Enabled in recommended
            // "vars-on-top": "error",
            "yoda": "error",
        },
    },
];
