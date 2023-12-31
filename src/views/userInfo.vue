<template>
  <div v-if="!isLogin">
    暂未登录 <a href="/">去登录</a>
  </div>
  <div v-else>
    <el-form :inline="true" :model="loginInfo" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="loginInfo.username" placeholder="用户名" clearable />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '../store/user'

const router = useRouter()
const userStore = useUserStore()
// 是否登录
const isLogin = ref(false);
const loginInfo = ref({});
isLogin.value = userStore.isLogin;
loginInfo.value = userStore.loginInfo;
const handleExit = () => {
  ElMessageBox.confirm(
    '确定要退出吗？',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      userStore.isLogin = false;
      // 清空当前用户
      userStore.loginInfo = {};
      router.push('/')
    })
    .catch(() => {
    })
};
</script>