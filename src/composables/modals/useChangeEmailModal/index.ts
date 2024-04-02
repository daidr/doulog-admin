import { updateEmail, type UserInfo } from "@/api/user";
import BaseInput from "@/components/base/BaseInput.vue";
import { useToast } from "@/composables/useToast";

export const useChangeEmailModal = (user: UserInfo, successCb?: () => void | Promise<void>) => {
  const loading = ref(false)
  const valid = ref(true)
  const email = ref(user.email)
  const { success } = useToast()

  const handleConfirm = async () => {
    loading.value = true
    try {
      if (await updateEmail(user.id, email.value)) {
        await successCb?.();
        success({
          content: '邮箱修改成功',
          duration: 2000
        })
        modal.close()
      }
    } finally {
      loading.value = false
    }
  }

  const modal = useModal({
    title: computed(() => '修改邮箱'),
    icon: 'i-mingcute-pencil-3-fill',
    content: () => h(BaseInput, {
      min: 1,
      max: 25,
      modelValue: email.value,
      'onUpdate:modelValue': (val: string) => {
        email.value = val
      },
      valid: valid.value,
      'onUpdate:valid': (val: boolean) => {
        valid.value = val
      },
      wrapperClass: 'w-full',
      placeholder: '请输入邮箱',
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
