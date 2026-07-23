import { ref, watch, type Ref } from "vue";
import type { AnyColor, ColorModel, HsvaColor } from "../types";
import { equalColorObjects } from "../utils/compare";

export const useColorManipulation = <T extends AnyColor>(
  colorModel: ColorModel<T>,
  colorRef: Ref<T>,
  emit: (event: "update:color" | "change" | "changeEnd", value: T) => void
) => {
  const initialColor = colorRef.value as unknown as T;
  const hsva = ref<HsvaColor>(colorModel.toHsva(initialColor));
  const cache = ref<{ color: T; hsva: HsvaColor }>({ color: initialColor, hsva: hsva.value });
  const isDirty = ref(false);

  watch(
    colorRef,
    (color) => {
      const nextColor = color as unknown as T;
      if (!colorModel.equal(nextColor, cache.value.color as T)) {
        const nextHsva = colorModel.toHsva(nextColor);
        cache.value = { hsva: nextHsva, color: nextColor };
        hsva.value = nextHsva;
        isDirty.value = false;
      }
    },
    { immediate: false, flush: "sync" }
  );

  watch(
    hsva,
    (value) => {
      let nextColor: T | undefined;

      if (
        !equalColorObjects(value, cache.value.hsva) &&
        !colorModel.equal((nextColor = colorModel.fromHsva(value)), cache.value.color as T)
      ) {
        cache.value = { hsva: value, color: nextColor };
        emit("update:color", nextColor);
        emit("change", nextColor);
        isDirty.value = true;
      }
    },
    { deep: true, flush: "sync" }
  );

  const updateHsva = (params: Partial<HsvaColor>) => {
    hsva.value = { ...hsva.value, ...params };
  };

  const commitChange = () => {
    if (isDirty.value) {
      isDirty.value = false;
      emit("changeEnd", cache.value.color as T);
    }
  };

  return { hsva, updateHsva, commitChange };
};
