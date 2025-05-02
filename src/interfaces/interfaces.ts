export interface UserInfo {
    id: number
    tags: { text: string }[]
    type: 'LDAP' | 'Локальная'
    login: string
    password: string | null
}