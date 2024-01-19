<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item 
      :index="item.path"
      @click="toPage(item.path)"
      v-for="(item, index) in mainRoutes[0].children"
      :key="index"
    >
      <template #title>
        <el-icon :size="20">
          <component :is="comArr[item.meta.icon]" />
        </el-icon>
        {{ item.meta.title }}
      </template>
    </el-menu-item>
    <!-- <el-menu-item index="3" @click="toPage('/main')">
      <el-icon><document /></el-icon>
      <template #title>主面板</template>
    </el-menu-item>
    <el-menu-item index="4" @click="toPage('/main/userInfo')">
      <el-icon><setting /></el-icon>
      <template #title>个人中心</template>
    </el-menu-item>
    <el-menu-item index="5" @click="toPage('/main/userList')">
      <el-icon><UserFilled /></el-icon>
      <template #title>用户管理</template>
    </el-menu-item> -->
  </el-menu>
</template>

<script lang="ts" setup>
import { computed, reactive, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { HomeFilled, Setting, UserFilled } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/setting'
import { mainRoutes } from '@/router/index'

const comArr = reactive({
  Setting: markRaw(Setting),
  HomeFilled: markRaw(HomeFilled),
  UserFilled: markRaw(UserFilled),
})
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
