<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">任务调度中心</h3>
      <el-form-item prop="userName">
        <el-input
          v-model="loginForm.userName"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width:100%;"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2025 Shrimp Workstudio All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup>
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const router = useRouter();
const { proxy } = getCurrentInstance();

const loginForm = ref({
  userName: "",
  password: "",
  rememberMe: false,
});

const loginRules = {
  userName: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
};

const loading = ref(false);
const redirect = ref(undefined);

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        localStorage.setItem("username", loginForm.value.username, { expires: 30 });
        localStorage.setItem("password", encrypt(loginForm.value.password), { expires: 30 });
        localStorage.setItem("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }
      // 调用action的登录方法
      userStore.login(loginForm.value).then((res) => {
        router.push({ path: redirect.value || "/" });
      }).catch(() => {
        loading.value = false;
      });
    }
  });
}

function getCache() {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  const rememberMe = localStorage.getItem("rememberMe");
  loginForm.value = {
    username: !!username ? username : '',
    password: !!password ? decrypt(password) : '',
    rememberMe: !!rememberMe ? Boolean(rememberMe) : false
  };
}

getCache();
console.log('心灵的付出没得到回音便会是孤单，记忆滞后太久，会退色，也会更鲜明');
</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: right;
  align-items: center;
  height: 100%;
  background-image: url('/public/background.jpeg');
  background-size: cover;
  padding-right: 108px;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
