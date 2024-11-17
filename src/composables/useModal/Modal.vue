<script setup lang="ts">
import { toValue } from 'vue';
import type { ModalInfo } from '.'
import BaseButton from '@/components/base/BaseButton.vue';
import { RenderComponent } from '@/utils/comp';

defineProps<{
  info: ModalInfo
}>()

defineEmits(['cancel', 'confirm'])

</script>

<template>
  <div class="common-modal">
    <div class="common-modal-modal">
      <div v-if="info.title || !toValue(info.hideClose)" class="flex justify-between">
        <div v-if="info.title" class="p-1.5 bg-gray-300 flex self-start items-center gap-1 rounded-full text-gray-800">
          <div v-if="info.icon" class="text-2xl h-6 lh-150%" :class="[toValue(info.icon)]"></div>
          <RenderComponent :node="info.title" className="font-extrabold h-6 pr-0.5 lh-150%" />
        </div>
        <div v-if="!toValue(info.hideClose)" class="common-modal-close-btn transition-shadow,colors"
          @click="$emit('cancel')">
          <div class="i-mingcute-close-fill"></div>
        </div>
        <div v-else></div>
      </div>
      <template v-if="info.content">
        <RenderComponent :node="info.content" className="text-center font-bold text-xl" />
      </template>
      <div
        v-if="!toValue(info.hideCancel) || !toValue(info.hideConfirm) || (!toValue(info.hideCustomTools) && info.customTools)"
        class="flex justify-end gap-5 items-center">
        <RenderComponent v-if="info.customTools" :node="info.customTools" className="" />
        <BaseButton v-if="!toValue(info.hideCancel)" @click="$emit('cancel')"
          :disabled="toValue(info.loading) || toValue(info.disabledCancel)" :ghost="true">
          {{ toValue(info.cancelText) || 'Cancel' }}
        </BaseButton>
        <BaseButton v-if="!toValue(info.hideConfirm)" @click="$emit('confirm')" :loading="toValue(info.loading)"
          :disabled="toValue(info.disabledConfirm)">
          {{ toValue(info.confirmText) || 'OK' }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.common-modal {
  @apply select-none duration-200;
  @apply max-w-[min(1024px\,calc(100vw-20px))] min-w-[min(350px\,calc(100vw-20px))];
  @apply fixed top-1/2 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2;

  .common-modal-modal {
    @apply bg-light rounded-6 p-5 text-gray-700;
    @apply ring-1 ring-gray-300;
    @apply max-h-[calc(100dvh-20px)] min-h-0;
    @apply shadow-xl;
    @apply flex flex-col gap-3;
  }

  .common-modal-close-btn {
    @apply bg-gray-300 w-36px h-36px rounded-full flex items-center justify-center text-gray-800 cursor-pointer;
    @apply ring-1 ring-transparent;

    &:hover {
      @apply shadow-xl ring-gray-400;
    }

    &:active {
      @apply bg-gray-400;
    }

    &.disabled {
      @apply opacity-70 pointer-events-none;
    }
  }
}
</style>
