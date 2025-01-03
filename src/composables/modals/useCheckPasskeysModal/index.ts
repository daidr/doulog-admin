import type { UserInfo } from '@/api/user'
import CheckPasskeysModalContent from './CheckPasskeysModalContent.vue'

export function useCheckPasskeysModal(user: UserInfo) {
  const modal = useModal({
    title: computed(() => '通行密钥管理'),
    icon: 'i-mingcute-key-2-fill',
    content: () => h(CheckPasskeysModalContent, {
      userInfo: user,
    }),
    hideCancel: true,
    hideConfirm: true,
  })
  return modal
}
