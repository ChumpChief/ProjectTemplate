import { describe, expect, test } from "@jest/globals";
import { foo2 } from "../foo2.js";

describe("foo2", function() {
    test("Is correct", function() {
        expect(foo2).toBe(2);
    });
});
