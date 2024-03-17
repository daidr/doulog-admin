<script setup lang="ts">
import Modal from './Modal.vue'
import type { ModalInfo } from './'

const props = defineProps<{
  modals: ModalInfo[]
}>()

const emit = defineEmits<{
  cancel: [modal: ModalInfo]
  confirm: [modal: ModalInfo]
  close: [modal: ModalInfo]
}>()

const maskVisible = computed(() => props.modals.length > 0)

const handleCancel = (modal: ModalInfo) => {
  emit('cancel', modal)
}

const handleConfirm = (modal: ModalInfo) => {
  emit('confirm', modal)
}

const handleClose = (modal: ModalInfo) => {
  if (!modal) return
  emit('close', modal)
}

const MaxTranslateValue = 15
const TranslateFactor = 2.1
const TranslateCache = new Map<number, number>()
const getTranslateValue = (index: number) => {
  if (TranslateCache.has(index)) {
    return TranslateCache.get(index)!
  }
  const value = -MaxTranslateValue * (1 - Math.pow(1 + 1 / TranslateFactor, -index))
  TranslateCache.set(index, value)
  return value
}

const MinScaleValue = 0.4
const ScaleFactor = 3
const ScaleCache = new Map<number, number>()
const getScaleValue = (index: number) => {
  if (ScaleCache.has(index)) {
    return ScaleCache.get(index)!
  }
  const value = MinScaleValue + (1 - MinScaleValue) * Math.pow(1 + 1 / ScaleFactor, -index)
  ScaleCache.set(index, value)
  return value
}

const MinFilterValue = 0.2
const FilterFactor = 2.9
const FilterCache = new Map<number, number>()
const getBrightnessValue = (index: number) => {
  if (FilterCache.has(index)) {
    return FilterCache.get(index)!
  }
  const value = MinFilterValue + (1 - MinFilterValue) * Math.pow(1 + 1 / FilterFactor, -index)
  FilterCache.set(index, value)
  return value
}

function onEscPressed(event: KeyboardEvent) {
  if (props.modals.length === 0) {
    return
  }
  if (event.key === 'Escape') {
    handleClose(props.modals[props.modals.length - 1])
  }
}

onMounted(() => {
  window.addEventListener('keydown', onEscPressed)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onEscPressed)
})

</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="maskVisible" class="modal-mask" />
    </Transition>
    <TransitionGroup name="modal" tag="div" class="modal-transition-group">
      <div v-for="(modal, index) of modals" :key="modal._id" class="transition-transform,filter fixed z-100 top-1/2 left-1/2" :style="{
        transform: `translateY(${getTranslateValue(modals.length - 1 - index)}vh) scale(${getScaleValue(modals.length - 1 - index)})`,
        filter: `brightness(${getBrightnessValue(modals.length - 1 - index)})`,
      }">
        <Modal :info="modal" @cancel="handleCancel(modal)" @confirm="handleConfirm(modal)" :class="{
        'pointer-events-none': index < modals.length - 1,
      }" />
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-mask {
  @apply bg-black/60 w-full h-full duration-700;
  @apply fixed top-0 left-0 z-99;
}

@media (prefers-reduced-motion: no-preference) {

  .modal-enter-active,
  .modal-leave-active {
    :deep(.common-modal-modal) {
      @apply transition duration-200;
    }
  }

  .modal-enter-from,
  .modal-leave-to {
    :deep(.common-modal-modal) {
      @apply opacity-0 transform-gpu translate-y-50;
    }
  }
}
</style>
