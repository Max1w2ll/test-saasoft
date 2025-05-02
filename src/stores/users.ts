import { defineStore } from 'pinia'
import type { UserInfo } from '../interfaces/interfaces'

export const useUsersStore = defineStore('user', {
  state: () => ({
    userList: JSON.parse(localStorage.getItem('users') || '[]') as UserInfo[],
    user: null as UserInfo | null,
    nextId: parseInt(localStorage.getItem('nextUserId') || '1'),
    userTypes: [
      { value: 'LDAP', label: 'LDAP' },
      { value: 'Локальная', label: 'Локальная' }
    ]
  }),
  actions: {
    addUser(newUser: Omit<UserInfo, 'id'>) {
      const userToAdd = {
        ...newUser,
        id: this.nextId++,
      }
      this.userList.push(userToAdd)
    },
    removeUser(id: number) {
      this.userList = this.userList.filter(user => user.id !== id)
      this.saveToLocalStorage()
    },
    updateUser(userData: Omit<UserInfo, 'id'> & { id?: number }): boolean {
      if (!userData.login.trim()) return false
      if (userData.type === 'Локальная' && !userData.password?.trim()) return false

      // Здесь должна быть ещё обработка тегов, но не очень понял этот пункт в ТЗ

      if (userData.id) {
        const index = this.userList.findIndex(u => u.id === userData.id)
        if (index !== -1) {
          this.userList[index] = {
            ...userData,
            password: userData.type === 'Локальная' ? userData.password : null
          } as UserInfo
          this.saveToLocalStorage()
          return true
        }
        return false
      } 

      else {
        this.userList.push({
          ...userData,
          id: this.nextId++,
          password: userData.type === 'Локальная' ? userData.password : null
        })
        this.saveToLocalStorage()
        return true
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.userList))
      localStorage.setItem('nextUserId', this.nextId.toString())
    }
  }
})