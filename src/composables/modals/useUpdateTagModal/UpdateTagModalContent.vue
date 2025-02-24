<script setup lang="ts">
import type { TagInfo } from '@/api/tag'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTagBadge from '@/components/base/BaseTagBadge.vue'

defineProps<{
  tag: TagInfo | Omit<TagInfo, 'id'>
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'updateTag', updatedTag: Omit<TagInfo, 'id'>): void
  (e: 'updateValid', isValid: boolean): void
}>()
const labelValid = ref(true)
const slugValid = ref(true)
const colorValid = ref(true)

watchEffect(() => {
  emit('updateValid', labelValid.value && slugValid.value && colorValid.value)
})

function updateTag(newTag: Omit<TagInfo, 'id'>) {
  emit('updateTag', newTag)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col items-center gap-2 border-1.5 border-gray rounded-2xl p-2">
      <p class="select-none text-center opacity-70">
        标签预览
      </p>
      <BaseTagBadge :label="tag.label || '标签'" :color="tag.color" />
    </div>
    <BaseInput v-if="'id' in tag" :model-value="tag.id.toString()" label="ID" readonly />
    <BaseInput
      v-model:valid="slugValid" :model-value="tag.slug" label="Slug" :min="1"
      :max="255"
      :disabled="disabled"
      @update:model-value="(v) => updateTag({ ...tag, slug: v })"
    />
    <BaseInput
      v-model:valid="labelValid" :model-value="tag.label" label="标签" :min="1"
      :max="40"
      :disabled="disabled"
      @update:model-value="(v) => updateTag({ ...tag, label: v })"
    />
    <BaseInput
      v-model:valid="colorValid" :model-value="tag.color" label="颜色"
      type="color"
      :disabled="disabled"
      @update:model-value="(v) => updateTag({ ...tag, color: v })"
    />
  </div>
</template>

<style scoped></style>
