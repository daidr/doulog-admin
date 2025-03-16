<script setup lang="ts" generic="Item extends SettingItem">
import type { SettingItem } from '@/types/api'
import { app } from '@/api/elysia'
import BaseButton from '../base/BaseButton.vue'
import BaseInput from '../base/BaseInput.vue'
import BasePopover from '../base/BasePopover.vue'
import BaseTextarea from '../base/BaseTextarea.vue'
import BaseTooltip from '../base/BaseTooltip.vue'

const props = defineProps<{
  setting: Item
}>()

const model = defineModel<Item['default']>({ required: true })

const innerValue = ref<Item['default']>(model.value)

watch(() => model.value, (value) => {
  if (value !== innerValue.value) {
    innerValue.value = value
  }
}, {
  immediate: true,
})

const unsaved = computed(() => {
  return innerValue.value !== model.value
})

const valid = ref(false)

const alignClass = computed(() => {
  if (props.setting.type === 'string' && props.setting.multiline) {
    return 'sm-items-start'
  }
  return 'sm-items-center'
})

function resetValue() {
  innerValue.value = model.value
}

const isSaving = ref(false)

const { success } = useToast()

async function saveValue() {
  isSaving.value = true

  const { data } = await app.api.setting({ key: props.setting.key }).put({ value: innerValue.value })

  if (data) {
    success({ content: '保存成功' })
    model.value = data.value
  }
  isSaving.value = false
}
</script>

<template>
  <div class="flex flex-col gap-1 relative">
    <div class="flex gap-3 flex-col sm-flex-row" :class="[alignClass]">
      <div class="flex gap-1 flex-shrink-0 items-center relative">
        <span v-if="!setting.desc" class="text-lg">
          {{ setting.label }}
        </span>
        <BaseTooltip v-else :text="setting.desc" trigger="hover" position="bottom">
          <span class="underline-dotted underline underline-black/50 text-lg">{{ setting.label }}</span>
        </BaseTooltip>
        <div
          class="bg-orange-500 w-2 h-2 rounded-full transition-opacity absolute left--3 top-1/2 transform-gpu translate-y--1/2" :class="{
            'opacity-0': !unsaved,
          }"
        />
      </div>
      <BaseInput
        v-if="setting.type === 'string' && typeof innerValue === 'string' && !setting.multiline"
        v-model="innerValue" v-model:valid="valid" class="flex-grow" :type="setting.private ? 'password' : setting.type"
        :placeholder="setting.placeholder" :min="setting.minLength" :max="setting.maxLength" :pattern="setting.pattern"
      />
      <BaseTextarea
        v-if="setting.type === 'string' && typeof innerValue === 'string' && setting.multiline"
        v-model="innerValue" v-model:valid="valid" class="flex-grow" :type="setting.private ? 'password' : setting.type"
        :placeholder="setting.placeholder" :min="setting.minLength" :max="setting.maxLength"
      />
    </div>
    <Transition name="toolbar-fade">
      <div v-show="unsaved" class="flex gap-2 justify-end absolute bottom--7 right-0 toolbar-wrapper">
        <BaseTooltip text="重置到修改前的值" trigger="hover" position="bottom-right">
          <BaseButton ghost small :disabled="isSaving" @click="resetValue">
            <div class="i-mingcute-refresh-anticlockwise-1-line my-0.5" />
          </BaseButton>
        </BaseTooltip>
        <BaseTooltip text="保存修改" trigger="hover" position="bottom-right">
          <BaseButton ghost small :disabled="isSaving || !valid" @click="saveValue">
            <div v-if="!isSaving" class="i-mingcute-save-2-line my-0.5" />
            <div v-else class="i-mingcute-loading-3-fill my-0.5 animate-spin" />
          </BaseButton>
        </BaseTooltip>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@keyframes toolbar-appear {
  0% {
    opacity: 0;
    transform: translateY(-26px);
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.toolbar-fade-enter-active {
  animation: toolbar-appear 0.15s cubic-bezier(0.42, 0, 0.34, 1.68);
}

.toolbar-fade-leave-active {
  animation: toolbar-appear 0.15s reverse cubic-bezier(0.42, 0, 0.34, 1.68);
}
</style>
