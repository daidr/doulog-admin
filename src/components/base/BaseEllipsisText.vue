<script setup lang="ts">

</script>

<template>
  <div class="base-ellipsis-text">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-ellipsis-text {
  @apply overflow-hidden whitespace-nowrap text-ellipsis;
}
</style>
