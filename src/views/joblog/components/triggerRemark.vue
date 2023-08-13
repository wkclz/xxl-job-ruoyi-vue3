<template>
  <el-dialog :title="title" v-model="open" width="600px" append-to-body draggable :close-on-click-modal="false">
    <div v-html="form.triggerMsg"></div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="TriggerRemark">

defineExpose({init})
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("执行备注");

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
  open.value = true;
}

</script>
