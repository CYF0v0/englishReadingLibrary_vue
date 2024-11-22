<template>
  <!--  <div  v-if="!isLogin" @keyup.enter.native="handleLogin">-->
  <!--    <div>用户名: <el-input type="text" v-model="formData.username"></el-input></div>-->
  <!--    <div>密码:  <el-input type="password" v-model="formData.password"></el-input></div>-->
  <!--    <el-button @click="handleLogin">登录</el-button>-->
  <!--  </div>-->
  <div class="login-wrapper" v-if="!isLogin" @keyup.enter.native="handleLogin">
    <div class="login-cart">
      <p class="login-text">中小学生课外英语阅读馆</p>

      <!-- 输入 -->
      <div class="input-wrapper">
        <i class="iconfont icon-user-filling icon"></i>
        <input placeholder="请输入账号" v-model="formData.account"/>
      </div>
      <div class="input-wrapper">
        <i class="iconfont icon-lock icon"></i>
        <input type="password" placeholder="请输入密码" v-model="formData.password" ref="passwordInput"/>
        <i class="iconfont icon-hide icon" @click="changPasswordShow" ref="iconHide"></i>
      </div>

      <!-- 角色选择 -->
      <div class="role-wrap">
        <input type="radio" id="admin" value="admin" v-model="formData.role"/>
        <label for="admin">管理员</label>
        <input type="radio" id="teacher" value="teacher" v-model="formData.role"/>
        <label for="teacher">老师</label>
        <input type="radio" id="student" value="student" v-model="formData.role"/>
        <label for="student">学生</label>
        <input type="radio" id="parent" value="parent" v-model="formData.role"/>
        <label for="parent">家长</label>
      </div>

      <button class="loginbt" @click="handleLogin">登 录</button>
      <br>
      <el-link @click="open">注册</el-link>
    </div>
  </div>
  <div v-else style="{position: absolute;top: 0; bottom: 0;left: 0;right: 0;margin-top: 25%; }">
    欢迎，{{ loginInfo.type }} {{ loginInfo.username }}
    <el-button type="success" @click="handleExit">退出登录</el-button>
  </div>

</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage,ElMessageBox} from 'element-plus'
import {useUserStore} from '@/store/user'
import http from '@/utils/request'
import axios  from "axios";

const router = useRouter()
const userStore = useUserStore()
const passwordInput = ref();
const iconHide = ref();
const users = [{
  id: 1,
  username: 'admin',
  account:'admin',
  password: 'admin',
  role: '管理员',
}, {
  id: 2,
  username: 'teacher',
  account:'teacher',
  password: 'teacher',
  role: '老师',
},{
  id: 3,
  username: 'student',
  account:'student',
  password: 'student',
  role: '学生',
},{
  id: 4,
  username: 'parent',
  account:'parent',
  password: 'parent',
  role: '家长',
}];

// const formData = ref({
//   username: '',
//   password: '',
// })
const formData = ref({
  id:0,
  username: "admin",
  account:"admin",
  password: "admin",
  role: "admin",
});


function changPasswordShow() {
  formData.value.type = passwordInput.value.type === "password" ? "text" : "password";
  formData.value.className = iconHide.value.className.indexOf("icon-hide") > -1 ? "iconfont icon-browse icon" : "iconfont icon-hide icon";
}



// 是否登录
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
  http.post('/api/login', {
    data: {
      username: formData.value.account,
      password: formData.value.password,
    }
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

const registerData = ref({
  id:0,
  username: "admin",
  account:"admin",
  password: "admin",
  role: "admin",
});
const open = () => {
  ElMessageBox.prompt('Please input your Message', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    
      })
}
</script>

<style lang="less" scoped>
.login-wrapper {
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: slategray;

  .login-cart {
    background-color: rgba(100, 100, 100, 0.25);
    backdrop-filter: blur(8px);
    width: 500px;
    height: 400px;
    box-shadow: 2px 2px 16px 2px rgba(39, 39, 39, 0.5);
    border-radius: 18px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    .login-text {
      margin-top: 18px;
      line-height: 60px;
      text-align: center;
      color: rgb(255, 255, 255);
      font-size: 32px;
    }

    .input-wrapper {
      box-sizing: border-box;
      margin: 22px auto;
      background-color: rgba(255, 255, 255, 0.1);
      width: 400px;
      height: 50px;
      outline: 0.5px solid rgba(235, 235, 235, 0.3);
      border-radius: 5px;
      padding: 4px 12px;
      transition: 0.5s;
      text-align: left;
      display: flex;
      align-items: center;

      .icon {
        font-size: 24px;
        color: rgba(224, 224, 224, 0.5);
      }

      .icon-hide,
      .icon-browse {
        cursor: pointer;
      }

      input {
        display: inline-block;
        background-color: transparent;
        width: 100%;
        height: 100%;
        border: 0;
        color: white;
        font-size: 16px;
        padding: 4px 14px;

        &:focus-visible {
          outline: 0;
        }
      }

      &:focus-within {
        outline: 0.5px solid rgb(142, 190, 138);
      }
    }

    .role-wrap {
      width: 400px;
      height: 30px;
      line-height: 30px;
      margin: -10px auto;
      text-align: left;

      input[type="radio"] {
        display: none;
      }

      input[type="radio"]:checked + label::after {
        position: absolute;
        content: "✔";
        font-size: 8px;
        left: -6px;
        color: rgb(142, 190, 138);
      }

      label {
        position: relative;
        color: white;
        font-size: 14px;
        margin-left: 8px;
        margin-right: 16px;

        &:before {
          display: inline-block;
          position: relative;
          left: -8px;
          top: 2px;
          width: 14px;
          height: 14px;
          border: 1px solid rgba(207, 236, 204, 0.5);
          border-radius: 4px;
          content: "";
          cursor: pointer;
          box-sizing: border-box;
        }
      }
    }

    .loginbt {
      background-color: rgba(116, 185, 110, 0.9);
      border: 0;
      color: white;
      margin: 25px 10px;
      width: 400px;
      height: 50px;
      border-radius: 5px;
      font-size: 18px;
      padding: 4px 16px;
      cursor: pointer;

      &:hover {
        background-color: rgb(142, 190, 138);
      }
    }

    .tip {
      color: rgb(240, 240, 240);
      font-size: 12px;
      margin-left: 55px;
      text-align: left;
    }
  }
  .subButton{

  }
  .el-link {
    margin-right: 8px;
  }
  .el-link .el-icon--right.el-icon {
    vertical-align: text-bottom;
  }
}
</style>