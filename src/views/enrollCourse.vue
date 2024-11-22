<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed prop="id" label="id" width="150" />
      <el-table-column prop="courseName" label="课程名称" width="150" />
      <el-table-column prop="studentId" label="学生ID" width="120" />
      <el-table-column prop="date" label="日期" width="150">
        <template #default="scope">
          {{ formatDate(scope.row.date) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template #default="scope">
          {{ scope.row.status ? '已学习' : '未学习' }}
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分数" width="120" />
      <el-table-column fixed="right" label="操作" width="250">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleStudy(scope.row.id, scope.row.status)" v-if="showStudyButton">
            {{ scope.row.status ? '已学习' : '学习' }}
          </el-button>
          <el-button link type="primary" size="small" @click="handleUpdateScore(scope.row.id)" v-if="showUpdateScoreButton">修改分数</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(scope.row.id)" v-if="showDeleteButton">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const currentUserRole = ref(null)
const showStudyButton = ref(false)
const showUpdateScoreButton = ref(false)
const showDeleteButton = ref(false)

const fetchEnrollCourses = async () => {
  const userInfo = JSON.parse(<string>localStorage.getItem('userInfo'))
  if (userInfo) {
    currentUserRole.value = userInfo.role
    showStudyButton.value = ['student', 'parent'].includes(currentUserRole.value)
    showUpdateScoreButton.value = ['admin', 'teacher'].includes(currentUserRole.value)
    showDeleteButton.value = ['admin', 'parent'].includes(currentUserRole.value)
  }

  try {
    let response
    if (currentUserRole.value === 'admin' || currentUserRole.value === 'parent') {
      response = await axios.get('http://localhost:8080/api/enrollcourses/getAll')
    } else {
      const studentId = userInfo.id
      response = await axios.get(`http://localhost:8080/api/enrollcourses/getByStudentId/${studentId}`)
    }

    if (response.data.code === 200) {
      tableData.value = response.data.data
    } else {
      console.error(response.data.message)
    }
  } catch (error) {
    console.error('Failed to fetch enroll courses:', error)
  }
}

onMounted(() => {
  fetchEnrollCourses()
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return `${year}-${month}-${day}`
}

const handleStudy = async (id: number, status: boolean) => {
  if (status) {
    ElMessage.warning('课程已学习，无法再次学习')
    return
  }

  try {
    const response = await axios.put(`http://localhost:8080/api/enrollcourses/updateStatusById/${id}?status=true`)
    if (response.data.code === 200) {
      const updatedEnrollCourse = response.data.data
      const index = tableData.value.findIndex(course => course.id === updatedEnrollCourse.id)
      if (index !== -1) {
        tableData.value.splice(index, 1, updatedEnrollCourse)
      }
      ElMessage.success('课程状态更新成功')
    } else {
      ElMessage.error(response.data.message)
    }
  } catch (error) {
    console.error('更新课程状态失败:', error)
    ElMessage.error('更新课程状态失败')
  }
}

const handleUpdateScore = async (id: number) => {
  const score = prompt('请输入新的分数')
  if (score === null) return

  try {
    const response = await axios.put(`http://localhost:8080/api/enrollcourses/updateScoreById/${id}?score=${parseInt(score)}`)
    if (response.data.code === 200) {
      const updatedEnrollCourse = response.data.data
      const index = tableData.value.findIndex(course => course.id === updatedEnrollCourse.id)
      if (index !== -1) {
        tableData.value.splice(index, 1, updatedEnrollCourse)
      }
      ElMessage.success('课程分数更新成功')
    } else {
      ElMessage.error(response.data.message)
    }
  } catch (error) {
    console.error('更新课程分数失败:', error)
    ElMessage.error('更新课程分数失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/enrollcourses/deleteById/${id}`)
    if (response.data.code === 200) {
      const index = tableData.value.findIndex(course => course.id === id)
      if (index !== -1) {
        tableData.value.splice(index, 1)
      }
      ElMessage.success('课程删除成功')
    } else {
      ElMessage.error(response.data.message)
    }
  } catch (error) {
    console.error('删除课程失败:', error)
    ElMessage.error('删除课程失败')
  }
}
</script>

<style scoped>
.el-scrollbar :global(.el-scrollbar__view) {
  display: block !important;
}
</style>