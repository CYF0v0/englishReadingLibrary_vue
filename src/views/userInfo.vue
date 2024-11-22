<template>
  <el-descriptions title="身份信息" border>
    <el-descriptions-item
        :rowspan="2"
        :width="140"
        label="头像"
        align="center"
    >
      <el-image
          style="width: 100px; height: 100px"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
    </el-descriptions-item>
    <el-descriptions-item label="姓名">{{userMessage.username}}</el-descriptions-item>
    <el-descriptions-item label="电话">1234567890</el-descriptions-item>
    <el-descriptions-item label="地址">address</el-descriptions-item>
    <el-descriptions-item label="身份">
      <el-tag size="small">{{userMessage.role}}</el-tag>
    </el-descriptions-item>
  </el-descriptions>
</template>


<style>
.el-descriptions__title{
  margin: 0 auto;
}
</style>

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
const userMessage={
  username:'',
  role:''
}
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
if (userInfo) {
  userMessage.username=userInfo.username
  userMessage.role=userInfo.role
}
</script>