<script setup lang="ts">
import { RenderComponent } from '@/utils/comp';
import type { ToastInfo } from '.'
import { toValue } from 'vue'

const props = defineProps<{
  info: ToastInfo
}>()

const emit = defineEmits(['close'])

const DEFAULT_ICONS = {
  success: 'i-mingcute-check-circle-line',
  error: 'i-mingcute-close-circle-line',
  warning: 'i-mingcute-warning-line',
  info: 'i-mingcute-information-line'
}

let timer: number;
const paused = ref(false);
const totalTime = ref(0);
const progress = computed(() => {
  if (!props.info.duration) return 0
  if (typeof totalTime.value !== 'number') return 0

  return (totalTime.value / props.info.duration) * 100
})

function updateProcess() {
  if (paused.value) return
  if (typeof props.info.duration !== 'number') return
  totalTime.value += 10
  if (totalTime.value > props.info.duration) {
    clearInterval(timer)
    emit('close')
  }
}

const ToastRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (props.info.duration) {
    timer = setInterval(updateProcess, 10)
  }
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div ref="ToastRef" class="toast" @mouseenter="paused = true" @mouseleave="paused = false">
    <div class="toast-icon">
      <div v-if="info.icon" :class="[toValue(info.icon)]"></div>
      <div v-else :class="DEFAULT_ICONS[info.type || 'info']"></div>
      <div class="close-btn" @click="$emit('close')">
        <div class="text-base i-mingcute-close-line"></div>
      </div>
    </div>
    <div class="toast-message">
      <RenderComponent :node="info.content" className="text-base" />
    </div>
    <div v-if="info.duration" class="toast-progress">
      <div :style="{
    width: `${progress}%`
  }"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toast {
  @apply relative overflow-hidden;
  @apply ring-gray-200 ring-1;
  @apply py-1 px-3;
  @apply flex items-center gap-2;
  @apply rounded-3;
  @apply bg-gray-50;
  @apply shadow-xl shadow-black/3;

  .close-btn {
    @apply transition;
    @apply opacity-0;
    @apply w-5 h-5 bg-white ring-1 rounded-md ring-gray-200 flex items-center justify-center;
    @apply absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2;
    @apply cursor-pointer;

    &:hover {
      @apply bg-white ring-gray-300;
    }

    &:active {
      @apply bg-gray-200 ring-gray-400;
    }
  }

  .toast-icon {
    @apply text-lg w-4.5 h-4.5 relative rounded-3;
  }

  &:hover {
    .close-btn {
      @apply opacity-100;
    }
  }

  .toast-progress {
    @apply w-full h-2px absolute bottom-0 left-0;

    div {
      @apply h-full;
      @apply rounded-full bg-gray-400;
    }
  }
}
</style>
