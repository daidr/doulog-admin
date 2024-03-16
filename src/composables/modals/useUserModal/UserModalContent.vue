<script setup lang="ts">
import { API_BASE } from '@/utils/env';
import { getUserStatusText } from '@/utils/user';
import { useChangeNameModal } from '../useChangeNameModal';
import BaseButton from '@/components/base/BaseButton.vue';

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const loginProcessing = ref(false)

const handleLogin = () => {
  loginProcessing.value = true
  // /login
  const frontendCallback = new URL('/login', window.location.origin).href
  const backendUrl = new URL('/api/auth/login/v1/go', API_BASE)
  backendUrl.searchParams.set('platform', 'github')
  backendUrl.searchParams.set('callback', frontendCallback)
  window.open(backendUrl, "_blank", "popup, width=600, height=600, location=no")
}

const handleChangeName = () => {
  useChangeNameModal()
}

watch(() => userInfo.value.isLogged, () => {
  if (userInfo.value.isLogged) {
    loginProcessing.value = false
  }
})
</script>

<template>
  <div v-if="!userInfo.isLogged">
    <BaseButton @click="handleLogin" color="#303846" :loading="loginProcessing" class="w-full font-bold text-xl"
      icon="i-mingcute-github-line">使用 GitHub 登录</BaseButton>
  </div>
  <div v-else class="flex flex-col gap-2">
    <div class="flex gap-2 items-start">
      <img :src="`https://cn.gravatar.com/avatar/${userInfo.emailHash}?size=128`"
        class="w-15 h-15 rounded-xl ring-gray-200 ring-1">
      <div class="text-base">
        <table>
          <tr>
            <td>ID：</td>
            <td>{{ userInfo.id }}</td>
          </tr>
          <tr>
            <td>昵称：</td>
            <td>{{ userInfo.name }}</td>
          </tr>
          <tr>
            <td>邮箱：</td>
            <td>{{ userInfo.email }}</td>
          </tr>
          <tr>
            <td>权限：</td>
            <td>{{ getUserStatusText(userInfo).name }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div>
      <button @click="handleChangeName"
        class="text-white bg-gray-800/80 hover:bg-gray-700 flex items-center w-full py-1.5 px-5 justify-center gap-2 rounded-3 text-base">
        <span>修改昵称</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
table {
  tr td:first-child {
    @apply pr-2 font-bold;
  }
}
</style>
