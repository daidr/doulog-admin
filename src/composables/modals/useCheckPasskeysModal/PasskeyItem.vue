<script setup lang="ts">
import type { WebAuthnCredentialItem } from '@/api/login';
import BaseButton from '@/components/base/BaseButton.vue';
import { formatTimeAgo, type UseTimeAgoMessages, type UseTimeAgoUnitNamesDefault } from '@vueuse/core';

defineProps<{
  passkey: WebAuthnCredentialItem
}>();

function formatTimeByIntl(time: number) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(time * 1000);
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
      <div class="flex gap-1 items-center">
        <div class="text-base font-bold flex gap-1 items-center">
          <div class="i-mingcute-user-security-fill text-lg"></div>
          {{ passkey.label }}
        </div>
        <div class="text-10px text-blue-500 rounded-full border-1 border-blue-500 px-1.5" v-if="passkey.synced">Synced
        </div>
      </div>
      <BaseButton icon="i-mingcute-more-1-fill" ghost small class="text-black" />
    </div>

    <div class="flex justify-between">
      <span class="text-xs text-gray-500">创建于 {{ formatTimeByIntl(passkey.createdAt) }}</span>
      <span class="text-xs text-gray-500" v-if="passkey.lastUsedAt !== -1">使用于{{ formatTimeAgo(new
        Date(passkey.lastUsedAt * 1000), { messages: DEFAULT_MESSAGES }) }}</span>
      <span class="text-xs text-gray-500" v-else>未使用</span>
    </div>
  </div>

</template>

<style scoped>
.passkey-item {
  @apply flex flex-col items-stretch justify-between p-1;
  @apply transition;
  @apply rounded-lg;

  &:hover {
    @apply bg-gray-200/50;
  }
}
</style>
