<template>
  <el-dialog :title="title" v-model="open" width="600px">
    <el-form ref="editRef" :model="form" :rules="rules" label-width="120px">

      <el-form-item label="任务参数" prop="executorParam">
        <el-input v-model="form.executorParam" type="textarea" placeholder="请输入任务参数" />
      </el-form-item>

      <el-form-item label="机器地址" prop="addressList">
        <el-input v-model="form.addressList" type="textarea" placeholder="请输入本次执行的机器地址，为空则从执行器获取" />
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

<script setup name="jobTrigger">
import {jobinfoTrigger} from "@/api/jobinfo";

defineExpose({handleEdit})
const emit = defineEmits(['change']);
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("");

const form = ref({
  executorParam: '',
  addressList: '',
});
const rules = ref({
});

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
function handleEdit(row) {
  reset();
  form.value = JSON.parse(JSON.stringify(row))
  open.value = true;
  title.value = "执行一次";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      jobinfoTrigger({
        id: form.value.id,
        executorParam: form.value.executorParam,
        addressList: form.value.addressList
      }).then(res => {
        proxy.$modal.msgSuccess('执行一次成功');
        open.value = false;
      });
    }
  });
}
</script>
