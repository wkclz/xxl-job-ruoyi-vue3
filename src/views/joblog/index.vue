<template>
   <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true">
       <el-form-item label="执行器" prop="jobGroup">
         <el-select v-model="queryParams.jobGroup" placeholder="执行器" filterable style='width: 200px' @change="changeJobGroup">
           <el-option v-for="item in appOptions" :key="item.id" :label="item.title" :value="item.id"/>
         </el-select>
       </el-form-item>
       <el-form-item label="任务" prop="jobId">
         <el-select v-model="queryParams.jobId" placeholder="任务" filterable style='width: 200px' @change="handleQuery">
           <el-option v-for="item in jobsOptions" :key="item.id" :label="item.jobDesc" :value="item.id"/>
         </el-select>
       </el-form-item>
       <el-form-item label="状态" prop="logStatus">
         <el-select v-model="queryParams.logStatus" placeholder="状态" filterable style='width: 100px' @change="handleQuery">
           <el-option v-for="item in LogStatus" :key="item.value" :label="item.label" :value="item.value"/>
         </el-select>
       </el-form-item>
       <el-form-item>
         <el-date-picker
             v-model="dateRange"
             style='width: 380px'
             :clearable="false"
             value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange"
             range-separator="-"
             start-placeholder="开始时间" end-placeholder="结束时间"/>
       </el-form-item>
       <el-form-item>
         <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
         <el-button icon="Refresh" @click="resetQuery">重置</el-button>
       </el-form-item>
       <el-form-item style="float: right;">
         <el-button type="info" plain icon="Delete" @click="handleClean">清理</el-button>
       </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="dataList">
        <el-table-column label="ID" prop="id" width="80"/>
        <el-table-column label="任务ID" prop="jobId" min-width="160"/>
        <el-table-column label="调度时间" prop="triggerTime" min-width="160">
          <template #default="{row}"><span>{{ parseTime(row.triggerTime) }}</span></template>
        </el-table-column>
        <el-table-column label="调度结果" prop="triggerCode" min-width="100">
          <template #default="{row}"><dict-tag :options="TriggerResult" :value="row.triggerCode"/></template>
        </el-table-column>
        <el-table-column label="调度备注" prop="triggerMsg" min-width="100">
          <template #default="{row}">
            <el-button link type="primary" icon="View" @click="handleRriggerRemark(row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="执行时间" prop="handleTime" min-width="160">
          <template #default="{row}"><span>{{ parseTime(row.handleTime) }}</span></template>
        </el-table-column>
        <el-table-column label="执行结果" prop="handleMsg" min-width="200"/>
        <el-table-column label="执行备注" prop="username" min-width="200"/>
        <!--
        <el-table-column label="操作" fixed='right' width="160">
          <template #default="{row}">
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        -->
      </el-table>

     <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.current"
         v-model:limit="queryParams.size"
         @pagination="getList"
     />

     <clean ref="cleanRef" @change="cleanResult"/>
     <trigger-remark ref="triggerRemarkRef"/>
   </div>
</template>

<script setup name="Joblog">
import {joblogPage, joblogGetJobsByGroup} from "@/api/joblog";
import {jobgroupPage} from "@/api/jobgroup";
import { parseTime } from '@/utils/ruoyi';
import LogStatus from "@/api/dict/LogStatus.json"
import TriggerResult from "@/api/dict/TriggerResult.json"

import Clean from "./components/clean"
import TriggerRemark from "./components/triggerRemark"

const { proxy } = getCurrentInstance();
const route = useRoute();

const appOptions = ref([]);
const jobsOptions = ref([]);
const dataList = ref([]);
const loading = ref(false);
const total = ref(0);
const dateRange = ref([]);

const queryParams = ref({
  start: 0,
  length: 10,
  jobGroup: -1,
  jobId: 0,
  logStatus: -1,
  filterTime: '2023-08-12 00:00:00 - 2023-08-12 23:59:59'
});

function init() {
  const now = new Date();
  dateRange.value = [
    parseTime(now, '{y}-{m}-{d}') + ' 00:00:00',
    parseTime(now, '{y}-{m}-{d}') + ' 23:59:59'
  ];
  appOptions.value.push({id: -1, title: '全部'})
  jobsOptions.value.push({id: 0, jobDesc: '全部'})

  const {query} = route;
  let jobGroup = query?.jobGroup;
  let jobId = query?.jobId;

  if (jobGroup && jobGroup > 0) {
    queryParams.value.jobGroup = Number(jobGroup);
    changeJobGroup(jobGroup);
  }
  if (jobId && jobId > 0) {
    queryParams.value.jobId = Number(jobId);
  }

  // 非跳转场景，进入页面查询一次
  if (!jobGroup && !jobId) {
    handleQuery();
  }
  getApps();
}

function getApps() {
  jobgroupPage({start: 0,length: 10000}).then(res => {
    const data = res.data;
    if (data && data.length > 0) {
        for (const a of data) {
          appOptions.value.push(a);
        }
      }
  });
}

function changeJobGroup(jobGroup) {
  handleQuery();
  if (jobGroup === -1) {
    return;
  }
  getJobsOptions();
}

function getJobsOptions() {
  if (!queryParams.value.jobGroup) {
    return;
  }
  jobsOptions.value = [];
  jobsOptions.value.push({id: 0, jobDesc: '全部'})
  if (queryParams.value.jobGroup === -1) {
    return;
  }
  joblogGetJobsByGroup({jobGroup: queryParams.value.jobGroup}).then(res => {
    const data = res.content;
    if (data && data.length > 0) {
      for (let d of data) {
        jobsOptions.value.push(d)
      }
    }
  })
}

/** 查询参数列表 */
function getList() {
  loading.value = true;

  if (dateRange.value.length === 2) {
    const from = dateRange.value[0];
    const to = dateRange.value[1];
    queryParams.value.filterTime = from + ' - '+ to;
  }

  joblogPage(queryParams.value).then(res => {
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

function handleClean() {
  const row = {};
  row.jobGroup = queryParams.value.jobGroup;
  row.jobId = queryParams.value.jobId;
  for (const t of appOptions.value) {
    if (t.id === row.jobGroup) {
      row.jobGroupName = t.title;
      break;
    }
  }
  for (const t of jobsOptions.value) {
    if (t.id === row.jobId) {
      row.jobName = t.jobDesc;
      break;
    }
  }
  proxy.$refs["cleanRef"].init(row);
}
function cleanResult() {
  getList();
}
function handleRriggerRemark(row) {
  proxy.$refs["triggerRemarkRef"].init(row);
}


init();
</script>
