<script setup lang="ts">
import type { VNode } from 'vue';
import PageEllipsis from './BasePaginatorWidgets/PageEllipsis.vue';
import BaseSelect from './BaseSelect.vue';

export interface PaginatorProps {
  current: number,
  total: number,
  size: number,
  pageSizes?: number[],
  disabled?: boolean,
  showSwitch?: boolean,
  showSizer?: boolean,
}
const props = withDefaults(defineProps<PaginatorProps>(), {
  disabled: false,
  pageSizes: () => [10, 20, 50, 100],
  showSwitch: false,
  showSizer: false,
})

export type PaginatorEmits = {
  'page-change': [page: number];
  'size-change': [size: number];
}

const emit = defineEmits<PaginatorEmits>()

const totalPageCount = computed(() => Math.ceil(props.total / props.size))

const PageItemComponent = defineComponent((itemProps) => {
  return () => {
    return h('div', {
      class: {
        'page-item': true,
        active: props.current === itemProps.i,
      },
      onClick: () => {
        if (props.current !== itemProps.i) {
          emit('page-change', itemProps.i)
        }
      }
    }, itemProps.i)
  }
}, {
  props: {
    i: Number
  }
})

const PageItemGroup = () => {
  const nodes: VNode[] = []

  // 渲染当前页
  nodes.push(h(PageItemComponent, { i: props.current, key: props.current }))

  // 渲染左侧页码（如有）
  if (props.current > 1) {
    nodes.unshift(h(PageItemComponent, { i: props.current - 1, key: props.current - 1 }))
  }

  // 渲染右侧页码（如有）
  if (props.current < totalPageCount.value) {
    nodes.push(h(PageItemComponent, { i: props.current + 1, key: props.current + 1 }))
  }

  // 渲染左侧省略号（中间至少有 1 页时）
  if (props.current > 3) {
    nodes.unshift(h(PageEllipsis, { min: 2, max: props.current - 2, current: props.current, onPageChange: (page: number) => emit('page-change', page), key: 'left-ellipsis' }))
  }

  // 渲染最左侧页码
  if (props.current > 2) {
    nodes.unshift(h(PageItemComponent, { i: 1 }))
  }

  // 渲染右侧省略号（中间至少有 1 页时）
  if (props.current < totalPageCount.value - 2) {
    nodes.push(h(PageEllipsis, { min: props.current + 2, max: totalPageCount.value - 1, current: props.current, onPageChange: (page: number) => emit('page-change', page), key: 'right-ellipsis' }))
  }

  // 渲染最右侧页码
  if (props.current < totalPageCount.value - 1) {
    nodes.push(h(PageItemComponent, { i: totalPageCount.value, key: totalPageCount.value }))
  }
  return nodes;
}

const delayDisabled = useDelayRef(() => props.disabled, 300, false);

const sizerOptions = computed(() => props.pageSizes.map((size) => ({ label: `${size} 条/页`, value: size })))
</script>

<template>
  <div class="paginator" :class="{
    disabled: delayDisabled,
  }">
    <div v-if="showSwitch" class="page-item" :class="{
    disabled: props.current === 1,
  }" @click="emit('page-change', props.current - 1)">
      <div class="i-mingcute-left-line text-base"></div>
    </div>
    <Component :is="PageItemGroup" />
    <div v-if="showSwitch" class="page-item" :class="{
    disabled: props.current === totalPageCount,
  }" @click="emit('page-change', props.current + 1)">
      <div class="i-mingcute-right-line text-base"></div>
    </div>
    <BaseSelect :options="sizerOptions" :model-value="size" @update:model-value="emit('size-change', Number($event))" class="important-text-sm" />
  </div>
</template>

<style lang="scss" scoped>
.paginator {
  @apply flex gap-1 items-center;
  @apply select-none;

  &.disabled {
    @apply opacity-50;
  }

  :deep(.page-item) {
    @apply cursor-pointer;
    @apply w-7 h-7 ring-1 ring-gray-300 text-xs;
    @apply flex items-center justify-center;
    @apply rounded-2;

    &:hover {
      @apply bg-gray-100;
    }

    &.active {
      @apply bg-gray-200;
      @apply pointer-events-none;
    }

    &.disabled {
      @apply pointer-events-none;
      @apply opacity-20;
    }
  }
}
</style>
