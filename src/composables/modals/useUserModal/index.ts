import UserActionMenu from "./UserActionMenu.vue"
import UserModalContent from "./UserModalContent.vue"
import { useChangeNameModal } from '../useChangeNameModal';

export const useUserModal = () => {
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const { setToken } = userStore
  return useModal({
    title: computed(() => userInfo.value.isLogged ? '管理' : '登录'),
    icon: 'i-mingcute-user-4-fill',
    content: () => h(UserModalContent),
    hideCancel: true,
    confirmText: '关闭',
    cancelText: '登出',
    onCancel() {
      setToken('')
      return false
    },
    customTools: () => {
      if (userInfo.value.isLogged) {
        return h(UserActionMenu, {
          onLogout: () => {
            setToken('')
          },
          onUpdateUsername: () => {
            useChangeNameModal()
          }
        })
      }

      return '';
    }
  })
}
