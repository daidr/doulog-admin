<script setup lang="ts">
const currentRef = defineModel<HTMLElement | null>()

const WrapperRef = ref<HTMLElement | null>(null)

const handleBlockEnter = () => {
  currentRef.value = WrapperRef.value
}

const handleBlockLeave = () => {
  if (currentRef.value !== WrapperRef.value) return
  currentRef.value = null
}
</script>

<template>
  <div ref="WrapperRef" class="info-block" @mouseenter="handleBlockEnter" @mouseleave="handleBlockLeave" :class="{
    'important-opacity-0': currentRef && currentRef !== WrapperRef
  }">
    <slot :mouse-over="currentRef && currentRef !== WrapperRef"></slot>
  </div>
</template>

<style scoped>
.info-block {
  @apply z-2;
  @apply py-1 px-1.5 rounded-3;
  @apply text-xs;
  @apply bg-white/70 text-black;
  @apply ring-1 ring-gray/20;
  @apply backdrop-blur-md backdrop-contrast-150;
  @apply transition duration-400;
}
</style>
