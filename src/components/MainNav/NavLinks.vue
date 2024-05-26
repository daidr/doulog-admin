<script setup lang="ts">
import { NAV_ITEMS } from '@/constants/nav';
import LinkItem from './LinkItem.vue';

const { userInfo } = storeToRefs(useUserStore())

const NavLinksRef = ref<HTMLElement | null>(null)

const { arrivedState } = useScroll(NavLinksRef, {

})

const showStartMask = computed(() => {
  return !arrivedState.top
})

const showEndMask = computed(() => {
  return !arrivedState.bottom
})
</script>

<template>
  <div v-if="userInfo.isLogged && userInfo.isAdmin" class="main-nav-links max-h-[calc(100%-100px)] flex-grow overflow-y-scroll" ref="NavLinksRef" :class="{
    'start-mask': showStartMask,
    'end-mask': showEndMask,
  }">
    <div class="flex pt-3 flex-col gap-3 w-full">
      <div v-for="category of NAV_ITEMS" :key="category.name + category.root">
        <p v-if="!category.root" class="text-xs text-gray-400 mb-1 text-center w-[var(--item-width)]">
          {{
          category.name
          }}</p>
        <div class="flex flex-col gap-1">
          <LinkItem v-for="item of category.items" :key="item.name" :to="item.to" activeHighlight>
            <div class="w-5 h-5" :class="item.icon"></div>
            <template #extra>
              {{ item.name }}
            </template>
          </LinkItem>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-nav-links {
  --show-start-mask: 0;
  --show-end-mask: 0;
  --mask-size: 24px;
  --gradient: linear-gradient(to bottom, transparent 0%, white calc(var(--show-start-mask) * var(--mask-size)), white calc(100% - calc(var(--mask-size)*var(--show-end-mask))), transparent 100%);
  -webkit-mask: var(--gradient);
  mask: var(--gradient);

  &.start-mask {
    --show-start-mask: 1;
  }

  &.end-mask {
    --show-end-mask: 1;
  }

  &::-webkit-scrollbar {
    width: 0;
  }

  scrollbar-width: none;
}
</style>
