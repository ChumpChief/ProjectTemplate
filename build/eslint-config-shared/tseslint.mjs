import tseslint from "typescript-eslint";

// The typescript-eslint plugin doesn't provide a single, easily includable config.
// Instead, each of their configs are composed from multiple individual configs that
// won't work individually (e.g. they omit the languageOptions, files, etc.).  They
// expect you to use their helper method to flatten their configs back into a single
// usable config.  I'm choosing to avoid that helper to try to keep tighter control
// over the config.  For now I extract and reassemble the rules from the source
// config, but it might be better to later just take a static copy of the "all"
// ruleset and just customize it directly rather than reaching into the config like this.
const strictTypeCheckedConfig = tseslint.configs.strictTypeChecked;
const strictTypeCheckedRules = strictTypeCheckedConfig.reduce(
    (acc, curr) => curr.rules !== undefined ? { ...acc, ...curr.rules } : acc,
    {},
);
const stylisticTypeCheckedConfig = tseslint.configs.stylisticTypeChecked;
const stylisticTypeCheckedRules = stylisticTypeCheckedConfig.reduce(
    (acc, curr) => curr.rules !== undefined ? { ...acc, ...curr.rules } : acc,
    {},
);

export const tseslintConfigs = [
    {
        files: ["**/*.{ts,mts,cts,tsx}"],
        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            ...strictTypeCheckedRules,
            ...stylisticTypeCheckedRules,
            // "@typescript-eslint/adjacent-overload-signatures": "error", // Enabled in stylistic
            // "@typescript-eslint/array-type": "error", // Enabled in stylistic
            // "@typescript-eslint/await-thenable": "error", // Enabled in recommended
            // "@typescript-eslint/ban-ts-comment": "error", // Enabled in recommended
            // "@typescript-eslint/ban-tslint-comment": "error", // Enabled in stylistic
            // "@typescript-eslint/class-literal-property-style": "error", // Enabled in stylistic
            // "@typescript-eslint/class-methods-use-this": "error",
            // "@typescript-eslint/consistent-generic-constructors": "error", // Enabled in stylistic
            // "@typescript-eslint/consistent-indexed-object-style": "error", // Enabled in stylistic
            // "@typescript-eslint/consistent-return": "error",
            // "@typescript-eslint/consistent-type-assertions": "error", // Enabled in stylistic
            "@typescript-eslint/consistent-type-definitions": ["error", "type"], // Enabled in stylistic
            // "@typescript-eslint/consistent-type-exports": "error",
            // "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/default-param-last": "error",
            // "@typescript-eslint/dot-notation": "error", // Enabled in stylistic
            // "@typescript-eslint/explicit-function-return-type": "error",
            // "@typescript-eslint/explicit-member-accessibility": "error",
            // "@typescript-eslint/explicit-module-boundary-types": "error",
            // "@typescript-eslint/init-declarations": "error",
            // "@typescript-eslint/max-params": "error",
            // "@typescript-eslint/member-ordering": "error",
            // "@typescript-eslint/method-signature-style": "error",
            // "@typescript-eslint/naming-convention": "error",
            // "@typescript-eslint/no-array-constructor": "error", // Enabled in recommended
            // "@typescript-eslint/no-array-delete": "error", // Enabled in recommended
            // "@typescript-eslint/no-base-to-string": "error", // Enabled in recommended
            // "@typescript-eslint/no-confusing-non-null-assertion": "error", // Enabled in stylistic
            // "@typescript-eslint/no-confusing-void-expression": "error", // Enabled in strict
            // "@typescript-eslint/no-deprecated": "error", // Enabled in strict
            // "@typescript-eslint/no-dupe-class-members": "error",
            // "@typescript-eslint/no-duplicate-enum-values": "error", // Enabled in recommended
            // "@typescript-eslint/no-duplicate-type-constituents": "error", // Enabled in recommended
            // "@typescript-eslint/no-dynamic-delete": "error", // Enabled in strict
            // "@typescript-eslint/no-empty-function": "error", // Enabled in stylistic
            // "@typescript-eslint/no-empty-object-type": "error", // Enabled in recommended
            // "@typescript-eslint/no-explicit-any": "error", // Enabled in recommended
            // "@typescript-eslint/no-extra-non-null-assertion": "error", // Enabled in recommended
            // "@typescript-eslint/no-extraneous-class": "error", // Enabled in strict
            // "@typescript-eslint/no-floating-promises": "error", // Enabled in recommended
            // "@typescript-eslint/no-for-in-array": "error", // Enabled in recommended
            // "@typescript-eslint/no-implied-eval": "error", // Enabled in recommended
            // "@typescript-eslint/no-import-type-side-effects": "error",
            // "@typescript-eslint/no-inferrable-types": "error", // Enabled in stylistic
            // "@typescript-eslint/no-invalid-this": "error",
            // "@typescript-eslint/no-invalid-void-type": "error", // Enabled in strict
            // "@typescript-eslint/no-loop-func": "error",
            // "@typescript-eslint/no-magic-numbers": "error",
            // "@typescript-eslint/no-meaningless-void-operator": "error", // Enabled in strict
            // "@typescript-eslint/no-misused-new": "error", // Enabled in recommended
            // "@typescript-eslint/no-misused-promises": "error", // Enabled in recommended
            // "@typescript-eslint/no-misused-spread": "error", // Enabled in strict
            // "@typescript-eslint/no-mixed-enums": "error", // Enabled in strict
            // "@typescript-eslint/no-namespace": "error", // Enabled in recommended
            // "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error", // Enabled in strict
            // "@typescript-eslint/no-non-null-asserted-optional-chain": "error", // Enabled in recommended
            // "@typescript-eslint/no-non-null-assertion": "error", // Enabled in strict
            // "@typescript-eslint/no-redeclare": "error",
            // "@typescript-eslint/no-redundant-type-constituents": "error", // Enabled in recommended
            // "@typescript-eslint/no-require-imports": "error", // Enabled in recommended
            // "@typescript-eslint/no-restricted-imports": "error",
            // "@typescript-eslint/no-restricted-types": "error",
            // "@typescript-eslint/no-shadow": "error",
            // "@typescript-eslint/no-this-alias": "error", // Enabled in recommended
            // "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error", // Enabled in strict
            // "@typescript-eslint/no-unnecessary-condition": "error", // Enabled in strict
            // "@typescript-eslint/no-unnecessary-parameter-property-assignment": "error",
            // "@typescript-eslint/no-unnecessary-qualifier": "error",
            // "@typescript-eslint/no-unnecessary-template-expression": "error", // Enabled in strict
            // "@typescript-eslint/no-unnecessary-type-arguments": "error", // Enabled in strict
            // "@typescript-eslint/no-unnecessary-type-assertion": "error", // Enabled in recommended
            // "@typescript-eslint/no-unnecessary-type-constraint": "error", // Enabled in recommended
            // "@typescript-eslint/no-unnecessary-type-conversion": "error",
            // "@typescript-eslint/no-unnecessary-type-parameters": "error", // Enabled in strict
            // "@typescript-eslint/no-unsafe-argument": "error", // Enabled in recommended
            // "@typescript-eslint/no-unsafe-assignment": "error", // Enabled in recommended
            // "@typescript-eslint/no-unsafe-call": "error", // Enabled in recommended
            // "@typescript-eslint/no-unsafe-declaration-merging": "error", // Enabled in recommended
            // "@typescript-eslint/no-unsafe-enum-comparison": "error", // Enabled in recommended
            // "@typescript-eslint/no-unsafe-function-type": "error", // Enabled in recommended
            // "@typescript-eslint/no-unsafe-member-access": "error", // Enabled in recommended
            // "@typescript-eslint/no-unsafe-return": "error", // Enabled in recommended
            // "@typescript-eslint/no-unsafe-type-assertion": "error",
            // "@typescript-eslint/no-unsafe-unary-minus": "error", // Enabled in recommended
            // "@typescript-eslint/no-unused-expressions": "error", // Enabled in recommended
            // "@typescript-eslint/no-unused-vars": "error", // Enabled in recommended
            // "@typescript-eslint/no-use-before-define": "error",
            // "@typescript-eslint/no-useless-constructor": "error", // Enabled in strict
            // "@typescript-eslint/no-useless-empty-export": "error",
            // "@typescript-eslint/no-wrapper-object-types": "error", // Enabled in recommended
            // "@typescript-eslint/non-nullable-type-assertion-style": "error", // Enabled in stylistic
            // "@typescript-eslint/only-throw-error": "error", // Enabled in recommended
            // "@typescript-eslint/parameter-properties": "error",
            // "@typescript-eslint/prefer-as-const": "error", // Enabled in recommended
            // "@typescript-eslint/prefer-destructuring": "error",
            // "@typescript-eslint/prefer-enum-initializers": "error",
            // "@typescript-eslint/prefer-find": "error", // Enabled in stylistic
            // "@typescript-eslint/prefer-for-of": "error", // Enabled in stylistic
            // "@typescript-eslint/prefer-function-type": "error", // Enabled in stylistic
            // "@typescript-eslint/prefer-includes": "error", // Enabled in stylistic
            // "@typescript-eslint/prefer-literal-enum-member": "error", // Enabled in strict
            // "@typescript-eslint/prefer-namespace-keyword": "error", // Enabled in recommended
            // "@typescript-eslint/prefer-nullish-coalescing": "error", // Enabled in stylistic
            // "@typescript-eslint/prefer-optional-chain": "error", // Enabled in stylistic
            // "@typescript-eslint/prefer-promise-reject-errors": "error", // Enabled in recommended
            "@typescript-eslint/prefer-readonly": "error",
            // "@typescript-eslint/prefer-readonly-parameter-types": "error",
            // "@typescript-eslint/prefer-reduce-type-parameter": "error", // Enabled in strict
            // "@typescript-eslint/prefer-regexp-exec": "error", // Enabled in stylistic
            // "@typescript-eslint/prefer-return-this-type": "error", // Enabled in strict
            // "@typescript-eslint/prefer-string-starts-ends-with": "error", // Enabled in stylistic
            // "@typescript-eslint/promise-function-async": "error",
            // "@typescript-eslint/related-getter-setter-pairs": "error", // Enabled in strict
            // "@typescript-eslint/require-array-sort-compare": "error",
            // "@typescript-eslint/require-await": "error", // Enabled in recommended
            // "@typescript-eslint/restrict-plus-operands": "error", // Enabled in recommended
            "@typescript-eslint/restrict-template-expressions": ["error", {
                allowBoolean: true,
                allowNullish: true,
                allowNumber: true,
                allowRegExp: true,
            }], // Enabled in recommended
            // "@typescript-eslint/return-await": "error", // Enabled in strict
            // "@typescript-eslint/strict-boolean-expressions": "error",
            // "@typescript-eslint/switch-exhaustiveness-check": "error",
            // "@typescript-eslint/triple-slash-reference": "error", // Enabled in recommended
            // "@typescript-eslint/unbound-method": "error", // Enabled in recommended
            // "@typescript-eslint/unified-signatures": "error", // Enabled in strict
            // "@typescript-eslint/use-unknown-in-catch-callback-variable": "error", // Enabled in strict
        }
    },
];
