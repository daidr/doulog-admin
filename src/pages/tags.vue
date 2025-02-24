<script setup lang="ts">
import { getTagList, type TagInfo } from '@/api/tag'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseEllipsisText from '@/components/base/BaseEllipsisText.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import BaseTagBadge from '@/components/base/BaseTagBadge.vue'
import TagPageEditMenu from '@/components/tag/TagPageEditMenu.vue'
import { useUpdateTagModal } from '@/composables/modals/useUpdateTagModal'

const tagTableColumns = computed(() => [{
  label: '标签',
  key: 'label',
  width: 'min(300px, 30vw)',
  fixed: true,
}, {
  label: '#',
  key: 'id',
  width: 100,
}, {
  label: 'Slug',
  key: 'slug',
  width: 250,
}, {
  label: '颜色',
  key: 'color',
  width: 250,
}, {
  label: '',
  key: '_action',
  width: 70,
  fixed: true,
}])

const loading = ref(true)
const total = ref(0)
const page = ref(1)
const size = ref(20)
const keyword = ref('')

const searchValue = ref('')

function handleSearch() {
  keyword.value = searchValue.value
}

const tagList = shallowRef<TagInfo[]>([])
let currentInstance: number = 0

async function fetchData(_page: number, _size: number) {
  const _instance = currentInstance = Math.random()
  try {
    loading.value = true
    const result = await getTagList({
      keyword: keyword.value,
      page: _page,
      size: _size,
    })

    if (_instance !== currentInstance) return

    if (!result) return

    tagList.value = result.list

    total.value = result.total
    page.value = _page
    size.value = _size
  } finally {
    if (_instance === currentInstance) {
      loading.value = false
    }
  }
}

watch(keyword, () => {
  fetchData(1, size.value)
}, { immediate: true })

async function refresh() {
  await fetchData(page.value, size.value)
}

function randomMaterialColor() {
  const colors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#9e9e9e',
    '#607d8b',
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}

async function addTag() {
  useUpdateTagModal({
    label: '',
    color: randomMaterialColor(),
    slug: '',
  }, refresh)
}
</script>

<template>
  <div class="h-100dvh flex flex-col p-1">
    <div class="page-header">
      <BaseButton icon="i-mingcute-tag-line" @click="addTag">
        新增tag
      </BaseButton>
      <BaseInput v-model="searchValue" placeholder="搜索tag" class="w-[min(400px,80vw)]" @keyup.enter="handleSearch" />
    </div>
    <BaseTable
      :columns="tagTableColumns" :data="tagList" row-key="id" scroll-height="calc(100dvh - 45px - 48px - 48px)"
      scroll-width="max(2500px, 100vw)" table-class="ring-1 rounded-3 ring-gray-300 overflow-hidden"
      paginator-class="pt-2" :paginator="{
        current: page,
        total,
        size,
        disabled: loading,
        showSwitch: false,
      }" @page-change="(page) => fetchData(page, size)" @size-change="(size) => fetchData(1, size)"
    >
      <template #column-label="{ item }">
        <BaseTagBadge :label="item.label" :color="item.color" />
      </template>
      <template #column-slug="{ item }">
        <BaseEllipsisText>{{ item.slug }}</BaseEllipsisText>
      </template>
      <template #column-color="{ item }">
        <BaseEllipsisText>{{ item.color }}</BaseEllipsisText>
      </template>
      <template #column-_action="{ item }">
        <div class="flex justify-center">
          <TagPageEditMenu :tag="item" :refresh="refresh" />
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  @apply flex justify-end gap-2;
  @apply mb-2;
}
</style>

<route lang="json">
{
  "meta": {
    "title": "标签"
  }
}
</route>
