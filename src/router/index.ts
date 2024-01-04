import { createRouter, createWebHashHistory } from "vue-router"
import { useUserStore } from "@/store/user"
import Layout from '@/layouts/index.vue' 

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: '/', component: () => import('@/views/home.vue') },
  { 
    path: '/main', 
    component: Layout,
    redirect: '/main/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/main.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          affix: true,
        },
      },
      {
        path: 'userInfo',
        name: 'UserInfo',
        component: () => import('@/views/userInfo.vue'),
        meta: {
          title: '个人中心',
          icon: 'HomeFilled',
          affix: true,
        },
      },
      {
        path: 'userList',
        name: 'userList',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'UserFilled',
          affix: true,
        },
      },
    ], 
  },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

const loginRoutePath = '/'

router.beforeEach(async to => {
  const userStore = useUserStore()
  // 未登录的
  if (!userStore.isLogin) {
    console.log(to.fullPath)
    if (to.fullPath !== loginRoutePath) {
      // 其他路由一律跳转到登录页
      return {
        path: loginRoutePath,
        replace: true,
      }
    }
  }
})

export default router