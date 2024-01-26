<template>
  <el-dialog :title="title" v-model="open" width="300px">
    <ol>
      <li v-for="item in nexts"><el-tag>{{item}}</el-tag></li>
    </ol>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="jobNextTiggerTime">
import {jobinfoNextTriggerTime} from "@/api/jobinfo";

defineExpose({handleEdit})
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("");

const nexts = ref([]);

/** 表单重置 */
function reset() {
  nexts.value = [];
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

// 新增/修改按钮操作
function handleEdit(row) {
  reset();
  jobinfoNextTriggerTime({
    scheduleType: row.scheduleType,
    scheduleConf: row.scheduleConf,
  }).then(res => {
    open.value = true;
    title.value = "下次执行时间";
    nexts.value = res.content;
  })
}

</script>
