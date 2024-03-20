<script setup lang="ts">
import type { InputHTMLAttributes, PropType } from 'vue';

interface BaseInputProps extends /* @vue-ignore */ InputHTMLAttributes {
  max?: number;
  min?: number;
  wrapperClass?: any;
  disabled?: boolean;
}

const props = defineProps<BaseInputProps>()

const model = defineModel<string>()
</script>

<template>
  <div class="base-input" :class="[wrapperClass, {
    'disabled': props.disabled,
  }]">
    <input v-bind="$attrs" v-model="model" :disabled="disabled" />
    <div class="h-0">
      <div class="length-check" v-if="typeof max === 'number' || typeof min === 'number'" :class="{
    [`height-level-${[typeof max === 'number', typeof min === 'number'].filter(Boolean).length}`]: true
  }">
        <LengthCheckComp />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-input {
  @apply relative;
  @apply ring-1 ring-gray-200 rounded-xl;
  @apply flex items-center;
  @apply bg-white;
  @apply shadow-xl shadow-black/2;

  &.disabled {
    @apply pointer-events-none;
    @apply opacity-50;
  }

  &:focus-within {
    @apply ring-gray-300;
  }

  input {
    @apply rounded-xl;
    @apply w-full outline-0;
    @apply bg-white;
    @apply px-2 py-2;
  }

  .length-check {
    @apply text-gray-400 bg-white text-center whitespace-nowrap;
    @apply rounded-xl;
    @apply transform-gpu transition duration-300 -translate-y-1/2;
    transition-property: height, box-shadow, transform;

    &.height-level-1 {
      --total-height: calc(1.6em + 0.5rem);
    }

    &.height-level-2 {
      --total-height: calc(1.6em + 0.5rem + 1.6em);
    }

    :deep(.error) {
      @apply text-red-600;
    }

    @apply h-[calc(1.6em+0.5rem)] overflow-hidden;
    @apply py-1 px-2 flex-shrink-0;

    &:hover {
      @apply shadow-xl scale-150 ring-1 ring-gray-200;
      @apply h-[var(--total-height)];
    }
  }
}
</style>
