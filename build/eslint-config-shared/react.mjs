import pluginReact from "eslint-plugin-react";

export const reactConfigs = [
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat["jsx-runtime"],
    {
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        rules: {
            // "react/boolean-prop-naming": "error",
            // "react/button-has-type": "error",
            // "react/checked-requires-onchange-or-readonly": "error",
            // "react/default-props-match-prop-types": "error",
            // "react/destructuring-assignment": "error",
            // "react/display-name": "error", // Enabled in recommended
            // "react/forbid-component-props": "error",
            // "react/forbid-dom-props": "error",
            // "react/forbid-elements": "error",
            // "react/forbid-foreign-prop-types": "error",
            // "react/forbid-prop-types": "error",
            // "react/forward-ref-uses-ref": "error",
            // "react/function-component-definition": "error",
            // "react/hook-use-state": "error",
            // "react/iframe-missing-sandbox": "error",
            // "react/jsx-boolean-value": "error",
            // "react/jsx-child-element-spacing": "error",
            // "react/jsx-closing-bracket-location": "error",
            // "react/jsx-closing-tag-location": "error",
            // "react/jsx-curly-brace-presence": "error",
            // "react/jsx-curly-newline": "error",
            // "react/jsx-curly-spacing": "error",
            // "react/jsx-equals-spacing": "error",
            // "react/jsx-filename-extension": "error",
            // "react/jsx-first-prop-new-line": "error",
            // "react/jsx-fragments": "error",
            // "react/jsx-handler-names": "error",
            // "react/jsx-indent": "error",
            // "react/jsx-indent-props": "error",
            // "react/jsx-key": "error", // Enabled in recommended
            // "react/jsx-max-depth": "error",
            // "react/jsx-max-props-per-line": "error",
            // "react/jsx-newline": "error",
            // "react/jsx-no-bind": "error",
            // "react/jsx-no-comment-textnodes": "error", // Enabled in recommended
            // "react/jsx-no-constructed-context-values": "error",
            // "react/jsx-no-duplicate-props": "error", // Enabled in recommended
            // "react/jsx-no-leaked-render": "error",
            // "react/jsx-no-literals": "error",
            // "react/jsx-no-script-url": "error",
            // "react/jsx-no-target-blank": "error", // Enabled in recommended
            // "react/jsx-no-undef": "error", // Enabled in recommended
            // "react/jsx-no-useless-fragment": "error",
            // "react/jsx-one-expression-per-line": "error",
            // "react/jsx-pascal-case": "error",
            // "react/jsx-props-no-multi-spaces": "error",
            // "react/jsx-props-no-spread-multi": "error",
            // "react/jsx-props-no-spreading": "error",
            // "react/jsx-sort-props": "error",
            // "react/jsx-tag-spacing": "error",
            // "react/jsx-uses-react": "error", // Enabled in recommended, but disabled in jsx-runtime
            // "react/jsx-uses-vars": "error", // Enabled in recommended
            // "react/jsx-wrap-multilines": "error",
            // "react/no-access-state-in-setstate": "error",
            // "react/no-adjacent-inline-elements": "error",
            // "react/no-array-index-key": "error",
            // "react/no-arrow-function-lifecycle": "error",
            // "react/no-children-prop": "error", // Enabled in recommended
            // "react/no-danger": "error",
            // "react/no-danger-with-children": "error", // Enabled in recommended
            // "react/no-deprecated": "error", // Enabled in recommended
            // "react/no-did-mount-set-state": "error",
            // "react/no-did-update-set-state": "error",
            // "react/no-direct-mutation-state": "error", // Enabled in recommended
            // "react/no-find-dom-node": "error", // Enabled in recommended
            // "react/no-invalid-html-attribute": "error",
            // "react/no-is-mounted": "error", // Enabled in recommended
            // "react/no-multi-comp": "error",
            // "react/no-namespace": "error",
            // "react/no-object-type-as-default-prop": "error",
            // "react/no-redundant-should-component-update": "error",
            // "react/no-render-return-value": "error", // Enabled in recommended
            // "react/no-set-state": "error",
            // "react/no-string-refs": "error", // Enabled in recommended
            // "react/no-this-in-sfc": "error",
            // "react/no-typos": "error",
            // "react/no-unescaped-entities": "error", // Enabled in recommended
            // "react/no-unknown-property": "error", // Enabled in recommended
            "react/no-unsafe": "error", // Disabled in recommended
            // "react/no-unstable-nested-components": "error",
            // "react/no-unused-class-component-methods": "error",
            // "react/no-unused-prop-types": "error",
            // "react/no-unused-state": "error",
            // "react/no-will-update-set-state": "error",
            // "react/prefer-es6-class": "error",
            // "react/prefer-exact-props": "error",
            // "react/prefer-read-only-props": "error",
            // "react/prefer-stateless-function": "error",
            // "react/prop-types": "error", // Enabled in recommended
            // "react/react-in-jsx-scope": "error", // Enabled in recommended, but disabled in jsx-runtime
            // "react/require-default-props": "error",
            // "react/require-optimization": "error",
            // "react/require-render-return": "error", // Enabled in recommended
            // "react/self-closing-comp": "error",
            // "react/sort-comp": "error",
            // "react/sort-default-props": "error",
            // "react/sort-prop-types": "error",
            // "react/state-in-constructor": "error",
            // "react/static-property-placement": "error",
            // "react/style-prop-object": "error",
            // "react/void-dom-elements-no-children": "error",
        },
    },
];
