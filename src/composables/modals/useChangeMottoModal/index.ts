import { updateMotto, type UserInfo } from "@/api/user";
import BaseTextarea from "@/components/base/BaseTextarea.vue";
import { useToast } from "@/composables/useToast";

export const useChangeMottoModal = (user: UserInfo, successCb?: () => void | Promise<void>) => {
  const loading = ref(false)
  const valid = ref(true)
  const motto = ref(user.motto)
  const { success } = useToast()

  const handleConfirm = async () => {
    loading.value = true
    try {
      if (await updateMotto(user.id, motto.value || '')) {
        await successCb?.()
        success({
          content: '座右铭修改成功',
          duration: 2000
        })
        modal.close()
      }
    } finally {
      loading.value = false
    }
  }

  const modal = useModal({
    title: computed(() => '修改座右铭'),
    icon: 'i-mingcute-pencil-3-fill',
    content: () => h(BaseTextarea, {
      max: 300,
      modelValue: motto.value,
      'onUpdate:modelValue': (val: string) => {
        motto.value = val
      },
      valid: valid.value,
      'onUpdate:valid': (val: boolean) => {
        valid.value = val
      },
      style: {
        maxHeight: '80vh'
      },
      wrapperClass: 'w-full',
      placeholder: '这个人什么都没留下～',
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
