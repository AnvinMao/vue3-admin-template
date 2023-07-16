<script setup lang="ts">
defineOptions({
  name: "UserList",
  inheritAttrs: false,
});

import { UserQuery, UserVO } from "@/api/user/type";

const loading = ref(true);
const total = ref(0);
const queryForm = ref(ElForm);
const userList = ref<UserVO[]>();
const userQuery = reactive<UserQuery>({
  page: 1,
  pageSize: 20,
});

const fetchData = () => {
  loading.value = true;
  const list: UserVO[] = [];
  for (let i = 0; i < 20; i++) {
    const user: UserVO = {
      id: i + 1,
      name: `User${i}`,
      status: 1,
      email: "anvinxl_mao@hotmail.com",
      phone: "18892839028",
      createTime: new Date(),
    };

    list.push(user);
  }

  userList.value = list;
  total.value = 100;

  loading.value = false;
};

const handleEdit = (row: UserVO) => {
  console.log(row);
};

const handleDelete = (row: UserVO) => {
  console.log(row);
};

const handleQuery = () => {
  console.log(userQuery);
};

const resetQuery = () => {
  queryForm.value.resetFields();
  userQuery.page = 1;
  handleQuery();
};

onMounted(() => {
  setTimeout(() => fetchData(), 3000);
});
</script>

<template>
  <div class="app-container">
    <div class="wrapper important-pb-0">
      <el-form ref="queryForm" :model="userQuery" :inline="true">
        <el-form-item prop="name" label="用户名称">
          <el-input v-model="userQuery.name" placeholder="用户名称" clearable />
        </el-form-item>
        <el-form-item prop="dateTime" label="注册时间">
          <el-date-picker
            v-model="userQuery.dateTime"
            type="datetimerange"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            range-separator="-"
            format="YYYY-MM-DD hh:mm:ss"
            value-format="x"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon>
              <i-ep-search />
            </template>
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <template #icon>
              <i-ep-refresh />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="wrapper mt-4">
      <el-table
        v-loading="loading"
        :data="userList"
        highlight-current-row
        element-loading-text="loading..."
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" min-width="80" />
        <el-table-column label="用户名称" prop="name" min-width="120" />
        <el-table-column label="电子邮箱" prop="email" min-width="200" />
        <el-table-column label="联系电话" prop="phone" min-width="140" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" min-width="180">
          <template #default="scope">
            <i-ep-clock /> {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">
              <template #icon>
                <i-ep-edit />
              </template>
              编辑
            </el-button>
            <el-button type="primary" link @click="handleDelete(scope.row)">
              <template #icon>
                <i-ep-delete />
              </template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="userQuery.page"
        v-model:limit="userQuery.pageSize"
        layout="total, prev, pager, next"
        @pagination="handleQuery"
      />
    </div>
  </div>
</template>
