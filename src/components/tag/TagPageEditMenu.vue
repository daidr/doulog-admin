<script setup lang="ts">
import type { TagInfo } from '@/api/tag'
import BaseMenu, { type Menu } from '@/components/base/BaseMenu.vue'
import { useUpdateTagModal } from '@/composables/modals/useUpdateTagModal'

const props = defineProps<{
  tag: TagInfo
  refresh: () => void | Promise<void>
}>()

const menu = computed<Menu>(() =>
  [
    {
      label: '编辑标签',
      onClick: () => {
        useUpdateTagModal(props.tag, props.refresh)
      },
      icon: 'i-mingcute-edit-line',
      type: 'item',
    },
    {
      label: '删除',
      onClick: () => {
      },
      class: 'text-red-700',
      icon: 'i-mingcute-delete-line',
      type: 'item',
    },
  ])
</script>

<template>
  <BaseMenu :menu="menu" position="right-top">
    <template #default="{ open }">
      <div
        class="cursor-pointer rounded-3 p-2 hover:bg-gray-200" :class="{
          'bg-gray-200': open,
        }"
      >
        <div class="i-mingcute-more-3-line text-lg" />
      </div>
    </template>
  </BaseMenu>
</template>

<style scoped></style>
