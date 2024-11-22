<script setup lang="ts">
</script>

<template>
  <router-view></router-view>
</template>

<style >
.logo {
  height: 6em;

  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
#app{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.el-select__wrapper{
  background: white;
}
</style>
