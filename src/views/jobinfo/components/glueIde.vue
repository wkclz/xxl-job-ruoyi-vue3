<template>
  <el-dialog :title="title" v-model="open" width="1080px">
    <el-form ref="editRef" :model="form" :rules="rules" label-width="108px">
      <el-form-item label="任务参数" prop="glueSource">
        <monaco-editor v-model="form.glueSource" language="java" placeholder="请编辑 GLUE 源码" height="320px"/>
      </el-form-item>
      <el-form-item label="源码备注" prop="glueRemark">
        <el-input v-model="form.glueRemark" placeholder="请输入 GLUE 源码 修改备注" />
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

<script setup name="JobinfoGlue">
import {jobcodeSave} from "@/api/jobinfo";
import MonacoEditor from '@/components/MonacoEditor'

defineExpose({handleEdit})
const emit = defineEmits(['change']);
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("");

const form = ref({});
const rules = ref({
  glueSource: [{ required: true, message: "源代码 不能为空", trigger: "blur" }],
  glueRemark: [{ required: true, min: 4, max: 63, message: "源代码 备注不能少于4个字符！", trigger: "blur" }],
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
  if (!row || !row.id) {
    return;
  }

  form.value = JSON.parse(JSON.stringify(row))
  open.value = true;
  title.value = "编辑: " + row.glueType + ": " + row.jobDesc;
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      if (form.value.id) {
        jobcodeSave({
          id: form.value.id,
          glueSource: form.value.glueSource,
          glueRemark: form.value.glueRemark
        }).then(res => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          emit("change", true);
        });
      }
    }
  });
}
</script>
