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
    <div class="common-modal-wrapper">
      <div class="max-w-screen-lg min-w-350px">
        <div class="common-modal-modal flex flex-col gap-3">
          <div v-if="info.title" class="p-1 bg-gray-300 flex self-start items-center gap-1 rounded-full text-gray-800">
            <div v-if="info.icon" class="text-2xl lh-0" :class="[toValue(info.icon)]"></div>
            <RenderComponent :node="info.title" className="font-extrabold pr-1 lh-0" />
          </div>
          <template v-if="info.content">
            <RenderComponent :node="info.content" className="text-center font-bold text-xl" />
          </template>
          <div class="flex justify-end gap-5 mt-5">
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.common-modal {
  @apply z-100 transition-transform fixed top-0 left-0 right-0 bottom-0 select-none duration-150;
  transition-property: transform, filter;

  .common-modal-wrapper {
    @apply fixed top-0 left-0 right-0 bottom-0 px-5;
    @apply flex justify-center items-center;
  }

  .common-modal-modal {
    @apply bg-light rounded-6 p-5 text-gray-700;
    @apply border-1 border-gray-300;
    @apply shadow-xl;
  }
}
</style>
