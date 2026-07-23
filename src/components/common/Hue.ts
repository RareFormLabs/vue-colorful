import { defineComponent, h, type PropType } from "vue";
import { hsvaToHslString } from "../../utils/convert";
import { formatClassName } from "../../utils/format";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";
import { Interactive, type Interaction } from "./Interactive";
import { Pointer } from "./Pointer";

export const Hue = defineComponent({
  name: "ColorfulHue",
  props: {
    className: String,
    hue: {
      type: Number,
      required: true,
    },
    onChange: {
      type: Function as PropType<(color: { h: number }) => void>,
      required: true,
    },
    onChangeEnd: Function as PropType<() => void>,
  },
  setup(props) {
    const handleMove = (interaction: Interaction) => {
      props.onChange({ h: 360 * interaction.left });
    };

    const handleKey = (offset: Interaction) => {
      props.onChange({ h: clamp(props.hue + offset.left * 360, 0, 360) });
    };

    return () =>
      h(
        "div",
        { class: formatClassName(["react-colorful__hue", props.className]) },
        [
          h(
            Interactive,
            {
              onMove: handleMove,
              onKey: handleKey,
              onEnd: props.onChangeEnd,
              ariaLabel: "Hue",
              ariaValueNow: round(props.hue),
              ariaValueMin: 0,
              ariaValueMax: 360,
            },
            {
              default: () => [
                h(Pointer, {
                  className: "react-colorful__hue-pointer",
                  left: props.hue / 360,
                  color: hsvaToHslString({ h: props.hue, s: 100, v: 100, a: 1 }),
                }),
              ],
            }
          ),
        ]
      );
  },
});
