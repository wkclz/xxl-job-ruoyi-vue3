<template>
  <el-dialog :title="title" v-model="open" width="1080px" append-to-body draggable :close-on-click-modal="false">
    <el-form ref="editRef" :model="form" :rules="rules" label-width="108px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="执行器" prop="jobGroup">
            <el-select v-model="form.jobGroup" placeholder="执行器" filterable style='width: 100%'>
              <el-option v-for="item in appOptions" :key="item.id" :label="item.appname" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="任务描" prop="jobDesc">
            <el-input v-model="form.jobDesc" placeholder="请输入 任务描" />
          </el-form-item>
          <el-form-item label="负责人" prop="author">
            <el-input v-model="form.author" placeholder="请输入 负责人" />
          </el-form-item>
          <el-form-item label="报警邮件" prop="alarmEmail">
            <el-input v-model="form.alarmEmail" type="textarea" rows="5" placeholder="请输入报警邮件，多个邮件地址则逗号分隔" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="调度类型" prop="scheduleType">
            <el-select v-model="form.scheduleType" placeholder="请选择 调度类型" filterable style='width: 660px'>
              <el-option v-for="dict in ScheduleType" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="scheduleConf" style="display: none">
            <el-input v-model="form.scheduleConf"  />
          </el-form-item>
          <el-form-item label="Cron" prop="schedule_conf_CRON" v-if="form.scheduleType === 'CRON'">
            <el-input v-model="form.schedule_conf_CRON" placeholder="请输入 Cron" />
          </el-form-item>
          <el-form-item label="固定速度" prop="schedule_conf_FIX_RATE" v-if="form.scheduleType === 'FIX_RATE'">
            <el-input v-model="form.schedule_conf_FIX_RATE" type="number" placeholder="请输入 固定速度（Second）" />
          </el-form-item>
          <el-form-item label="延迟" prop="schedule_conf_FIX_DELAY" v-if="form.scheduleType === 'FIX_DELAY'">
            <el-input v-model="form.schedule_conf_FIX_DELAY" type="number" placeholder="请输入 延迟（Second）" />
          </el-form-item>

          <el-form-item label="运行模式" prop="glueType">
            <el-select v-model="form.glueType" placeholder="请选择 运行模式" :disabled="!!form.id" filterable style='width: 660px'>
              <el-option v-for="dict in GlueType" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="JobHandler" prop="executorHandler" v-if="form.glueType === 'BEAN'">
            <el-input v-model="form.executorHandler" placeholder="请输入 JobHandler" />
          </el-form-item>
          <el-form-item label="任务参数" prop="executorParam">
            <el-input v-model="form.executorParam"  type="textarea" rows="3" placeholder="请输入 任务参数" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="路由策略" prop="executorRouteStrategy">
            <el-select v-model="form.executorRouteStrategy" placeholder="请选择 路由策略" filterable style='width: 660px'>
              <el-option v-for="dict in ExecutorRouteStrategy" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="调度过期策略" prop="misfireStrategy">
            <el-select v-model="form.misfireStrategy" placeholder="请选择 调度过期策略" filterable style='width: 660px'>
              <el-option v-for="dict in MisfireStrategy" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="任务超时时间" prop="executorTimeout">
            <el-input v-model="form.executorTimeout" placeholder="任务超时时间，单位秒，大于零时生效" />
          </el-form-item>
          <el-form-item label="子任务ID" prop="childJobId">
            <el-input v-model="form.childJobId" type="number" placeholder="请输入 子任务ID" />
          </el-form-item>
          <el-form-item label="阻塞处理策略" prop="executorBlockStrategy">
            <el-select v-model="form.executorBlockStrategy" placeholder="请选择 阻塞处理策略" filterable style='width: 660px'>
              <el-option v-for="dict in ExecutorBlockStrategy" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="失败重试次数" prop="executorFailRetryCount">
            <el-input v-model="form.executorFailRetryCount" type="number" placeholder="请输入 失败重试次数" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="JobinfoEdit">
import {jobinfoAdd, jobinfoUpdte} from "@/api/jobinfo";
import {jobgroupPage} from "@/api/jobgroup";

import GlueType from "@/api/dict/GlueType.json"
import ScheduleType from "@/api/dict/ScheduleType.json"
import MisfireStrategy from "@/api/dict/MisfireStrategy.json"
import ExecutorRouteStrategy from "@/api/dict/ExecutorRouteStrategy.json"
import ExecutorBlockStrategy from "@/api/dict/ExecutorBlockStrategy.json"

defineExpose({handleEdit})
const emit = defineEmits(['change']);
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("");

const appOptions = ref([]);

const form = ref({});
const rules = ref({
  jobGroup: [{ required: true, message: "执行器 不能为空", trigger: "blur" }],
  jobDesc: [{ required: true, message: "任务描述 不能为空", trigger: "blur" }],
  author: [{ required: true, message: "负责人 不能为空", trigger: "blur" }],
  alarmEmail: [{ required: false, message: "报警邮件 不能为空", trigger: "blur" }],
  scheduleType: [{ required: false, message: "调度类型 不能为空", trigger: "blur" }],
  schedule_conf_CRON: [{ required: true, message: "Cron 不能为空", trigger: "blur" }],
  glueType: [{ required: true, message: "运行模式 不能为空", trigger: "blur" }],
  executorHandler: [{ required: true, message: "路由策略 不能为空", trigger: "blur" }],
  executorRouteStrategy: [{ required: true, message: "路由策略 不能为空", trigger: "blur" }],
  misfireStrategy: [{ required: true, message: "阻塞处理策略 不能为空", trigger: "blur" }],
  executorBlockStrategy: [{ required: true, message: "阻塞处理策略 不能为空", trigger: "blur" }],
});


/** 表单重置 */
function reset() {
  form.value = {
    scheduleType: 'CRON',
    glueType: 'BEAN',
    executorRouteStrategy: 'FIRST',
    misfireStrategy: 'DO_NOTHING',
    executorBlockStrategy: 'SERIAL_EXECUTION',
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
    if (form.value.scheduleType === 'CRON') {
      form.value.schedule_conf_CRON = form.value.scheduleConf;
    }
    if (form.value.scheduleType === 'FIX_RATE') {
      form.value.schedule_conf_FIX_RATE = form.value.scheduleConf;
    }
    if (form.value.scheduleType === 'FIX_DELAY') {
      form.value.schedule_conf_FIX_DELAY = form.value.scheduleConf;
    }
    open.value = true;
    title.value = "修改";
  }
  getApps();
}


function getApps() {
  jobgroupPage({start: 0,length: 10000}).then(res => {
    appOptions.value = res.data;
  });
}


/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      if (form.value.scheduleType === 'CRON') {
        form.value.scheduleConf = form.value.schedule_conf_CRON;
      }
      if (form.value.scheduleType === 'FIX_RATE') {
        form.value.scheduleConf = form.value.schedule_conf_FIX_RATE;
      }
      if (form.value.scheduleType === 'FIX_DELAY') {
        form.value.scheduleConf = form.value.schedule_conf_FIX_DELAY;
      }
      if (form.value.id) {
        jobinfoUpdate(form.value).then(res => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          emit("change", true);
        });
      } else {
        jobinfoAdd(form.value).then(res => {
          proxy.$modal.msgSuccess('新增成功');
          open.value = false;
          emit("change", true);
        });
      }
    }
  });
}
</script>
