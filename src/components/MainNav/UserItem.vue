<script setup lang="ts">
const { userInfo, isFetching } = storeToRefs(useUserStore())
</script>

<template>
  <div class="flex items-center">
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

<style scoped></style>
