import type { MaybeRefOrGetter, VNode } from 'vue'
import InnerModalContainer from './ModalContainer.vue'

export interface ModalInfo {
  _id: string
  _createdAt: number
  title?: MaybeRefOrGetter<string | VNode>
  content?: MaybeRefOrGetter<string | VNode>
  icon?: string
  confirmText?: MaybeRefOrGetter<string>
  cancelText?: MaybeRefOrGetter<string>
  onConfirm?: () => false | void
  onCancel?: () => false | void
  onClose?: () => void
  hideConfirm?: MaybeRefOrGetter<boolean>
  hideCancel?: MaybeRefOrGetter<boolean>
  loading?: MaybeRefOrGetter<boolean>
  disabledConfirm?: MaybeRefOrGetter<boolean>
  disabledCancel?: MaybeRefOrGetter<boolean>
  customTools?: MaybeRefOrGetter<string | VNode>
}

let modals: Ref<ModalInfo[]> | undefined

export function _initModal() {
  if (modals) return modals
  effectScope().run(() => {
    modals = shallowRef([])
    onScopeDispose(() => {
      modals = undefined
    })
  })
  return modals!
}

export type UseModalProps = Omit<ModalInfo, '_id' | '_createdAt'>
export interface UseModalReturn {
  close: () => void
}

function closeModal(_id: string) {
  if (!modals) return
  modals.value = modals.value.filter(m => m._id !== _id)
}

export const ModalContainer = defineComponent(() => {
  return () => {
    const modals = _initModal()
    return h(InnerModalContainer, {
      modals: modals.value,
      onCancel: (modal) => {
        if (toValue(modal.loading)) return
        const result = modal.onCancel?.()
        if (result === false) return
        closeModal(modal._id)
      },
      onConfirm: (modal) => {
        if (toValue(modal.loading)) return
        const result = modal.onConfirm?.()
        if (result === false) return
        closeModal(modal._id)
      },
      onClose: (modal) => {
        if (toValue(modal.loading)) return
        closeModal(modal._id)
      }
    })
  }
})

function randomString(length: number) {
  return Math.random().toString(36).slice(2, 2 + length)
}

export function useModal(props: UseModalProps) {
  if (!modals) return { close: () => { } }
  const randomNonce = randomString(6)
  const _createdAt = Date.now()
  const _id = `modal-${_createdAt}-${randomNonce}`
  const modalInfo = {
    _id,
    _createdAt,
    ...props,
  }
  modals.value = [...modals.value, modalInfo]
  return {
    close: () => {
      closeModal(_id)
    },
  }
}

if (import.meta.env.DEV) {
  window.useModal = useModal
}

declare global {
  interface Window {
    useModal: typeof useModal
  }
}