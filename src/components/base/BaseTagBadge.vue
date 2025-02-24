<script setup lang="ts">
const props = defineProps<{
  label: string
  color: string
}>()

const normalizedColor = computed(() => {
  if (!props.color.startsWith('#') || props.color.length !== 7) {
    return [255, 255, 255]
  }

  return [
    Number.parseInt(props.color.slice(1, 3), 16),
    Number.parseInt(props.color.slice(3, 5), 16),
    Number.parseInt(props.color.slice(5, 7), 16),
  ]
})

const isBgDark = computed(() => {
  const [r, g, b] = normalizedColor.value
  return r * 0.299 + g * 0.587 + b * 0.114 < 150
})

const textStyle = computed(() => {
  const [r, g, b] = normalizedColor.value

  return {
    '--bg-color': `rgb(${r}, ${g}, ${b})`,
    '--text-color': isBgDark.value ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.8)',
    '--ring-color': isBgDark.value ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
  }
})
</script>

<template>
  <div :style="textStyle" class="inline-block rounded-xl bg-[var(--bg-color)] px-2 text-base text-[var(--text-color)] ring-1 ring-[var(--ring-color)]">
    {{ label }}
  </div>
</template>

<style scoped></style>
