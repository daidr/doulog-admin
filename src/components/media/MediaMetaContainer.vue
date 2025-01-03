<script setup lang="ts">
const currentRef = defineModel<HTMLElement | null>()

const WrapperRef = ref<HTMLElement | null>(null)

function handleBlockEnter() {
  currentRef.value = WrapperRef.value
}

function handleBlockLeave() {
  if (currentRef.value !== WrapperRef.value) return
  currentRef.value = null
}
</script>

<template>
  <div
    ref="WrapperRef" class="info-block" :class="{
      'important-opacity-0': currentRef && currentRef !== WrapperRef,
    }" @mouseenter="handleBlockEnter" @mouseleave="handleBlockLeave"
  >
    <slot :mouse-over="currentRef && currentRef !== WrapperRef" />
  </div>
</template>

<style scoped>
.info-block {
  @apply z-2;
  @apply py-1 px-1.5 rounded-3 w-fit;
  @apply text-xs;
  @apply bg-white/70 text-black;
  @apply ring-1 ring-gray/20;
  @apply backdrop-blur-md backdrop-contrast-150;
  @apply transition duration-400;
}
</style>
