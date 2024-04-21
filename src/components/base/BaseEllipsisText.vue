<script setup lang="ts">
import BasePopover from './BasePopover.vue';

const showTooltip = ref(false);

const ContentRef = ref<HTMLElement | null>(null);

function handleTryOpen() {
  if(!ContentRef.value) return;
  const contentWidth = ContentRef.value.clientWidth;
  const contentScrollWidth = ContentRef.value.scrollWidth;
  if(contentWidth >= contentScrollWidth) return;
  showTooltip.value = true;
}

function handleTryClose() {
  showTooltip.value = false;
}
</script>

<template>
  <BasePopover v-model:open="showTooltip" :gap="10" position="top-left" trigger="manual" @try-open="handleTryOpen" @try-close="handleTryClose">
    <template #default>
      <div ref="ContentRef" class="base-ellipsis-text">
        <slot></slot>
      </div>
    </template>

    <template #content>
      <div class="p-2 w-max">
        <slot></slot>
      </div>
    </template>
  </BasePopover>
</template>

<style scoped>
.base-ellipsis-text {
  @apply overflow-hidden whitespace-nowrap text-ellipsis;
  @apply w-0 min-w-full;
}
</style>
