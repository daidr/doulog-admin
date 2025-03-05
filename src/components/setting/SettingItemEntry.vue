<script setup lang="ts" generic="Item extends SettingItem">
import type { SettingItem } from '@/types/api'
import BasePopover from '../base/BasePopover.vue'
import BaseInput from '../base/BaseInput.vue';
import BaseTextarea from '../base/BaseTextarea.vue';
import BaseButton from '../base/BaseButton.vue';
import BaseTooltip from '../base/BaseTooltip.vue';
import { app } from '@/api/elysia';

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
  isSaving.value = false;
}
</script>

<template>
  <div class="flex flex-col gap-1 relative">
    <div class="flex gap-3 flex-col sm-flex-row" :class="[alignClass]">
      <div class="flex gap-1 flex-shrink-0 items-center relative">
        <span v-if="!setting.desc" class="text-lg">
          {{ setting.label }}
        </span>
        <BaseTooltip :text="setting.desc" v-else trigger="hover" position="bottom">
          <span class="underline-dotted underline underline-black/50 text-lg">{{ setting.label }}</span>
        </BaseTooltip>
        <div class="bg-orange-500 w-2 h-2 rounded-full transition-opacity absolute left--3 top-1/2 transform-gpu translate-y--1/2" :class="{
          'opacity-0': !unsaved,
        }"></div>
      </div>
      <BaseInput v-if="setting.type === 'string' && typeof innerValue === 'string' && !setting.multiline"
        class="flex-grow" v-model="innerValue" :type="setting.type" :placeholder="setting.placeholder"
        :min="setting.minLength" :max="setting.maxLength" :pattern="setting.pattern" v-model:valid="valid" />
      <BaseTextarea v-if="setting.type === 'string' && typeof innerValue === 'string' && setting.multiline"
        class="flex-grow" v-model="innerValue" :type="setting.type" :placeholder="setting.placeholder"
        :min="setting.minLength" :max="setting.maxLength" v-model:valid="valid" />
    </div>
    <Transition name="toolbar-fade">
      <div v-show="unsaved" class="flex gap-2 justify-end absolute bottom--7 right-0 toolbar-wrapper">
        <BaseTooltip text="重置到修改前的值" trigger="hover" position="bottom-right">
          <BaseButton @click="resetValue" ghost small :disabled="isSaving">
            <div class="i-mingcute-refresh-anticlockwise-1-line my-0.5"></div>
          </BaseButton>

        </BaseTooltip>
        <BaseTooltip text="保存修改" trigger="hover" position="bottom-right">
          <BaseButton @click="saveValue" ghost small :disabled="isSaving || !valid">
            <div v-if="!isSaving" class="i-mingcute-save-2-line my-0.5"></div>
            <div v-else class="i-mingcute-loading-3-fill my-0.5 animate-spin"></div>
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
