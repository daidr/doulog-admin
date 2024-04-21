<script setup lang="ts">
import type { UserInfo } from '@/api/user';
import BaseEllipsisText from '../base/BaseEllipsisText.vue';

defineProps<{
  user: UserInfo
}>()
</script>

<template>
  <div class="flex items-center gap-2 min-w-full w-0">
    <img :src="`https://gravatar.loli.net/avatar/${user.emailHash}?size=128`"
      class="w-8 h-8 rounded-2 ring-gray-200 ring-1">
    <div class="flex-grow">
      <BaseEllipsisText>{{ user.name }}</BaseEllipsisText>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
