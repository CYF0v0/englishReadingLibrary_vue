<template>
  <div>
    <div>
      <el-button class="mt-4" @click="handleAdd">
        添加
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed prop="createdAt" label="添加时间" width="150" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="sex" label="性别" width="120">
        <template #default="scope">
          <el-tag
            :type="scope.row.sex === '男' ? '' : 'success'"
            disable-transitions
            >{{ scope.row.sex }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="120" />
      <el-table-column prop="x" label="" />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button
            link
            size="small"
            @click.prevent="handleEdit(scope)"
          >
            编辑
          </el-button>
          <el-popconfirm title="确定要删除吗?" @confirm="deleteRow(scope.$index)" confirm-button-text="确定"
    cancel-button-text="取消">
            <template #reference>
              <el-button
                link
                type="primary"
                size="small"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <EditForm v-if="formShow" :dialogVisible="formShow" :formData="formData" :formIndex="formIndex" @ok="handleFormOk" @cancel="handleFormCancel"></EditForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import EditForm from './form.vue'

const tableData = ref([
  {
    name: '张三',
    sex: '男',
    mobile: '19100001111',
    createdAt: '2024-01-01',
  },
])

const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}

const formShow = ref(false)

const handleFormOk = (value: any, formIndex: Number) => {
  formShow.value = false
  if (formIndex == -1) {
    tableData.value.push(value)
  } else {
    tableData.value[parseInt(formIndex.toString())] = value
  }
}

const handleFormCancel = () => {
  formShow.value = false
}
const formData = ref({})
const formIndex = ref(-1)
const handleAdd = () => {
  formData.value = {
    name: '',
    sex: '男',
    mobile: '',
    createdAt: '',
  }
  formIndex.value = -1
  formShow.value = true
}

const handleEdit = (scope: any) => {
  formData.value = scope.row
  formIndex.value = scope.$index
  formShow.value = true
}
</script>