<script setup lang="ts">
import type { WebAuthnCredentialItem } from '@/api/login'
import { formatTimeAgo, type UseTimeAgoMessages, type UseTimeAgoUnitNamesDefault } from '@vueuse/core'
import PasskeyActionMenu from './PasskeyActionMenu.vue'

defineProps<{
  passkey: WebAuthnCredentialItem
}>()

const emit = defineEmits(['refresh'])

function formatTimeByIntl(time: number) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(time * 1000)
}

const DEFAULT_MESSAGES: UseTimeAgoMessages<UseTimeAgoUnitNamesDefault> = {
  justNow: '刚刚',
  past: n => n.match(/\d/) ? `${n}前` : n,
  future: n => n.match(/\d/) ? `${n}后` : n,
  month: (n, past) => n === 1
    ? past
      ? '下个月'
      : '上个月'
    : `${n}个月`,
  year: (n, past) => n === 1
    ? past
      ? '去年'
      : '明年'
    : `${n}年`,
  day: (n, past) => n === 1
    ? past
      ? '昨天'
      : '明天'
    : `${n}天`,
  week: (n, past) => n === 1
    ? past
      ? '上周'
      : '下周'
    : `${n}周`,
  hour: n => `${n}小时`,
  minute: n => `${n}分钟`,
  second: n => `${n}秒`,
  invalid: '',
}
</script>

<template>
  <div class="passkey-item">
    <div class="flex justify-between">
      <div class="flex items-center gap-1">
        <div class="flex items-center gap-1 text-base font-bold">
          <div class="i-mingcute-user-security-fill text-lg" />
          {{ passkey.label }}
        </div>
        <div v-if="passkey.synced" class="border-1 border-blue-500 rounded-full px-1.5 text-10px text-blue-500">
          Synced
        </div>
      </div>
      <PasskeyActionMenu :passkey="passkey" @refresh="emit('refresh')" />
    </div>

    <div class="flex justify-between">
      <span class="text-xs text-gray-500">创建于 {{ formatTimeByIntl(passkey.createdAt) }}</span>
      <span v-if="passkey.lastUsedAt !== -1" class="text-xs text-gray-500">使用于{{ formatTimeAgo(new
        Date(passkey.lastUsedAt * 1000), { messages: DEFAULT_MESSAGES }) }}</span>
      <span v-else class="text-xs text-gray-500">未使用</span>
    </div>
  </div>
</template>

<style scoped>
.passkey-item {
  @apply flex flex-col items-stretch justify-between p-1;
  @apply transition;
  @apply rounded-lg;

  &:hover {
    @apply bg-gray-200/50 ring-1 ring-gray-3;
  }
}
</style>
