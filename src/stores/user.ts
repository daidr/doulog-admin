import { app } from '@/api/elysia'
import { STORAGE_TOKEN } from '@/constants/base'
import { defineStore } from 'pinia'

type UserInfo = (Awaited<ReturnType<typeof app.api.auth.check.get>>['data'] & { isLogged: true }) | { isLogged: false }

export const useUserStore = defineStore('user', () => {
  const isFetching = ref(false)
  const userInfo = ref<UserInfo>({
    isLogged: false,
  })

  const fetchUserInfo = async () => {
    isFetching.value = true
    const result = await app.api.auth.check.get()
    if (result.error || !result.data) {
      userInfo.value = { isLogged: false }
    } else {
      userInfo.value = {
        ...result.data,
        isLogged: true,
      }
    }
    isFetching.value = false
  }

  const token = useLocalStorage(STORAGE_TOKEN, '')

  const setToken = (newToken: string) => {
    token.value = newToken
  }

  watch(token, (newToken) => {
    if (newToken) {
      userInfo.value = { isLogged: false }
      fetchUserInfo()
    } else {
      userInfo.value = { isLogged: false }
    }
  }, {
    immediate: true,
  })

  return { isFetching, userInfo, setToken, fetchUserInfo }
})
