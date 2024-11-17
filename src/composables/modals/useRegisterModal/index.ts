import RegisterModalContent from "./RegisterModalContent.vue"
export const useRegisterModal = () => {
  return useModal({
    title: '注册',
    icon: 'i-mingcute-user-4-fill',
    content: () => h(RegisterModalContent),
    hideCancel: true,
    hideConfirm: true,
  })
}
