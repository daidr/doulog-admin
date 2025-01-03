<script setup lang="ts">
import type { UserInfo } from '@/api/user'
import { finishWebAuthnReg, getWebAuthnRegOptions, listWebAuthnCredentials } from '@/api/login'
import BaseButton from '@/components/base/BaseButton.vue'
import { getWebAuthnToastTextByError } from '@/utils/webauthn'
import { create, parseCreationOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill'
import PasskeyItem from './PasskeyItem.vue'

defineProps<{
  userInfo: UserInfo
}>()

const isAddingPasskey = ref(false)
const { success, error } = useToast()

const { state: passkeyList, isLoading: isListLoading, error: loadedListError, execute: reloadList } = useAsyncState(
  listWebAuthnCredentials
  , [],
)

async function handleAddPasskey() {
  if (isAddingPasskey.value) return
  isAddingPasskey.value = true
  const optionsJSON = await getWebAuthnRegOptions()
  if (!optionsJSON) {
    isAddingPasskey.value = false
    return
  }
  const challenge = optionsJSON.publicKey.challenge
  const options = parseCreationOptionsFromJSON(optionsJSON)
  try {
    const response = await create(options)
    const result = await finishWebAuthnReg(challenge, response)
    if (!result) {
      isAddingPasskey.value = false
      return
    }
    success({
      content: '成功添加通行密钥',
      duration: 2000,
    })
    reloadList()
  } catch (err) {
    console.error('error', err)
    const text = getWebAuthnToastTextByError(err as Error)
    error({
      content: text,
      duration: 2000,
    })
  }
  isAddingPasskey.value = false
}
</script>

<template>
  <div class="min-h-0 flex flex-shrink flex-col gap-3">
    <div class="w-full overflow-auto border-2.5 border-gray-300 rounded-xl p-1">
      <div v-if="isListLoading" class="i-mingcute-loading-3-line mx-auto my-5 animate-spin text-3xl" />
      <div v-if="loadedListError" class="my-5 text-center text-xl">
        加载失败
      </div>
      <div v-else-if="!passkeyList || passkeyList.length === 0" class="my-5 text-center text-xl">
        暂无通行密钥
      </div>
      <div v-else class="flex flex-col gap-1 overflow-auto p-1px">
        <PasskeyItem v-for="passkey in passkeyList" :key="passkey.id" :passkey="passkey" @refresh="reloadList" />
      </div>
    </div>
    <div class="flex justify-end">
      <BaseButton icon="i-mingcute-add-circle-line" :loading="isAddingPasskey" @click="handleAddPasskey">
        添加通行密钥
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
