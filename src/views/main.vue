<template>
<!--  <div v-if="!isLogin">-->
<!--    暂未登录 <a href="/">去登录</a>-->
<!--  </div>-->
<!--  <div v-else>-->
<!--      欢迎使用后台管理系统，{{ loginInfo.type }} {{ loginInfo.username }}-->
<!--  </div>-->
  <el-descriptions title="欢迎来到中小学生课外英语阅读馆" ></el-descriptions>
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
// const userInfo = localStorage.getItem('userInfo');
// if (userInfo) {
//   isLogin.value = true;
//   loginInfo.value = JSON.parse(userInfo);
// }
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