<template>
  <span>{{label}}</span>
  <el-tooltip class="box-item" effect="dark" placement="top-start">
    <template #content>
      <span v-html="content"></span>
    </template>
    <el-icon><question-filled /></el-icon>
  </el-tooltip>
</template>
<script setup>
const props = defineProps({
  label: {
    type: String,
    default: '请设置标签',
  },
  content: {
    type: String,
    default: '请设置提示语',
  },
});
</script>
