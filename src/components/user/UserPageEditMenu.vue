<script setup lang="ts">
import type { UserInfo } from '@/api/user';
import BaseMenu, { type Menu } from '@/components/base/BaseMenu.vue';
import { useChangeEmailModal } from '@/composables/modals/useChangeEmailModal';
import { useChangeHomepageModal } from '@/composables/modals/useChangeHomepageModal';
import { useChangeMottoModal } from '@/composables/modals/useChangeMottoModal';
import { useChangeNameModal } from '@/composables/modals/useChangeNameModal';

const props = defineProps<{
  user: UserInfo
  refresh: () => void | Promise<void>
}>()

const menu = computed<Menu>(() =>
  [
    {
      label: '修改用户名',
      onClick: () => { 
        useChangeNameModal(props.user, props.refresh)
      },
      icon: 'i-mingcute-edit-line',
      type: 'item'
    },
    {
      label: '修改邮箱',
      onClick: () => { 
        useChangeEmailModal(props.user, props.refresh)
      },
      icon: 'i-mingcute-mail-send-line',
      type: 'item'
    },
    {
      label: '修改主页',
      onClick: () => {
        useChangeHomepageModal(props.user, props.refresh)
       },
      icon: 'i-mingcute-link-line',
      type: 'item'
    },
    {
      label: '修改座右铭',
      onClick: () => {
        useChangeMottoModal(props.user, props.refresh)
       },
      icon: 'i-mingcute-textbox-line',
      type: 'item'
    },
    ...(props.user.isAdmin ? [] : <Menu>[
      {
        type: 'separator'
      },
      {
        label: props.user.isBanned ? '解除封禁' : '封禁',
        onClick: () => { },
        class: 'text-red-700',
        icon: 'i-mingcute-forbid-circle-line',
        type: 'item'
      }
    ])
  ])
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
