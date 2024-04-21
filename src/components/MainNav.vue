<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core';
import LinkItem from './MainNav/LinkItem.vue';
import NavLinks from './MainNav/NavLinks.vue';
import UserItem from './MainNav/UserItem.vue';

const MainNavWrapperRef = ref<HTMLElement | null>(null)
const MainNavRef = ref<HTMLElement | null>(null)
const MainNavContentRef = ref<HTMLElement | null>(null)

const isMouseEnter = ref(false)
const breakpoints = useBreakpoints(breakpointsTailwind)
const smAndSmaller = breakpoints.smallerOrEqual('sm')

const showOnMobile = ref(false)

const isNavExpanded = computed(() => {
  return smAndSmaller.value || isMouseEnter.value
})
const maxContentWidth = ref(0)

useEventListener(MainNavRef, 'mouseenter', (_evt) => {
  if (!MainNavContentRef.value) return
  isMouseEnter.value = true
})

useEventListener(MainNavRef, 'mouseleave', (_evt) => {
  isMouseEnter.value = false
})

onClickOutside(MainNavWrapperRef, () => {
  if (smAndSmaller.value && showOnMobile.value) {
    showOnMobile.value = false
  }
})

onUpdated(() => {
  if (!isNavExpanded.value) return
  if (!MainNavContentRef.value) return
  console.log('updated')
  maxContentWidth.value = MainNavContentRef.value!.clientWidth + 8
})

const route = useRoute()
</script>

<template>
  <div class="relative h-[calc(100%-0.5rem)] transition-margin duration-300" :style="{
    '--content-width': isNavExpanded ? maxContentWidth + 'px' : undefined,
    'margin-left': smAndSmaller && !showOnMobile ? `-${maxContentWidth + 4}px` : undefined,
  }" ref="MainNavWrapperRef">
    <div v-if="smAndSmaller" class="mobile-button" @click.prevent="showOnMobile = !showOnMobile">
      <div v-if="showOnMobile" class="i-mingcute-arrows-left-line"></div>
      <div v-else class="i-mingcute-arrows-right-line"></div>
    </div>
    <nav class="main-nav" ref="MainNavRef" :class="{
      'expanded': isNavExpanded,
      'shadow-xl': showOnMobile || (!smAndSmaller && isNavExpanded),
    }">
      <div class="w-max h-full flex flex-col justify-between" ref="MainNavContentRef">
        <div class="max-h-[calc(100%-60px)] flex-grow flex flex-col">
          <LinkItem to="/">
            <img src="@/assets/images/logo-head.png" class="w-11 h-11" />
            <template #extra>
              <p class="text-base font-bold">DouLog 管理面板</p>
              <p class="text-xs">{{ route.meta.title }}</p>
            </template>
          </LinkItem>
          <NavLinks />
        </div>
        <div>
          <UserItem />
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.mobile-button {
  @apply absolute right-0 bottom-10 transform-gpu translate-x-full;
  @apply ring-1 ring-gray-300 rounded-r-lg;
  @apply bg-gray-50 text-lg;
  @apply cursor-pointer p-1 m-1 pl-3;

  &:hover {
    @apply bg-gray-100;
  }
}

@keyframes delay-hide {
  0% {
    opacity: 1;
    width: auto;
    padding-right: 1rem;
  }

  75% {
    padding-right: 0;
    opacity: 0;
    width: auto;
  }

  99% {
    opacity: 0;
    width: auto;
  }

  100% {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }
}

.main-nav {
  --normal-width: 4rem;
  --padding: 0.25rem;
  --item-width: calc(var(--normal-width) - var(--padding) * 2);

  @apply h-full w-[var(--normal-width)] m-1 p-[var(--padding)];
  @apply relative select-none;
  @apply bg-gray-50 ring-1 ring-gray-300;
  @apply rounded-lg overflow-hidden;
  @apply flex flex-col;
  @apply transition-width duration-300;

  :deep(.item-size) {
    @apply w-[var(--item-width)] py-2;
  }

  :deep(.hide-on-collapse) {
    @apply whitespace-nowrap;
    animation: delay-hide 0.2s forwards;
  }

  &.expanded {
    @apply w-[var(--content-width)];

    :deep(.hide-on-collapse) {
      animation: none;
      padding-right: 1rem;
    }
  }
}
</style>
