<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item index="3" @click="toPage('/main')">
      <el-icon><document /></el-icon>
      <template #title>主面板</template>
    </el-menu-item>
    <el-menu-item index="4" @click="toPage('/main/userInfo')">
      <el-icon><setting /></el-icon>
      <template #title>个人中心</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  Document,
  Setting,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()
const router = useRouter()
const isCollapse = computed(() => settingStore.isCollapse)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const toPage = (path: string) => {
  router.push(path)
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
