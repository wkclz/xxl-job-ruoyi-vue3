<template>
  <el-dialog v-model="open" width="80%" @close="cancel">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <div :id="titleId" :class="titleClass">执行日志</div>
        <div>
          每&nbsp;<el-input-number v-model="refreshTime" style="width: 120px" :min="2" placeholder="定时" clearable />&nbsp;秒
          <el-button type="primary" @click="getLog">刷新一次</el-button>
          <span style="padding: 0 12px 0 12px">最后刷新时间: {{parseTime(logTime)}}</span>
        </div>
      </div>
    </template>

    <monaco-editor v-model="form.logContent" language="html" height="660px"/>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="LogDetail">
import {joblogLogDetailCat} from "@/api/joblog";
import MonacoEditor from '@/components/MonacoEditor'

defineExpose({init})
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("");

const baseTime = ref(1000);
const refreshTime = ref(5);
let interval = null;
const logTime = ref(null)
const param = ref({});
const form = ref({});


/** 表单重置 */
function reset() {
  form.value = {};
  param.value = {};
  proxy.resetForm("editRef");
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

// 新增/修改按钮操作
function init(row) {
  reset();
  param.value = row;
  getLog();
  setInterval4Log();
}

function setInterval4Log() {
  if (interval !== null) {
    return;
  }
  interval = setInterval(() => {
    if (refreshTime.value && baseTime.value % (refreshTime.value * 1000) === 0) {
      getLog();
    }
    baseTime.value = baseTime.value + 1000;
  }, 1000)
}

function getLog() {
  if (!param.value.id) {
    clearInterval(interval);
    return;
  }
  joblogLogDetailCat({
    logId: param.value.id,
    fromLineNum: 1
  }).then(res => {
    form.value = res.content;
    if (refreshTime.value === 0) {
      proxy.$modal.msgSuccess("获取日志成功！");
    }
    logTime.value = new Date();
    open.value = true;
  })
}

</script>
<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
