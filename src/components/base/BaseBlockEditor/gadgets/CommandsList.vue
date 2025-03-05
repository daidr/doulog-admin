<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  items: any[];
  command: (item: any) => void;
}>();

const selectedIndex = ref(0);

watch(() => props.items, () => {
  selectedIndex.value = 0;
});

const itemsWithInsertCommand = computed(() => {
  return props.items.filter((item) => item.insertCommand);
});

function upHandler() {
  selectedIndex.value =
    (selectedIndex.value + props.items.length - 1) % props.items.length;
};

function downHandler() {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
};

function enterHandler() {
  selectItem(selectedIndex.value);
};

function selectItem(index: number) {
  const item = itemsWithInsertCommand.value[index];
  if (item) {
    props.command(item);
  }
}

function onKeyDown({ event }) {
  if (event.key === "ArrowUp") {
    upHandler();
    return true;
  }

  if (event.key === "ArrowDown") {
    downHandler();
    return true;
  }

  if (event.key === "Enter") {
    enterHandler();
    return true;
  }

  return false;
};

defineExpose({
  onKeyDown
});
</script>


<template>
  <div class="bg-white border border-slate-400 rounded overflow-hidden shadow">
    <template v-if="items.length">
      <button class="flex flex-row gap-2 items-center w-full p-2 pr-12 text-slate-600 hover:bg-slate-50 text-sm"
        :class="{ 'bg-slate-100': index === selectedIndex }" v-for="(item, index) in itemsWithInsertCommand"
        :key="index" @click.prevent="selectItem(index)">
        <span v-html="item.icon"></span>
        {{ item.title }}
      </button>
    </template>
    <div class="p-2 text-slate-600 text-sm w-full" v-else>No result</div>
  </div>
</template>
