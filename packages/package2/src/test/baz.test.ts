import { describe, expect, test } from "@jest/globals";

import { baz } from "../baz.js";

describe("baz", function() {
    test("Is correct", function() {
        expect(baz).toBe(6);
    });
});
