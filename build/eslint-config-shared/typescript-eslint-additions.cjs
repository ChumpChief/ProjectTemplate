"use strict";

// This config includes rules that are not mentioned in the recommended rulesets but seem good.
// Only includes typescript-eslint rules, not base eslint - the latter are in eslint-additions.js

module.exports = {
    rules: {
        "@typescript-eslint/restrict-template-expressions": ["error", {
            allowBoolean: true,
            allowNullish: true,
            allowNumber: true,
            allowRegExp: true,
        }],
    }
};
