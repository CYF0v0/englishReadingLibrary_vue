<template>
  <el-descriptions title="欢迎来到中小学生课外英语阅读馆" ></el-descriptions>
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
      <el-descriptions-item label="姓名">kooriookami</el-descriptions-item>
      <el-descriptions-item label="电话">18100000000</el-descriptions-item>
      <el-descriptions-item label="地址">Suzhou</el-descriptions-item>
      <el-descriptions-item label="身份">
        <el-tag size="small">四种权限角色</el-tag>
      </el-descriptions-item>
<!--      <el-descriptions-item label="Address">-->
<!--        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province-->
<!--      </el-descriptions-item>-->
    </el-descriptions>
</template>
<style>
.el-descriptions__title{
  margin: 0 auto;
}
</style>
