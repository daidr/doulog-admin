import { updateUsername, type UserInfo } from "@/api/user";
import BaseInput from "@/components/base/BaseInput.vue";
import { useToast } from "@/composables/useToast";
import CheckPasskeysModalContent from "./CheckPasskeysModalContent.vue";

export const useCheckPasskeysModal = (user: UserInfo) => {
  const modal = useModal({
    title: computed(() => '通行密钥管理'),
    icon: 'i-mingcute-key-2-fill',
    content: () => h(CheckPasskeysModalContent, {
      userInfo: user,
    }),
    hideCancel: true,
    hideConfirm: true,
  })
  return modal;
}
