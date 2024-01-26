<template>
  <el-dialog :title="title" v-model="open" width="300px">
    <ol>
      <li v-for="item in jobgroup?.registryList"><el-tag>{{item}}</el-tag></li>
    </ol>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="jobReg">
import {jobgroupLoadById} from "@/api/jobgroup";

defineExpose({handleEdit})
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("");

const jobgroup = ref({});

/** 表单重置 */
function reset() {
  jobgroup.value = {};
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

// 新增/修改按钮操作
function handleEdit(row) {
  reset();
  jobgroupLoadById({id: row.id}).then(res => {
    open.value = true;
    title.value = "注册节点";
    jobgroup.value = res.content;
  })
}

</script>
