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

const tableBodyScrollbarWidth = ref<number>(0)

const scrollHandler = () => {
  if (TableHeadRef.value && TableBodyRef.value) {
    tableBodyScrollbarWidth.value = TableBodyRef.value.offsetWidth - TableBodyRef.value.clientWidth

    TableHeadRef.value.scrollLeft = TableBodyRef.value.scrollLeft

    if (TableBodyRef.value.scrollWidth > TableBodyRef.value.clientWidth) {
      if (TableBodyRef.value.scrollLeft <= 0) {
        currentScrollState.value = 'left'
      } else if (TableBodyRef.value.scrollWidth - TableBodyRef.value.scrollLeft - TableBodyRef.value.clientWidth < 2) {
        currentScrollState.value = 'right'
      } else {
        currentScrollState.value = 'middle'
      }
    } else {
      currentScrollState.value = 'none'
    }

  }
}

useEventListener(TableBodyRef, 'scroll', scrollHandler, { passive: true })

const FakeTableHeadRefs = ref<HTMLElement[]>([])
const calcTableHeadWidths = ref<number[]>([])

watch([width, FakeTableHeadRefs, () => props.data], () => {
  calcTableHeadWidths.value = FakeTableHeadRefs.value.map((ref) => {
    return ref.getBoundingClientRect().width
  })
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollHandler()
    })
  })
}, {
  immediate: true,
  flush: 'post'
})

</script>

<template>
  <div v-bind="$attrs" class="table-scroll">
    <div class="table-container" :class="[{
      [`table-scroll-left`]: currentScrollState === 'left',
      [`table-scroll-right`]: currentScrollState === 'right',
      [`table-scroll-none`]: currentScrollState === 'none',
    }, tableClass]">
      <div ref="TableHeadRef" class="table-head" :style="{
      marginRight: tableBodyScrollbarWidth + 'px',
    }">
        <table :style="{
          maxHeight: normalizeSize(scrollHeight),
          maxWidth: normalizeSize(scrollWidth),
        }">
          <thead>
            <tr class="table-row">
              <th class="table-row-head" v-for="(column, index) of columns" :key="column.key" :class="{
                [`table-cell-fixed-left`]: leftFixedColumns.includes(column.key),
                [`table-cell-fixed-right`]: rightFixedColumns.includes(column.key),
                [`table-cell-fixed-left-last`]: leftFixedColumns[leftFixedColumns.length - 1] === column.key,
                [`table-cell-fixed-right-first`]: rightFixedColumns[0] === column.key,
              }" :style="{
                width: calcTableHeadWidths[index] ? normalizeSize(calcTableHeadWidths[index]) : 'auto',
                minWidth: calcTableHeadWidths[index] ? normalizeSize(calcTableHeadWidths[index]) : 'auto',
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
          <colgroup>
            <col v-for="column of columns" :key="column.key" :style="{ width: normalizeSize(column.width) }" />
          </colgroup>
          <tbody>
            <tr class="table-row table-row-fake">
              <th class="table-row-head" ref="FakeTableHeadRefs" v-for="column of columns" :key="column.key">
                {{ column.label }}
              </th>
            </tr>
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
                  <div class="">
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
      <BasePaginator v-bind="paginator" @page-change="$emit('page-change', $event)"
        @size-change="$emit('size-change', $event)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-container {
  @apply relative;
}

.table-head {
  @apply overflow-hidden;
  table-layout: fixed;
}

.table-row {
  &-head {
    @apply bg-white text-gray-500;
    @apply px-2 py-2 px-4 v-middle text-left whitespace-nowrap;
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
  position: sticky;
  left: 0;
  z-index: 9;
}

.table-cell-fixed-right {
  position: sticky;
  right: 0;
  z-index: 9;
}

.table-cell-fixed-left-last {
  --normal-shadow: 2px 0 0 0 #0000000b;
  --active-shadow: 5px 0 5px 0 #0000000f;
  box-shadow: var(--normal-shadow), var(--active-shadow);
}

.table-cell-fixed-right-first {
  --normal-shadow: -2px 0 0 0 #0000000b;
  --active-shadow: -5px 0 5px 0 #0000000f;
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

.table-row-fake {
  visibility: hidden;
  visibility: collapse;
  height: 0.01px;
  line-height: 0;
  // overflow: hidden;
  border: 0;
  padding: 0;
  margin: 0;
}

.paginator-container {
  @apply flex items-center justify-between;
}

.paginator-tips {
  @apply text-gray-400 text-xs sm-text-sm;
}
</style>
