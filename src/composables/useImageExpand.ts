let lastUpdate = 0
const MIN = 1
const MAX = 9
let current = MIN

export default function useImageExpand(delay: number = 500) {
  const zIndex = ref<number | undefined>(undefined)
  const expanded = ref(false)
  let timer: NodeJS.Timeout

  function show() {
    const now = Date.now()
    clearTimeout(timer)
    if (now - lastUpdate > delay || current > MAX) {
      current = MIN
    }
    lastUpdate = now
    zIndex.value = current++
    expanded.value = true
  }

  function hide() {
    lastUpdate = Date.now()
    expanded.value = false
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
