<template>
  <div class="main">
    <div class="left">
      <div class="left-top">
        后台管理
      </div>
      <div class="left-main">
        <SideBar />
      </div>
    </div>
    <div class="right">
      <div class="right-top">
        这是顶部
      </div>
      <div class="right-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/layouts/SideBar/index.vue'

</script>

<style scoped>
.main {
  display: flex;
}
.left-top {
  height: 30px;
}
.right {
  margin-left: 30px;
}
.right-top {
  height: 30px;
}
.right-content {
  height: 100vh;
}
</style>