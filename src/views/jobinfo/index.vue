<template>
   <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true">
       <el-form-item label="执行器" prop="jobGroup">
         <el-select v-model="queryParams.jobGroup" placeholder="执行器" filterable style='width: 200px' @change="handleQuery">
           <el-option v-for="item in appOptions" :key="item.id" :label="item.title" :value="item.id"/>
         </el-select>
       </el-form-item>
       <el-form-item label="状态" prop="triggerStatus">
         <el-select v-model="queryParams.triggerStatus" placeholder="状态" filterable style='width: 100px' @change="handleQuery">
           <el-option v-for="dict in TriggerStatus" :key="dict.value" :label="dict.label" :value="dict.value"/>
         </el-select>
       </el-form-item>
       <el-form-item label="任务描述" prop="jobDesc">
         <el-input v-model="queryParams.jobDesc" placeholder="任务描述" clearable style="width: 160px" @keyup.enter="handleQuery"/>
       </el-form-item>
       <el-form-item label="Hander" prop="executorHandler">
         <el-input v-model="queryParams.executorHandler" placeholder="JobHander" clearable style="width: 160px" @keyup.enter="handleQuery"/>
       </el-form-item>
       <el-form-item label="负责人" prop="author">
         <el-input v-model="queryParams.author" placeholder="负责人" clearable style="width: 120px" @keyup.enter="handleQuery"/>
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
       <el-table-column label="任务描述" prop="jobDesc" min-width="200"/>
       <el-table-column label="调度类型" prop="jobDesc" min-width="200">
         <template #default="scope">
           <span>{{scope.row.scheduleType}}: {{scope.row.scheduleConf}}</span>
         </template>
       </el-table-column>
       <el-table-column label="运行模式" prop="jobDesc" min-width="200">
         <template #default="scope">
           <div>
             <span v-if="scope.row.glueType !== 'BEAN'"><dict-tag :options="GlueType" :value="scope.row.glueType"/></span>
             <span v-if="scope.row.glueType === 'BEAN'">{{scope.row.glueType}}: {{scope.row.executorHandler}}</span>
           </div>
         </template>
       </el-table-column>
       <el-table-column label="负责人" prop="author" min-width="120"/>
       <el-table-column label="状态" prop="triggerStatus" width="80" fixed='right'>
         <template #default="scope">
           <el-switch v-model="scope.row.triggerStatus" active-value="1" inactive-value="0" @click="changeTriggerStatus(scope.row)"/>
         </template>
       </el-table-column>

       <el-table-column label="操作" fixed='right' width="288">
         <template #default="scope">
           <el-button link type="primary" icon="VideoPlay" @click="handleExec(scope.row)">执行</el-button>
           <el-button link type="primary" icon="Notebook" @click="handleLog(scope.row)">日志</el-button>
           <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
           <el-dropdown @command="(command) => handleCommand(command, scope.row)" trigger="hover">
             <el-button link type="primary" icon="el-icon-d-arrow-right">更多<el-icon><DArrowRight /></el-icon></el-button>
             <template #dropdown>
               <el-dropdown-item command="handleCopy" icon="DocumentCopy">复制</el-dropdown-item>
               <el-dropdown-item command="handleReg" icon="Promotion">注册节点</el-dropdown-item>
               <el-dropdown-item command="handleNexttime" icon="Clock">下次执行时间</el-dropdown-item>
               <el-dropdown-item command="handleGlueIde" icon="Edit" v-if="scope.row.glueType !== 'BEAN'">GLUE IDE</el-dropdown-item>
               <el-dropdown-item command="handleDelete" icon="DeleteFilled">删除</el-dropdown-item>
             </template>
           </el-dropdown>
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
     <exec ref="execRef"/>
     <reg ref="regRef"/>
     <next-tigger-time ref="nextTiggerTimeRef"/>
     <glue-ide ref="glueIdeRef"/>
   </div>
</template>

<script setup name="Jobinfo">
import {jobinfoPage, jobinfoRemove, jobinfoStart, jobinfoStop} from "@/api/jobinfo";
import {jobgroupPage} from "@/api/jobgroup";
import Edit from "./components/edit"
import GlueIde from "./components/glueIde.vue"
import Exec from "./components/exec"
import Reg from "./components/reg"
import GlueType from "@/api/dict/GlueType.json"
import TriggerStatus from "@/api/dict/TriggerStatus.json"
import NextTiggerTime from "./components/nextTiggerTime.vue"


const tableHeight = computed(() => window.innerHeight - 164);
const { proxy } = getCurrentInstance();
const router = useRouter();

const appOptions = ref([]);
const dataList = ref([]);
const loading = ref(false);
const total = ref(0);

const queryParams = ref({
  start: 0,
  length: 10,
  jobGroup: 1,
  triggerStatus: -1,
  jobDesc: '',
  executorHandler: '',
  author: '',
});

function init() {
  getApps();
}

function getApps() {
  jobgroupPage({start: 0,length: 10000}).then(res => {
    appOptions.value = res.data;
    if (appOptions.value && appOptions.value.length > 0) {
      queryParams.value.jobGroup = appOptions.value[0].id;
      getList();
    }
  });
}


/** 查询参数列表 */
function getList() {
  if (!queryParams.value.jobGroup) {
    return;
  }
  loading.value = true;
  jobinfoPage(queryParams.value).then(res => {
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

function changeTriggerStatus(row) {
  if (row.triggerStatus === '1') {
    jobinfoStart({id: row.id}).then(res => {
      // do nothing
    }).catch(() => {
      proxy.$modal.msgError("开启失败！");
      row.triggerStatus = '0';
    });
  }
  if (row.triggerStatus === '0') {
    jobinfoStop({id: row.id}).then(res => {
      // do nothing
    }).catch(() => {
      proxy.$modal.msgError("关闭失败！");
      row.triggerStatus = '1';
    });
  }
}


function handleCommand(command, row) {
  switch (command) {
    case "handleCopy":
      handleCopy(row);
      break;
    case "handleReg":
      handleReg(row);
      break;
    case "handleNexttime":
      handleNexttime(row);
      break;
    case "handleGlueIde":
      handleGlueIde(row);
      break;
    case "handleDelete":
      handleDelete(row);
      break;
    default:
      break;
  }
}

function handleAdd() {
  proxy.$refs["editRef"].handleEdit();
}
function handleExec(row) {
  proxy.$refs["execRef"].handleEdit(row);
}
function handleGlueIde(row) {
  proxy.$refs["glueIdeRef"].handleEdit(row);
}
function handleLog(row) {
  console.log('handleLog');
  router.push('/joblog?jobGroup='+row.jobGroup+'&jobId=' + row.id);
}
function handleUpdate(row) {
  proxy.$refs["editRef"].handleEdit(row);
}
function handleCopy(row) {
  row.id = undefined;
  proxy.$refs["editRef"].handleEdit(row);
}
function handleReg(row) {
  proxy.$refs["regRef"].handleEdit(row);
}
function handleNexttime(row) {
  proxy.$refs["nextTiggerTimeRef"].handleEdit(row);
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除:"' + row.jobDesc + '"？').then(() => {
    jobinfoRemove({id: row.id}).then(res => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
  }).catch(() => {});
}

init();
</script>
