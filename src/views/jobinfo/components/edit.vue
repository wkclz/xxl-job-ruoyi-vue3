<template>
  <el-dialog :title="title" v-model="open" width="1080px">
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
            <el-input v-model="form.schedule_conf_CRON" placeholder="请输入cron执行表达式">
              <template #append>
                <el-button type="primary" @click="handleShowCron">
                  生成表达式
                  <i class="el-icon-time el-icon--right"></i>
                </el-button>
              </template>
            </el-input>
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

<textarea id="GLUE_GROOVY" style="display:none;" >
package com.xxl.job.service.handler;

import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.IJobHandler;

public class DemoGlueJobHandler extends IJobHandler {

	@Override
	public void execute() throws Exception {
		XxlJobHelper.log("XXL-JOB, Hello World.");
	}

}
</textarea>
<textarea id="GLUE_SHELL" style="display:none;" >
#!/bin/bash
echo "xxl-job: hello shell"

echo "脚本位置：$0"
echo "任务参数：$1"
echo "分片序号 = $2"
echo "分片总数 = $3"

echo "Good bye!"
exit 0
</textarea>
<textarea id="GLUE_PYTHON" style="display:none;" >
#!/usr/bin/python
# -*- coding: UTF-8 -*-
import time
import sys

print "xxl-job: hello python"

print "脚本位置：", sys.argv[0]
print "任务参数：", sys.argv[1]
print "分片序号：", sys.argv[2]
print "分片总数：", sys.argv[3]

print "Good bye!"
exit(0)
</textarea>
<textarea id="GLUE_PHP" style="display:none;" >
&lt;?php

    echo "xxl-job: hello php  \n";

    echo "脚本位置：$argv[0]  \n";
    echo "任务参数：$argv[1]  \n";
    echo "分片序号 = $argv[2]  \n";
    echo "分片总数 = $argv[3]  \n";

    echo "Good bye!  \n";
    exit(0);

?>
</textarea>
<textarea id="GLUE_NODEJS" style="display:none;" >
#!/usr/bin/env node
console.log("xxl-job: hello nodejs")

var arguments = process.argv

console.log("脚本位置: " + arguments[1])
console.log("任务参数: " + arguments[2])
console.log("分片序号: " + arguments[3])
console.log("分片总数: " + arguments[4])

console.log("Good bye!")
process.exit(0)
</textarea>
<textarea id="GLUE_POWERSHELL" style="display:none;" >
Write-Host "xxl-job: hello powershell"

Write-Host "脚本位置: " $MyInvocation.MyCommand.Definition
Write-Host "任务参数: "
	if ($args.Count -gt 2) { $args[0..($args.Count-3)] }
Write-Host "分片序号: " $args[$args.Count-2]
Write-Host "分片总数: " $args[$args.Count-1]

Write-Host "Good bye!"
exit 0
</textarea>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>

    <el-dialog title="Cron表达式生成器" v-model="openCron" destroy-on-close>
      <crontab ref="crontabRef" @hide="openCron=false" @fill="crontabFill" :expression="expression"></crontab>
    </el-dialog>

  </el-dialog>
</template>

<script setup name="JobinfoEdit">
import {jobinfoAdd, jobinfoUpdate} from "@/api/jobinfo";
import {jobgroupPage} from "@/api/jobgroup";

import Crontab from '@/components/Crontab'

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

const openCron = ref(false);
const expression = ref("");

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
    if (row) {
      form.value = JSON.parse(JSON.stringify(row))
      initScheduleConf();
    }
  } else {
    form.value = JSON.parse(JSON.stringify(row))
    initScheduleConf();
    open.value = true;
    title.value = "修改";
  }
  getApps();
}

function initScheduleConf() {
  if (form.value.scheduleType === 'CRON') {
    form.value.schedule_conf_CRON = form.value.scheduleConf;
  }
  if (form.value.scheduleType === 'FIX_RATE') {
    form.value.schedule_conf_FIX_RATE = form.value.scheduleConf;
  }
  if (form.value.scheduleType === 'FIX_DELAY') {
    form.value.schedule_conf_FIX_DELAY = form.value.scheduleConf;
  }
}

function getApps() {
  jobgroupPage({
    start: 0,
    length: 10000,
    appname: '',
    title: ''
  }).then(res => {
    appOptions.value = res.data;
  });
}


function handleShowCron() {
  expression.value = form.value.schedule_conf_CRON;
  openCron.value = true;
}
/** 确定后回传值 */
function crontabFill(value) {
  form.value.schedule_conf_CRON = value;
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
      if (!form.value.id && form.value.glueType !== 'BEAN') {
        const glueSource = document.getElementById(form.value.glueType);
        form.value.glueSource = glueSource.textContent;
        form.value.glueRemark = 'GLUE代码初始化';
      }

      form.value.addTime = undefined;
      form.value.updateTime = undefined;
      form.value.glueUpdatetime = undefined;
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
