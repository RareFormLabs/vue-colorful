import { defineComponent, h, onBeforeUnmount, ref, type PropType } from "vue";
import { clamp } from "../../utils/clamp";

export interface Interaction {
  left: number;
  top: number;
}

const isTouch = (event: MouseEvent | TouchEvent): event is TouchEvent => "touches" in event;

const getTouchPoint = (touches: TouchList, touchId: null | number): Touch => {
  for (let index = 0; index < touches.length; index += 1) {
    if (touches[index].identifier === touchId) return touches[index];
  }
  return touches[0];
};

const getParentWindow = (node?: HTMLDivElement | null): Window => {
  return (node && node.ownerDocument.defaultView) || self;
};

const getRelativePosition = (
  node: HTMLDivElement,
  event: MouseEvent | TouchEvent,
  touchId: null | number
): Interaction => {
  const rect = node.getBoundingClientRect();
  const pointer = isTouch(event) ? getTouchPoint(event.touches, touchId) : event;

  return {
    left: clamp((pointer.pageX - (rect.left + getParentWindow(node).pageXOffset)) / rect.width),
    top: clamp((pointer.pageY - (rect.top + getParentWindow(node).pageYOffset)) / rect.height),
  };
};

const preventDefaultMove = (event: MouseEvent | TouchEvent): void => {
  if (!isTouch(event)) event.preventDefault();
};

const isInvalid = (event: MouseEvent | TouchEvent, hasTouch: boolean): boolean => {
  return hasTouch && !isTouch(event);
};

export const Interactive = defineComponent({
  name: "ColorfulInteractive",
  props: {
    onMove: {
      type: Function as PropType<(interaction: Interaction) => void>,
      required: true,
    },
    onKey: {
      type: Function as PropType<(interaction: Interaction) => void>,
      required: true,
    },
    onEnd: Function as PropType<() => void>,
    ariaLabel: String,
    ariaValueText: String,
    ariaValueNow: [Number, String] as PropType<number | string>,
    ariaValueMin: [Number, String] as PropType<number | string>,
    ariaValueMax: [Number, String] as PropType<number | string>,
  },
  setup(props, { slots }) {
    const container = ref<HTMLDivElement | null>(null);
    const touchId = ref<number | null>(null);
    const hasTouch = ref(false);

    const handleMove = (event: MouseEvent | TouchEvent) => {
      preventDefaultMove(event);
      const isDown = isTouch(event) ? event.touches.length > 0 : event.buttons > 0;

      if (isDown && container.value) {
        props.onMove(getRelativePosition(container.value, event, touchId.value));
      } else {
        toggleDocumentEvents(false);
        props.onEnd?.();
      }
    };

    const handleMoveEnd = () => {
      toggleDocumentEvents(false);
      props.onEnd?.();
    };

    const toggleDocumentEvents = (state?: boolean) => {
      const touch = hasTouch.value;
      const parentWindow = getParentWindow(container.value);
      const toggleEvent = state ? parentWindow.addEventListener : parentWindow.removeEventListener;
      toggleEvent(touch ? "touchmove" : "mousemove", handleMove);
      toggleEvent(touch ? "touchend" : "mouseup", handleMoveEnd);
    };

    const handleMoveStart = (event: MouseEvent | TouchEvent) => {
      const element = container.value;
      if (!element) return;

      preventDefaultMove(event);
      if (isInvalid(event, hasTouch.value)) return;

      if (isTouch(event)) {
        hasTouch.value = true;
        const changedTouches = event.changedTouches || [];
        if (changedTouches.length) touchId.value = changedTouches[0].identifier;
      }

      element.focus();
      props.onMove(getRelativePosition(element, event, touchId.value));
      toggleDocumentEvents(true);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyCode = event.which || event.keyCode;
      if (keyCode < 37 || keyCode > 40) return;

      event.preventDefault();
      props.onKey({
        left: keyCode === 39 ? 0.05 : keyCode === 37 ? -0.05 : 0,
        top: keyCode === 40 ? 0.05 : keyCode === 38 ? -0.05 : 0,
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const keyCode = event.which || event.keyCode;
      if (keyCode >= 37 && keyCode <= 40) props.onEnd?.();
    };

    onBeforeUnmount(() => {
      toggleDocumentEvents(false);
    });

    return () =>
      h(
        "div",
        {
          ref: container,
          class: "react-colorful__interactive",
          tabindex: 0,
          role: "slider",
          "aria-label": props.ariaLabel,
          "aria-valuetext": props.ariaValueText,
          "aria-valuenow": props.ariaValueNow,
          "aria-valuemin": props.ariaValueMin,
          "aria-valuemax": props.ariaValueMax,
          onTouchstart: (event: TouchEvent) => handleMoveStart(event),
          onMousedown: (event: MouseEvent) => handleMoveStart(event),
          onKeydown: (event: KeyboardEvent) => handleKeyDown(event),
          onKeyup: (event: KeyboardEvent) => handleKeyUp(event),
        },
        slots.default?.()
      );
  },
});
