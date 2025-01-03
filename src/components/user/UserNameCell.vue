<script setup lang="ts">
import type { UserInfo } from '@/api/user'
import BaseEllipsisText from '../base/BaseEllipsisText.vue'

defineProps<{
  user: UserInfo
}>()
</script>

<template>
  <div class="min-w-full w-0 flex items-center gap-2">
    <div class="h-8 w-8 flex-shrink-0">
      <img
        :src="`https://gravatar.loli.net/avatar/${user.emailHash}?size=128`"
        class="h-8 w-8 rounded-2 ring-1 ring-gray-200"
      >
    </div>
    <div class="flex-grow">
      <BaseEllipsisText>{{ user.name }}</BaseEllipsisText>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
