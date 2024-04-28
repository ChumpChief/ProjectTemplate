"use strict";

// This config includes all the recommended configs, including type-checking, and the strict config.
// It then also upgrades most of the rules to "error" that the recommended configs leave at "warn".

module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
    ],
    parserOptions: {
        // Enabling type checking
        project: true,
    },
    rules: {
        // Couple warns that I'm not ready to be errors
        "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
        "@typescript-eslint/no-unnecessary-condition": "warn",
        "@typescript-eslint/prefer-readonly": "error",
        // Left as warn, for sync implementations complying with async interfaces
        "@typescript-eslint/require-await": "warn",
    },
};
