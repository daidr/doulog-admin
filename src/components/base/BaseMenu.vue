<script setup lang="ts">
export type Menu = (MenuItem | MenuSeparator)[]
export type MenuItem = {
  type: 'item'
  label: string
  icon?: string
  class?: any
  disabled?: boolean
  keepOpen?: boolean
  onClick?: () => void
}

export type MenuSeparator = {
  type: 'separator'
}

const props = withDefaults(defineProps<{
  menu: Menu,
  position?: "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right" | "left" | "left-top" | "left-bottom" | "right" | "right-top" | "right-bottom",
  gap?: number,
}>(), {
  position: "left-top",
  gap: 10
})

defineSlots<{
  default(props: { open: boolean }): any
}>()

const SlotRef = ref<HTMLElement | null>(null)
const MenuRef = ref<HTMLElement | null>(null)
const showMenu = ref(false)
const { x: slotX, y: slotY, width: slotWidth, height: slotHeight, update } = useElementBounding(SlotRef, {
  immediate: true,
})
const { width: menuWidth, height: menuHeight } = useElementBounding(MenuRef)
const { width: windowWidth, height: windowHeight } = useWindowSize()

onClickOutside(MenuRef, () => {
  showMenu.value = false
}, {
  ignore: [SlotRef]
})

const handleClick = (item: MenuItem) => {
  if (item.disabled) return
  if (item.keepOpen) return
  showMenu.value = false
  item.onClick?.()
}

const menuPosition = ref<{ top: number, left: number }>({ top: 0, left: 0 })

watch([slotX, slotY, slotWidth, slotHeight, menuWidth, menuHeight, windowWidth, windowHeight], () => {
  if (!showMenu.value) return
  update()
  // calc top
  let top = 0;
  switch (props.position) {
    case "top":
    case "top-left":
    case "top-right":
      top = slotY.value - menuHeight.value - props.gap
      if (top < 0) {
        top = slotY.value + slotHeight.value + props.gap
      }
      break
    case "bottom":
    case "bottom-left":
    case "bottom-right":
      top = slotY.value + slotHeight.value + props.gap
      if (top + menuHeight.value > windowHeight.value) {
        top = slotY.value - menuHeight.value - props.gap
      }
      break
    case "left":
    case "right":
      top = slotY.value + (slotHeight.value - menuHeight.value) / 2
      if (top < 0) {
        top = slotY.value
      } else if (top + menuHeight.value > windowHeight.value) {
        top = slotY.value + slotHeight.value - menuHeight.value
      }

      break
    case "left-top":
    case "right-top":
      top = slotY.value
      if (top + menuHeight.value > windowHeight.value) {
        top = windowHeight.value - menuHeight.value
      }
      break
    case "left-bottom":
    case "right-bottom":
      top = slotY.value + slotHeight.value - menuHeight.value
      if (top < 0) {
        top = 0
      }
      break
  }
  // calc left
  let left = 0;
  switch (props.position) {
    case "top":
    case "bottom":
      left = slotX.value + (slotWidth.value - menuWidth.value) / 2
      if (left < 0) {
        left = slotX.value
      } else if (left + menuWidth.value > windowWidth.value) {
        left = slotX.value + slotWidth.value - menuWidth.value
      }
      break
    case "top-left":
    case "bottom-left":
      left = slotX.value + slotWidth.value - menuWidth.value
      if (left < 0) {
        left = slotX.value
      }
      break
    case "left":
      left = slotX.value - menuWidth.value - props.gap
      if (left < 0) {
        left = slotX.value + slotWidth.value + props.gap
      }
      break
    case "top-right":
    case "bottom-right":
      left = slotX.value
      if (left + menuWidth.value > windowWidth.value) {
        left = slotX.value + slotWidth.value - menuWidth.value
      }
      break
    case "right":
      left = slotX.value + slotWidth.value + props.gap
      if (left + menuWidth.value > windowWidth.value) {
        left = slotX.value - menuWidth.value - props.gap
      }
      break
    case "left-top":
    case "left-bottom":
      left = slotX.value - menuWidth.value - props.gap
      if (left < 0) {
        left = slotX.value + slotWidth.value + props.gap
      }
      break
    case "right-top":
    case "right-bottom":
      left = slotX.value + slotWidth.value + props.gap
      if (left + menuWidth.value > windowWidth.value) {
        left = slotX.value - menuWidth.value - props.gap
      }
      break
  }
  menuPosition.value = { top, left }
}, {
  flush: 'pre'
})
</script>

<template>
  <div ref="SlotRef" @click="showMenu = !showMenu">
    <slot :open="showMenu" />
  </div>

  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showMenu" ref="MenuRef" class="base-menu" :style="{
    top: `${menuPosition.top}px`,
    left: `${menuPosition.left}px`
  }">
        <template v-for="(item, index) of menu" :key="index">
          <div v-if="item.type === 'item'" class="menu-item" :class="[item.class, { disabled: item.disabled }]"
            @click="handleClick(item)">
            <div class="menu-item-icon">
              <div :class="[item.icon]" />
            </div>
            <div class="menu-item-label">{{ item.label }}</div>
          </div>
          <div v-else-if="item.type === 'separator'" class="menu-separator" />
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.base-menu {
  @apply min-w-min;
  @apply fixed z-105 select-none;
  @apply bg-white p-1;
  @apply ring-1 ring-gray-300;
  @apply shadow-xl shadow-black/5;
  @apply rounded-3;
  @apply gap-1 flex flex-col;

  .menu-item {
    @apply flex items-center gap-2 pl-2 pr-10 py-1;
    @apply rounded-2;
    @apply transition cursor-pointer whitespace-nowrap;

    &.disabled {
      @apply cursor-not-allowed;
      @apply opacity-50;
    }

    &:not(.disabled):hover {
      @apply bg-gray-100;
      @apply ring-1 ring-gray-200;
    }

    &:not(.disabled):active {
      @apply bg-gray-200;
      @apply ring-gray-300;
    }
  }

  .menu-item-icon {
    @apply w-1em h-1em;
  }

  .menu-separator {
    @apply h-1.5px;
    @apply bg-gray-200;
    @apply mx-2;
  }
}
</style>
