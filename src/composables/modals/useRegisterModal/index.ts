import RegisterModalContent from './RegisterModalContent.vue'

export function useRegisterModal() {
  return useModal({
    title: '注册',
    icon: 'i-mingcute-user-4-fill',
    content: () => h(RegisterModalContent),
    hideCancel: true,
    hideConfirm: true,
  })
}
