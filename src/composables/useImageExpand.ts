const TOP = 8
const INTERMEDIATE = 6

export default function useImageExpand(delay: number = 500) {
  const zIndex = ref<number | undefined>(undefined)
  const expanded = ref(false)
  let timer: NodeJS.Timeout

  function show() {
    clearTimeout(timer)
    zIndex.value = TOP
    expanded.value = true
  }

  function hide() {
    clearTimeout(timer)
    expanded.value = false
    zIndex.value = INTERMEDIATE
    timer = setTimeout(() => {
      zIndex.value = undefined
    }, delay)
  }

  return {
    zIndex,
    expanded,
    show,
    hide
  }
}
