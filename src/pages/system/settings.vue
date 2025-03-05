<script setup lang="ts">
import type { ElysiaResp } from '@/utils/elysia.util'
import { app } from '@/api/elysia'
import BasePopover from '@/components/base/BasePopover.vue'
import BaseTooltip from '@/components/base/BaseTooltip.vue'
import SettingItemEntry from '@/components/setting/SettingItemEntry.vue'

type SettingResp = ElysiaResp<typeof app.api.setting.get>

const settings = ref<SettingResp['settings'] | null>(null)
const settingValues = ref<SettingResp['settingValues'] | null>(null)

onMounted(async () => {
  const { data, error } = await app.api.setting.get()
  if (error) throw error

  const { settings: fetchedSettings, settingValues: fetchedSettingValues } = data!
  settings.value = fetchedSettings
  settingValues.value = fetchedSettingValues
})
</script>

<template>
  <div v-if="settings && settingValues" class="flex flex-col gap-6 pr-4 pl-8 pb-2">
    <div v-for="category of settings" :key="category.key" class="category bg-white space-y-6">
      <h1 class="sticky top-0 flex items-center gap-2 bg-white text-2xl font-500 z-8 py-4 border-b-2 border-gray-100">
        <div v-if="category.icon" :class="category.icon" class="text-4xl" />
        <template v-if="!category.desc">
          {{ category.label }}
        </template>
        <BaseTooltip v-else trigger="hover" position="bottom" :text="category.desc">
          {{ category.label }}
        </BaseTooltip>
      </h1>
      <div class="flex flex-col gap-8 max-w-[min(95vw,600px)]">
        <div v-for="setting of category.items" :key="setting.key">
          <SettingItemEntry v-model="settingValues[setting.key]" :setting="setting" />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="h-100dvh w-full flex flex-col items-center justify-center gap-2 text-gray-600">
    <div class="i-mingcute-loading-3-line animate-spin text-5xl font-bold" />
    <p class="text-sm font-bold">
      请稍候
    </p>
  </div>
</template>

<style scoped></style>

<route lang="json">
{
  "meta": {
    "title": "站点设置"
  }
}
</route>
