import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore('setting', () => {
  const isCollapse = ref(false);

  return { isCollapse }
})