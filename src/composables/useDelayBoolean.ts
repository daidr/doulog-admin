import type { MaybeRefOrGetter } from "vue";

export const useDelayRef = (value: MaybeRefOrGetter<boolean>, delay: number, init: boolean) => {
  let timer: NodeJS.Timeout;
  let lastValue = ref(init);

  watch(computed(() => toValue(value)), (val) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      lastValue.value = val;
    }, delay);
  }, { immediate: true });

  return lastValue;
}
