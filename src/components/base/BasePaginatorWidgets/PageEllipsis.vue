<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import BasePopover from '../BasePopover.vue'
const props = defineProps<{
  current: number,
  min: number,
  max: number,
}>()

defineSlots<{
  default(props: { open: boolean }): any
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const popoverOpen = ref(false)

function handleClick(page: number) {
  popoverOpen.value = false
  emit('page-change', page)
}
</script>

<template>
  <BasePopover position="top" trigger="hover" v-model:open="popoverOpen">
    <template #default="{ open }">
      <div class="page-item">
        ...
      </div>
    </template>
    <template #content>
      <RecycleScroller class="min-w-23 max-h-12rem overflow-auto rounded-3" :item-size="30"
        :items="Array.from({ length: max - min + 1 }).map((_, i) => ({ page: i + min }))" v-slot="{ item }"
        key-field="page">
        <div class="page-list-item" @click="handleClick(item.page)" :class="{
    active: item.page === current,
  }">{{ item.page }}</div>
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
