<script setup lang="ts">
import type { MediaInfo } from '@/api/media';
import useImageExpand from '@/composables/useImageExpand';
import prettyBytes from 'pretty-bytes';

const props = defineProps<{
  media: MediaInfo
  maxWidth: number
  maxHeight: number
  imageSize: number
  minLeft: number
}>()

const currentActive = ref<HTMLElement | null>(null)
const DescRef = ref<HTMLElement | null>(null)
const MetaRef = ref<HTMLElement | null>(null)

const tinyMode = computed(() => props.imageSize < 150)

const isLandscape = computed(() => props.media.width > props.media.height)

/**
 * expand 模式：clip
 * 非 expand 模式：contain
 */
const canBeExpand = computed(() => {
  if (tinyMode.value) return false;

  if (props.maxHeight < props.imageSize || props.maxWidth < props.imageSize) return false

  // 长宽比or宽长比小于 2 的图片可以展开（缩略图尺寸大于屏幕尺寸）
  const width = props.media.width
  const height = props.media.height
  if (width === 0 || height === 0) return false
  if (width === height) return false

  const ratio = width > height ? width / height : height / width
  // if (ratio > 2) return false

  if (width > height) {
    return props.imageSize * ratio < props.maxWidth
  } else {
    return props.imageSize * ratio < props.maxHeight
  }
})

const imageContainerSize = computed(() => {
  if (tinyMode.value) {
    return {
      width: props.imageSize + 'px',
      height: props.imageSize + 'px',
    }
  }
  if (!canBeExpand.value) {
    return {
      width: props.imageSize + 'px',
      height: props.imageSize + 0.1 + 'px',
    }
  }

  if (props.media.width > props.media.height) {
    return {
      height: props.imageSize + 'px',
      width: `${props.imageSize * props.media.width / props.media.height}px`,
    }
  }

  return {
    width: props.imageSize + 'px',
    height: `${props.imageSize * props.media.height / props.media.width}px`,
  }
})

function getURLFromId(id: number, thumbnail = false) {
  if (thumbnail) {
    return `/api/x/media/${id}?thumbnail=true`
  }
  return `/api/x/media/${id}`
}

const { zIndex, expanded, show, hide } = useImageExpand(400)

const imageSource = ref(getURLFromId(props.media.id, true))

let sourceTimer: number;
watchEffect(() => {
  clearTimeout(sourceTimer)
  if (tinyMode.value) {
    imageSource.value = getURLFromId(props.media.id, true)
  } else if (expanded.value) {
    sourceTimer = setTimeout(() => {
      imageSource.value = getURLFromId(props.media.id)
    }, 400)
  } else {
    imageSource.value = getURLFromId(props.media.id, true)
  }
})

const MediaRef = ref<HTMLElement | null>(null)

const transform = ref<[number, number]>([0, 0])

function handleEnter() {
  if (tinyMode.value) return
  const { width: widthRaw, height: heightRaw } = imageContainerSize.value
  const width = parseInt(widthRaw)
  const height = parseInt(heightRaw)

  const rect = MediaRef.value?.getBoundingClientRect()
  if (!rect) return
  let { x, y } = rect

  let tx = 0;
  let ty = 0;

  if (isLandscape.value) {
    tx = (props.imageSize - width) / 2
  } else {
    ty = (props.imageSize - height) / 2
  }

  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth
  const padding = 10

  if (x + tx + width + padding > windowWidth) {
    tx = windowWidth - x - width - padding
  } else if (x + tx < padding + props.minLeft) {
    tx = padding - x + props.minLeft
  }

  if (y + ty + height + padding > windowHeight) {
    ty = windowHeight - y - height - padding
  } else if (y + ty < padding) {
    ty = padding - y
  }


  transform.value = [tx, ty]
  show()
}

function handleLeave() {
  transform.value = [0, 0]
  hide()
}

function handleBlockEnter(event: MouseEvent) {
  if (tinyMode.value) return
  currentActive.value = event.target as HTMLElement
}

function handleBlockLeave(event: MouseEvent) {
  if (tinyMode.value) return
  currentActive.value = null
}
</script>

