import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { HexColorPicker } from "../src";

describe("shadow dom", () => {
  it("injects styles into the closest shadow root", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });
    const mountNode = document.createElement("div");
    shadow.appendChild(mountNode);

    mount(HexColorPicker, {
      props: { color: "#ff0000" },
      attachTo: mountNode,
    });

    expect(shadow.querySelector("style")).not.toBeNull();
  });
});
