<script setup lang="ts">
import BasePopover from './BasePopover.vue'

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

const showMenu = ref(false)

const handleClick = (item: MenuItem) => {
  if (item.disabled) return
  if (item.keepOpen) return
  showMenu.value = false
  item.onClick?.()
}
</script>

<template>
  <div class="menu">
    <BasePopover v-model:open="showMenu" :gap="gap" :position="position">
      <template #default="{ open }">
        <slot :open="open" />
      </template>

      <template #content>
        <div class="base-menu">
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
      </template>
    </BasePopover>
  </div>
</template>

<style scoped lang="scss">
.base-menu {
  @apply gap-1 flex flex-col m-1;
}

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
  @apply h-1px;
  @apply bg-gray-200;
  @apply mx-2;
}
</style>
