<template>
  <el-dialog :title="title" v-model="open" width="600px" append-to-body draggable :close-on-click-modal="false">
    <el-form ref="editRef" :model="form" label-width="120px">

      <el-form-item label="执行器" prop="jobGroupName">
        <el-input v-model="form.jobGroupName" disabled />
      </el-form-item>

      <el-form-item label="任务" prop="jobName">
        <el-input v-model="form.jobName" disabled />
      </el-form-item>



      <el-form-item label="清理方式" prop="type">
        <el-select v-model="form.type" placeholder="请选择 清理方式" filterable style='width: 660px'>
          <el-option v-for="dict in CleanType" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="CleanLog">
import {joblogClearLog} from "@/api/joblog";

import CleanType from "@/api/dict/CleanType.json"

defineExpose({init})
const emit = defineEmits(['change']);
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("日志清理");
const form = ref({});

/** 表单重置 */
function reset() {
  form.value = {};
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
  form.value = JSON.parse(JSON.stringify(row))
  form.value.type = 1;
  open.value = true;
}

function submitForm() {
  joblogClearLog({
    jobGroup: form.value.jobGroup,
    jobId: form.value.jobId,
    type: form.value.type
  }).then(res => {
    proxy.$modal.msgSuccess('清理成功');
    open.value = false;
    emit("change", true);
  });
}
</script>
