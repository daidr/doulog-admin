<script setup lang="ts">
import BasePopover, { type BasePopoverProps } from './BasePopover.vue';


const {
  text = '',
  ...restProps
} = defineProps<BasePopoverProps & {
  text: string
}>()
</script>

<template>
  <BasePopover v-bind="restProps">
    <slot />

    <template #content>
      <p class="px-2 text-sm max-w-160px">
        {{ text }}
      </p>
    </template>
  </BasePopover>
</template>

<style scoped>

</style>
