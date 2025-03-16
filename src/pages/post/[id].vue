<script setup lang="ts">
import type { ElysiaResp } from '@/utils/elysia.util'
import { app } from '@/api/elysia'
import BaseAutoTextarea from '@/components/base/BaseAutoTextarea.vue'
import BaseBlockEditor from '@/components/base/BaseBlockEditor/BaseBlockEditor.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseTooltip from '@/components/base/BaseTooltip.vue'

const router = useRouter()
const route = useRoute()

function goBack() {
  router.back()
}

const isCreate = computed(() => {
  return !('id' in route.params)
})

watch(() => isCreate.value, (val) => {
  if (val) {
    route.meta.title = '创建文章'
  } else {
    route.meta.title = '编辑文章'
  }
}, {
  immediate: true,
})

const title = ref('')
const content = ref('')

const slug = ref('')
const tags = ref('')
const summary = ref('')

type CategoryItem = ElysiaResp<typeof app.api.category.index.get>[number]

const category = ref('')
const categoryData = ref<CategoryItem[]>([])

const categoryOptions = computed(() => {
  return categoryData.value.map(item => ({
    label: item.name,
    value: item._id.toString(),
  }))
})

const commentAccess = ref(1)

const isPostLoading = ref(!isCreate.value)
const isSummaryGenerating = ref(false)

onMounted(async () => {
  const { data } = await app.api.category.index.get()
  if (!data) {
    return
  }
  categoryData.value = data
  category.value = data[0]._id.toString()
})

watch(() => route.params, async () => {
  if ('id' in route.params) {
    isPostLoading.value = true
    const { id } = route.params
    const { data } = await app.api.posts({
      id: id.toString(),
    }).get()
    if (!data) {
      throw new Error('文章不存在')
      return
    }
    if (data) {
      title.value = data.title
      content.value = data.text
      slug.value = data.slug
      tags.value = data.tags.join(',')
      summary.value = data.summary
      category.value = data.categoryId.toString()
      commentAccess.value = data.allowComment ? 1 : 0
    }
    isPostLoading.value = false
  }
}, {
  immediate: true,
})

const commentAccessOptions = [
  {
    label: '允许评论',
    value: 1,
  },
  {
    label: '禁止评论',
    value: 0,
  },
]

function isParameterValid() {
  return title.value.trim() && content.value.trim() && slug.value.trim() && category.value
}

const { error, loading: tL, success } = useToast()

function createPost() {
  if (!isParameterValid()) {
    error({ content: '请填写完整的文章信息' })
    return
  }
  const { close } = tL({
    content: '正在创建文章',
  })

  app.api.posts.index.post({
    title: title.value,
    text: content.value,
    slug: slug.value,
    categoryId: category.value,
    tags: tags.value.split(',').map(tag => tag.trim()),
    summary: summary.value,
    allowComment: Boolean(commentAccess.value),
  }).then(({ data }) => {
    if (data?.slug) {
      router.push('/posts')
      success({
        content: '创建成功',
      })
    }
  }).catch(() => {
    // error({
    //   content: '创建失败',
    // })
  }).finally(() => {
    close()
  })
}

function updatePost() {
  if (!('id' in route.params)) {
    return
  }
  if (!isParameterValid()) {
    error({ content: '请填写完整的文章信息' })
    return
  }
  const { close } = tL({
    content: '正在保存文章',
  })

  app.api.posts({
    id: route.params.id.toString(),
  }).put({
    title: title.value,
    text: content.value,
    slug: slug.value,
    categoryId: category.value,
    tags: tags.value.split(',').map(tag => tag.trim()),
    summary: summary.value,
    allowComment: Boolean(commentAccess.value),
  }).then(({ data }) => {
    if (data?.slug) {
      router.push('/posts')
      success({
        content: '保存成功',
      })
    }
  }).catch(() => {
    // error({
    //   content: '创建失败',
    // })
  }).finally(() => {
    close()
  })
}

const EditorRef = useTemplateRef('EditorRef')

async function generateSummary() {
  const text = await EditorRef.value?.editor?.getText()
  if (!text) {
    error({ content: '请输入文章内容' })
    return
  }
  summary.value = ''
  isSummaryGenerating.value = true

  const { data } = await app.api.summary.generate.post({
    content: text,
  })

  if (data) {
    for await (const item of data) {
      summary.value += item
    }
  }

  isSummaryGenerating.value = false
}
</script>

<template>
  <div class="flex flex-col h-100dvh">
    <header class="flex items-center gap-2 justify-between bg-gray-100 ps-5 px-2 ring-1 ring-gray-300 h-14">
      <div class="left flex items-center gap-2">
        <BaseButton ghost @click="goBack">
          <div class="i-mingcute-arrow-left-line text-xl" />
        </BaseButton>
        <h1 class="flex flex-col">
          <span class="text-lg">{{ route.meta.title }}</span>
          <span v-if="title" class="text-xs opacity-50">{{ title }}</span>
        </h1>
      </div>
      <div class="right">
        <BaseButton :disabled="isPostLoading || isSummaryGenerating" @click="isCreate ? createPost() : updatePost()">
          <div class="i-mingcute-save-2-line text-xl" />
          {{ isCreate ? '创建' : '保存' }}
        </BaseButton>
      </div>
    </header>
    <div v-if="isPostLoading" class="w-full flex-1 flex text-5xl items-center justify-center">
      <div class="i-mingcute-loading-3-line animate-spin" />
    </div>
    <div v-else class="split-panel w-full flex-1 flex overflow-y-auto">
      <BaseBlockEditor ref="EditorRef" v-model:title="title" v-model:content="content" class="flex-1 relative" />
      <div class="w-300px border-l-1 border-gray-200 px-4 py-2 flex flex-col gap-4 overflow-y-auto">
        <BaseInput v-model="title" label="标题" />
        <BaseInput v-model="slug" label="Slug" :min="1" :readonly="!isCreate" />
        <BaseSelect v-model="category" :options="categoryOptions" label="分类" size="large" />
        <BaseInput v-model="tags" label="标签" placeholder="用逗号分隔标签" />
        <BaseAutoTextarea v-model="summary" label="摘要" placeholder="文章梗概" :readonly="isSummaryGenerating">
          <BaseTooltip text="AI 生成" trigger="hover">
            <BaseButton ghost small class="py-1!" :disabled="isSummaryGenerating" @click="generateSummary">
              <div v-if="isSummaryGenerating" class="i-mingcute-loading-3-fill animate-spin" />
              <div v-else class="i-mingcute-ai-fill" />
            </BaseButton>
          </BaseTooltip>
        </BaseAutoTextarea>
        <BaseSelect v-model="commentAccess" :options="commentAccessOptions" label="评论权限" size="large" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.split-panel {
  :deep() {
    .label {
      @apply pb-1;
    }
  }
}
</style>

<route lang="json">
{
  "meta": {
    "title": "编辑文章",
    "hideNav": true
  }
}
</route>
