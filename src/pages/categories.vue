<script setup lang="ts">
import type { ElysiaResp } from '@/utils/elysia.util'
import { app } from '@/api/elysia'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseEllipsisText from '@/components/base/BaseEllipsisText.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import TagPageEditMenu from '@/components/tag/TagPageEditMenu.vue'
import { useUpdateTagModal } from '@/composables/modals/useUpdateTagModal'

const tagTableColumns = computed(() => [{
  label: '文章分类',
  key: 'name',
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
  label: '文章数量',
  key: 'count',
  width: 250,
}, {
  label: '',
  key: '_action',
  width: 70,
  fixed: true,
}])

const loading = ref(true)
const keyword = ref('')

const searchValue = ref('')

function handleSearch() {
  keyword.value = searchValue.value
}

export type CategoryResp = ElysiaResp<typeof app.api.category.index.get>

const tagList = shallowRef<CategoryResp>([])
let currentInstance: number = 0

async function fetchData() {
  const _instance = currentInstance = Math.random()
  try {
    loading.value = true
    const { data } = await app.api.category.index.get()

    if (_instance !== currentInstance) return

    if (!data) return

    tagList.value = data
  } finally {
    if (_instance === currentInstance) {
      loading.value = false
    }
  }
}

watch(keyword, () => {
  fetchData()
}, { immediate: true })

async function refresh() {
  await fetchData()
}

async function addTag() {
  useUpdateTagModal({
    name: '',
    slug: '',
  }, refresh)
}
</script>

<template>
  <div class="h-100dvh flex flex-col p-1">
    <div class="page-header">
      <BaseButton icon="i-mingcute-tag-line" @click="addTag">
        新增分类
      </BaseButton>
      <BaseInput v-model="searchValue" placeholder="搜索分类名称/slug" class="w-[min(400px,80vw)]" @keyup.enter="handleSearch" />
    </div>
    <BaseTable
      :columns="tagTableColumns" :data="tagList" row-key="_id" scroll-height="calc(100dvh - 45px - 48px - 48px)"
      scroll-width="max(2500px, 100vw)" table-class="ring-1 rounded-3 ring-gray-300 overflow-hidden"
    >
      <template #column-name="{ item }">
        <BaseEllipsisText>{{ item.name }}</BaseEllipsisText>
      </template>
      <template #column-slug="{ item }">
        <BaseEllipsisText>{{ item.slug }}</BaseEllipsisText>
      </template>
      <template #column-count="{ item }">
        <BaseEllipsisText>{{ item.count }}</BaseEllipsisText>
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
    "title": "文章分类"
  }
}
</route>
