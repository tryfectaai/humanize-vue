export type AccountType = 'human' | 'humanize' | 'agency'

export interface User {
  id: number
  email: string
  name: string
  account_type: AccountType
  first_verified_login: boolean
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  date_joined: string
  last_login: string | null
  picture?: string
  profile_progress?: number
  admin_verified?: boolean
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password1: string
  password2: string
  name: string
  account_type: AccountType
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  uid: string
  token: string
  new_password1: string
  new_password2: string
}

export interface ChangePassword {
  old_password: string
  new_password1: string
  new_password2: string
}
