import pluginPerfectionist from "eslint-plugin-perfectionist";

export const perfectionistConfigs = [
    pluginPerfectionist.configs["recommended-natural"],
    {
        rules: {
            // "perfectionist/sort-array-includes": "error",
            "perfectionist/sort-classes": "off",
            // "perfectionist/sort-decorators": "error",
            // "perfectionist/sort-enums": "error",
            // "perfectionist/sort-exports": "error",
            // "perfectionist/sort-heritage-clauses": "error",
            // "perfectionist/sort-imports": "error",
            // "perfectionist/sort-interfaces": "error",
            "perfectionist/sort-intersection-types": "off",
            "perfectionist/sort-jsx-props": "off",
            // "perfectionist/sort-maps": "error",
            // "perfectionist/sort-named-exports": "error",
            "perfectionist/sort-modules": "off",
            // "perfectionist/sort-named-imports": "error",
            "perfectionist/sort-object-types": "off",
            "perfectionist/sort-objects": "off",
            // "perfectionist/sort-sets": "error",
            // "perfectionist/sort-switch-case": "error",
            // "perfectionist/sort-union-types": "error",
            // "perfectionist/sort-variable-declarations": "error",
        },
    },
];
