import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it, afterEach } from "vitest";
import {
  HexColorInput,
  HexColorPicker,
  HsvColorPicker,
  RgbaColorPicker,
  RgbaStringColorPicker,
} from "../src";

class FakeMouseEvent extends MouseEvent {
  pageX: number;
  pageY: number;

  constructor(type: string, values: Record<string, number> = {}) {
    super(type, { buttons: 1, bubbles: true, ...values });
    this.pageX = values.pageX || 0;
    this.pageY = values.pageY || 0;
  }
}

Object.defineProperties(HTMLElement.prototype, {
  getBoundingClientRect: {
    configurable: true,
    get: () => () => ({
      left: 5,
      top: 5,
      width: 100,
      height: 100,
    }),
  },
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("components", () => {
  it("renders base markup", () => {
    const wrapper = mount(HexColorPicker, { props: { color: "#ff0000" } });
    expect(wrapper.classes()).toContain("react-colorful");
    expect(wrapper.find(".react-colorful__saturation").exists()).toBe(true);
    expect(wrapper.find(".react-colorful__hue").exists()).toBe(true);
  });

  it("renders alpha controls when needed", () => {
    const wrapper = mount(RgbaStringColorPicker, {
      props: { color: "rgba(255, 0, 0, 0.5)" },
    });
    expect(wrapper.find(".react-colorful__alpha").exists()).toBe(true);
  });

  it("emits change during mouse interaction", async () => {
    const wrapper = mount(RgbaColorPicker, {
      attachTo: document.body,
    });
    const saturation = wrapper.find(".react-colorful__saturation .react-colorful__interactive").element;

    saturation.dispatchEvent(new FakeMouseEvent("mousedown", { pageX: 0, pageY: 0 }));
    window.dispatchEvent(new FakeMouseEvent("mousemove", { pageX: 10, pageY: 10 }));
    await nextTick();

    expect(wrapper.emitted("change")?.length).toBeGreaterThan(0);
  });

  it("emits changeEnd after mouseup", async () => {
    const wrapper = mount(RgbaColorPicker, {
      attachTo: document.body,
    });
    const saturation = wrapper.find(".react-colorful__saturation .react-colorful__interactive").element;

    saturation.dispatchEvent(new FakeMouseEvent("mousedown", { pageX: 0, pageY: 0 }));
    window.dispatchEvent(new FakeMouseEvent("mousemove", { pageX: 10, pageY: 10 }));
    window.dispatchEvent(new FakeMouseEvent("mouseup"));
    await nextTick();

    expect(wrapper.emitted("changeEnd")).toHaveLength(1);
  });

  it("emits changeEnd after keyboard interaction", async () => {
    const wrapper = mount(HexColorPicker, {
      props: {
        color: "#ff0000",
      },
      attachTo: document.body,
    });

    const hue = wrapper.find(".react-colorful__hue .react-colorful__interactive").element;
    const down = new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" });
    Object.defineProperty(down, "which", { value: 39 });
    Object.defineProperty(down, "keyCode", { value: 39 });
    const up = new KeyboardEvent("keyup", { bubbles: true, key: "ArrowRight" });
    Object.defineProperty(up, "which", { value: 39 });
    Object.defineProperty(up, "keyCode", { value: 39 });

    hue.dispatchEvent(down);
    hue.dispatchEvent(up);
    await nextTick();

    expect(wrapper.emitted("changeEnd")).toHaveLength(1);
  });

  it("supports touch interaction", async () => {
    const wrapper = mount(HsvColorPicker, {
      props: {
        color: { h: 0, s: 100, v: 100 },
      },
      attachTo: document.body,
    });
    const hue = wrapper.find(".react-colorful__hue .react-colorful__interactive").element;

    const start = new Event("touchstart", { bubbles: true }) as TouchEvent & {
      touches: TouchList;
      changedTouches: TouchList;
    };
    start.touches = [{ pageX: 0, pageY: 0, identifier: 0 }] as unknown as TouchList;
    start.changedTouches = [{ pageX: 0, pageY: 0, identifier: 0 }] as unknown as TouchList;

    const move = new Event("touchmove", { bubbles: true }) as TouchEvent & {
      touches: TouchList;
      changedTouches: TouchList;
    };
    move.touches = [{ pageX: 55, pageY: 0, identifier: 0 }] as unknown as TouchList;
    move.changedTouches = [{ pageX: 55, pageY: 0, identifier: 0 }] as unknown as TouchList;

    hue.dispatchEvent(start);
    window.dispatchEvent(move);
    await nextTick();

    expect(wrapper.emitted("change")?.length).toBeGreaterThan(0);
  });

  it("hex input emits normalized values", async () => {
    const wrapper = mount(HexColorInput, {
      props: {
        color: "#aabbcc",
        prefixed: true,
      },
    });

    await wrapper.find("input").setValue("ff00aa");
    expect(wrapper.emitted("update:color")?.[0]).toEqual(["#ff00aa"]);
  });
});
