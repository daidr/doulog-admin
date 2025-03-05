<script setup lang="ts">
import type { ElysiaResp } from '@/utils/elysia.util'
import { app } from '@/api/elysia'
import BaseBlockEditor from '@/components/base/BaseBlockEditor/BaseBlockEditor.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'

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

function createPost() {
  // Logic to create a post
}

function updatePost() {
  // Logic to update a post
}

const title = ref(localStorage.getItem('postTitle') || '')
const content = ref(localStorage.getItem('postContent') || '')

const slug = ref('')
const tags = ref('')
const summary = ref('')

watch(title, (title) => {
  localStorage.setItem('postTitle', title)
})
watch(content, (content) => {
  localStorage.setItem('postContent', content)
})

type CategoryItem = ElysiaResp<typeof app.api.category.index.get>[number]

const category = ref('')
const categoryData = ref<CategoryItem[]>([])

const categoryOptions = computed(() => {
  return categoryData.value.map(item => ({
    label: item.name,
    value: item._id.toString(),
  }))
})
onMounted(async () => {
  const { data } = await app.api.category.index.get()
  if (!data) {
    return
  }
  categoryData.value = data
  category.value = data[0]._id.toString()
})
</script>

<template>
  <div class="flex flex-col h-100dvh">
    <header class="flex items-center gap-2 justify-between bg-gray-100 ps-5 p-2 ring-1 ring-gray-300">
      <div class="left flex items-center gap-2">
        <BaseButton ghost @click="goBack">
          <div class="i-mingcute-arrow-left-line text-xl" />
        </BaseButton>
        <h1>{{ route.meta.title }} - {{ title }}</h1>
      </div>
      <div class="right">
        <BaseButton @click="isCreate ? createPost() : updatePost()">
          <div class="i-mingcute-save-2-line text-xl" />
          {{ isCreate ? '创建' : '保存' }}
        </BaseButton>
      </div>
    </header>
    <div class="split-panel w-full flex-1 flex overflow-y-auto">
      <BaseBlockEditor v-model:title="title" v-model:content="content" class="flex-1 relative" />
      <div class="w-300px border-l-1 border-gray-200 px-4 py-2 flex flex-col gap-4 overflow-y-auto">
        <BaseInput v-model="title" label="标题" />
        <BaseInput v-model="slug" label="Slug" />
        <BaseSelect v-model="category" :options="categoryOptions" label="分类" size="large" />
        <BaseInput v-model="tags" label="标签" placeholder="用逗号分隔标签" />
        <BaseTextarea v-model="summary" label="摘要" placeholder="文章梗概" />
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
