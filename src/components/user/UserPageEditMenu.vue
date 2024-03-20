<script setup lang="ts">
import type { UserInfo } from '@/api/user';
import BaseMenu, { type Menu } from '@/components/base/BaseMenu.vue';

const menu: Menu = [
  {
    label: '修改用户名',
    onClick: () => {},
    icon: 'i-mingcute-edit-line',
    type: 'item'
  },
  {
    label: '修改邮箱',
    onClick: () => {},
    icon: 'i-mingcute-mail-send-line',
    type: 'item'
  },
  {
    type: 'separator'
  },
  {
    label: '封禁',
    onClick: () => {},
    class: 'text-red-700',
    icon: 'i-mingcute-forbid-circle-line',
    type: 'item'
  }
]

defineProps<{
  user: UserInfo
}>()
</script>

<template>
  <BaseMenu :menu="menu" position="right-top">
    <template #default="{ open }">
      <div class="p-2 rounded-3 cursor-pointer hover:bg-gray-200" :class="{
    'bg-gray-200': open
  }">
        <div class="i-mingcute-more-3-line text-lg"></div>
      </div>
    </template>
  </BaseMenu>
</template>

<style scoped></style>
