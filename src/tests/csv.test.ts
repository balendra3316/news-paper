import { describe, it, expect } from "vitest";
// Assuming you have a function that cleans names
const formatName = (name: string) => name.trim().toUpperCase();

describe("Utility Functions", () => {
  it("should format names correctly", () => {
    expect(formatName("  john doe  ")).toBe("JOHN DOE");
  });
});
