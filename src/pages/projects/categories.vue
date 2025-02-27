<script setup lang="ts">
import { getProjCatList, type ProjCatInfo } from '@/api/project'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseEllipsisText from '@/components/base/BaseEllipsisText.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import ProjCatPageEditMenu from '@/components/project/ProjCatPageEditMenu.vue'
import { useUpdateProjCatModal } from '@/composables/modals/useUpdateProjCatModal'

const catTableColumns = computed(() => [{
  label: '项目分类',
  key: 'label',
  width: 'min(300px, 30vw)',
  fixed: true,
}, {
  label: '#',
  key: 'id',
  width: 100,
}, {
  label: '描述',
  key: 'desc',
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

const catList = shallowRef<ProjCatInfo[]>([])
let currentInstance: number = 0

async function fetchData(_page: number, _size: number) {
  const _instance = currentInstance = Math.random()
  try {
    loading.value = true
    const result = await getProjCatList({
      keyword: keyword.value,
      page: _page,
      size: _size,
    })

    if (_instance !== currentInstance) return

    if (!result) return

    catList.value = result.list

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

async function addProjCat() {
  useUpdateProjCatModal({
    label: '',
    desc: '',
  }, refresh)
}
</script>

<template>
  <div class="h-100dvh flex flex-col p-1">
    <div class="page-header">
      <BaseButton icon="i-mingcute-tag-line" @click="addProjCat">
        新增项目分类
      </BaseButton>
      <BaseInput v-model="searchValue" placeholder="搜索项目分类" class="w-[min(400px,80vw)]" @keyup.enter="handleSearch" />
    </div>
    <BaseTable
      :columns="catTableColumns" :data="catList" row-key="id" scroll-height="calc(100dvh - 45px - 48px - 48px)"
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
        <BaseEllipsisText>{{ item.label }}</BaseEllipsisText>
      </template>
      <template #column-desc="{ item }">
        <BaseEllipsisText>{{ item.desc }}</BaseEllipsisText>
      </template>
      <template #column-_action="{ item }">
        <div class="flex justify-center">
          <ProjCatPageEditMenu :cat="item" :refresh="refresh" />
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
    "title": "项目分类"
  }
}
</route>
