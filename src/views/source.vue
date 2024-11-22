<template>
  <div>
    <el-button type="primary" @click="handleAddResource" v-if="userInfo && (userInfo.role === 'teacher' || userInfo.role === 'admin')">添加资源</el-button>
    <el-table ref="tableRef" row-key="id" :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="publisher" label="Publisher" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="time" label="Time" sortable width="180" column-key="time">
        <template #default="scope">
          {{ formatDate(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column prop="url" label="URL" :formatter="formatter" />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)" v-if="userInfo && (userInfo.role === 'teacher' || userInfo.role === 'admin')">编辑</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(scope.row)" v-if="userInfo && (userInfo.role === 'teacher' || userInfo.role === 'admin')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="editDialogVisible" :title="editedResource.id ? '编辑资源' : '添加资源'" width="20%">
      <el-form :model="editedResource">
        <el-form-item label="Publisher">
          <el-input v-model="editedResource.publisher" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="editedResource.name" />
        </el-form-item>
        <el-form-item label="Time">
          <DatePicker
              v-model="editedResource.time"
              type="date"
              placeholder="Select date"
              value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="editedResource.url" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editedResource.id ? saveEdit() : saveNewResource()">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { TableColumnCtx, TableInstance } from 'element-plus'
import { format } from 'date-fns'
import DatePicker from 'vue3-datepicker' // 确保已经安装了vue3-datepicker

interface Resource {
  id: number
  publisher: string
  name: string
  time: Date | null
  url: string
}

const tableRef = ref<TableInstance>()
const tableData = ref<Resource[]>([])
const userInfo = ref<{ role: string } | null>(null)
const editDialogVisible = ref(false)
const editedResource = ref<Resource>({
  id: 0,
  publisher: '',
  name: '',
  time: null,
  url: ''
})

const resetDateFilter = () => {
  tableRef.value!.clearFilter(['time'])
}
const clearFilter = () => {
  tableRef.value!.clearFilter()
}
const formatter = (row: Resource, column: TableColumnCtx<Resource>) => {
  return row.url
}

const formatDate = (date: Date | null) => {
  return date ? format(new Date(date), 'yyyy-MM-dd') : ''
}

const fetchResources = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/resources/getAll')
    if (response.data.code === 200) {
      tableData.value = response.data.data.map((resource: Resource) => ({
        ...resource,
        time: resource.time ? new Date(resource.time) : null
      }))
    } else {
      console.error(response.data.message)
    }
  } catch (error) {
    console.error('Failed to fetch resources:', error)
  }
}

const handleEdit = (resource: Resource) => {
  editedResource.value = { ...resource, time: resource.time ? new Date(resource.time) : null }
  editDialogVisible.value = true
}

const handleDelete = async (resource: Resource) => {
  try {
    await axios.delete(`http://localhost:8080/api/resources/deleteById/${resource.id}`)
    tableData.value = tableData.value.filter(r => r.id !== resource.id)
    ElMessage.success('Resource deleted successfully')
  } catch (error) {
    console.error('Failed to delete resource:', error)
    ElMessage.error('Failed to delete resource')
  }
}

const handleAddResource = () => {
  editedResource.value = {
    id: 0,
    publisher: '',
    name: '',
    time: null,
    url: ''
  }
  editDialogVisible.value = true
}

const saveEdit = async () => {
  try {
    const formattedDate = editedResource.value.time ? format(new Date(editedResource.value.time), 'yyyy-MM-dd') : null
    const response = await axios.put(`http://localhost:8080/api/resources/updateById/${editedResource.value.id}`, {
      ...editedResource.value,
      time: formattedDate
    })
    if (response.data.code === 200) {
      const updatedResource = response.data.data
      const index = tableData.value.findIndex(resource => resource.id === updatedResource.id)
      if (index !== -1) {
        tableData.value.splice(index, 1, { ...updatedResource, time: updatedResource.time ? new Date(updatedResource.time) : null })
      }
      ElMessage.success('Resource updated successfully')
    } else {
      ElMessage.error(response.data.message)
    }
  } catch (error) {
    console.error('Failed to update resource:', error)
    ElMessage.error('Failed to update resource')
  } finally {
    editDialogVisible.value = false
  }
}

const saveNewResource = async () => {
  try {
    const formattedDate = editedResource.value.time ? format(new Date(editedResource.value.time), 'yyyy-MM-dd') : null
    const response = await axios.post('http://localhost:8080/api/resources/create', {
      ...editedResource.value,
      time: formattedDate
    })
    if (response.data.code === 200) {
      const newResource = response.data.data
      tableData.value.push({ ...newResource, time: newResource.time ? new Date(newResource.time) : null })
      ElMessage.success('Resource added successfully')
    } else {
      ElMessage.error(response.data.message)
    }
  } catch (error) {
    console.error('Failed to add resource:', error)
    ElMessage.error('Failed to add resource')
  } finally {
    editDialogVisible.value = false
  }
}

onMounted(() => {
  fetchResources()
  userInfo.value = JSON.parse(<string>localStorage.getItem('userInfo'))
})
</script>

<style scoped>
:global(.v3dp__input_wrapper ){

    align-items: center;
    background-color: var(--el-input-bg-color,var(--el-fill-color-blank));
    background-image: none;
    border-radius: var(--el-input-border-radius,var(--el-border-radius-base));
    box-shadow: 0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;
    cursor: text;
    display: inline-flex;
    flex-grow: 1;
    justify-content: center;
    padding: 1px 11px;
    transform: translateZ(0);
    transition: var(--el-transition-box-shadow);

}

:global(.v3dp__datepicker input ){
  width: 100%;
    --el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);
    -webkit-appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: var(--el-input-text-color,var(--el-text-color-regular));
    flex-grow: 1;
    font-size: inherit;
    height: var(--el-input-inner-height);
    line-height: var(--el-input-inner-height);
    outline: none;
    padding: 0;

}
</style>
