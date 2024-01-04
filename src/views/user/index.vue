<template>
   <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item label="角色" prop="role">
          <el-select v-model="queryParams.role" placeholder="角色" filterable style='width: 120px' @change="handleQuery">
            <el-option v-for="dict in Role" :key="dict.value" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>
         <el-form-item label="账号" prop="username">
            <el-input v-model="queryParams.username" placeholder="账号" clearable style="width: 160px" @keyup.enter="handleQuery"/>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :height="tableHeight" :data="dataList">
        <el-table-column label="ID" prop="id" width="80"/>
        <el-table-column label="账号" prop="username" min-width="200"/>
        <el-table-column label="角色" prop="role" min-width="200">
          <template #default="scope"><dict-tag :options="Role" :value="scope.row.role"/></template>
        </el-table-column>
        <el-table-column label="操作" fixed='right' width="160" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

     <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.current"
         v-model:limit="queryParams.size"
         @pagination="getList"
     />

     <edit ref="editRef" @change="getList"/>
   </div>
</template>

<script setup name="User">
import {userPage, userRemove} from "@/api/user";
import Edit from "./components/edit"

import Role from "@/api/dict/Role.json"

const tableHeight = computed(() => window.innerHeight - 164);
const { proxy } = getCurrentInstance();

const dataList = ref([]);
const loading = ref(false);
const total = ref(0);

const queryParams = ref({
  start: 0,
  length: 10,
  role: -1,
  username: undefined,
});


/** 查询参数列表 */
function getList() {
  loading.value = true;
  userPage(queryParams.value).then(res => {
    dataList.value = res.data;
    // res.recordsFiltered
    total.value = res.recordsTotal;
  }).finally(() => {
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.start = 0;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

function handleAdd() {
  proxy.$refs["editRef"].handleEdit();
}
function handleUpdate(row) {
  proxy.$refs["editRef"].handleEdit(row);
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除:"' + row.username + '"？').then(() => {
    userRemove({id: row.id}).then(res => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
  }).catch(() => {});
}

getList();
</script>
