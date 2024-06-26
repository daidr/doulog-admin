<script setup lang="ts">
import { API_BASE } from '@/utils/env';
import BaseButton from '@/components/base/BaseButton.vue';
import UserRoleCell from '@/components/user/UserRoleCell.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import { useChangeMottoModal } from '../useChangeMottoModal';

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const loginProcessing = ref(false)

const handleGitHubLogin = () => {
  loginProcessing.value = true
  // /login
  const frontendCallback = new URL('/login', window.location.origin).href
  const backendUrl = new URL('/api/auth/login/go', API_BASE)
  backendUrl.searchParams.set('platform', 'github')
  backendUrl.searchParams.set('callback', frontendCallback)
  window.open(backendUrl, "_blank", "popup, width=600, height=600, location=no")
}

const handleDemoLogin = () => {
  loginProcessing.value = true
  const frontendCallback = new URL('/login', window.location.origin).href
  const backendUrl = new URL('/api/auth/login/demo', API_BASE)
  backendUrl.searchParams.set('callback', frontendCallback)
  window.open(backendUrl, "_blank", "popup, width=600, height=600, location=no")
}

watch(() => userInfo.value.isLogged, () => {
  if (userInfo.value.isLogged) {
    loginProcessing.value = false
  }
})

function formatTime(time: number) {
  return useDateFormat(time * 1000, 'YYYY-MM-DD HH:mm:ss').value
}
</script>

<template>
  <div v-if="!userInfo.isLogged" class="gap-2 flex flex-col">
    <BaseButton @click="handleGitHubLogin" color="#303846" :loading="loginProcessing" class="w-full font-bold text-xl"
      icon="i-mingcute-github-line">使用 GitHub 登录</BaseButton>
    <BaseButton @click="handleDemoLogin" color="#0a2e8f" :loading="loginProcessing" class="w-full font-bold text-xl">
      演示用户</BaseButton>
  </div>
  <div v-else class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <div class="flex gap-2 items-start">
        <img :src="`https://gravatar.loli.net/avatar/${userInfo.emailHash}?size=128`"
          class="w-15 h-15 rounded-xl ring-gray-200 ring-1">
        <div class="text-base">
          <table>
            <tr>
              <td>ID</td>
              <td>{{ userInfo.id }}</td>
            </tr>
            <tr>
              <td>用户名</td>
              <td>{{ userInfo.name }}</td>
            </tr>
            <tr>
              <td>邮箱</td>
              <td>{{ userInfo.email }}</td>
            </tr>
            <tr>
              <td>个人主页</td>
              <td>{{ userInfo.homepage }}</td>
            </tr>
            <tr>
              <td>创建时间</td>
              <td>{{ formatTime(userInfo.createdAt) }}</td>
            </tr>
            <tr>
              <td>角色权限</td>
              <td>
                <UserRoleCell :user="userInfo" size="small" />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div @click="useChangeMottoModal(userInfo, userStore.fetchUserInfo)" class="cursor-text">
      <BaseTextarea placeholder="这个人什么都没有留下～" disabled :model-value="userInfo.motto" />
    </div>
  </div>
</template>

<style scoped>
table {
  tr td:first-child {
    @apply pr-2 font-bold;
  }

  td {
    @apply whitespace-nowrap;
  }
}
</style>
