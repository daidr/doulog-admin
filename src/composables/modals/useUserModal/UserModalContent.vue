<script setup lang="ts">
import UserRoleCell from '@/components/user/UserRoleCell.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import { useChangeMottoModal } from '../useChangeMottoModal';
import LoginModalContent from './LoginModalContent.vue';

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

function formatTime(time: number) {
  return useDateFormat(time * 1000, 'YYYY-MM-DD HH:mm:ss').value
}
</script>

<template>
  <div class="overflow-auto p-1px">
    <LoginModalContent v-if="!userInfo.isLogged" />
    <div v-else class="flex flex-col gap-2">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-start">
          <img :src="`https://gravatar.loli.net/avatar/${userInfo.emailHash}?size=128`"
            class="w-15 h-15 rounded-xl ring-gray-200 ring-1">
          <div class="text-base">
            <table>
              <tbody>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div @click="useChangeMottoModal(userInfo, userStore.fetchUserInfo)" class="cursor-text">
        <BaseTextarea placeholder="这个人什么都没有留下～" disabled :model-value="userInfo.motto" />
      </div>
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
