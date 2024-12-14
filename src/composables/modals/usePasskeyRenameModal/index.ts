import { renameWebAuthnCredential, type WebAuthnCredentialItem } from "@/api/login";
import BaseInput from "@/components/base/BaseInput.vue";
import { useToast } from "@/composables/useToast";

export const usePasskeyRenameModal = (passkey: WebAuthnCredentialItem, successCb?: () => void | Promise<void>) => {
  const loading = ref(false)
  const valid = ref(true)
  const label = ref(passkey.label)
  const { success } = useToast()

  const handleConfirm = async () => {
    loading.value = true
    try {
      if (await renameWebAuthnCredential(passkey.id, label.value)) {
        await successCb?.();
        success({
          content: '标签修改成功',
          duration: 2000
        })
        modal.close()
      }
    } finally {
      loading.value = false
    }
  }

  const modal = useModal({
    title: computed(() => '重命名通行密钥'),
    icon: 'i-mingcute-pencil-3-fill',
    content: () => h(BaseInput, {
      min: 1,
      max: 25,
      modelValue: label.value,
      'onUpdate:modelValue': (val: string) => {
        label.value = val
      },
      valid: valid.value,
      'onUpdate:valid': (val: boolean) => {
        valid.value = val
      },
      wrapperClass: 'w-full',
      placeholder: '请输入通行密钥标签',
      disabled: loading.value,
    }),
    cancelText: computed(() => '取消'),
    loading,
    confirmText: computed(() => '修改'),
    disabledConfirm: computed(() => !valid.value),
    onConfirm() {
      handleConfirm()
      return false;
    }
  })

  return modal;
}
