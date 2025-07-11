import { describe, expect, test } from "@jest/globals";

import { bar2 } from "../bar2.js";

describe("bar2", function() {
    test("Is correct", function() {
        expect(bar2).toBe(2);
    });
});
