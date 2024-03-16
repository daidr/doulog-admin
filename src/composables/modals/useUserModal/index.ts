import UserModalContent from "./UserModalContent.vue"

export const useUserModal = () => {
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const { setToken } = userStore
  return useModal({
    title: computed(() => userInfo.value.isLogged ? '管理' : '登录'),
    icon: 'i-mingcute-user-4-fill',
    content: () => h(UserModalContent),
    hideCancel: computed(() => !userInfo.value.isLogged),
    cancelText: '登出',
    confirmText: '关闭',
    onCancel() {
      setToken('')
      return false
    }
  })
}
