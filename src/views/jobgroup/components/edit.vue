<template>
  <el-dialog :title="title" v-model="open" width="600px" append-to-body draggable :close-on-click-modal="false">
    <el-form ref="editRef" :model="form" :rules="rules" label-width="120px">

      <el-form-item label="AppName" prop="appname">
        <el-input v-model="form.appname" placeholder="请输入 AppName" />
      </el-form-item>
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入 名称" />
      </el-form-item>

      <el-form-item label="注册方式" prop="addressType">
        <el-radio-group v-model="form.addressType">
          <el-radio v-for="item in AddressType" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="机器地址" prop="addressList">
        <el-input v-model="form.addressList" type="textarea" :disabled="form.addressType === 0" placeholder="请输入执行器地址列表，多地址逗号分隔" />
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

<script setup name="jobgroupEdit">
import {jobgroupSave, jobgroupUpdate} from "@/api/jobgroup";
import AddressType from "@/api/dict/AddressType.json"

defineExpose({handleEdit})
const emit = defineEmits(['change']);
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("");

const form = ref({});
const rules = ref({
  appname: [{ required: true, message: "AppName 不能为空", trigger: "blur" }],
  title: [{ required: true, message: "名称 不能为空", trigger: "blur" }],
  addressType: [{ required: true, message: "注册方式 不能为空", trigger: "blur" }],
  addressList: [{ required: false, message: "机器地址 不能为空", trigger: "blur" }],
});

/** 表单重置 */
function reset() {
  form.value = {
    addressType: 0
  };
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
    open.value = true;
    title.value = "添加";
  } else {
    form.value = JSON.parse(JSON.stringify(row))
    open.value = true;
    title.value = "修改";
  }
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      if (form.value.addressType === 1 && !form.value.addressList) {
        proxy.$modal.msgError('手动录入地址，地址不能为空');
        return;
      }
      form.value.registryList = undefined;
      form.value.updateTime = undefined;
      if (form.value.id) {
        jobgroupUpdate(form.value).then(res => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          emit("change", true);
        });
      } else {
        jobgroupSave(form.value).then(res => {
          proxy.$modal.msgSuccess('新增成功');
          open.value = false;
          emit("change", true);
        });
      }
    }
  });
}
</script>
