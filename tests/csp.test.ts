import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { HexColorPicker, setNonce } from "../src";

describe("csp", () => {
  it("signs the style element with a nonce", () => {
    setNonce("some-hash");
    mount(HexColorPicker, { props: { color: "#ff0000" }, attachTo: document.body });

    const styleElement = document.head.querySelector("style");
    expect(styleElement?.getAttribute("nonce")).toBe("some-hash");
  });
});
