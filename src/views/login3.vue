<template>
  <div>
    <form @submit.prevent="handleCreateAccount">
      <label for="username">Username:</label>
      <input id="username" v-model="registerData.username" type="text" required />

      <label for="account">Account:</label>
      <input id="account" v-model="registerData.account" type="text" required />

      <label for="password">Password:</label>
      <input id="password" v-model="registerData.password" type="password" required />

      <label for="role">Role:</label>
      <input id="role" v-model="registerData.role" type="text" required />

      <button type="submit">Register</button>
    </form>

    <div>
      <form @submit.prevent="handleLogin">
        <label for="loginAccount">Account:</label>
        <input id="loginAccount" v-model="loginData.account" type="text" required />

        <label for="loginPassword">Password:</label>
        <input id="loginPassword" v-model="loginData.password" type="password" required />

        <button type="submit">Login</button>
      </form>
    </div>

    <!-- Add delete button -->
    <div>
      <label for="deleteAccount">Account to Delete:</label>
      <input id="deleteAccount" v-model="deleteData.account" type="text" required />
      <button @click="handleDeleteUser">Delete User</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const registerData = ref({
  username: "",
  account: "",
  password: "",
  role: "",
});

const handleCreateAccount = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/register', registerData.value, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = response.data;
    if (data.code === 200) {
      ElMessage.success('注册成功');
      // 你可以在这里添加其他逻辑，例如重定向到登录页面
    } else {
      ElMessage.error(data.message);
    }
  } catch (error) {
    ElMessage.error('注册失败');
    console.log(error)
  }
};

const loginData = ref({
  account: "",
  password: "",
});

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/login', null, {
      params: {
        account: loginData.value.account,
        password: loginData.value.password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    if (data.code === 200) {
      ElMessage.success('登录成功');
      // 你可以在这里添加其他逻辑，例如重定向到主页面
    } else {
      ElMessage.error(data.message);
    }
  } catch (error) {
    ElMessage.error('登录失败');
    console.log(error);
  }
};

const deleteData = ref({
  account: "",
});

const handleDeleteUser = async () => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/deleteUsers/${deleteData.value.account}`);
    const data = response.data;
    if (data.code === 200) {
      ElMessage.success('用户删除成功');
      // 你可以在这里添加其他逻辑，例如清除输入框
      deleteData.value.account = "";
    } else {
      ElMessage.error(data.message);
    }
  } catch (error) {
    ElMessage.error('删除用户失败');
    console.log(error);
  }
};
</script>