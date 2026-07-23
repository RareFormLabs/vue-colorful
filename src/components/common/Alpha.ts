import { defineComponent, h, type PropType } from "vue";
import { hsvaToHslaString } from "../../utils/convert";
import { formatClassName } from "../../utils/format";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";
import { HsvaColor } from "../../types";
import { Interactive, type Interaction } from "./Interactive";
import { Pointer } from "./Pointer";

export const Alpha = defineComponent({
  name: "ColorfulAlpha",
  props: {
    className: String,
    hsva: {
      type: Object as PropType<HsvaColor>,
      required: true,
    },
    onChange: {
      type: Function as PropType<(color: { a: number }) => void>,
      required: true,
    },
    onChangeEnd: Function as PropType<() => void>,
  },
  setup(props) {
    const handleMove = (interaction: Interaction) => {
      props.onChange({ a: interaction.left });
    };

    const handleKey = (offset: Interaction) => {
      props.onChange({ a: clamp(props.hsva.a + offset.left) });
    };

    return () => {
      const colorFrom = hsvaToHslaString({ ...props.hsva, a: 0 });
      const colorTo = hsvaToHslaString({ ...props.hsva, a: 1 });
      const ariaValue = round(props.hsva.a * 100);

      return h(
        "div",
        { class: formatClassName(["react-colorful__alpha", props.className]) },
        [
          h("div", {
            class: "react-colorful__alpha-gradient",
            style: {
              backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
            },
          }),
          h(
            Interactive,
            {
              onMove: handleMove,
              onKey: handleKey,
              onEnd: props.onChangeEnd,
              ariaLabel: "Alpha",
              ariaValueText: `${ariaValue}%`,
              ariaValueNow: ariaValue,
              ariaValueMin: 0,
              ariaValueMax: 100,
            },
            {
              default: () => [
                h(Pointer, {
                  className: "react-colorful__alpha-pointer",
                  left: props.hsva.a,
                  color: hsvaToHslaString(props.hsva),
                }),
              ],
            }
          ),
        ]
      );
    };
  },
});
