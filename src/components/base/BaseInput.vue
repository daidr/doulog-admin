<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'

interface BaseInputProps extends /* @vue-ignore */ InputHTMLAttributes {
  max?: number
  min?: number
  pattern?: string
  wrapperClass?: any
  disabled?: boolean
  label?: string
}

const props = defineProps<BaseInputProps>()

const model = defineModel<string>({ default: '' })
const modelValid = defineModel<boolean>('valid', { default: true })

const compiledPattern = computed(() => {
  if (props.pattern) {
    return new RegExp(props.pattern)
  }
  return null
})

watch(() => model.value, () => {
  let temp = true
  if (typeof props.max === 'number') {
    temp = model.value.length <= props.max
  }

  if (typeof props.min === 'number') {
    temp = temp && model.value.length >= props.min
  }

  if (compiledPattern.value) {
    temp = temp && compiledPattern.value.test(model.value);
  }

  modelValid.value = temp
}, {
  immediate: true,
})

const LengthTextComp = defineComponent(textProps => () => h('div', {
  class: {
    'error': textProps.isError,
    'length-check-text': true,
  },
  title: textProps.text,
}, textProps.text.split('\n')[0]), {
  props: {
    isError: Boolean,
    text: String,
  },
})

const LengthCheckComp = defineComponent(() => {
  return () => {
    const nodes: VNode[] = []

    if (typeof props.max === 'number') {
      nodes.push(h(LengthTextComp, { isError: model.value.length > props.max, text: `${model.value.length}/${props.max}` }))
    }

    if (typeof props.min === 'number') {
      const error = model.value.length < props.min
      const node = h(LengthTextComp, { isError: error, text: `至少 ${props.min} 位` })
      if (error) {
        nodes.unshift(node)
      } else {
        nodes.push(node)
      }
    }

    if (compiledPattern.value) {
      const error = !compiledPattern.value.test(model.value);
      const node = h(LengthTextComp, { isError: error, text: `正则限制\n${props.pattern}` })
      if (error) {
        nodes.unshift(node)
      } else {
        nodes.push(node)
      }
    }

    return h('div', nodes)
  }
})
</script>

<template>
  <div class="wrapper">
    <div v-if="label" class="label">
      {{ label }}
    </div>
    <div class="base-input" :class="[wrapperClass, {
      disabled: props.disabled,
    }]">
      <input v-bind="$attrs" v-model="model" :disabled="disabled">
      <div class="h-0">
        <div v-if="typeof max === 'number' || typeof min === 'number' || props.pattern" class="length-check" :class="{
          [`height-level-${[typeof max === 'number', typeof min === 'number', typeof props.pattern === 'string'].filter(Boolean).length}`]: true,
        }">
          <LengthCheckComp />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.label {
  @apply text-gray-500;
  @apply text-base;
  @apply mb-1;
}

.base-input {
  @apply relative;
  @apply ring-1 ring-gray-200 rounded-xl;
  @apply flex items-center;
  @apply bg-white;

  &.disabled {
    @apply pointer-events-none;
    @apply opacity-50;
  }

  &:focus-within {
    @apply ring-gray-300;
    @apply shadow-xl shadow-black/2;
  }

  input {
    @apply rounded-xl;
    @apply w-full outline-0;
    @apply bg-white;
    @apply px-2 py-2;
  }

  input[type='color'] {
    @apply p-0 mx-2 my-1 h-8;
  }

  .length-check {
    @apply text-gray-400 bg-white text-center whitespace-nowrap z-2 relative transform-origin-r;
    @apply rounded-xl;
    @apply transform-gpu transition duration-300 -translate-y-1/2;
    transition-property: height, box-shadow, transform;

    &.height-level-1 {
      // 0.5rem padding + 1.5em line-height
      --total-height: calc(1.6em + 0.5rem);
    }

    &.height-level-2 {
      --total-height: calc(3.2em + 0.5rem);
    }

    &.height-level-3 {
      --total-height: calc(4.8em + 0.5rem);
    }

    :deep(.error) {
      @apply text-red-600 text-ellipsis min-w-0 overflow-hidden;
    }

    @apply h-[calc(1.6em+0.5rem)] overflow-hidden;
    @apply py-1 px-2 flex-shrink-0;

    &:hover {
      @apply shadow-lg scale-150 ring-1 ring-gray-200;
      @apply h-[var(--total-height)];
    }
  }
}
</style>
