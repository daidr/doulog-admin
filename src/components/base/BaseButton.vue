<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';

interface BaseButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  icon?: string;
  loading?: boolean;
  ghost?: boolean;
  color?: string;
  disabled?: boolean;
}

defineProps<BaseButtonProps>()
</script>

<template>
  <button :class="{
    'ghost': ghost,
    'normal': !ghost
  }" :disabled="loading || disabled" :style="{
    '--bg-color': color
  }">
    <div class="bg"></div>
    <div class="content">
      <div v-if="loading" class="icon animate-spin i-mingcute-loading-3-line"></div>
      <div v-else-if="icon" class="icon" :class="[icon]"></div>
      <slot />
    </div>
  </button>
</template>

<style scoped lang="scss">
button {
  @apply py-1.5 px-5 rounded-3;
  @apply cursor-pointer;
  @apply whitespace-nowrap relative;
  @apply transition;
  transition-property: opacity, box-shadow;
  --bg-color: #303846;

  &>.content {
    @apply flex items-center justify-center relative gap-2;
  }

  &:disabled {
    @apply cursor-not-allowed opacity-50;
  }

  &.ghost {
    @apply text-gray-400;
    @apply ring-1 ring-transparent;

    &:not(:disabled):hover {
      @apply ring-gray-300;
    }

    &:not(:disabled):active {
      @apply text-gray-500;
    }
  }

  &.normal {
    @apply text-white;

    .bg {
      @apply opacity-80 bg-[var(--bg-color)] absolute inset-0 rounded-3;
      @apply transition-opacity;
    }

    &:not(:disabled):hover {
      .bg {
        @apply opacity-90;
      }
    }

    &:not(:disabled):active {
      .bg {
        @apply opacity-100;
      }
    }
  }

  .icon {
    @apply text-2xl flex-shrink-0;
  }
}
</style>
