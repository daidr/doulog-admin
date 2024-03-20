<script setup lang="ts">
import { getUserList, type UserInfo } from '@/api/user';
import BaseBadge from '@/components/base/BaseBadge.vue';
import BaseEllipsisText from '@/components/base/BaseEllipsisText.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import UserNameCell from '@/components/user/UserNameCell.vue';
import UserPageEditMenu from '@/components/user/UserPageEditMenu.vue';
import UserRoleCell from '@/components/user/UserRoleCell.vue';

const userTableColumns = computed(() => [{
  label: '用户名',
  key: 'name',
  width: 'min(300px, 30vw)',
  fixed: true,
}, {
  label: '邮箱',
  key: 'email',
  width: 250,
}, {
  label: '主页',
  key: 'homepage',
  width: 250,
}, {
  label: '创建时间',
  key: 'createdAt',
  width: 200,
}, {
  label: '角色',
  key: 'is_admin',
  width: 120,
}, {
  label: '',
  key: '_action',
  width: 70,
  fixed: true,
}])

const loading = ref(true)
const total = ref(0)
const page = ref(1)
const size = ref(20)
const keyword = ref('')

const searchValue = ref('')

function handleSearch() {
  keyword.value = searchValue.value
}

const userList = shallowRef<UserInfo[]>([]);
let currentInstance: number = 0;

async function fetchData(_page: number, _size: number) {
  let _instance = currentInstance = Math.random()
  try {
    loading.value = true
    const result = await getUserList({
      keyword: keyword.value,
      page: _page,
      size: _size,
    })

    if (_instance !== currentInstance) return

    if (!result) return

    userList.value = result.list

    total.value = result.total
    page.value = _page
    size.value = _size
  } finally {
    if (_instance !== currentInstance) return

    loading.value = false
  }
}

watch(keyword, () => {
  fetchData(page.value, size.value)
}, { immediate: true })



function formatTime(time: number) {
  return useDateFormat(time * 1000, 'YYYY-MM-DD HH:mm:ss').value
}
</script>

<template>
  <div class="flex flex-col h-100dvh p-1">
    <div class="page-header">
      <BaseInput placeholder="搜索用户/邮箱" class="w-[min(400px,80vw)]" v-model="searchValue" @keyup.enter="handleSearch" />
    </div>
    <BaseTable :columns="userTableColumns" :data="userList" rowKey="id" scrollHeight="calc(100dvh - 45px - 48px - 48px)"
      scrollWidth="max(2500px, 100vw)" tableClass="ring-1 rounded-3 ring-gray-300 overflow-hidden" paginatorClass="pt-2"
      :paginator="{
        current: page,
        total,
        size,
        disabled: loading,
      }" @page-change="(page) => fetchData(page, size)" @size-change="(size) => fetchData(page, size)">
      <template #column-name="{ item }">
        <UserNameCell :user="item" />
      </template>
      <template #column-homepage="{ item }">
        <BaseEllipsisText>{{ item.homepage }}</BaseEllipsisText>
      </template>
      <template #column-createdAt="{ item }">
        <BaseEllipsisText>{{ formatTime(item.createdAt) }}</BaseEllipsisText>
      </template>
      <template #column-email="{ item }">
        <BaseEllipsisText>{{ item.email }}</BaseEllipsisText>
      </template>
      <template #column-is_admin="{ item }">
        <UserRoleCell :user="item" />
      </template>
      <template #column-_action="{ item }">
        <div class="flex justify-center">
          <UserPageEditMenu :user="item" />
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  @apply flex justify-end;
  @apply mb-2;
}
</style>

<route lang="json">{
  "meta": {
    "title": "用户管理"
  }
}</route>
