<template>
  <el-dialog :title="title" v-model="open" width="480px" append-to-body draggable :close-on-click-modal="false">
    <el-form ref="editRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入新密码" />
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

<script setup name="PasswordEdit">
import {userUpdatePwd} from "@/api/user";
import {removeToken } from '@/utils/auth'
import {ElMessageBox} from "element-plus";

defineExpose({init})
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("修改密码");

const form = ref({});
const rules = ref({
  password: [{ required: true, message: "密码 不能为空", trigger: "blur" }],
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
function init() {
  reset();
  open.value = true;
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      userUpdatePwd(form.value).then(res => {
        removeToken();
        ElMessageBox.alert('密码修改成功，请重新登录!', '重新登录!', {  confirmButtonText: '确定', callback: (action) => location.href = '/'})
      });
    }
  });
}
</script>
