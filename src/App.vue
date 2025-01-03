<script setup lang="ts">
import { ModalContainer } from '@/composables/useModal'
import { ToastContainer } from '@/composables/useToast'
import MainNav from './components/MainNav.vue'
import VectorLogo from './components/VectorLogo.vue'

const { userInfo } = storeToRefs(useUserStore())
const route = useRoute()
</script>

<template>
  <ToastContainer />
  <ModalContainer />
  <div v-if="!route.meta.hideNav" class="fixed bottom-0 left-0 top-0 z-10">
    <MainNav />
  </div>
  <div
    class="min-h-100dvh w-100vw" :class="{
      'sm:pl-18': !route.meta.hideNav,
    }"
  >
    <RouterView v-if="route.meta.skipAuth || (userInfo.isLogged && userInfo.isAdmin)" />
    <div v-else class="h-100dvh w-full flex flex-col items-center justify-center gap-2 text-gray-600">
      <VectorLogo class="mx-auto h-32 w-32" />
      <p class="text-xl font-bold">
        DouLog Admin
      </p>
      <p class="text-xl font-bold">
        你必须登录且拥有管理员身份才能访问
      </p>
    </div>
  </div>
</template>

<style scoped></style>
