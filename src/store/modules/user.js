import { loginXxlJob, logoutXxlJob } from '@/api/sso'
import { getToken, removeToken } from '@/utils/auth'

const useUserStore = defineStore('user', {
    state: () => ({
      apps: [],
      name: '',
      avatar: '',
    }),
    actions: {
      // 登录
      login(userInfo) {
        return new Promise((resolve, reject) => {
          loginXxlJob({
            userName: userInfo.userName,
            password: userInfo.password,
          }).then(res => {
            // 没有接口获取，直接从当前位置获取
            localStorage.setItem('username', userInfo.userName);
            resolve(true);
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          const username = getToken();
          this.name = username;
          resolve(username)
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          logoutXxlJob().then(() => {
            resolve()
          }).catch(error => {
            reject(error)
          }).finally(val => {
            // 无论如何前端均需要清除 token
            removeToken()
          });
        })
      }
    }
  })

export default useUserStore
