import { defineComponent, h } from "vue";
import { createColorPicker } from "./base";
import { ColorInput } from "./common/ColorInput";
import type { ColorModel, HslColor, HslaColor, HsvColor, HsvaColor, RgbColor, RgbaColor } from "../types";
import { equalColorObjects, equalColorString, equalHex } from "../utils/compare";
import {
  hexToHsva,
  hslaStringToHsva,
  hslaToHsl,
  hslaToHsva,
  hsvaToHex,
  hsvaToHslString,
  hsvaToHsla,
  hsvaToHslaString,
  hsvaToHsv,
  hsvaToHsvaString,
  hsvaToRgbString,
  hsvaToRgba,
  hsvaToRgbaString,
  hsvaStringToHsva,
  hsvStringToHsva,
  rgbaStringToHsva,
  rgbaToHsva,
  rgbaToRgb,
  roundHsva,
} from "../utils/convert";
import { validHex } from "../utils/validate";

const hexModel: ColorModel<string> = {
  defaultColor: "000",
  toHsva: hexToHsva,
  fromHsva: ({ h, s, v }) => hsvaToHex({ h, s, v, a: 1 }),
  equal: equalHex,
};

const hexAlphaModel: ColorModel<string> = {
  defaultColor: "0001",
  toHsva: hexToHsva,
  fromHsva: hsvaToHex,
  equal: equalHex,
};

const rgbaModel: ColorModel<RgbaColor> = {
  defaultColor: { r: 0, g: 0, b: 0, a: 1 },
  toHsva: rgbaToHsva,
  fromHsva: hsvaToRgba,
  equal: equalColorObjects,
};

const rgbModel: ColorModel<RgbColor> = {
  defaultColor: { r: 0, g: 0, b: 0 },
  toHsva: (rgb) => rgbaToHsva({ ...rgb, a: 1 }),
  fromHsva: (hsva) => rgbaToRgb(hsvaToRgba(hsva)),
  equal: equalColorObjects,
};

const rgbaStringModel: ColorModel<string> = {
  defaultColor: "rgba(0, 0, 0, 1)",
  toHsva: rgbaStringToHsva,
  fromHsva: hsvaToRgbaString,
  equal: equalColorString,
};

const rgbStringModel: ColorModel<string> = {
  defaultColor: "rgb(0, 0, 0)",
  toHsva: rgbaStringToHsva,
  fromHsva: hsvaToRgbString,
  equal: equalColorString,
};

const hslaModel: ColorModel<HslaColor> = {
  defaultColor: { h: 0, s: 0, l: 0, a: 1 },
  toHsva: hslaToHsva,
  fromHsva: hsvaToHsla,
  equal: equalColorObjects,
};

const hslModel: ColorModel<HslColor> = {
  defaultColor: { h: 0, s: 0, l: 0 },
  toHsva: (hsl) => hslaToHsva({ ...hsl, a: 1 }),
  fromHsva: (hsva) => hslaToHsl(hsvaToHsla(hsva)),
  equal: equalColorObjects,
};

const hslaStringModel: ColorModel<string> = {
  defaultColor: "hsla(0, 0%, 0%, 1)",
  toHsva: hslaStringToHsva,
  fromHsva: hsvaToHslaString,
  equal: equalColorString,
};

const hslStringModel: ColorModel<string> = {
  defaultColor: "hsl(0, 0%, 0%)",
  toHsva: hslaStringToHsva,
  fromHsva: hsvaToHslString,
  equal: equalColorString,
};

const hsvaModel: ColorModel<HsvaColor> = {
  defaultColor: { h: 0, s: 0, v: 0, a: 1 },
  toHsva: (hsva) => hsva,
  fromHsva: roundHsva,
  equal: equalColorObjects,
};

const hsvModel: ColorModel<HsvColor> = {
  defaultColor: { h: 0, s: 0, v: 0 },
  toHsva: (hsv) => ({ ...hsv, a: 1 }),
  fromHsva: hsvaToHsv,
  equal: equalColorObjects,
};

const hsvaStringModel: ColorModel<string> = {
  defaultColor: "hsva(0, 0%, 0%, 1)",
  toHsva: hsvaStringToHsva,
  fromHsva: hsvaToHsvaString,
  equal: equalColorString,
};

const hsvStringModel: ColorModel<string> = {
  defaultColor: "hsv(0, 0%, 0%)",
  toHsva: hsvStringToHsva,
  fromHsva: (hsva) => {
    const { h, s, v } = hsvaToHsv(hsva);
    return `hsv(${h}, ${s}%, ${v}%)`;
  },
  equal: equalColorString,
};

export const HexColorPicker = createColorPicker(hexModel);
export const HexAlphaColorPicker = createColorPicker(hexAlphaModel, true);
export const RgbColorPicker = createColorPicker(rgbModel);
export const RgbaColorPicker = createColorPicker(rgbaModel, true);
export const RgbStringColorPicker = createColorPicker(rgbStringModel);
export const RgbaStringColorPicker = createColorPicker(rgbaStringModel, true);
export const HslColorPicker = createColorPicker(hslModel);
export const HslaColorPicker = createColorPicker(hslaModel, true);
export const HslStringColorPicker = createColorPicker(hslStringModel);
export const HslaStringColorPicker = createColorPicker(hslaStringModel, true);
export const HsvColorPicker = createColorPicker(hsvModel);
export const HsvaColorPicker = createColorPicker(hsvaModel, true);
export const HsvStringColorPicker = createColorPicker(hsvStringModel);
export const HsvaStringColorPicker = createColorPicker(hsvaStringModel, true);

export const HexColorInput = defineComponent({
  name: "HexColorInput",
  inheritAttrs: false,
  props: {
    color: {
      type: String,
      default: "",
    },
    prefixed: Boolean,
    alpha: Boolean,
  },
  emits: ["update:color", "change"],
  setup(props, { attrs, emit }) {
    const prefix = (value: string) => "#" + value;
    const escape = (value: string) =>
      value.replace(/([^0-9A-F]+)/gi, "").substring(0, props.alpha ? 8 : 6);
    const validate = (value: string) => validHex(value, props.alpha);

    return () =>
      h(ColorInput, {
        ...attrs,
        color: props.color,
        escape,
        validate,
        format: props.prefixed ? prefix : undefined,
        process: prefix,
        "onUpdate:color": (value: string) => emit("update:color", value),
        onChange: (value: string) => emit("change", value),
      });
  },
});
