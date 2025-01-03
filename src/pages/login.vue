<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import VectorLogo from '@/components/VectorLogo.vue'

const route = useRoute()
const userStore = useUserStore()
const { userInfo, isFetching } = storeToRefs(userStore)
const { setToken } = userStore

function handleClick() {
  window.close()
}

onMounted(() => {
  if (route.query.token) {
    setToken(route.query.token as string)
  }
})
</script>

<template>
  <div class="h-100dvh w-full flex flex-col items-center justify-center gap-2 text-gray-600">
    <VectorLogo class="mx-auto h-32 w-32" />
    <p class="text-xl font-bold">
      DouLog Admin
    </p>
    <br>
    <template v-if="route.query.msg">
      <p class="text-xl font-bold">
        登录失败：{{ route.query.msg }}
      </p>
      <BaseButton @click="handleClick">
        关闭窗口
      </BaseButton>
    </template>
    <template v-else-if="userInfo.isLogged">
      <p class="text-xl font-bold">
        登录成功
      </p>
      <BaseButton @click="handleClick">
        关闭窗口
      </BaseButton>
    </template>
    <template v-else-if="isFetching">
      <div class="flex items-center gap-2 text-xl font-bold">
        <div class="i-mingcute-loading-3-line animate-spin text-2xl" />
        登录中
      </div>
    </template>
  </div>
</template>

<style scoped></style>

<route lang="json">
{
  "meta": {
    "title": "登录",
    "skipAuth": true,
    "hideNav": true
  }
}
</route>
