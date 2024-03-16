<script setup lang="ts">
import VectorLogo from '@/components/VectorLogo.vue';
import BaseButton from '@/components/base/BaseButton.vue';
const route = useRoute()
const userStore = useUserStore()
const { userInfo, isFetching } = storeToRefs(userStore)
const { setToken } = userStore

const handleClick = () => {
  window.close()
}

onMounted(() => {
  if (route.query.token) {
    setToken(route.query.token as string)
  }
})
</script>

<template>
  <div class="w-full h-screen flex flex-col items-center justify-center text-gray-600 gap-2">
    <VectorLogo class="w-32 h-32 mx-auto" />
    <p class="text-xl font-bold">DouLog Admin</p>
    <br>
    <template v-if="route.query.msg">
      <p class="text-xl font-bold">登录失败：{{ route.query.msg }}</p>
      <BaseButton @click="handleClick">关闭窗口</BaseButton>
    </template>
    <template v-else-if="userInfo.isLogged">
      <p class="text-xl font-bold">登录成功</p>
      <BaseButton @click="handleClick">关闭窗口</BaseButton>
    </template>
    <template v-else-if="isFetching">
      <p class="text-xl font-bold flex items-center gap-2">
      <div class="i-mingcute-loading-3-line animate-spin text-2xl"></div>
      登录中
      </p>
    </template>
  </div>
</template>

<style scoped></style>

<route lang="json">{
  "meta": {
    "title": "登录",
    "skipAuth": true,
    "hideNav": true
  }
}</route>
