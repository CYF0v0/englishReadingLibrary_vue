# Vue 用户管理系统

node版本: v22.8.0

## 项目描述

本项目是一个基于 Vue 3 和 Element Plus 的用户管理系统。系统允许管理员查看、编辑和删除用户信息。用户角色包括学生、家长、教师和管理员。  

## 主要功能

用户列表展示：显示所有用户的详细信息，包括用户名、角色、账号和密码。
用户编辑：管理员可以编辑用户的详细信息，并保存更改。
用户删除：管理员可以删除用户信息。
权限控制：仅管理员可以查看和操作用户列表。

## 技术栈

前端：
Vue 3
TypeScript
Element Plus
Axios (用于与后端 API 通信)

## 安装与运行
#### 克隆仓库：  

```
git clone https://github.com/CYF0v0/englishReadingLibrary_vue.git
cd englishReadingLibrary_vue
```

#### 安装依赖：  

```
npm install
```

#### 运行项目：  

```
npm run serve
```

## 项目结构：

```
vue-project/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  ├─ views/
│  ├─ store/
│  ├─ App.vue
│  └─ main.ts
├─ package.json
└─ README.md
```

