# xxl-job-ruoyi-vue3

## 平台简介

使用 Ruoyi-Vue3 重新实现 xxl-job 的管理后台页面. 只包含 UI

## 前端运行

```bash

# 进入项目目录
cd xxl-job-ruoyi-vue3

# 安装依赖
yarn config set registry https://registry.npmmirror.com
yarn config set registry https://packages.aliyun.com/5ec7a118405cdab50f3fd5aa/npm/npm-registry/
yarn install

# 修改 vite.config.js 中的 target 地址

# 启动服务
yarn dev

# 构建测试环境 yarn build:uat
# 构建生产环境 yarn build:prod
# 前端访问地址 http://localhost:80
```


## 部署

### 如何部署

1. 修改 env/.env.xxx 配置文件中的 VITE_APP_BASE_API 为自己的
2. 添加/修改 env/.env.xxx 配置文件中的其他信息（按实际情况修改即可）
3. 编译 dist 放到 nginx/oss/容器内均可。若部署到容器，请自行添加 Dockerfile 和打包

### 跨域问题解决

1. 前端开发环境使用了 proxy，无跨域问题
2. 此项目为纯前端，不修改 xxl-job 后端的任何代码，故需要在前端和后端的中间解决跨域问题，nginx/httpd/Ingress均可
3. 自己总结的跨域配置（nginx）: http://doc.wkclz.com/devops/component/nginx.html
4. Ingress 怎样定义 nginx 片断: http://doc.wkclz.com/devops/k8s/07_ingress.html
5. 注意上面文档的 Allow-Origin 问题，必需配置为原请求地址，不能用 *， 否则不能接收 cookie
6. 跨域基础知识可自行百度，推荐阮一峰大佬的博文：https://www.ruanyifeng.com/blog/2016/04/cors.html