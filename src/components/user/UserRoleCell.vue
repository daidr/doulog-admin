<script setup lang="ts">
import type { UserInfo } from '@/api/user';
import BaseBadge, { type BaseBadgeProps } from '../base/BaseBadge.vue';

withDefaults(defineProps<{
  user: UserInfo
  size?: BaseBadgeProps['size']
}>(), {
  size: 'medium'
})

function getBadgeType(user: UserInfo) {
  if (user.isAdmin) return 'info'
  if (user.isBanned) return 'danger'
  return 'primary'
}

function getBadgeContent(user: UserInfo) {
  if (user.isAdmin) return '管理员'
  if (user.isBanned) return '封禁中'
  return '访客'
}

function getBadgeIcon(user: UserInfo) {
  if (user.isAdmin) return 'i-mingcute-user-security-line'
  if (user.isBanned) return 'i-mingcute-user-forbid-line'
  return 'i-mingcute-user-visible-line'
}
</script>

<template>
  <div class="min-w-full w-0 flex justify-start">
    <BaseBadge :type="getBadgeType(user)" :icon="getBadgeIcon(user)" :size="size">
      {{ getBadgeContent(user) }}
    </BaseBadge>
  </div>
</template>

<style lang="scss" scoped></style>
