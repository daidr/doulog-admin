import { updateHomepage } from "@/api/user";
import BaseInput from "@/components/base/BaseInput.vue";
import { useToast } from "@/composables/useToast";

export const useChangeHomepageModal = (uid: number) => {
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const { fetchUserInfo } = userStore;
  if (!userInfo.value.isLogged) {
    return;
  }

  const loading = ref(false)
  const valid = ref(true)
  const homepage = ref(userInfo.value.homepage)
  const { success } = useToast()

  const handleConfirm = async () => {
    loading.value = true
    try {
      if (await updateHomepage(uid, homepage.value)) {
        await fetchUserInfo()
        success({
          content: '主页修改成功',
          duration: 2000
        })
        modal.close()
      }
    } finally {
      loading.value = false
    }
  }

  const modal = useModal({
    title: computed(() => '修改主页'),
    icon: 'i-mingcute-pencil-3-fill',
    content: () => h(BaseInput, {
      min: 1,
      max: 99,
      modelValue: homepage.value,
      'onUpdate:modelValue': (val: string) => {
        homepage.value = val
      },
      valid: valid.value,
      'onUpdate:valid': (val: boolean) => {
        valid.value = val
      },
      wrapperClass: 'w-full',
      placeholder: '请输入主页',
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
