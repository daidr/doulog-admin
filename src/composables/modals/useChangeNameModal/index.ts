import { updateSelfUsername } from "@/api/user";
import BaseInput from "@/components/base/BaseInput.vue";
import { useToast } from "@/composables/useToast";

export const useChangeNameModal = () => {
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const { fetchUserInfo } = userStore;
  if (!userInfo.value.isLogged) {
    return;
  }

  const loading = ref(false)
  const valid = ref(true)
  const name = ref(userInfo.value.name)
  const { success } = useToast()

  const handleConfirm = async () => {
    loading.value = true
    try {
      if (await updateSelfUsername(name.value)) {
        await fetchUserInfo()
        success({
          content: '用户名修改成功',
          duration: 2000
        })
        modal.close()
      }
    } finally {
      loading.value = false
    }
  }

  const modal = useModal({
    title: computed(() => '修改用户名'),
    icon: 'i-mingcute-pencil-3-fill',
    content: () => h(BaseInput, {
      min: 1,
      max: 25,
      modelValue: name.value,
      'onUpdate:modelValue': (val: string) => {
        name.value = val
      },
      valid: valid.value,
      'onUpdate:valid': (val: boolean) => {
        valid.value = val
      },
      wrapperClass: 'w-full',
      placeholder: '请输入用户名',
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