<template>
  <div class="size-limit" @mouseenter="handleEnter" @mouseleave="handleLeave" ref="MediaRef">
    <div class="media-item" :class="{
      expanded,
      'tiny-mode': tinyMode
    }" :style="{
      '--width': imageContainerSize.width,
      '--height': imageContainerSize.height,
      '--image-size': props.imageSize + 'px',
      zIndex,
      transform: `translate(${transform[0]}px, ${transform[1]}px)`,
    }">
      <div ref="MetaRef" v-if="!tinyMode" class="meta info-block" @mouseenter="handleBlockEnter"
        @mouseleave="handleBlockLeave" :class="{
          'opacity-0': currentActive && currentActive !== MetaRef
        }">
        {{ media.width }} x {{ media.height }} | {{ media.ext.toUpperCase() }}
      </div>
      <div class="image">
        <img :src="imageSource" :title="media.title" :alt="media.alt" :style="{
          backgroundColor: `#${media.prominentColor[0]}`
        }" />
        <div ref="DescRef" v-if="!tinyMode" class="desc info-block" @mouseenter="handleBlockEnter"
          @mouseleave="handleBlockLeave" :class="{
            'important-opacity-0': currentActive && currentActive !== DescRef
          }">
          <table>
            <tr>
              <td>Title</td>
              <td class="line-clamp-2">{{ media.title }}</td>
            </tr>
            <tr v-if="media.alt">
              <td>Alt</td>
              <td class="line-clamp-1">{{ media.alt }}</td>
            </tr>
            <tr>
              <td>MIME</td>
              <td>{{ media.mime }}</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>Original {{ prettyBytes(media.extra.original) }}
                <br />Thumbnail {{ prettyBytes(media.extra.thumbnail) }}
                <br />WebP {{ prettyBytes(media.extra.compressed) }}
              </td>
            </tr>
            <tr>
              <td>Color</td>
              <td>
                <div class="flex gap-1">
                  <div v-for="color of media.prominentColor" :key="color" class="w-4 h-4 rounded-1 ring-1 ring-gray/20"
                    :style="{
                      backgroundColor: `#${color}`
                    }">
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.size-limit {
  @apply w-full h-full;
}

.media-item {
  @apply rounded-3;
  @apply ring-gray/20 ring-1 shadow-lg;
  @apply overflow-hidden relative;
  @apply w-[--image-size] h-[--image-size];


  &.tiny-mode {
    @apply w-auto h-[--image-size];
  }

  &:not(.tiny-mode) {
    @apply transition duration-400;
    transition-property: height, width, transform;
  }

  .meta {
    @apply absolute top-2 left-2 bg-white/70 text-black py-1 px-2 z-2;
    @apply backdrop-blur-md backdrop-contrast-150;
    @apply rounded-3;
    @apply text-xs;
    @apply ring-1 ring-gray/20;
    @apply transition-opacity duration-400;
  }

  &.expanded {
    @apply w-[--width] h-[--height];
  }

  .image {
    @apply z-1;
    @apply relative overflow-hidden;
    @apply w-[--width] h-[--height];
  }

  .desc {
    @apply absolute bottom-2 left-2 right-2 z-2;
    @apply p-1 rounded-3 text-xs;
    @apply bg-white/70 text-black;
    @apply ring-1 ring-gray/20;

    @apply transition duration-400 transform-gpu opacity-0 translate-y-100%;
    @apply will-change-opacity;
    @apply backdrop-blur-md backdrop-contrast-150;

    tr {
      td:first-child {
        @apply font-bold whitespace-nowrap v-top text-right pr-1;
      }

      td:last-child {
        @apply pl-1;
        @apply whitespace-pre-wrap break-all;
      }
    }
  }

  &.expanded .desc {
    @apply opacity-100 translate-y-0;

  }

  .image img {
    @apply object-contain rounded-3;
    @apply w-full h-full;
    @apply bg-black;
  }

  &.tiny-mode img {
    @apply object-cover;
  }
}
</style>
