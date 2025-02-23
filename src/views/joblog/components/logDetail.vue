<template>
  <el-dialog :title="title" v-model="open" width="80%">
    <monaco-editor v-model="form.logContent" language="html" height="660px"/>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" @click="getLog">刷 新</el-button>
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
const title = ref("执行日志");

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
}

function getLog() {
  joblogLogDetailCat({
    logId: param.value.id,
    fromLineNum: 1
  }).then(res => {
    form.value = res.content;
    proxy.$modal.msgSuccess("获取日志成功！");
    open.value = true;
  })
}

</script>
