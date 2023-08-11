<template>
  <div>
    <el-dropdown trigger="click" @command="handleSelectApp" style="margin-top: 18px;">
      <span class="el-dropdown-link">
        {{currentApp.displayName}}
        <el-icon><arrow-down-bold /></el-icon>
        &nbsp;&nbsp;
      </span>
      <template #dropdown>
        <el-input v-model="form.keyword" clearable @input="queryApps" placeholder="搜索应用"/>
        <el-dropdown-menu>
          <el-dropdown-item
              v-for="(item, index) of filtedApps"
              :key="index"
              :disabled="appCode === item.appCode"
              :command="item">
            {{ item.displayName}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import useUserStore from '@/store/modules/user';

const { proxy } = getCurrentInstance();
const appCode = import.meta.env.VITE_APP_APP_CODE;
const userStore = useUserStore()
const currentApp = ref({});

const form = ref({})
const filtedApps = ref([]);

function queryApps() {
  const keyword = form.value.keyword;
  const apps = userStore.apps;
  const tmpApps = [];
  for (const app of apps) {
    if (!keyword || app.displayName.indexOf(keyword) > -1) {
      tmpApps.push(app);
    }
  }
  filtedApps.value = tmpApps;
}
function getCurrentApp() {
  const apps = userStore.apps;
  for (const app of apps) {
    if (app.appCode === appCode) {
      currentApp.value = app;
      break;
    }
  }
  queryApps();
}

function handleSelectApp(app) {
  proxy.$modal.loading("正在使用新窗口打开 " + app.appCode + ":" + app.appName + "，请稍候...");
  setTimeout(() => {
    proxy.$modal.closeLoading();
    window.open(app.domain);
  }, 1000);
}

getCurrentApp();
</script>
