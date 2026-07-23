import { computed, defineComponent, h, ref, type PropType } from "vue";
import type { AnyColor, ColorModel } from "../types";
import { useColorManipulation } from "../composables/useColorManipulation";
import { useStyleSheet } from "../composables/useStyleSheet";
import { formatClassName } from "../utils/format";
import { Saturation } from "./common/Saturation";
import { Hue } from "./common/Hue";
import { Alpha } from "./common/Alpha";

export const createColorPicker = <T extends AnyColor>(colorModel: ColorModel<T>, withAlpha = false) =>
  defineComponent({
    name: withAlpha ? "AlphaColorPicker" : "ColorPicker",
    inheritAttrs: false,
    props: {
      color: {
        type: null as unknown as PropType<T>,
        default: colorModel.defaultColor,
      },
    },
    emits: ["update:color", "change", "changeEnd"],
    setup(props, { attrs, emit }) {
      const nodeRef = ref<HTMLDivElement | null>(null);
      useStyleSheet(nodeRef);

      const color = computed(() => (props as unknown as { color: T }).color);
      const { hsva, updateHsva, commitChange } = useColorManipulation(colorModel, color, emit);

      return () =>
        h(
          "div",
          {
            ...attrs,
            ref: nodeRef,
            class: formatClassName(["react-colorful", attrs.class]),
          },
          [
            h(Saturation, { hsva: hsva.value, onChange: updateHsva, onChangeEnd: commitChange }),
            h(Hue, {
              hue: hsva.value.h,
              onChange: updateHsva,
              onChangeEnd: commitChange,
              className: withAlpha ? undefined : "react-colorful__last-control",
            }),
            ...(withAlpha
              ? [
                  h(Alpha, {
                    hsva: hsva.value,
                    onChange: updateHsva,
                    onChangeEnd: commitChange,
                    className: "react-colorful__last-control",
                  }),
                ]
              : []),
          ]
        );
    },
  });
