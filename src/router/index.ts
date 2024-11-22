import { createRouter, createWebHistory } from "vue-router"
import { useUserStore } from "@/store/user"
import Layout from '@/layouts/index.vue' 

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
// @ts-ignore
// @ts-ignore
export const mainRoutes = [
  {
    path: '/main', 
    component: Layout,
    redirect: '/main/index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/main.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          affix: true,
        },
      },
      {
        path: 'userInfo',
        name: 'userInfo',
        component: () => import('@/views/userInfo.vue'),
        meta: {
          title: '个人中心',
          icon: 'Setting',
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
      {
        path: 'course',
        name: 'course',
        component: () => import('@/views/course.vue'),
        meta: {
          title: '课程',
          icon: 'Reading',
          affix: true,
        },
      },
      {
        path: 'source',
        name: 'source',
        component: () => import('@/views/source.vue'),
        meta: {
          title: '资源',
          icon: 'Files',
          affix: true,
        },
      },
      {
        path: 'selectedCourse',
        name: 'selectedCourse',
        component: () => import('@/views/enrollCourse.vue'),
        meta: {
          title: '已选选课',
          icon: 'Tickets',
          affix: true,
        },
      },
    ],
  },
]

export const staticRoutes = [
  { 
    path: '/', 
    name: 'login',
    component: () => import('@/views/login.vue'),
    // name: 'course',
    // component: () => import('@/views/course.vue'),
  },
  // {
  //   path: '/:pathMatch(.*)',
  //   name: '404',
  //   component: () => import('@/views/exception/404.vue'),
  // },
];

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。
  history: createWebHistory(),
  routes: staticRoutes,
})

export const addMainRoute = () => {
  mainRoutes.map((item) => {
    router.addRoute(item)
  })
}

const loginRoutePath = '/'

router.beforeEach(async to => {
  const userStore = useUserStore()
  if (!userStore.isLogin) {
    // 本地存储中有用户信息的，用该信息重新登录
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      await userStore.login(JSON.parse(userInfo))
      return {
        path: to.fullPath,
        replace: true
      }
    }
  }
  if (!userStore.isLogin) {
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