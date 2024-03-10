<script setup lang="ts">
import MainNav from './components/MainNav.vue';
</script>

<template>
  <div class="fixed left-0 bottom-0 top-0 z-10">
    <MainNav />
  </div>
  <div class="w-100vw min-h-100dvh sm:pl-18">
    <RouterView />
  </div>
</template>

<style scoped></style>
