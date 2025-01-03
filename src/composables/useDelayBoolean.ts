import type { MaybeRefOrGetter } from 'vue'

export function useDelayRef(value: MaybeRefOrGetter<boolean>, delay: number, init: boolean) {
  let timer: number
  const lastValue = ref(init)

  watch(computed(() => toValue(value)), (val) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      lastValue.value = val
    }, delay)
  }, { immediate: true })

  return lastValue
}
