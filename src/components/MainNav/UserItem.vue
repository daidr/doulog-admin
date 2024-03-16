<script setup lang="ts">
import { useUserModal } from '@/composables/modals/useUserModal';

const userStore = useUserStore()

const { userInfo, isFetching } = storeToRefs(userStore)

const handleUserClick = () => {
  useUserModal()
}
</script>

<template>
  <div class="user-card flex items-center" :data-tips="userInfo.isLogged ? '管理' : '登录'" @click="handleUserClick">
    <template v-if="isFetching">
      <div class="item-size flex items-center justify-center">
        <div class="w-11 h-11 rounded-md ring-gray-200 ring-1 flex items-center justify-center">
          <div class="i-mingcute-loading-3-line animate-spin text-2xl"></div>
        </div>
      </div>
      <div class="hide-on-collapse">
        <p class="text-lg font-bold">加载中...</p>
      </div>
    </template>
    <template v-else-if="!userInfo.isLogged">
      <div class="item-size flex items-center justify-center">
        <div class="w-11 h-11 rounded-md ring-gray-200 ring-1 flex items-center justify-center">
          <div class="i-mingcute-user-x-line text-2xl"></div>
        </div>
      </div>
      <div class="hide-on-collapse">
        <p class="text-lg font-bold">未登录</p>
      </div>
    </template>
    <template v-else>
      <div class="item-size flex items-center justify-center">
        <img :src="`https://cn.gravatar.com/avatar/${userInfo.emailHash}?size=128`"
          class="w-11 h-11 rounded-md ring-gray-200 ring-1">
      </div>
      <div class="hide-on-collapse">
        <p class="text-lg font-bold">{{ userInfo.name }}</p>
        <p class="text-xs">{{ userInfo.email }}</p>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.user-card {
  @apply relative cursor-pointer;

  &::before {
    @apply content-[attr(data-tips)] opacity-0 pointer-events-none;
    @apply absolute inset-0 bg-black/50 rounded-md;
    @apply transition-opacity duration-300;
    @apply text-white flex items-center justify-center font-bold text-xl;
  }

  &:hover::before {
    @apply opacity-100;
  }
}
</style>
