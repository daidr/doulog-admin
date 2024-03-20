import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getSelfUserInfo, type UserInfoWithLogged } from '@/api/user'
import { STORAGE_TOKEN } from '@/constants/base'

export const useUserStore = defineStore('user', () => {
  const isFetching = ref(false)
  const userInfo = shallowRef<UserInfoWithLogged>({
    isLogged: false
  })

  const fetchUserInfo = async () => {
    isFetching.value = true
    try {
      const result = await getSelfUserInfo();
      userInfo.value = result
    } finally {
      isFetching.value = false
    }
  }

  const token = useLocalStorage(STORAGE_TOKEN, "")

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
    immediate: true
  })

  return { isFetching, userInfo, setToken, fetchUserInfo }
})
