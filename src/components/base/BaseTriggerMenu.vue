<script setup lang="ts">
import BaseMenu, { type Menu } from '@/components/base/BaseMenu.vue'

defineProps<{
  menu: Menu
}>()
</script>

<template>
  <BaseMenu :menu="menu" position="right-top">
    <template #default="{ open }">
      <div
        class="cursor-pointer rounded-3 p-2 hover:bg-gray-200" :class="{
          'bg-gray-200': open,
        }"
      >
        <div class="i-mingcute-more-3-line text-lg" />
      </div>
    </template>
  </BaseMenu>
</template>

<style scoped></style>
