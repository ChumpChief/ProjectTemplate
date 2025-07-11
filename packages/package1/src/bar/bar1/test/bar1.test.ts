import { describe, expect, test } from "@jest/globals";

import { bar1 } from "../bar1.js";

describe("bar1", function() {
    test("Is correct", function() {
        expect(bar1).toBe(1);
    });
});
