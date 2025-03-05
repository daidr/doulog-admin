<script setup lang="ts">
import type { CategoryResp } from '@/pages/categories.vue'
import BaseInput from '@/components/base/BaseInput.vue'

defineProps<{
  tag: Pick<CategoryResp[number], '_id' | 'name' | 'slug'> | Pick<CategoryResp[number], 'name' | 'slug'>
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'updateTag', updatedTag: Pick<CategoryResp[number], '_id' | 'name' | 'slug'> | Pick<CategoryResp[number], 'name' | 'slug'>): void
  (e: 'updateValid', isValid: boolean): void
}>()
const labelValid = ref(true)
const slugValid = ref(true)
const colorValid = ref(true)

watchEffect(() => {
  emit('updateValid', labelValid.value && slugValid.value && colorValid.value)
})

function updateTag(newTag: Pick<CategoryResp[number], '_id' | 'name' | 'slug'> | Pick<CategoryResp[number], 'name' | 'slug'>) {
  emit('updateTag', newTag)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <BaseInput v-if="'_id' in tag" :model-value="tag._id.toString()" label="ID" readonly />
    <BaseInput
      v-model:valid="labelValid" :model-value="tag.name" label="名称"
      :disabled="disabled"
      @update:model-value="(v) => updateTag({ ...tag, name: v })"
    />
    <BaseInput
      v-model:valid="slugValid" :model-value="tag.slug" label="Slug"
      :disabled="disabled"
      @update:model-value="(v) => updateTag({ ...tag, slug: v })"
    />
  </div>
</template>

<style scoped></style>
