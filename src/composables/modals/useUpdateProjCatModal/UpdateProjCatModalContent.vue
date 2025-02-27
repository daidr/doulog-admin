<script setup lang="ts">
import type { ProjCatInfo } from '@/api/project'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'

defineProps<{
  cat: ProjCatInfo | Omit<ProjCatInfo, 'id'>
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'updateCat', updatedCat: Omit<ProjCatInfo, 'id'>): void
  (e: 'updateValid', isValid: boolean): void
}>()
const labelValid = ref(true)
const descValid = ref(true)

watchEffect(() => {
  emit('updateValid', labelValid.value && descValid.value)
})

function updateCat(newCat: Omit<ProjCatInfo, 'id'>) {
  emit('updateCat', newCat)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <BaseInput v-if="'id' in cat" :model-value="cat.id.toString()" label="ID" readonly />

    <BaseInput
      v-model:valid="labelValid" :model-value="cat.label" label="分类标签" :min="1"
      :max="40"
      :disabled="disabled"
      @update:model-value="(v) => updateCat({ ...cat, label: v })"
    />
    <BaseTextarea
      v-model:valid="descValid" :model-value="cat.desc" label="描述" :min="1"
      :disabled="disabled"
      @update:model-value="(v) => updateCat({ ...cat, desc: v })"
    />
  </div>
</template>

<style scoped></style>
