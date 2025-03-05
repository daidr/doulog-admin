<script setup lang="ts">
import type { CategoryResp } from '@/pages/categories.vue'
import { app } from '@/api/elysia'
import BaseMenu, { type Menu } from '@/components/base/BaseMenu.vue'
import { useUpdateTagModal } from '@/composables/modals/useUpdateTagModal'

const props = defineProps<{
  tag: Pick<CategoryResp[number], '_id' | 'name' | 'slug'>
  refresh: () => void | Promise<void>
}>()

const menu = computed<Menu>(() =>
  [
    {
      label: '编辑分类',
      onClick: () => {
        useUpdateTagModal(props.tag, props.refresh)
      },
      icon: 'i-mingcute-edit-line',
      type: 'item',
    },
    {
      label: '删除分类',
      onClick: async () => {
        await app.api.category({
          id: props.tag._id.toString(),
        }).delete()
        await props.refresh()
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
