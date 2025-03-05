<script setup lang="ts">
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import UserRoleCell from '@/components/user/UserRoleCell.vue'
import { useChangeMottoModal } from '../useChangeMottoModal'
import LoginModalContent from './LoginModalContent.vue'

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
        <div class="flex items-start gap-2">
          <img
            :src="`https://gravatar.loli.net/avatar/${userInfo.emailHash}?size=128`"
            class="h-15 w-15 rounded-xl ring-1 ring-gray-200"
          >
          <div class="text-base">
            <table>
              <tbody>
                <tr>
                  <td>名字</td>
                  <td>{{ userInfo.name }}</td>
                </tr>
                <tr>
                  <td>昵称</td>
                  <td>{{ userInfo.nickname }}</td>
                </tr>
                <tr>
                  <td>邮箱</td>
                  <td>{{ userInfo.email }}</td>
                </tr>
                <tr>
                  <td>座右铭</td>
                  <td>{{ userInfo.motto }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <BaseTextarea placeholder="这个人什么都没有留下～" disabled :model-value="userInfo.bio" />
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
