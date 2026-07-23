import { defineComponent, h, type PropType } from "vue";
import { HsvaColor } from "../../types";
import { hsvaToHslString } from "../../utils/convert";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";
import { Interactive, type Interaction } from "./Interactive";
import { Pointer } from "./Pointer";

export const Saturation = defineComponent({
  name: "ColorfulSaturation",
  props: {
    hsva: {
      type: Object as PropType<HsvaColor>,
      required: true,
    },
    onChange: {
      type: Function as PropType<(color: { s: number; v: number }) => void>,
      required: true,
    },
    onChangeEnd: Function as PropType<() => void>,
  },
  setup(props) {
    const handleMove = (interaction: Interaction) => {
      props.onChange({ s: interaction.left * 100, v: 100 - interaction.top * 100 });
    };

    const handleKey = (offset: Interaction) => {
      props.onChange({
        s: clamp(props.hsva.s + offset.left * 100, 0, 100),
        v: clamp(props.hsva.v - offset.top * 100, 0, 100),
      });
    };

    return () =>
      h(
        "div",
        {
          class: "react-colorful__saturation",
          style: {
            backgroundColor: hsvaToHslString({ h: props.hsva.h, s: 100, v: 100, a: 1 }),
          },
        },
        [
          h(
            Interactive,
            {
              onMove: handleMove,
              onKey: handleKey,
              onEnd: props.onChangeEnd,
              ariaLabel: "Color",
              ariaValueText: `Saturation ${round(props.hsva.s)}%, Brightness ${round(props.hsva.v)}%`,
            },
            {
              default: () => [
                h(Pointer, {
                  className: "react-colorful__saturation-pointer",
                  top: 1 - props.hsva.v / 100,
                  left: props.hsva.s / 100,
                  color: hsvaToHslString(props.hsva),
                }),
              ],
            }
          ),
        ]
      );
  },
});
