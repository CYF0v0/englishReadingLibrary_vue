import { defineStore } from 'pinia'
import { ref } from 'vue'
import { addMainRoute } from '@/router'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)
  const loginInfo = ref({})

  // 登录
  const login = (data: any) => {
    if (data) {
      isLogin.value = true
      loginInfo.value = data
      localStorage.setItem('userInfo', JSON.stringify(data))
      // 添加登录后的路由
      addMainRoute()
    }
  }

  // 退出
  const logout = () => {
    isLogin.value = false
    loginInfo.value = {}
    localStorage.removeItem('userInfo')
  }

  return { 
    isLogin, 
    loginInfo,

    login,
    logout,
  }
})