<script setup lang="ts">
import { ref } from 'vue'

export type BasePopoverProps = {
  position?: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'left-top' | 'left-bottom' | 'right' | 'right-top' | 'right-bottom'
  gap?: number
  trigger?: 'click' | 'hover' | 'manual'
}

const props = withDefaults(defineProps<BasePopoverProps>(), {
  position: 'left-top',
  gap: 10,
  trigger: 'click',
})

const emit = defineEmits<{
  tryOpen: []
  tryClose: []
}>()

defineSlots<{
  default: (props: { open: boolean }) => any
  content: () => any
}>()

const open = defineModel<boolean>('open', {
  default: false,
})

const SlotRef = ref<HTMLElement | null>(null)
const PopoverRef = ref<HTMLElement | null>(null)
const { x: slotX, y: slotY, width: slotWidth, height: slotHeight, update } = useElementBounding(SlotRef, {
  immediate: true,
})
const { width: popoverWidth, height: popoverHeight } = useElementBounding(PopoverRef)
const { width: windowWidth, height: windowHeight } = useWindowSize()

onClickOutside(PopoverRef, () => {
  if (props.trigger === 'click') {
    open.value = false
  }
}, {
  ignore: [SlotRef],
})

const popoverPosition = ref<{ top: number, left: number }>({ top: 0, left: 0 })

watch([slotX, slotY, slotWidth, slotHeight, popoverWidth, popoverHeight, windowWidth, windowHeight], () => {
  if (!open.value) return
  update()
  // calc top
  let top = 0
  switch (props.position) {
    case 'top':
    case 'top-left':
    case 'top-right':
      top = slotY.value - popoverHeight.value - props.gap
      // 变成 bottom
      if (top < 0) {
        top = slotY.value + slotHeight.value + props.gap
      }
      break
    case 'bottom':
    case 'bottom-left':
    case 'bottom-right':
      top = slotY.value + slotHeight.value + props.gap
      // 变成 top
      if (top + popoverHeight.value > windowHeight.value) {
        top = slotY.value - popoverHeight.value - props.gap
      }
      break
    case 'left':
    case 'right':
      top = slotY.value + (slotHeight.value - popoverHeight.value) / 2
      if (top < 0) {
        top = slotY.value
      } else if (top + popoverHeight.value > windowHeight.value) {
        top = slotY.value + slotHeight.value - popoverHeight.value
      }

      break
    case 'left-top':
    case 'right-top':
      top = slotY.value
      if (top < 0) {
        top = slotY.value
      } else if (top + popoverHeight.value > windowHeight.value) {
        top = slotY.value + slotHeight.value - popoverHeight.value
      }
      break
    case 'left-bottom':
    case 'right-bottom':
      top = slotY.value + slotHeight.value - popoverHeight.value
      if (top < 0) {
        top = 0
      }
      break
  }
  // calc left
  let left = 0
  switch (props.position) {
    case 'top':
    case 'bottom':
      left = slotX.value + (slotWidth.value - popoverWidth.value) / 2
      if (left < 0) {
        left = slotX.value
      } else if (left + popoverWidth.value > windowWidth.value) {
        left = slotX.value + slotWidth.value - popoverWidth.value
      }
      break
    case 'top-right':
    case 'bottom-right':
      left = slotX.value + slotWidth.value - popoverWidth.value
      if (left < 0) {
        left = slotX.value
      }
      break
    case 'left':
      left = slotX.value - popoverWidth.value - props.gap
      if (left < 0) {
        left = slotX.value + slotWidth.value + props.gap
      }
      break
    case 'top-left':
    case 'bottom-left':
      left = slotX.value
      if (left + popoverWidth.value > windowWidth.value) {
        left = slotX.value + slotWidth.value - popoverWidth.value
      }
      break
    case 'right':
      left = slotX.value + slotWidth.value + props.gap
      if (left + popoverWidth.value > windowWidth.value) {
        left = slotX.value - popoverWidth.value - props.gap
      }
      break
    case 'left-top':
    case 'left-bottom':
      left = slotX.value - popoverWidth.value - props.gap
      if (left < 0) {
        left = slotX.value + slotWidth.value + props.gap
      }
      break
    case 'right-top':
    case 'right-bottom':
      left = slotX.value + slotWidth.value + props.gap
      if (left + popoverWidth.value > windowWidth.value) {
        left = slotX.value - popoverWidth.value - props.gap
      }
      break
  }
  popoverPosition.value = { top, left }
}, {
  flush: 'pre',
})

function handleSlotClick() {
  if (props.trigger === 'click') {
    open.value = !open.value
  }
}

let hoverCloseTimer: Timer

onUnmounted(() => {
  clearTimeout(hoverCloseTimer)
})

useEventListener(SlotRef, 'mouseenter', () => {
  if (props.trigger === 'hover' || props.trigger === 'manual') {
    clearTimeout(hoverCloseTimer)
    if (props.trigger === 'hover') {
      open.value = true
    } else {
      emit('tryOpen')
    }
  }
})

useEventListener(SlotRef, 'mouseleave', () => {
  if (props.trigger === 'hover' || props.trigger === 'manual') {
    hoverCloseTimer = setTimeout(() => {
      if (props.trigger === 'hover') {
        open.value = false
      } else {
        emit('tryClose')
      }
    }, 50)
  }
})

useEventListener(PopoverRef, 'mouseenter', () => {
  if (props.trigger === 'hover' || props.trigger === 'manual') {
    clearTimeout(hoverCloseTimer)
  }
})

useEventListener(PopoverRef, 'mouseleave', () => {
  if (props.trigger === 'hover' || props.trigger === 'manual') {
    hoverCloseTimer = setTimeout(() => {
      if (props.trigger === 'hover') {
        open.value = false
      } else {
        emit('tryClose')
      }
    }, 50)
  }
})
</script>

<template>
  <div ref="SlotRef" @click="handleSlotClick">
    <slot :open="open" />
  </div>
  <Teleport to="#teleport-container">
    <Transition name="fade">
      <div
        v-if="open" ref="PopoverRef" class="base-popover" :style="{
          top: `${popoverPosition.top}px`,
          left: `${popoverPosition.left}px`,
        }"
      >
        <slot name="content" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.base-popover {
  @apply min-w-min;
  @apply fixed z-105 select-none;
  @apply bg-white;
  @apply ring-1 ring-gray-300;
  @apply shadow-xl shadow-black/10;
  @apply rounded-3;
}
</style>
