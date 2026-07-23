import { describe, expect, it } from "vitest";
import { equalColorObjects, equalColorString, equalHex } from "../src/utils/compare";
import { clamp } from "../src/utils/clamp";
import {
  hexToHsva,
  hslaStringToHsva,
  hslaToHsl,
  hslaToHsva,
  hsvaToHex,
  hsvaToHslString,
  hsvaToHsla,
  hsvaToHsvaString,
  hsvaToHsv,
  hsvaToHsvString,
  hsvaToRgbString,
  hsvaToRgba,
  hsvaToRgbaString,
  hsvStringToHsva,
  hsvaStringToHsva,
  hslStringToHsva,
  rgbStringToHsva,
  rgbaStringToHsva,
  rgbaToHsva,
  rgbaToRgb,
  roundHsva,
} from "../src/utils/convert";
import { formatClassName } from "../src/utils/format";
import { round } from "../src/utils/round";
import { validHex } from "../src/utils/validate";

describe("utils", () => {
  it("converts between color models", () => {
    expect(hexToHsva("#ffffff")).toMatchObject({ h: 0, s: 0, v: 100, a: 1 });
    expect(hsvaToHex({ h: 0, s: 100, v: 100, a: 1 })).toBe("#ff0000");
    expect(hsvaToHsla({ h: 200, s: 40, v: 40, a: 0.499 })).toMatchObject({
      h: 200,
      s: 25,
      l: 32,
      a: 0.5,
    });
    expect(hslaToHsva({ h: 200, s: 25, l: 32, a: 1 })).toMatchObject({
      h: 200,
      s: 40,
      v: 40,
      a: 1,
    });
    expect(hsvaToHslString({ h: 200, s: 40, v: 40, a: 1 })).toBe("hsl(200, 25%, 32%)");
    expect(hslStringToHsva("hsl(60, 100%, 50%)")).toMatchObject({ h: 60, s: 100, v: 100, a: 1 });
    expect(hslaStringToHsva("hsla(.5turn 25% 32% / 50%)")).toMatchObject({
      h: 180,
      s: 40,
      v: 40,
      a: 0.5,
    });
    expect(hsvaToRgba({ h: 0, s: 100, v: 100, a: 0.567 })).toMatchObject({
      r: 255,
      g: 0,
      b: 0,
      a: 0.57,
    });
    expect(rgbaToHsva({ r: 0, g: 255, b: 0, a: 1 })).toMatchObject({ h: 120, s: 100, v: 100, a: 1 });
    expect(rgbStringToHsva("rgb(50% 45.9% 25%)")).toMatchObject({ h: 50, s: 50, v: 50, a: 1 });
    expect(hsvaToRgbString({ h: 200, s: 40, v: 40, a: 1 })).toBe("rgb(61, 88, 102)");
    expect(hsvaToRgbaString({ h: 200, s: 40, v: 40, a: 0.5 })).toBe("rgba(61, 88, 102, 0.5)");
    expect(rgbaStringToHsva("rgba(23.9% 34.5% 40% / 99%)")).toMatchObject({
      h: 200,
      s: 40,
      v: 40,
      a: 0.99,
    });
    expect(hsvaToHsvaString({ h: 3.33, s: 5.55, v: 6.66, a: 0.567 })).toBe("hsva(3, 6%, 7%, 0.57)");
    expect(hsvaToHsvString({ h: 200, s: 40, v: 40, a: 1 })).toBe("hsv(200, 40%, 40%)");
    expect(hsvStringToHsva("hsv(1.5708rad 20% 10%)")).toMatchObject({ h: 90, s: 20, v: 10, a: 1 });
    expect(hsvaStringToHsva("hsva(0, 11%, 0, 0.5)")).toMatchObject({ h: 0, s: 11, v: 0, a: 0.5 });
    expect(roundHsva({ h: 3.3333, s: 4.4444, v: 5.5555, a: 0.6789 })).toMatchObject({
      h: 3,
      s: 4,
      v: 6,
      a: 0.68,
    });
    expect(rgbaToRgb({ r: 0, g: 0, b: 0, a: 1 })).toMatchObject({ r: 0, g: 0, b: 0 });
    expect(hslaToHsl({ h: 0, s: 0, l: 0, a: 1 })).toMatchObject({ h: 0, s: 0, l: 0 });
    expect(hsvaToHsv({ h: 0, s: 0, v: 0, a: 1 })).toMatchObject({ h: 0, s: 0, v: 0 });
  });

  it("compares and validates values", () => {
    expect(equalHex("#ABC", "#aabbcc")).toBe(true);
    expect(equalColorObjects({ h: 0, s: 0, v: 5, a: 0.5 }, { h: 0, s: 0, v: 5, a: 0.5 })).toBe(true);
    expect(equalColorString("rgb(0,0,0)", "rgb(0, 0, 0)")).toBe(true);
    expect(validHex("#8c0dba")).toBe(true);
    expect(validHex("#12345")).toBe(false);
  });

  it("formats helper output", () => {
    expect(formatClassName(["one", false, "two"])).toBe("one two");
    expect(round(0.789, 2)).toBe(0.79);
    expect(clamp(500, -50, 100)).toBe(100);
  });
});
