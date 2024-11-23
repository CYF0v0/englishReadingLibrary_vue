<script setup lang="ts">
import { ref } from 'vue';
import { useRoleStore } from '@/store/roleStore';
import {ElMessage} from "element-plus";
import http from "@/utils/request.ts";
import axios from "axios";
import {useUserStore} from "@/store/user.ts";
import router from "@/router";

const showSignIn = ref(true);
const userStore = useUserStore()

const toggleForm = (isSignIn: boolean) => {
  const pinkbox = document.querySelector('.pinkbox');
  if (pinkbox) {
    pinkbox.style.transform = isSignIn ? 'translateX(0%)' : 'translateX(80%)';
  }
  showSignIn.value = isSignIn;
};

const roleStore = useRoleStore();

const options = [
  {
    value: 'student',
    label: 'student',
  },
  {
    value: 'parent',
    label: 'parent',
  },
];

const handleSelection = (value: string) => {
  roleStore.setSelectedRole(value);
};

const handleCreateAccount = async () => {
  if (!registerDate.value.account || !registerDate.value.password) {
    ElMessage.error('账户和密码不能为空');
    return;
  }

  roleStore.setAccountInfo(registerDate.value.username, registerDate.value.account, registerDate.value.password);
  try {
    const response = await axios.post('http://localhost:8080/api/register', registerDate.value, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = response.data;
    if (data.code === 200) {
      ElMessage.success('注册成功');
      // 你可以在这里添加其他逻辑，例如重定向到登录页面
      userStore.login(data.data)
      await router.push('/main')
    } else {
      ElMessage.error(data.message);
    }
  } catch (error) {
    ElMessage.error('注册失败');
    console.log(error)
  }
};

const formData = ref({
  username: "admin",
  account:"admin",
  password: "admin",
  role: localStorage.getItem('selectedRole'),
});
const registerDate = ref({
  username: "",
  account:"",
  password: "",
  role: roleStore.selectedRole,
});
const isLogin = ref(false);
const loginInfo = ref({});
const handleLogin = () => {
  if (!formData.value.account) {
    ElMessage.error('请输入用户名')
    return
  }
  if (!formData.value.password) {
    ElMessage.error('请输入密码')
    return
  }
  http.post('http://localhost:8080/api/login', {
    account: formData.value.account,
    password: formData.value.password,
  }).then((response) => {
    const data = response.data
    if (data.code == 200) {
      userStore.login(data.data)
      ElMessage.success('登录成功')
      router.push('/main')
    } else {
      ElMessage.error(data.message)
    }
  }).catch((error) => {
    ElMessage.error('用户名或密码不正确')
  })
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
  formData.value.account = '';
  formData.value.password = '';
  // 清空当前用户
  localStorage.removeItem('userInfo');
};

</script>

<template>
  <div class="container" v-if="!isLogin" @keyup.enter.native="handleLogin">
    <div class="welcome">
      <div class="pinkbox">
        <div class="signup" :class="{ nodisplay: showSignIn }">
          <h1>register</h1>
          <form autocomplete="off">
            <input v-model="registerDate.username" type="text" placeholder="username">
            <input v-model="registerDate.account" type="text" placeholder="account">
            <input v-model="registerDate.password" type="password" placeholder="password">
            <div class="flex flex-wrap gap-4 items-center">
              <el-select
                  v-model="roleStore.selectedRole"
                  placeholder="Select"
                  size="large"
                  style="width: 240px"
                  @change="handleSelection"
              >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </div>
            <button class="button submit" @click.prevent="handleCreateAccount">create account</button>
          </form>
        </div>
        <div class="signin" :class="{ nodisplay: !showSignIn }">
          <h1>sign in</h1>
          <form class="more-padding" autocomplete="off">
            <input type="text" placeholder="account" v-model="formData.account">
            <input type="password" placeholder="password" v-model="formData.password">
            <div class="checkbox">
              <input type="checkbox" id="remember"/><label for="remember">remember me</label>
            </div>
            <button class="button submit" type="button" @click="handleLogin">login</button>
          </form>
        </div>
      </div>
      <div class="leftbox">
        <h2 class="title"><span>BLOOM</span>&<br>BOUQUET</h2>
        <p class="desc">pick your perfect <span>bouquet</span></p>
        <img class="flower smaller" src="https://image.ibb.co/d5X6pn/1357d638624297b.jpg" alt="1357d638624297b"
             border="0">
        <p class="account">have an account?</p>
        <button class="button" id="signin" @click="toggleForm(true)">login</button>
      </div>
      <div class="rightbox">
        <h2 class="title"><span>BLOOM</span>&<br>BOUQUET</h2>
        <p class="desc"> pick your perfect <span>bouquet</span></p>
        <img class="flower" src="https://preview.ibb.co/jvu2Un/0057c1c1bab51a0.jpg"/>
        <p class="account">don't have an account?</p>
        <button class="button" id="signup"  @click="toggleForm(false)">sign up</button>
      </div>
    </div>
  </div>
  <div v-else style="{position: absolute;top: 0; bottom: 0;left: 0;right: 0;margin-top: 25%; }">
    欢迎，{{ loginInfo.type }} {{ loginInfo.username }}
    <el-button type="success" @click="handleExit">退出登录</el-button>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400|Lora");
:global(body) {
  background: #CBC0D3;
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  margin: 0 auto;
  width: 650px;
  height: 550px;
  position: relative;
  top: 50px;
}

.welcome {
  background: #f6f6f6;
  width: 650px;
  height: 415px;
  position: absolute;
  top: 25%;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
}

.pinkbox {
  position: absolute;
  top: -10%;
  left: 5%;
  background: #EAC7CC;
  width: 320px;
  height: 500px;
  border-radius: 5px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: all .5s ease-in-out;
  z-index: 2;
}

.nodisplay {
  display: none;
  transition: all .5s ease;
}

.leftbox, .rightbox {
  position: absolute;
  width: 50%;
  transition: 1s all ease;
}

.leftbox {
  left: -2%;
}

.rightbox {
  right: -2%;
}

h1 {
  font-family: "Open Sans", sans-serif;
  text-align: center;
  margin-top: 95px;
  text-transform: uppercase;
  color: #f6f6f6;
  font-size: 2em;
  letter-spacing: 8px;
}

.title {
  font-family: "Lora", serif;
  color: #8E9AAF;
  font-size: 1.8em;
  line-height: 1.1em;
  letter-spacing: 3px;
  text-align: center;
  font-weight: 300;
  margin-top: 20%;
}

.desc {
  margin-top: -8px;
}

.account {
  margin-top: 45%;
  font-size: 10px;
}

p {
  font-family: "Open Sans", sans-serif;
  font-size: .7em;
  letter-spacing: 2px;
  color: #8E9AAF;
  text-align: center;
}

span {
  color: #EAC7CC;
}

.flower {
  position: absolute;
  width: 120px;
  height: 120px;
  top: 46%;
  left: 29%;
  opacity: .7;
}

.smaller {
  width: 90px;
  height: 100px;
  top: 48%;
  left: 38%;
  opacity: .9;
}

button {
  padding: 12px;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 11px;
  border-radius: 10px;
  margin: auto;
  outline: none;
  display: block;
}

button:hover {
  background: #EAC7CC;
  color: #f6f6f6;
  transition: background-color 1s ease-out;
}

.button {
  margin-top: 3%;
  background: #f6f6f6;
  color: #ce7d88;
  border: solid 1px #EAC7CC;
}

form {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 7px;
}

.more-padding {
  padding-top: 35px;
}

.more-padding input {
  padding: 12px;
}

.more-padding .submit {
  margin-top: 45px;
}

.submit {
  margin-top: 25px;
  padding: 12px;
  border-color: #ce7d88;
}

.submit:hover {
  background: #CBC0D3;
  border-color: #bfb1c9;
}

input{
  background: #EAC7CC;
  width: 65%;
  color: #ce7d88;
  border: none;
  border-bottom: 1px solid rgba(246, 246, 246, 0.5);
  padding: 9px;
  margin: 7px;
}

:global(.el-select__wrapper){
  background: #EAC7CC;
  width: 100%;
  color: #ce7d88;
  border: none;
  border-bottom: 1px solid rgba(246, 246, 246, 0.5);
  padding: 9px;
  margin: 7px;
}

input::placeholder {
  color: #f6f6f6;
  letter-spacing: 2px;
  font-size: 1.3em;
  font-weight: 100;
}

input:focus {
  color: #ce7d88;
  outline: none;
  border-bottom: 1.2px solid rgba(206, 125, 136, 0.7);
  font-size: 1em;
  transition: .8s all ease;
}

input:focus::placeholder {
  opacity: 0;
}

label {
  font-family: "Open Sans", sans-serif;
  color: #ce7d88;
  font-size: 0.8em;
  letter-spacing: 1px;
}

.checkbox {
  display: inline;
  white-space: nowrap;
  position: relative;
  left: -62px;
  top: 5px;
}

input[type=checkbox] {
  width: 7px;
  background: #ce7d88;
}

.checkbox input[type="checkbox"]:checked + label {
  color: #ce7d88;
  transition: .5s all ease;
}

.checkbox input[type="checkbox"]{
  height: 10px;
  width: 10px;
}
</style>
