import api, { setTokens, clearTokens } from './api'
import type { 
  User, 
  AuthTokens, 
  LoginCredentials, 
  RegisterData, 
  PasswordResetRequest, 
  PasswordResetConfirm, 
  ChangePassword 
} from '@/types/user'

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface RegisterResponse {
  access: string
  refresh: string
  user: User
}

// Auth API service
export const authService = {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login/', credentials)
    const { access, refresh } = response.data
    setTokens(access, refresh)
    return response.data
  },

  // Register new account
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register/', data)
    const { access, refresh } = response.data
    setTokens(access, refresh) // Auto-login after registration
    return response.data
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout/')
    } finally {
      clearTokens()
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/user/')
    return response.data
  },

  // Request password reset
  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    await api.post('/auth/password/reset/', data)
  },

  // Confirm password reset
  async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
    await api.post('/auth/password/reset/confirm/', data)
  },

  // Change password
  async changePassword(data: ChangePassword): Promise<void> {
    await api.post('/auth/password/change/', data)
  },

  // Refresh token
  async refreshToken(refresh: string): Promise<{ access: string }> {
    const response = await api.post<{ access: string }>('/auth/token/refresh/', { refresh })
    return response.data
  },

  // Social login - Google
  async loginWithGoogle(idToken: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/social/google/', { id_token: idToken })
    const { access, refresh } = response.data
    setTokens(access, refresh)
    return response.data
  },

  // Social login - Apple
  async loginWithApple(code: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/social/apple/', { code })
    const { access, refresh } = response.data
    setTokens(access, refresh)
    return response.data
  },

  // Social login - Facebook
  async loginWithFacebook(accessToken: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/social/facebook/', { access_token: accessToken })
    const { access, refresh } = response.data
    setTokens(access, refresh)
    return response.data
  },

  // Verify email
  async verifyEmail(key: string): Promise<void> {
    await api.post('/auth/verify-email/', { key })
  },

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<void> {
    await api.post('/auth/resend-verification/', { email })
  },
}

export default authService
