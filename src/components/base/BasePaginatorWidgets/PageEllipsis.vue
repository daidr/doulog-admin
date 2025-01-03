<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import BasePopover from '../BasePopover.vue'

defineProps<{
  current: number
  min: number
  max: number
}>()

const emit = defineEmits<{
  pageChange: [page: number]
}>()

defineSlots<{
  default: (props: { open: boolean }) => any
}>()

const popoverOpen = ref(false)

function handleClick(page: number) {
  popoverOpen.value = false
  emit('pageChange', page)
}
</script>

<template>
  <BasePopover v-model:open="popoverOpen" position="top" trigger="hover">
    <template #default="{ open }">
      <div class="page-item">
        ...
      </div>
    </template>
    <template #content>
      <RecycleScroller
        v-slot="{ item }" class="max-h-12rem min-w-23 overflow-auto rounded-3"
        :item-size="30" :items="Array.from({ length: max - min + 1 }).map((_, i) => ({ page: i + min }))"
        key-field="page"
      >
        <div
          class="page-list-item" :class="{
            active: item.page === current,
          }" @click="handleClick(item.page)"
        >
          {{ item.page }}
        </div>
      </RecycleScroller>
    </template>
  </BasePopover>
</template>

<style scoped lang="scss">
.page-list-item {
  @apply cursor-pointer;
  @apply h-30px px-2 flex items-center;

  &:hover {
    @apply bg-gray-200;
  }

  &.active {
    @apply bg-gray-300;
    @apply pointer-events-none;
  }

  &:active {
    @apply bg-gray-300;
  }
}
</style>
