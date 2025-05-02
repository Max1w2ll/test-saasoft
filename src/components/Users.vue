<script setup lang="ts">
    import { useUsersStore } from '../stores/users.ts'
    import { computed, ref, watch } from 'vue'
    import type { UserInfo } from '../interfaces/interfaces'

    const usersStore = useUsersStore()

    const newUser = ref<UserInfo, 'id'>({
        tags: '',
        type: 'Локальная',
        login: '',
        password: ''
    })

    watch(() => newUser.value.type, (newType) => {
        if (newType == 'LDAP') {
            newUser.value.password = null
        } else if (newType == 'Локальная' && !newUser.value.password) {
            newUser.value.password = ''
        }
    })

    const addNewUser = () => {
        usersStore.addUser({ ...newUser.value })
        newUser.value = { ...newUser.value }
    }

    const deleteUser = (id: number) => {
        usersStore.removeUser(id)
    }

    const updateUserField = (user: UserInfo, field: keyof UserInfo, value: string) => {
        const updatedUser = { ...user, [field]: value }
        usersStore.updateUser(updatedUser)
    }
</script>

<template>
    <div class="min-w-[945px] min-h-[300px]">
        <div class="flex">
            <h2 class="text-lg font-extrabold text-white text-left mb-4"> Учётные записи </h2>

            <button @click="addNewUser" class="mt-0.5 border border-neutral-700 rounded-sm p-1 h-7 text-center ml-3 hover:border-neutral-200 cursor-pointer duration-200">
                <svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
                </svg>
            </button>
        </div>


        <div class="p-2 text-left bg-gray-700 text-neutral-400 mb-6 flex rounded-sm">
            <svg class="mx-2 w-6 h-6 text-neutral-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            <span> Для указания нескольких меток для одной пары логин/пароль используйте разделитель ; </span>
        </div>

        <div class="relative overflow-x-auto rounded-sm">
            <table class="w-full text-sm text-left rtl:text-right text-neutral-500 dark:text-neutral-400">
                <thead class="text-xs text-neutral-700 uppercase bg-neutral-50 dark:bg-neutral-700 dark:text-neutral-400 min-w-[945px]">
                    <tr>
                        <th scope="col" class="px-6 py-3 w-[236px]">
                            Метки
                        </th>
                        <th scope="col" class="px-6 py-3 w-[181px]">
                            Тип записи
                        </th>
                        <th scope="col" class="px-6 py-3 w-[225px]">
                            Логин
                        </th>
                        <th scope="col" class="px-6 py-3 w-[254px]">
                            Пароль
                        </th>
                        <th scope="col" class="px-6 py-3 w-[48px]"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in usersStore.userList" :key="index" class="border-b bg-neutral-800 border-neutral-700">
                        <th scope="row" class="px-6 py-3 whitespace-nowrap w-[25%]">
                            <input @input="updateUserField(user, 'tags', ($event.target as HTMLInputElement).value)" v-model="user.tags" maxlength="50"
                                class="h-10 pl-4 font-normal border  border-b bg-neutral-800 border-neutral-700 hover:border-neutral-200 rounded-sm duration-200" placeholder="Введите тег(и)">
                        </th>
                        <td class="px-6 py-4">
                            <select v-model="user.type" @change="updateUserField(user, 'type', ($event.target as HTMLSelectElement).value)"
                                class="border-b bg-neutral-800 border-neutral-700 hover:border-neutral-200 cursor-pointer rounded-sm duration-200">
                                <option v-for="type in usersStore.userTypes" :value="type.value" :key="type.value">
                                    {{ type.label }}
                                </option>
                            </select>
                        </td>
                        <td class="px-6 py-4">
                            <input @input="updateUserField(user, 'login', ($event.target as HTMLInputElement).value)" v-model="user.login" maxlength="100" :class="user.login ? '' : '!border-red-600'"
                                class="h-10 pl-4 border border-b bg-neutral-800 border-neutral-700 hover:border-neutral-200 rounded-sm duration-200" placeholder="Введите логин">
                        </td>
                        <td class="px-6 py-4">
                            <input v-if="user.type == 'Локальная'" v-model="user.password" @input="updateUserField(user, 'password', ($event.target as HTMLInputElement).value)" type="password"
                                class="h-10 border border-b bg-neutral-800 border-neutral-700 hover:border-neutral-200 rounded-sm duration-200"
                                :class="!user.password && user.type == 'Локальная' ? '!border-red-600' : ''" placeholder="********" />
                        </td>
                        <td>
                            <svg @click="deleteUser(user.id)" class="w-6 h-6 text-neutral-400 hover:text-neutral-200 cursor-pointer duration-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                            </svg>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="mt-5" v-if="usersStore.userList.length == 0">
                <button @click="addNewUser" class="border bg-neutral-800 border-neutral-700 rounded-sm p-2 px-3 text-center hover:border-neutral-200 cursor-pointer">
                    Добавить нового пользователя
                </button>
            </div>
        </div>
    </div>
</template>