<script setup lang="ts">
export interface PaginatorProps {
    current: number,
    total: number,
    size: number,
    pageSizes?: number[],
    disabled?: boolean
}
const props = withDefaults(defineProps<PaginatorProps>(), {
    disabled: false,
    pageSizes: () => [10, 20, 50, 100],
})

export type PaginatorEmits = {
    'page-change': [page: number];
    'size-change': [size: number];
}

defineEmits<PaginatorEmits>()

const totalPageCount = computed(() => Math.ceil(props.total / props.size))
</script>

<template>
    <div class="paginator" :class="{
        disabled,
    }">
        <div class="page-item" v-for="i of 5" :key="i" :class="{
        active: current === i,
    }" @click="$emit('page-change', i)">{{ i }}</div>
    </div>
</template>

<style lang="scss" scoped>
.paginator {
    @apply flex gap-1 items-center;
    @apply select-none;

    &.disabled {
        @apply opacity-50;
    }

    .page-item {
        @apply cursor-pointer;
        @apply w-7 h-7 ring-1 ring-gray-300;
        @apply flex items-center justify-center;
        @apply rounded-2;

        &:hover {
            @apply bg-gray-100;
        }

        &.active {
            @apply bg-gray-200;
            @apply pointer-events-none;
        }
    }
}
</style>