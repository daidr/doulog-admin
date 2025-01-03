import { removeWebAuthnCredential, type WebAuthnCredentialItem } from '@/api/login'
import { useToast } from '@/composables/useToast'

export function usePasskeyRemoveModal(passkey: WebAuthnCredentialItem, successCb?: () => void | Promise<void>) {
  const loading = ref(false)
  const { success } = useToast()

  const handleConfirm = async (closeModal: () => void) => {
    loading.value = true
    try {
      if (await removeWebAuthnCredential(passkey.id)) {
        await successCb?.()
        success({
          content: '成功移除通行密钥',
          duration: 2000,
        })
        closeModal()
      }
    } finally {
      loading.value = false
    }
  }

  const modal = useModal({
    title: computed(() => '移除通行密钥'),
    icon: 'i-mingcute-pencil-3-fill',
    content: () => `确定移除「${passkey.label}」吗？`,
    cancelText: computed(() => '取消'),
    loading,
    confirmText: computed(() => '确定'),
    onConfirm() {
      handleConfirm(modal.close)
      return false
    },
  })

  return modal
}
