<template>
  <div v-if="!isLogin">
    <div>用户名: <el-input type="text" v-model="formData.username"></el-input></div>
    <div>密码:  <el-input type="password" v-model="formData.password"></el-input></div>
    <el-button @click="handleLogin">登录</el-button>
  </div>
  <div v-else>
      欢迎，{{ loginInfo.type }} {{ loginInfo.username }} <el-button type="success" @click="handleExit">退出登录</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const users = [{
  id: 1,
  username: 'admin',
  password: 'admin',
  type: '管理员',
}, {
  id: 2,
  username: 'manager',
  password: 'manager',
  type: '运营人员',
}];
const formData = ref({
  username: '',
  password: '',
})
// 是否登录
const isLogin = ref(false);
const loginInfo = ref({});
const handleLogin = () => {
  if (!formData.value.username) {
    ElMessage.error('请输入用户名')
    return
  }
  if (!formData.value.password) {
    ElMessage.error('请输入密码')
    return
  }
  let isRight = false;
  users.forEach((element) => {
    if (formData.value.username == element.username && formData.value.password ==element.password) {
      isRight = true;
      loginInfo.value = element;
      return false;
    }
  });
  if (isRight) {
    isLogin.value = true;
    localStorage.setItem('userInfo', JSON.stringify(loginInfo.value))
    ElMessage.success('登录成功')
    router.push('/about')
  } else {
    ElMessage.error('用户名或密码不正确')
  }
};

const userInfo = localStorage.getItem('userInfo');
if (userInfo) {
  isLogin.value = true;
  loginInfo.value = JSON.parse(userInfo);
}

const handleExit = () => {
  let result = confirm('确定要退出吗？');
  if (!result) {
    return;
  }
  isLogin.value = false;
  // 清空登录数据
  formData.value.username = '';
  formData.value.password = '';
  // 清空当前用户
  localStorage.removeItem('userInfo');
};
</script>