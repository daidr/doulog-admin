<script setup lang="ts">
import MainNav from './components/MainNav.vue';
import VectorLogo from './components/VectorLogo.vue';
const { userInfo } = storeToRefs(useUserStore())
</script>

<template>
  <div class="fixed left-0 bottom-0 top-0 z-10">
    <MainNav />
  </div>
  <div class="w-100vw min-h-100dvh sm:pl-18">
    <RouterView v-if="userInfo.isLogged && userInfo.isAdmin" />
    <div v-else class="w-full h-screen flex flex-col items-center justify-center text-gray-600 gap-2">
      <VectorLogo class="w-32 h-32 mx-auto" />
      <p class="text-xl font-bold">DouLog Admin</p>
      <p class="text-xl font-bold">你必须登录且拥有管理员身份才能访问</p>
    </div>
  </div>
</template>

<style scoped></style>
