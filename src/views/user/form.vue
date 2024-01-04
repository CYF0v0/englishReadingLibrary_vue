<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="`${isAdd ? '添加' : '编辑' }用户`"
    width="400px"
  >
    <span></span>
    <el-form ref="formRef" :model="formInfo" label-width="80px" :rules="rules">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formInfo.name" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="formInfo.sex">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formInfo.mobile" placeholder="手机号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleOk">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import dayjs from 'dayjs'

const emit = defineEmits(['ok', 'cancel'])
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  formData: {
    type: Object,
    default: {
      name: '',
      sex: '',
      mobile: '',
      createdAt: '',
    }
  },
  formIndex: {
    type: Number,
    default: -1,
  }
})
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入姓名' },
  ],
  mobile: [
    { required: true, message: '请输入手机号' },
  ],
})
const formInfo = ref({ ...props.formData })
const formRef = ref<FormInstance>()

const isAdd = ref(false)
if (!props.formData?.createdAt) {
  isAdd.value = false
  formInfo.value.createdAt = dayjs().format('YYYY-MM-DD')
} else {
  isAdd.value = true
}
const handleCancel = () => {
  emit('cancel')
}

const handleOk = () => {
  if (!formRef.value) {
    return false
  }
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log(formInfo.value, 'formInfo.value')
      emit('ok', formInfo.value, props.formIndex)
    } else {
      return false
    }
  })
}
</script>