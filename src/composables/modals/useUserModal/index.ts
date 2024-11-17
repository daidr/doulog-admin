import UserActionMenu from "./UserActionMenu.vue"
import UserModalContent from "./UserModalContent.vue"
import { useChangeNameModal } from '../useChangeNameModal';
import { useChangeEmailModal } from "../useChangeEmailModal";
import { useChangeHomepageModal } from "../useChangeHomepageModal";
import { useChangeMottoModal } from "../useChangeMottoModal";
import { useCheckPasskeysModal } from "../useCheckPasskeysModal";

export const useUserModal = () => {
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const { setToken, fetchUserInfo } = userStore
  return useModal({
    title: computed(() => userInfo.value.isLogged ? '管理' : '登录'),
    icon: 'i-mingcute-user-4-fill',
    content: () => h(UserModalContent),
    hideCancel: true,
    hideConfirm: true,
    onConfirm() {
      setToken('')
      return false
    },
    hideCustomTools() {
      return !userInfo.value.isLogged
    },
    customTools: () => {
      return h(UserActionMenu, {
        onLogout: () => {
          setToken('')
        },
        onUpdateUsername: () => {
          if (userInfo.value.isLogged) {
            useChangeNameModal(userInfo.value, async () => {
              await fetchUserInfo()
            })
          }
        },
        onUpdateEmail: () => {
          if (userInfo.value.isLogged) {
            useChangeEmailModal(userInfo.value, async () => {
              await fetchUserInfo()
            })
          }
        },
        onUpdateHomepage: () => {
          if (userInfo.value.isLogged) {
            useChangeHomepageModal(userInfo.value, async () => {
              await fetchUserInfo()
            })
          }
        },
        onUpdateMotto: () => {
          if (userInfo.value.isLogged) {
            useChangeMottoModal(userInfo.value, async () => {
              await fetchUserInfo()
            })
          }
        },
        onCheckPasskeys: () => {
          if (userInfo.value.isLogged) {
            useCheckPasskeysModal(userInfo.value)
          }
        }
      })
    }
  })
}
