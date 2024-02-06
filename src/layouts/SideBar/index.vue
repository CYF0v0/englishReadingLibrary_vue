<template>
  <el-menu
    :default-active="route.path.split('/')[2]"
    :router="true"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item 
      :index="item.path"
      v-for="(item, index) in mainRoutes[0].children"
      :key="index"
    >
      <template #title>
        <el-icon :size="20">
          <component v-if="item.meta.icon" :is="findCom(item.meta.icon)?.com" />
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
import { useRoute } from 'vue-router'
import { HomeFilled, Setting, UserFilled } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/setting'
import { mainRoutes } from '@/router/index'

interface ComType {
  name: string;
  com: Object;
}
const comArr: ComType[] = reactive([
  {
    name: 'Setting',
    com: markRaw(Setting),
  },
  {
    name: 'HomeFilled',
    com: markRaw(HomeFilled),
  },
  {
    name: 'UserFilled',
    com: markRaw(UserFilled),
  }
])
const findCom = (name: string) => {
  const findArr = comArr.filter((item) => item.name == name)
  if (findArr.length > 0) {
    return findArr[0]
  }
  return null
}
const settingStore = useSettingStore()
const isCollapse = computed(() => settingStore.isCollapse)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const route = useRoute()
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
