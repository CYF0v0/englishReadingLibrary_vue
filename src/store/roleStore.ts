import { defineStore } from 'pinia';

export const useRoleStore = defineStore('role', {
    state: () => ({
        selectedRole: localStorage.getItem('selectedRole') || '',
        account: '',
        username: '',
        password: '',
    }),
    actions: {
        setSelectedRole(role: string) {
            this.selectedRole = role;
            localStorage.setItem('selectedRole', role);
        },
        setAccountInfo(account: string, username: string, password: string) {
            this.account = account;
            this.username = username;
            this.password = password;
            // 可以在这里添加保存到 localStorage 或其他存储机制的逻辑
            localStorage.setItem('account', account);
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        },
    },
});