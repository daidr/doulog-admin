import { createProjCat, type ProjCatInfo, updateProjCat } from '@/api/project'
import { useToast } from '@/composables/useToast'
import UpdateTagModalContent from './UpdateProjCatModalContent.vue'

export function useUpdateProjCatModal(cat: ProjCatInfo | Omit<ProjCatInfo, 'id'>, successCb?: () => void | Promise<void>) {
  const loading = ref(false)
  const valid = ref(true)
  const innerCat = ref(cat)
  const { success } = useToast()

  const handleConfirm = async (closeModal: () => void) => {
    loading.value = true
    try {
      if ('id' in cat) {
        if (await updateProjCat(cat.id, innerCat.value)) {
          await successCb?.()
          success({
            content: '分类修改成功',
            duration: 2000,
          })
          closeModal()
        }
      } else {
        if (await createProjCat(innerCat.value)) {
          await successCb?.()
          success({
            content: '分类创建成功',
            duration: 2000,
          })
          closeModal()
        }
      }
    } finally {
      loading.value = false
    }
  }

  const modal = useModal({
    title: computed(() => 'id' in innerCat.value ? '修改分类' : '创建分类'),
    icon: 'i-mingcute-tag-line',
    content: () => h(UpdateTagModalContent, {
      cat: innerCat.value,
      disabled: loading.value,
      onUpdateCat(value) {
        innerCat.value = value
      },
      onUpdateValid(value) {
        valid.value = value
      },
    }),
    cancelText: computed(() => '取消'),
    loading,
    confirmText: computed(() => 'id' in innerCat.value ? '修改' : '创建'),
    disabledConfirm: computed(() => !valid.value),
    onConfirm() {
      handleConfirm(modal.close)
      return false
    },
  })

  return modal
}
