<script setup lang="ts">
import { getMediaList, type MediaInfo } from '@/api/media';
import BaseInput from '@/components/base/BaseInput.vue';
import MediaItem from '@/components/media/MediaItem.vue';

const searchValue = ref('')

function handleSearch() {
  keyword.value = searchValue.value
}

const loading = ref(true)
const total = ref(0)
const page = ref(1)
const size = ref(20)
const keyword = ref('')

const mediaList = shallowRef<MediaInfo[]>([]);
let currentInstance: number = 0;

async function fetchData(_page: number, _size: number) {
  let _instance = currentInstance = Math.random()
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
    if (_instance !== currentInstance) return

    loading.value = false
  }
}

watch(keyword, () => {
  fetchData(1, size.value)
}, { immediate: true })

const refresh = async () => {
  await fetchData(page.value, size.value)
}

const { width: windowWidth, height: windowHeight } = useWindowSize()


const SIDEBAR_WIDTH = 72;
const FULL_IMAGE_SIZE = 180;
const GAP = 10;

const isMobile = computed(() => {
  return (FULL_IMAGE_SIZE + GAP) * 3 > windowWidth.value - SIDEBAR_WIDTH
})

const imageSize = computed(() => {
  return isMobile.value ? Math.max((windowWidth.value) / 6, 60) : FULL_IMAGE_SIZE
})
</script>

<template>
  <div class="flex flex-col min-h-100dvh p-1">
    <div class="page-header">
      <BaseInput placeholder="搜索图片" class="w-[min(400px,80vw)]" v-model="searchValue" @keyup.enter="handleSearch" />
    </div>
    <div class="grid flex-grow justify-center gap-10px py-10px" :style="{
      gridTemplateColumns: `repeat(auto-fill,${imageSize}px)`,
      gridAutoRows: imageSize + 'px',
    }">
      <MediaItem v-for="media of mediaList" :key="media.id" :media="media" :max-width="windowWidth - SIDEBAR_WIDTH - 20"
        :max-height="windowHeight" :imageSize="imageSize" :min-left="SIDEBAR_WIDTH + 10" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  @apply flex justify-end;
  @apply mb-2;
}
</style>

<route lang="json">{
  "meta": {
    "title": "媒体库"
  }
}</route>
