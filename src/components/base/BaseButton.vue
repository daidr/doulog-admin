<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';

interface BaseButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  icon?: string;
  loading?: boolean;
  ghost?: boolean;
  color?: string;
  disabled?: boolean;
  small?: boolean;
}

defineProps<BaseButtonProps>()
</script>

<template>
  <button :class="{
    'ghost': ghost,
    'normal': !ghost,
    'small': small
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
  @apply py-1.5 px-3 rounded-0.75em relative w-auto;
  @apply cursor-pointer;
  @apply whitespace-nowrap;
  @apply transition;

  transition-property: opacity, background-color;
  --bg-color: #303846;

  &>.content {
    @apply flex items-center justify-center relative gap-0.25em;
  }

  &:disabled {
    @apply cursor-not-allowed opacity-50;
  }

  &.ghost {
    @apply text-gray-500 relative;
    @apply bg-transparent;

    &::before {
      @apply content-empty bg-current;
      @apply absolute bottom-0 left-1.5 right-1.5 h-2px;
      @apply transform-gpu scale-x-1 opacity-0 rounded-xl duration-300;
      transition-property: opacity, transform;
    }

    &:not(:disabled):hover {
      @apply bg-gray-200;

      &::before {
        @apply scale-x-100 opacity-50;
      }
    }

    &:not(:disabled):active {
      @apply bg-gray-300;
    }
  }

  &.normal {
    @apply text-white;

    .bg {
      @apply opacity-80 bg-[var(--bg-color)] absolute inset-0 rounded-0.75em;
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

  &.small {
    @apply text-sm py-0.5 px-1 rounded-0.5em;

    .bg {
      @apply rounded-0.5em;
    }
  }

  .icon {
    @apply text-1.2em flex-shrink-0;
  }
}
</style>
