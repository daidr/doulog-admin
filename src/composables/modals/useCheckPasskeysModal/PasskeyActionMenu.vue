<script setup lang="ts">
import type { WebAuthnCredentialItem } from '@/api/login';
import BaseMenu, { type Menu } from '@/components/base/BaseMenu.vue';
import { usePasskeyRenameModal } from '../usePasskeyRenameModal';
import { usePasskeyRemoveModal } from '../usePasskeyRemoveModal';

const props = defineProps<{
  passkey: WebAuthnCredentialItem
}>();

const emit = defineEmits(['refresh'])

const menu: Menu = [
  {
    label: '重命名',
    onClick: () => {
      usePasskeyRenameModal(props.passkey, () => {
        emit('refresh')
      })
    },
    icon: 'i-mingcute-textbox-line',
    type: 'item'
  },
  {
    type: 'separator'
  },
  {
    label: '移除',
    onClick: async () => {
      usePasskeyRemoveModal(props.passkey, () => {
        emit('refresh')
      })
    },
    class: 'text-red-700',
    icon: 'i-mingcute-delete-line',
    type: 'item'
  }
]
</script>

<template>
  <BaseMenu :menu="menu" position="right-top">
    <template #default="{ open }">
      <div class="p-1 rounded-2 cursor-pointer transition hover:bg-gray-300" :class="{
        'bg-gray-300': open
      }">
        <div class="i-mingcute-more-2-line text-lg"></div>
      </div>
    </template>
  </BaseMenu>

</template>

<style scoped></style>
