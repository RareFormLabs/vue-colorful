import { defineComponent, h, ref, watch, type PropType } from "vue";

export const ColorInput = defineComponent({
  name: "ColorfulInput",
  inheritAttrs: false,
  props: {
    color: {
      type: String,
      default: "",
    },
    escape: {
      type: Function as PropType<(value: string) => string>,
      required: true,
    },
    validate: {
      type: Function as PropType<(value: string) => boolean>,
      required: true,
    },
    format: Function as PropType<(value: string) => string>,
    process: Function as PropType<(value: string) => string>,
  },
  emits: ["update:color", "change"],
  setup(props, { attrs, emit }) {
    const value = ref(props.escape(props.color));

    watch(
      () => props.color,
      (color) => {
        value.value = props.escape(color);
      }
    );

    const handleInput = (event: Event) => {
      const inputValue = props.escape((event.target as HTMLInputElement).value);
      value.value = inputValue;
      if (props.validate(inputValue)) {
        const nextValue = props.process ? props.process(inputValue) : inputValue;
        emit("update:color", nextValue);
        emit("change", nextValue);
      }
    };

    const handleBlur = (event: FocusEvent) => {
      const input = event.target as HTMLInputElement;
      if (!props.validate(input.value)) {
        value.value = props.escape(props.color);
      }
      (attrs.onBlur as ((event: FocusEvent) => void) | undefined)?.(event);
    };

    return () =>
      h("input", {
        ...attrs,
        value: props.format ? props.format(value.value) : value.value,
        spellcheck: "false",
        onInput: handleInput,
        onBlur: handleBlur,
      });
  },
});
