<template>
  <el-result
    status="404"
    title="404"
    style="background: none"
    sub-title="Sorry, the page you visited does not exist."
  >
    <template #extra>
      <router-link to="/main/index">
        <el-button type="primary">返回首页</el-button>
      </router-link>
    </template>
  </el-result>
</template>

<script lang="ts">
</script>
