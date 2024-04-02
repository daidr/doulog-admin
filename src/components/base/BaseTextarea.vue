<script setup lang="ts">
import type { TextareaHTMLAttributes } from 'vue';

interface BaseTextareaProps extends /* @vue-ignore */ TextareaHTMLAttributes {
  max?: number;
  min?: number;
  wrapperClass?: any;
  disabled?: boolean;
}

const props = defineProps<BaseTextareaProps>()

const model = defineModel<string>({ default: '' })
const modelValid = defineModel<boolean>('valid', { default: true })

watch(() => model.value, () => {
  let temp = true;
  if (typeof props.max === 'number') {
    temp = model.value.length <= props.max;
  }

  if (typeof props.min === 'number') {
    temp = temp && model.value.length >= props.min;
  }

  modelValid.value = temp;
}, {
  immediate: true
})

const LengthTextComp = defineComponent((textProps) => () => h('div', {
  class: {
    'error': textProps.isError,
    'length-check-text': true,
  }
}, textProps.text), {
  props: {
    isError: Boolean,
    text: String
  }
})

const LengthCheckComp = defineComponent(() => {
  return () => {
    const nodes: VNode[] = [];

    if (typeof props.max === 'number') {
      nodes.push(h(LengthTextComp, { isError: model.value.length > props.max, text: `${model.value.length}/${props.max}` }))
    }


    if (typeof props.min === 'number') {
      const error = model.value.length < props.min;
      const node = h(LengthTextComp, { isError: error, text: `min: ${props.min}` });
      if (error) {
        nodes.unshift(node);
      } else {
        nodes.push(node);
      }
    }


    return h('div', nodes);
  }
})
</script>

<template>
  <div class="base-input" :class="[wrapperClass, {
    'disabled': props.disabled,
  }]">
    <textarea v-bind="$attrs" v-model="model" :disabled="disabled" />
    <div class="absolute bottom-0 left-0 h-[calc(1.6em+0.5rem)]">
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
  @apply bg-white;
  @apply shadow-xl shadow-black/2;

  &.disabled {
    @apply pointer-events-none;
    @apply opacity-50;
  }

  &:focus-within {
    @apply ring-gray-300;
  }

  textarea {
    @apply rounded-xl block;
    @apply w-full outline-0;
    @apply bg-white;
    @apply px-2 py-2 pb-[calc(0.5rem+1.6em+0.5rem)];
    @apply min-h-[calc(3rem+1.6em+0.5rem)];
  }

  .length-check {
    @apply text-gray-400 bg-white/80 text-center whitespace-nowrap;
    @apply rounded-xl;
    @apply transition duration-300;
    transition-property: height, box-shadow, transform, background-color;

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
      @apply bg-white;
      @apply h-[var(--total-height)];
    }
  }
}
</style>
