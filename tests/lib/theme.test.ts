import { describe, expect, it } from "vitest";
import { getThemeColor, themeToCssVar } from "@/lib/theme";

describe("getThemeColor", () => {
  it("returns the CSS var for known themes", () => {
    expect(getThemeColor("green")).toBe(themeToCssVar.green);
    expect(getThemeColor("purple")).toBe(themeToCssVar.purple);
  });

  it("falls back to green for unknown themes", () => {
    expect(getThemeColor("not-a-real-theme")).toBe(themeToCssVar.green);
  });
});
