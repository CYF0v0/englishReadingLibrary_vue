<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed prop="id" label="id" width="150" />
      <el-table-column prop="username" label="姓名" width="120" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column prop="account" label="账号" width="150" />
      <el-table-column prop="password" label="密码" width="150" />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleEdit(scope.$index)">编辑</el-button>
          <el-popconfirm title="确定要删除吗?" @confirm="deleteRow(scope.$index)" confirm-button-text="确定"
                         cancel-button-text="取消">
            <template #reference>
              <el-button link type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="editDialogVisible" title="编辑用户信息" width="20%">
      <el-form :model="editedUser">
        <el-form-item label="姓名">
          <el-input v-model="editedUser.username" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editedUser.role" placeholder="请选择角色">
            <el-option v-for="role in roles" :key="role" :label="role" :value="role" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editedUser.password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const currentUserAccount = ref(null)
const editDialogVisible = ref(false)
const editedUser = ref({
  id: null,
  username: '',
  role: '',
  account: '',
  password: ''
})

const roles = ['student', 'parent', 'teacher', 'admin']

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/getAllUsers')
    if (response.data.code === 200) {
      const userInfo = JSON.parse(<string>localStorage.getItem('userInfo'))
      if (userInfo.role === 'admin') {
        tableData.value = response.data.data
      } else {
        tableData.value = []
      }
    } else {
      console.error(response.data.message)
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

onMounted(() => {
  fetchUsers()
  const userInfo = JSON.parse(<string>localStorage.getItem('userInfo'))
  if (userInfo) {
    currentUserAccount.value = userInfo.account
  }
})

const handleEdit = (index: number) => {
  const userAccount = tableData.value[index].account
  if (userAccount === currentUserAccount.value) {
    ElMessage.error('Cannot edit current user')
    return
  }
  editedUser.value = { ...tableData.value[index] }
  editDialogVisible.value = true
}

const saveEdit = async () => {
  try {
    const response = await axios.put(`http://localhost:8080/api/updateUser/${editedUser.value.account}`, editedUser.value)
    if (response.data.code === 200) {
      const updatedUser = response.data.data
      const index = tableData.value.findIndex(user => user.id === updatedUser.id)
      if (index !== -1) {
        tableData.value.splice(index, 1, updatedUser)
      }
      ElMessage.success('User updated successfully')
    } else {
      ElMessage.error(response.data.message)
    }
  } catch (error) {
    console.error('Failed to update user:', error)
    ElMessage.error('Failed to update user')
  } finally {
    editDialogVisible.value = false
  }
}

const deleteRow = async (index: number) => {
  const userAccount = tableData.value[index].account
  if (userAccount === currentUserAccount.value) {
    ElMessage.error('Cannot delete current user')
    return
  }
  try {
    await axios.delete(`http://localhost:8080/api/deleteUsers/${userAccount}`)
    tableData.value.splice(index, 1)
    ElMessage.success('User deleted successfully')
  } catch (error) {
    console.error('Failed to delete user:', error)
    ElMessage.error('Failed to delete user')
  }
}
</script>

<style scoped>
.el-scrollbar :global(.el-scrollbar__view) {
  display: block !important;
}
:global(.el-select__wrapper){
  background: white;
}
</style>