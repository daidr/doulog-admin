<script setup lang="ts">
import BaseMenu, { type Menu } from '@/components/base/BaseMenu.vue';

const emit = defineEmits(['logout', 'updateUsername', 'updateEmail', 'updateHomepage', 'updateMotto']);

const menu: Menu = [
  {
    label: '修改用户名',
    onClick: () => {
      emit('updateUsername');
    },
    icon: 'i-mingcute-edit-line',
    type: 'item'
  },
  {
    label: '修改邮箱',
    onClick: () => {
      emit('updateEmail');
    },
    icon: 'i-mingcute-mail-send-line',
    type: 'item'
  },
  {
    label: '修改主页',
    onClick: () => {
      emit('updateHomepage');
    },
    icon: 'i-mingcute-link-line',
    type: 'item'
  },
  {
    label: '修改座右铭',
    onClick: () => {
      emit('updateMotto');
    },
    icon: 'i-mingcute-textbox-line',
    type: 'item'
  },
  {
    type: 'separator'
  },
  {
    label: '退出登录',
    onClick: () => {
      emit('logout');
    },
    class: 'text-red-700',
    icon: 'i-mingcute-align-arrow-right-line',
    type: 'item'
  }
]
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
