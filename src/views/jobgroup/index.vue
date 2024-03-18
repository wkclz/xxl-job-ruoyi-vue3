<template>
   <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
       <el-form-item label="AppName" prop="appname">
         <el-input v-model="queryParams.appname" placeholder="AppName" clearable style="width: 160px" @keyup.enter="handleQuery"/>
       </el-form-item>
       <el-form-item label="名称" prop="title">
         <el-input v-model="queryParams.title" placeholder="名称" clearable style="width: 160px" @keyup.enter="handleQuery"/>
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
        <el-table-column label="AppName" prop="appname" min-width="200"/>
        <el-table-column label="名称" prop="title" min-width="120"/>
        <el-table-column label="注册方式" prop="addressType" min-width="100">
          <template #default="scope"><dict-tag :options="AddressType" :value="scope.row.addressType"/></template>
        </el-table-column>
        <el-table-column label="OnLine 机器地址" prop="registryList" min-width="200">
          <template #default="scope">
            <div>
              <el-tag v-for="item in scope.row.registryList">{{item}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed='right' width="160">
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

<script setup name="Jobgroup">
import {jobgroupPage, jobgroupRemove} from "@/api/jobgroup";
import Edit from "./components/edit"
import AddressType from "@/api/dict/AddressType.json"

const tableHeight = computed(() => window.innerHeight - 164);
const { proxy } = getCurrentInstance();

const dataList = ref([]);
const loading = ref(false);
const total = ref(0);

const queryParams = ref({
  start: 0,
  length: 10,
  appname: '',
  title: '',
});


/** 查询参数列表 */
function getList() {
  loading.value = true;
  jobgroupPage(queryParams.value).then(res => {
    dataList.value = res.data;
    // res.recordsFiltered
    total.value = res.recordsTotal;
  }).finally(() => {
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.current = 0;
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
  proxy.$modal.confirm('是否确认删除:"' + row.appname + '"？').then(() => {
    jobgroupRemove({id: row.id}).then(res => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
  }).catch(() => {});
}

getList();
</script>
