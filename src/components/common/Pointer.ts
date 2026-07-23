import { defineComponent, h, type PropType } from "vue";
import { formatClassName } from "../../utils/format";

export const Pointer = defineComponent({
  name: "ColorfulPointer",
  props: {
    className: String,
    top: {
      type: Number,
      default: 0.5,
    },
    left: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(
        "div",
        {
          class: formatClassName(["react-colorful__pointer", props.className]),
          style: {
            top: `${props.top * 100}%`,
            left: `${props.left * 100}%`,
          },
        },
        [h("div", { class: "react-colorful__pointer-fill", style: { backgroundColor: props.color } })]
      );
  },
});
