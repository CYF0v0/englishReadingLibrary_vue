<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox, ElDialog, ElButton } from 'element-plus'

const activeName = ref('1')
const dialogEnrollVisible = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = ref({
  name: '',
  teacher: '',
  charge: 10000,
  status: 0,
})

const enrollForm = ref({
  courseName: '',
  studentId: null,
  date: '',
  status: false,
  score: 60,
})

const courses = ref([])
const userInfo = ref(null)
const editCourse = ref(null)
const selectedCourse = ref(null)

const fetchCourses = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/courses/getAll')
    if (response.data.code === 200) {
      courses.value = response.data.data
    } else {
      console.error(response.data.message)
    }
  } catch (error) {
    console.error('Failed to fetch courses:', error)
  }
}

onMounted(() => {
  fetchCourses()
  userInfo.value = JSON.parse(<string>localStorage.getItem('userInfo'))
})

const handleEdit = (course: any) => {
  editCourse.value = { ...course }
  form.value = { ...course } // 将当前课程信息填充到表单中
  dialogFormVisible.value = true
}

const handleDelete = (course: any) => {
  ElMessageBox.confirm('确定要删除此课程吗？', '删除课程', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    axios.delete(`http://localhost:8080/api/courses/deleteById/${course.id}`)
        .then(response => {
          if (response.data.code === 200) {
            courses.value = courses.value.filter(c => c.id !== course.id)
            ElMessage.success('课程删除成功')
          } else {
            ElMessage.error(response.data.message)
          }
        })
        .catch(error => {
          console.error('Failed to delete course:', error)
          ElMessage.error('删除课程失败')
        })
  })
}

const handleAddCourse = () => {
  editCourse.value = null
  form.value = { // 重置表单
    name: '',
    teacher: '',
    charge: 10000,
    status: 0,
  }
  dialogFormVisible.value = true
}

const submitForm = () => {
  const url = editCourse.value ? `http://localhost:8080/api/courses/updateById/${editCourse.value.id}` : 'http://localhost:8080/api/courses/create'
  const method = editCourse.value ? 'put' : 'post'
  axios[method](url, form.value)
      .then(response => {
        if (response.data.code === 200) {
          fetchCourses()
          dialogFormVisible.value = false
          ElMessage.success(editCourse.value ? '课程更新成功' : '课程添加成功')
        } else {
          ElMessage.error(response.data.message)
        }
      })
      .catch(error => {
        console.error(editCourse.value ? 'Failed to update course:' : 'Failed to add course:', error)
        ElMessage.error(editCourse.value ? '更新课程失败' : '添加课程失败')
      })
}

const handleEnroll = (course: any) => {
  selectedCourse.value = course
  enrollForm.value.courseName = course.name
  enrollForm.value.studentId = userInfo.value.id
  dialogEnrollVisible.value = true
}

const handlePay = () => {
  ElMessageBox.confirm('确定要支付吗？', '支付确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 获取当前日期并格式化为 'YYYY-MM-DD'
    const currentDate = new Date().toISOString().split('T')[0];
    enrollForm.value.date = currentDate;

    axios.post('http://localhost:8080/api/enrollcourses/create', enrollForm.value)
        .then(response => {
          if (response.data.code === 200) {
            dialogEnrollVisible.value = false
            ElMessage.success('报名成功')
          } else if (response.data.code === 409) {
            ElMessage.error('请勿重复报名')
          } else {
            ElMessage.error(response.data.message)
          }
        })
        .catch(error => {
          console.error('Failed to enroll course:', error)
          ElMessage.error('报名失败')
        })
  })
}

function refresh() {
  this.$router.go(0)
}
</script>

<template>
  <div class="demo-collapse">
    <el-button type="primary" @click="handleAddCourse" v-if="userInfo && (userInfo.role === 'teacher' || userInfo.role === 'admin')">添加课程</el-button>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item v-for="course in courses" :key="course.id" :title="course.name" :name="course.id">
        <el-descriptions>
          <el-descriptions-item label="课程id">{{ course.id }}</el-descriptions-item>
          <el-descriptions-item label="任课老师">{{ course.teacher }}</el-descriptions-item>
          <el-descriptions-item label="费用">
            <el-tag size="small">{{ course.charge }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag size="small">{{ course.status === 0 ? '未开课' : '已开课' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上课网站">
            No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
          </el-descriptions-item>
          <el-descriptions-item>
            <el-button type="primary" text @click="handleEnroll(course)" v-if="userInfo && (userInfo.role === 'student' || userInfo.role === 'teacher')">
              报名
            </el-button>
            <el-button type="primary" text @click="handleEdit(course)" v-if="userInfo && (userInfo.role === 'teacher' || userInfo.role === 'admin')">
              编辑
            </el-button>
            <el-button type="danger" text @click="handleDelete(course)" v-if="userInfo && (userInfo.role === 'teacher' || userInfo.role === 'admin')">
              删除
            </el-button>
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>

    <el-dialog v-model="dialogFormVisible" :title="editCourse ? '编辑课程' : '添加课程'">
      <el-form :model="form">
        <el-form-item label="课程名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="任课老师" :label-width="formLabelWidth">
          <el-input v-model="form.teacher" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="费用" :label-width="formLabelWidth">
          <el-input-number v-model="form.charge" :min="0" :step="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="未开课" :value="0"></el-option>
            <el-option label="已开课" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogEnrollVisible" title="报名确认">
      <el-form :model="enrollForm">
        <el-form-item label="课程名称" :label-width="formLabelWidth">
          <el-input v-model="enrollForm.courseName" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="学生ID" :label-width="formLabelWidth">
          <el-input v-model="enrollForm.studentId" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="费用" :label-width="formLabelWidth">
          <el-input v-model="selectedCourse.charge" autocomplete="off" readonly></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEnrollVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePay">支付</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.el-collapse-item {
  margin: 0 1rem;
}
</style>