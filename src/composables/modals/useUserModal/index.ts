import UserActionMenu from "./UserActionMenu.vue"
import UserModalContent from "./UserModalContent.vue"
import { useChangeNameModal } from '../useChangeNameModal';
import { useChangeEmailModal } from "../useChangeEmailModal";
import { useChangeHomepageModal } from "../useChangeHomepageModal";

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
            if (userInfo.value.isLogged) {
              useChangeNameModal(userInfo.value.id)
            }
          },
          onUpdateEmail: () => {
            if (userInfo.value.isLogged) {
              useChangeEmailModal(userInfo.value.id)
            }
          },
          onUpdateHomepage: () => {
            if (userInfo.value.isLogged) {
              useChangeHomepageModal(userInfo.value.id)
            }
          }
        })
      }

      return '';
    }
  })
}
