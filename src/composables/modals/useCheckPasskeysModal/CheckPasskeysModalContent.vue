<script setup lang="ts">
import type { UserInfo } from '@/api/user';
import { useCheckPasskeysModal } from '.';
import BaseButton from '@/components/base/BaseButton.vue';
import { finishWebAuthnReg, getWebAuthnRegOptions, listWebAuthnCredentials } from '@/api/login';
import { create, parseCreationOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill';
import { getWebAuthnToastTextByError } from '@/utils/webauthn';
import PasskeyItem from './PasskeyItem.vue';

defineProps<{
  userInfo: UserInfo
}>()

const isAddingPasskey = ref(false);
const { success, error } = useToast();


const { state: passkeyList, isLoading: isListLoading, error: loadedListError, execute: reloadList } = useAsyncState(
  listWebAuthnCredentials
  , []);


async function handleAddPasskey() {
  if (isAddingPasskey.value) return;
  isAddingPasskey.value = true;
  const optionsJSON = await getWebAuthnRegOptions();
  if (!optionsJSON) {
    isAddingPasskey.value = false;
    return;
  }
  const challenge = optionsJSON.publicKey.challenge;
  const options = parseCreationOptionsFromJSON(optionsJSON);
  try {
    const response = await create(options);
    const result = await finishWebAuthnReg(challenge, response);
    if (!result) {
      isAddingPasskey.value = false;
      return;
    }
    success({
      content: '成功添加通行密钥',
      duration: 2000,
    });
    reloadList();
  } catch (err) {
    console.error('error', err);
    const text = getWebAuthnToastTextByError(err as Error);
    error({
      content: text,
      duration: 2000,
    });
  }
  isAddingPasskey.value = false;
}

</script>

<template>
  <div class="flex flex-col gap-3 min-h-0 flex-shrink">
    <div class="rounded-xl border-2.5 border-gray-300 w-full p-1 overflow-auto">
      <div class="animate-spin i-mingcute-loading-3-line text-3xl mx-auto my-5" v-if="isListLoading"></div>
      <div class="text-xl text-center my-5" v-if="loadedListError">加载失败</div>
      <div v-else-if="!passkeyList || passkeyList.length === 0" class="text-xl text-center my-5">暂无通行密钥</div>
      <div v-else class="flex flex-col gap-1 overflow-auto p-1px">
        <PasskeyItem v-for="passkey in passkeyList" :key="passkey.id" :passkey="passkey" @refresh="reloadList" />
      </div>
    </div>
    <div class="flex justify-end">
      <BaseButton @click="handleAddPasskey" icon="i-mingcute-add-circle-line" :loading="isAddingPasskey">添加通行密钥
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
