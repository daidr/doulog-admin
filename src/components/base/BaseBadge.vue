<script setup lang="ts">
export interface BaseBadgeProps {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
  class?: any;
  icon?: string;
}

withDefaults(defineProps<BaseBadgeProps>(), {
  type: 'primary',
  size: 'medium',
})
</script>

<template>
  <div class="base-badge" :class="[$props.class, [`size-${size}`, `type-${type}`]]">
    <div v-if="icon" :class="icon" class="base-badge-icon"></div>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.base-badge {
  --font-size: theme('fontSize.base.0');
  --bg-color: theme('colors.gray.200');
  --text-color: theme('colors.gray.600');
  @apply px-2 py-1;
  @apply lh-0;
  @apply whitespace-nowrap select-none;
  @apply flex items-center gap-1 rounded-full;
  @apply ring-1 ring-white;
  @apply bg-[var(--bg-color)] text-[var(--text-color)] text-size-[var(--font-size)];

  &-icon {
    @apply text-1.2em flex-shrink-0;
  }

  &.size-small {
    --font-size: theme('fontSize.sm.0');
    @apply px-2 py-1;
  }

  &.size-large {
    --font-size: theme('fontSize.lg.0');
    @apply px-3 py-1.5;
  }

  &.type-danger {
    --bg-color: theme('colors.red.100');
    --text-color: theme('colors.red.700');
  }

  &.type-info {
    --bg-color: theme('colors.blue.100');
    --text-color: theme('colors.blue.700');
  }

  &.type-success {
    --bg-color: theme('colors.green.100');
    --text-color: theme('colors.green.700');
  }

  &.type-warning {
    --bg-color: theme('colors.orange.100');
    --text-color: theme('colors.orange.700');
  }
}
</style>
