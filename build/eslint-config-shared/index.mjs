import { jsConfigs } from "./js.mjs";
import { perfectionistConfigs } from "./perfectionist.mjs";
import { reactConfigs } from "./react.mjs";
import { stylisticConfigs } from "./stylistic.mjs";
import { tseslintConfigs } from "./tseslint.mjs";

export default [
    ...jsConfigs,
    ...tseslintConfigs,
    ...reactConfigs,
    ...perfectionistConfigs,
    ...stylisticConfigs,
    {
        linterOptions: {
            reportUnusedDisableDirectives: "error",
            reportUnusedInlineConfigs: "error",
        },
    },
    {
        ignores: ["built/**", "webpacked/**"],
    },
];
