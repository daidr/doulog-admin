<script setup lang="ts">
import type { Menu } from '@/components/base/BaseMenu.vue'
import type { ElysiaResp } from '@/utils/elysia.util'
import { app } from '@/api/elysia'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseEllipsisText from '@/components/base/BaseEllipsisText.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import BaseTriggerMenu from '@/components/base/BaseTriggerMenu.vue'
import { useUpdateTagModal } from '@/composables/modals/useUpdateTagModal'

const tagTableColumns = computed(() => [
  {
    label: '文章',
    key: 'title',
    width: 'min(400px, 40vw)',
    fixed: true,
  },
  {
    label: '#',
    key: '_id',
    width: 100,
  },
  {
    label: 'Slug',
    key: 'slug',
    width: 200,
  },
  {
    label: '分类',
    key: 'category',
    width: 250,
  },
  {
    label: '标签',
    key: 'tags',
    width: 250,
  },
  {
    label: '创建时间',
    key: 'createdAt',
    width: 250,
  },
  {
    label: '',
    key: '_action',
    width: 70,
    fixed: true,
  },
])

const loading = ref(true)
const keyword = ref('')

const searchValue = ref('')

function handleSearch() {
  keyword.value = searchValue.value
}

export type PostResp = ElysiaResp<typeof app.api.post.index.get>

const docList = shallowRef<PostResp['docs']>([])
let currentInstance: number = 0

const total = ref(1)
const page = ref(1)
const size = ref(10)

async function fetchData(_size = size.value, _page = page.value) {
  const _instance = currentInstance = Math.random()
  try {
    loading.value = true
    const { data } = await app.api.post.index.get({
      query: {
        page: _page,
        size: _size,
        keyword: keyword.value,
      },
    })

    if (_instance !== currentInstance) return

    if (!data) return

    docList.value = data.docs
    total.value = data.totalDocs
    page.value = data.page || 1
    size.value = data.limit
  } finally {
    if (_instance === currentInstance) {
      loading.value = false
    }
  }
}

watch(keyword, () => {
  fetchData(size.value, 1)
}, { immediate: true })

async function refresh() {
  await fetchData(size.value, page.value)
}

const router = useRouter()

async function addPost() {
  router.push({ path: '/post' })
}

const paginator = computed(() => ({
  current: page.value,
  total: total.value,
  size: size.value,
  disabled: loading.value,
  showSwitch: false,
}))
</script>

<template>
  <div class="h-100dvh flex flex-col p-1">
    <div class="page-header">
      <BaseButton icon="i-mingcute-add-circle-fill" @click="addPost">
        新文章
      </BaseButton>
      <BaseInput v-model="searchValue" placeholder="搜索文章" class="w-[min(400px,80vw)]" @keyup.enter="handleSearch" />
    </div>
    <BaseTable
      :columns="tagTableColumns" :data="docList" row-key="_id"
      scroll-height="calc(100dvh - 45px - 48px - 48px)" scroll-width="max(2500px, 100vw)"
      table-class="ring-1 rounded-3 ring-gray-300 overflow-hidden" paginator-class="pt-2" :paginator="paginator"
      @page-change="(page) => fetchData(size, page)" @size-change="(size) => fetchData(size, 1)"
    >
      <template #column-title="{ item }">
        <div class="flex flex-col">
          <BaseEllipsisText>{{ item.title }}</BaseEllipsisText>
          <div class="flex gap-2 text-sm opacity-70 text-blue-700">
            <div class="flex items-center gap-1">
              <div class="i-mingcute-comment-fill" />
              <div>{{ item.commentsCount }}</div>
            </div>
            <div class="flex items-center gap-1 text-green-700">
              <div class="i-mingcute-eye-2-fill" />
              <div>{{ item.count.read }}</div>
            </div>
            <div class="flex items-center gap-1 text-pink-700">
              <div class="i-mingcute-love-fill" />
              <div>{{ item.count.like }}</div>
            </div>
          </div>
        </div>
      </template>
      <template #column-_id="{ item }">
        <BaseEllipsisText>{{ item._id }}</BaseEllipsisText>
      </template>
      <template #column-slug="{ item }">
        <BaseEllipsisText>{{ item.slug }}</BaseEllipsisText>
      </template>
      <template #column-category="{ item }">
        <BaseEllipsisText>{{ item.category!.name }}</BaseEllipsisText>
      </template>
      <template #column-tags="{ item }">
        <BaseEllipsisText>{{ item.tags?.join(', ') || '-' }}</BaseEllipsisText>
      </template>
      <template #column-createdAt="{ item }">
        <BaseEllipsisText>{{ new Date(item.createdAt!).toLocaleString() }}</BaseEllipsisText>
      </template>
      <template #column-_action="{ item }">
        <div class="flex justify-center">
          <BaseTriggerMenu
            :menu="[
              {
                label: '编辑',
                onClick: () => {
                  router.push({ path: `/post/${item._id}` })
                },
                icon: 'i-mingcute-edit-line',
                type: 'item',
              },
              {
                label: '删除',
                onClick: async () => {
                },
                class: 'text-red-700',
                icon: 'i-mingcute-delete-line',
                type: 'item',
              },
            ]"
          />
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  @apply flex justify-end gap-2 relative z-10;
  @apply mb-2;
}
</style>

<route lang="json">
{
  "meta": {
    "title": "文章"
  }
}
</route>
