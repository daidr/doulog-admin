<script setup lang="ts" generic="T extends { [key: string]: any }">
import BasePaginator, { type PaginatorEmits, type PaginatorProps } from './BasePaginator.vue';

export interface TableSchemeItem {
  label: string;
  key: string;
  fixed?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export type TableScheme = TableSchemeItem[];

const props = defineProps<{
  columns: TableScheme;
  rowKey: keyof T;
  data: T[];
  loading?: boolean;
  scrollHeight?: number | string;
  scrollWidth?: number | string;
  tableClass?: any;
  paginatorClass?: any;
  paginator?: PaginatorProps;
}>();

const normalizeSize = (size: number | string | undefined) => {
  if (typeof size === 'number') {
    return `${size}px`;
  }
  return size;
};

const [DefineColGroup, ReuseColGroup] = createReusableTemplate()

defineSlots<{
  [x: `column-${string}`]: (props: { item: T, key: string }) => any;
}>()

defineEmits<PaginatorEmits>()

const leftFixedColumns = computed(() => {
  let left: string[] = []
  for (let i = 0; i < props.columns.length; i++) {
    const column = props.columns[i]
    if (column.fixed) {
      left.push(column.key)
    } else {
      break
    }
  }

  return left
})

const rightFixedColumns = computed(() => {
  let right: string[] = []

  for (let i = props.columns.length - 1; i >= 0; i--) {
    const column = props.columns[i]
    if (column.fixed) {
      right.push(column.key)
    } else {
      break
    }
  }

  return right
})

const TableHeadRef = ref<HTMLElement | null>(null)
const TableBodyRef = ref<HTMLElement | null>(null)

const currentScrollState = ref<'none' | 'left' | 'middle' | 'right'>('none')
const { width } = useElementBounding(TableBodyRef)

const scrollHandler = () => {
  if (TableHeadRef.value && TableBodyRef.value) {
    TableHeadRef.value.scrollLeft = TableBodyRef.value.scrollLeft

    if (TableBodyRef.value.scrollWidth > TableBodyRef.value.clientWidth) {
      if (TableBodyRef.value.scrollLeft === 0) {
        currentScrollState.value = 'left'
      } else if (Math.abs(TableBodyRef.value.scrollWidth - TableBodyRef.value.scrollLeft - TableBodyRef.value.clientWidth) < 2) {
        currentScrollState.value = 'right'
      } else {
        currentScrollState.value = 'middle'
      }
    } else {
      currentScrollState.value = 'none'
    }
  }
}

onMounted(() => {
  if (TableBodyRef.value) {
    TableBodyRef.value.addEventListener('scroll', scrollHandler, { passive: true })
  }
})

onUnmounted(() => {
  if (TableBodyRef.value) {
    TableBodyRef.value.removeEventListener('scroll', scrollHandler)
  }
})

watch(width, () => {
  scrollHandler()
})
</script>

<template>
  <DefineColGroup>
    <colgroup>
      <col v-for="column of columns" :key="column.key"
        :style="{ width: normalizeSize(column.width), minWidth: normalizeSize(column.width) }" />
    </colgroup>
  </DefineColGroup>
  <div v-bind="$attrs" class="table-scroll">
    <div class="table-container" :class="[{
        [`table-scroll-left`]: currentScrollState === 'left',
        [`table-scroll-right`]: currentScrollState === 'right',
        [`table-scroll-none`]: currentScrollState === 'none',
      }, tableClass]">
      <div ref="TableHeadRef" class="table-head">
        <table :style="{
        maxHeight: normalizeSize(scrollHeight),
        maxWidth: normalizeSize(scrollWidth),
      }">
          <ReuseColGroup />
          <thead>
            <tr class="table-row">
              <th class="table-row-head" v-for="column of columns" :key="column.key" :class="{
        [`table-cell-fixed-left`]: leftFixedColumns.includes(column.key),
        [`table-cell-fixed-right`]: rightFixedColumns.includes(column.key),
        [`table-cell-fixed-left-last`]: leftFixedColumns[leftFixedColumns.length - 1] === column.key,
        [`table-cell-fixed-right-first`]: rightFixedColumns[0] === column.key,
      }">
                {{ column.label }}
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div ref="TableBodyRef" class="table-body overflow-auto" :style="{
        maxHeight: normalizeSize(scrollHeight),
      }">
        <table :style="{
        maxWidth: normalizeSize(scrollWidth),
      }">
          <ReuseColGroup />
          <tbody>
            <tr class="table-row" v-for="item of data" :key="item[props.rowKey]">
              <td class="table-row-data" v-for="column of columns" :key="column.key" :class="{
        [`table-cell-fixed-left`]: leftFixedColumns.includes(column.key),
        [`table-cell-fixed-right`]: rightFixedColumns.includes(column.key),
        [`table-cell-fixed-left-last`]: leftFixedColumns[leftFixedColumns.length - 1] === column.key,
        [`table-cell-fixed-right-first`]: rightFixedColumns[0] === column.key,
      }">
                <template v-if="$slots[`column-${column.key}`]">
                  <slot :name="`column-${column.key}`" :item="item" :key="column.key" />
                </template>
                <template v-else>
                  <div class="w-0 min-w-full">
                    {{ item[column.key] }}
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="paginator" class="paginator-container" :class="[paginatorClass]">
      <div class="paginator-tips">
        显示第 {{ (paginator.current - 1) * paginator.size + 1 }} 到 {{ Math.min(paginator.current * paginator.size,
        paginator.total) }} 条，共 {{ paginator.total }} 条
      </div>
      <BasePaginator v-bind="paginator" @page-change="($event) => $emit('page-change', $event)"
        @size-change="($event) => $emit('size-change', $event)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-container {
  @apply relative;
}

.table-head {
  @apply overflow-hidden;
}

.table-row {
  &-head {
    @apply bg-white text-gray-500;
    @apply px-2 py-2 px-4 v-middle text-left break-words;
    @apply border-b-2 border-gray-200;
  }

  &-data {
    @apply bg-white;
    @apply p-2 md:p-4 v-middle break-words;
    @apply border-b-1 border-gray-200;
  }

  &:last-child &-data {
    @apply border-b-0;
  }

  &:hover &-data {
    @apply bg-gray-100;
  }
}

table {
  @apply min-w-full border-separate border-spacing-0 table-fixed;
}

.table-cell-fixed-left {
  @apply sticky left-0;
}

.table-cell-fixed-right {
  @apply sticky right-0;
}

.table-cell-fixed-left-last {
  --normal-shadow: 2px 0 0 0 #0000000b;
  --active-shadow: 5px 0 0 0 #0000000b;
  box-shadow: var(--normal-shadow), var(--active-shadow);
}

.table-cell-fixed-right-first {
  --normal-shadow: -2px 0 0 0 #0000000b;
  --active-shadow: -5px 0 0 0 #0000000b;
  box-shadow: var(--normal-shadow), var(--active-shadow);
}

.table-scroll-left {
  .table-cell-fixed-left-last {
    --active-shadow: 0 0 0 0 transparent;
  }
}

.table-scroll-right {
  .table-cell-fixed-right-first {
    --active-shadow: 0 0 0 0 transparent;
  }
}

.table-scroll-none {
  .table-cell-fixed-left-last {
    --active-shadow: 0 0 0 0 transparent;
  }

  .table-cell-fixed-right-first {
    --active-shadow: 0 0 0 0 transparent;
  }
}

.paginator-container {
  @apply flex items-center justify-between;
}

.paginator-tips {
  @apply text-gray-400 text-xs sm-text-sm;
}
</style>
