<script setup lang="ts">
import type { PropType, SelectHTMLAttributes } from 'vue';

export interface BaseSelectOptionItem {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface BaseSelectOptionGroup {
  label: string;
  options: BaseSelectOptionItem[];
  disabled?: boolean;
}

interface BaseSelectProps extends /* @vue-ignore */ SelectHTMLAttributes {
  wrapperClass?: any;
  disabled?: boolean;
  options: (BaseSelectOptionItem | BaseSelectOptionGroup)[];
  size?: 'small' | 'medium' | 'large';
}

withDefaults(defineProps<BaseSelectProps>(), {
  disabled: false,
  size: 'medium',
})

const value = defineModel<string | number>()
</script>

<template>
  <div class="base-select" :class="[
    `size-${size}`,
    { disabled }
  ]">
    <select v-model="value">
      <template v-for="option of options" :key="option.label">
        <optgroup v-if="('options' in option)" :label="option.label" :disabled="option.disabled">
          <option v-for="item of option.options" :key="item.value" :value="item.value" :disabled="item.disabled">
            {{ item.label }}
          </option>
        </optgroup>
        <option v-else :value="option.value" :disabled="option.disabled">
          {{ option.label }}
        </option>
      </template>
    </select>
  </div>
</template>

<style scoped lang="scss">
.base-select {
  @apply relative;
  @apply ring-1 ring-gray-200;
  @apply flex items-center;
  @apply bg-white;
  @apply shadow-xl shadow-black/2;

  &.disabled {
    @apply pointer-events-none;
    @apply opacity-50;
  }

  &:hover,
  &:focus-within {
    @apply ring-gray-300;
  }

  select {
    @apply w-full outline-0 rounded-inherit;
    @apply bg-white;
  }

  &.size-small {
    @apply rounded-1 text-xs;

    select {
      @apply px-0.5 h-5;
    }
  }

  &.size-medium {
    @apply rounded-2 text-base;

    select {
      @apply px-1 h-7;
    }
  }

  &.size-large {
    @apply rounded-3 text-lg;

    select {
      @apply px-2 h-10;
    }
  }
}
</style>
