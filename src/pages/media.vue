<script setup lang="ts">
import { getMediaList, type MediaInfo, uploadMedia } from '@/api/media'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import MediaItem from '@/components/media/MediaItem.vue'

const searchValue = ref('')

const loading = ref(true)
const total = ref(0)
const page = ref(1)
const size = ref(20)
const keyword = ref('')

function handleSearch() {
  keyword.value = searchValue.value
}

const { loading: tL, success: tS, error: tE } = useToast()

const mediaList = shallowRef<MediaInfo[]>([])
let currentInstance: number = 0

async function fetchData(_page: number, _size: number) {
  const _instance = currentInstance = Math.random()
  try {
    loading.value = true
    const result = await getMediaList({
      keyword: keyword.value,
      page: _page,
      size: _size,
    })

    if (_instance !== currentInstance) return

    if (!result) return

    mediaList.value = result.list

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

const { width: windowWidth, height: windowHeight } = useWindowSize()

const SIDEBAR_WIDTH = 72
const FULL_IMAGE_SIZE = 180
const GAP = 10

const isMobile = computed(() => {
  return (FULL_IMAGE_SIZE + GAP) * 3 > windowWidth.value - SIDEBAR_WIDTH
})

const imageSize = computed(() => {
  return isMobile.value ? Math.max((windowWidth.value) / 6, 60) : FULL_IMAGE_SIZE
})

function upload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  const { close: end } = tL({ content: '等待选择媒体文件' })
  input.onchange = async () => {
    try {
      end()
      const files = input.files
      if (!files || files.length === 0) {
        tE({ content: '未选择文件' })
        return
      }

      const { close: uploadEnd } = tL({ content: '上传中' })

      const uploadPromises = Array.from(files).map(file => uploadMedia(file))
      const responses = await Promise.all(uploadPromises)

      uploadEnd()

      if (responses.some(resp => !resp)) {
        throw new Error('部分文件上传失败')
      }

      tS({ content: '上传成功' })
    } catch (error) {
      console.error(error)
    } finally {
      input.remove()
      fetchData(1, size.value)
    }
  }

  input.oncancel = () => {
    end()
    tE({ content: '取消上传' })
    input.remove()
  }
  input.click()
}
</script>

<template>
  <div class="min-h-100dvh flex flex-col p-1">
    <div class="page-header">
      <BaseButton icon="i-mingcute-photo-album-2-line" @click="upload">
        上传图片
      </BaseButton>
      <BaseInput v-model="searchValue" placeholder="搜索图片" class="w-[min(400px,80vw)]" @keyup.enter="handleSearch" />
    </div>
    <div
      class="grid flex-grow justify-center gap-10px py-10px" :style="{
        gridTemplateColumns: `repeat(auto-fill,${imageSize}px)`,
        gridAutoRows: `${imageSize}px`,
      }"
    >
      <MediaItem
        v-for="media of mediaList" :key="media.id" :media="media" :max-width="windowWidth - SIDEBAR_WIDTH - 20"
        :max-height="windowHeight" :image-size="imageSize" :min-left="SIDEBAR_WIDTH + 10"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  @apply flex justify-end gap-2;
  @apply mb-2;
}
</style>

<route>
{
  "meta": {
    "title": "媒体库"
  }
}
</route>
