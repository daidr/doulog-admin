<script setup lang="ts">
import { getWebAuthnDiscoverLoginOptions, pwLogin, webauthnLogin } from '@/api/login'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { parseRequestOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill'
import { useRegisterModal } from '../useRegisterModal'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const loginProcessing = ref('')

watch(() => userInfo.value.isLogged, () => {
  if (userInfo.value.isLogged) {
    loginProcessing.value = ''
  }
})

function handlePasskeyLogin() {
}

function handleGitHubLogin() {
  // // /login
  // const frontendCallback = new URL('/login', window.location.origin).href
  // const backendUrl = new URL('/api/auth/login/go', API_BASE)
  // backendUrl.searchParams.set('platform', 'github')
  // backendUrl.searchParams.set('callback', frontendCallback)
  // window.open(backendUrl, "_blank", "popup, width=600, height=600, location=no")
}

function handleGoogleLogin() {
}

function handleQQLogin() {
}

function handleTestLogin() {
}

const formEmail = ref('')
const formPassword = ref('')
function isEmptyString(str: string) {
  return str.trim() === ''
}
function isInvalidEmail(email: string) {
  return !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)
}
const disabledPwButton = computed(() => (loginProcessing.value !== '' && loginProcessing.value !== 'password') || isEmptyString(formEmail.value) || isEmptyString(formPassword.value) || isInvalidEmail(formEmail.value))

async function loginWithPassword() {
  loginProcessing.value = 'password'
  const result = await pwLogin(formEmail.value, formPassword.value)
  if (result) {
    userStore.setToken(result)
  } else {
    loginProcessing.value = ''
  }
  formPassword.value = ''
}

const [DefinePlatformButtonTemplate, ReusePlatformButton] = createReusableTemplate<{
  platform: string
  clickHandler: () => void
  icon: string
}>()

function runLoginHandler(platform: string, handler: () => void) {
  loginProcessing.value = platform
  handler()
}

const discoverLoginController = ref<AbortController | null>(null)

onMounted(async () => {
  if (window.PublicKeyCredential
    && PublicKeyCredential.isConditionalMediationAvailable) {
    const isCMA = await PublicKeyCredential.isConditionalMediationAvailable()
    if (isCMA) {
      discoverLoginHandler()
    }
  }
})

async function discoverLoginHandler() {
  const resp = await getWebAuthnDiscoverLoginOptions()
  if (!resp) {
    return
  }
  discoverLoginController.value = new AbortController()
  const result = parseRequestOptionsFromJSON({
    ...resp,
    signal: discoverLoginController.value.signal,
    mediation: 'conditional',
  })

  const credential = await navigator.credentials.get(result)
  loginProcessing.value = 'passkey'
  const token = await webauthnLogin(resp.publicKey!.challenge, credential)
  if (token) {
    userStore.setToken(token)
  } else {
    loginProcessing.value = ''
    discoverLoginHandler()
  }
}

onUnmounted(() => {
  if (discoverLoginController.value) {
    discoverLoginController.value.abort()
  }
})
</script>

<template>
  <DefinePlatformButtonTemplate v-slot="{ platform, clickHandler, icon, $slots }">
    <BaseButton
      :loading="loginProcessing === platform" :ghost="true" :small="true"
      :disabled="loginProcessing !== '' && loginProcessing !== platform" :icon="icon" @click="runLoginHandler(platform, clickHandler)"
    >
      <component :is="$slots.default" />
    </BaseButton>
  </DefinePlatformButtonTemplate>
  <div class="flex flex-col gap-2">
    <BaseInput
      v-model="formEmail" type="email" placeholder="邮箱" autocomplete="username webauthn"
      :disabled="loginProcessing !== ''"
    />
    <BaseInput
      v-model="formPassword" type="password" placeholder="密码" autocomplete="current-password"
      :disabled="loginProcessing !== ''"
    />
    <BaseButton
      :loading="loginProcessing === 'password'" :disabled="disabledPwButton"
      @click="loginWithPassword"
    >
      登录
    </BaseButton>
    <div class="flex justify-between">
      <ReusePlatformButton platform="passkey" :click-handler="handlePasskeyLogin" icon="i-mingcute-key-2-fill">
        使用 passkey 登录
      </ReusePlatformButton>
      <BaseButton :ghost="true" :small="true" @click="useRegisterModal">
        创建账号
      </BaseButton>
    </div>
    <hr>
    <div class="flex flex-wrap justify-center gap-1">
      <ReusePlatformButton platform="github" :click-handler="handleGitHubLogin" icon="i-mingcute-github-fill">
        GitHub
      </ReusePlatformButton>
      <ReusePlatformButton platform="google" :click-handler="handleGoogleLogin" icon="i-mingcute-google-fill">
        Google
      </ReusePlatformButton>
      <ReusePlatformButton platform="qq" :click-handler="handleQQLogin" icon="i-mingcute-qq-fill">
        QQ
      </ReusePlatformButton>
      <ReusePlatformButton platform="test" :click-handler="handleTestLogin" icon="i-mingcute-idcard-fill">
        12啊啊aas
      </ReusePlatformButton>
    </div>
  </div>
</template>

<style scoped>
hr {
  @apply border-none bg-gray-300 rounded-full;
  @apply my-2 w-full;
  @apply h-0.5;
}
</style>
