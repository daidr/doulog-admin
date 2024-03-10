<script setup lang="ts">
import type { RouterLinkProps } from 'vue-router/auto';

defineProps<{
  to: typeof RouterLinkProps['to']
  activeHighlight?: boolean
}>()
</script>

<template>
  <RouterLink class="link-item" :class="{
      'active-highlight': activeHighlight
    }" :to="to">
    <div class="flex items-center">
      <div class="item-size flex items-center justify-center">
        <slot />
      </div>
      <div class="hide-on-collapse">
        <slot name="extra" />
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.link-item {
  @apply block transition;
  @apply rounded-md;

  &:hover {
    @apply bg-gray-200;
  }

  &.active-highlight {
    &.router-link-exact-active {
      @apply bg-gray-200;
    }
  }
}
</style>
