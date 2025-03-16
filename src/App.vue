<script setup lang="ts">
import { ModalContainer } from '@/composables/useModal'
import { ToastContainer } from '@/composables/useToast'
import BaseButton from './components/base/BaseButton.vue'
import MainNav from './components/MainNav.vue'
import VectorLogo from './components/VectorLogo.vue'

const router = useRouter()

const { userInfo, isFetching } = storeToRefs(useUserStore())
const route = useRoute()

const error = ref<Error | null>(null)
onMounted(() => {
  error.value = null
})
onErrorCaptured((err) => {
  error.value = err
})
function resetError() {
  error.value = null
}
router.afterEach(() => {
  resetError()
})
function goToHomepage() {
  router.push({ name: '/' })
}
</script>

<template>
  <ToastContainer />
  <ModalContainer />
  <div v-if="!route.meta.hideNav" class="fixed bottom-0 left-0 top-0 z-10">
    <MainNav />
  </div>
  <div
    class="min-h-100dvh" :class="{
      'sm:pl-18': !route.meta.hideNav,
    }"
  >
    <template v-if="error">
      <div class="relative h-100dvh w-full flex flex-col items-center justify-center gap-2 text-gray-600">
        <div class="i-mingcute-alert-diamond-fill text-4xl text-red-800" />
        <p class="text-xl text-red-800 font-bold">
          哎呀，发生了一些错误
        </p>
        <hr class="h-1.5px max-w-80vw w-300px bg-gray-300">
        <BaseButton ghost @click="goToHomepage">
          返回首页
        </BaseButton>
        <pre
          class="absolute bottom-40px max-w-[min(90vw,400px)] whitespace-pre-wrap break-all rounded-xl bg-gray-50 p-2 text-sm max-h-[calc(50dvh-40px-70px)] overflow-y-auto"
        >{{ error.stack }}</pre>
      </div>
    </template>
    <template v-else>
      <div v-if="isFetching" />
      <RouterView v-else-if="route.meta.skipAuth || (userInfo.isLogged)" v-slot="{ Component }">
        <Suspense timeout="0">
          <template #default>
            <component :is="Component" />
          </template>
          <template #fallback>
            <div class="h-100dvh w-full flex flex-col items-center justify-center gap-2 text-gray-600">
              <div class="i-mingcute-loading-3-line animate-spin text-5xl font-bold" />
              <p class="text-sm font-bold">
                请稍候
              </p>
            </div>
          </template>
        </Suspense>
      </RouterView>
      <div v-else class="h-100dvh w-full flex flex-col items-center justify-center gap-2 text-gray-600">
        <VectorLogo class="mx-auto h-32 w-32" />
        <p class="text-xl font-bold">
          DouLog Elysia Console
        </p>
        <p class="text-xl font-bold">
          你必须登录才能访问该页面
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
