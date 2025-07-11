import { describe, expect, test } from "@jest/globals";

import { foo1 } from "../foo1.js";

describe("foo1", function() {
    test("Is correct", function() {
        expect(foo1).toBe(1);
    });
});
