<template>
  <div class="main">
    <div class="left">
      <div class="left-top">
        {{ isCollapse ? '后台' : '后台管理' }}
      </div>
      <div class="left-main">
        <SideBar />
      </div>
    </div>
    <div class="right" :style="[isCollapse ? 'width: calc(100vw - 64px)' : 'width: calc(100vw - 200px)']">
      <div class="right-top">
        <div class="collapse">
          <el-icon @click="handleCollapse(true)" v-if="!isCollapse"><Fold /></el-icon>
          <el-icon @click="handleCollapse(false)" v-else><Expand /></el-icon>
        </div>
        <div class="user-info">
          {{ loginInfo?.username ?? '-' }}
          <el-button type="success" @click="handleExit">退出登录</el-button>
        </div>
      </div>
      <div class="right-content">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              :to="{ path: '/main/index' }"
            >
              首页
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(item, index) in getBreadcrumb"
              :to="{ path: item.path }"
              :key="index"
            >
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SideBar from '@/layouts/SideBar/index.vue'
import { useSettingStore } from '@/store/setting'
import { useUserStore } from '../store/user'
import { Fold, Expand } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const settingStore = useSettingStore()
const isCollapse = ref(false)
const handleCollapse = (value) => {
  isCollapse.value = value
  settingStore.isCollapse = value
}
const loginInfo = userStore.loginInfo
const getBreadcrumb = computed(() => {
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  if (matched.length == 1 && matched[0].path == '/main/index') {
    return []
  }
  return matched
})
const handleExit = () => {
  let result = confirm('确定要退出吗？')
  if (!result) {
    return
  }
  userStore.logout();
  router.push('/')
}
</script>

<style scoped>
.main {
  display: flex;
  width: 100%;
  justify-content: left;
  color: #000;
}
.left {
  padding-top: 1em;
  max-width: 200px;
  background-color: white;
}
.left-top {
  height: 30px;
  font-weight: bold;
}
.right {
  background-color: #dbdbdb;
}
.right-top {
  height: 50px;
  display: flex;
  justify-content: space-between;
  background-color: white;
  align-items: center;
}
.collapse {
  padding-left: 10px;
}
.right-content {
  height: 100vh;
  background-color: #fff;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
}
.breadcrumb {
  margin-bottom: 10px;
}
</style>