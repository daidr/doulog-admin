import type { CategoryResp } from '@/pages/categories.vue'
import { app } from '@/api/elysia'
import { useToast } from '@/composables/useToast'
import UpdateTagModalContent from './UpdateTagModalContent.vue'

export function useUpdateTagModal(tag: Pick<CategoryResp[number], '_id' | 'name' | 'slug'> | Pick<CategoryResp[number], 'name' | 'slug'>, successCb?: () => void | Promise<void>) {
  const loading = ref(false)
  const valid = ref(true)
  const innerTag = ref(tag)
  const { success } = useToast()

  const handleConfirm = async (closeModal: () => void) => {
    loading.value = true
    try {
      if ('_id' in innerTag.value) {
        const { data } = await app.api.category({
          id: innerTag.value._id.toString(),
        }).patch(innerTag.value as any)
        if (data) {
          await successCb?.()
          success({
            content: '文章分类修改成功',
            duration: 2000,
          })
          closeModal()
        }
      } else {
        const { data } = await app.api.category.index.post(innerTag.value)
        if (data) {
          await successCb?.()
          success({
            content: '文章分类创建成功',
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
    title: computed(() => 'id' in innerTag.value ? '修改文章分类' : '创建文章分类'),
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
