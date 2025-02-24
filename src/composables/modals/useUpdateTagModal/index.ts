import { createTag, type TagInfo, updateTag } from '@/api/tag'
import { useToast } from '@/composables/useToast'
import UpdateTagModalContent from './UpdateTagModalContent.vue'

export function useUpdateTagModal(tag: TagInfo | Omit<TagInfo, 'id'>, successCb?: () => void | Promise<void>) {
  const loading = ref(false)
  const valid = ref(true)
  const innerTag = ref(tag)
  const { success } = useToast()

  const handleConfirm = async (closeModal: () => void) => {
    loading.value = true
    try {
      if ('id' in tag) {
        if (await updateTag(tag.id, innerTag.value)) {
          await successCb?.()
          success({
            content: '标签修改成功',
            duration: 2000,
          })
          closeModal()
        }
      } else {
        if (await createTag(innerTag.value)) {
          await successCb?.()
          success({
            content: '标签创建成功',
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
    title: computed(() => 'id' in innerTag.value ? '修改标签' : '创建标签'),
    icon: 'i-mingcute-tag-line',
    content: () => h(UpdateTagModalContent, {
      tag: innerTag.value,
      disabled: loading.value,
      onUpdateTag(value) {
        innerTag.value = value
      },
      onUpdateValid(value) {
        valid.value = value
      },
    }),
    cancelText: computed(() => '取消'),
    loading,
    confirmText: computed(() => 'id' in innerTag.value ? '修改' : '创建'),
    disabledConfirm: computed(() => !valid.value),
    onConfirm() {
      handleConfirm(modal.close)
      return false
    },
  })

  return modal
}
