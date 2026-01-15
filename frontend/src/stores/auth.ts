import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AccountType, LoginCredentials, RegisterData } from '@/types/user'
import authService from '@/services/auth'
import { getAccessToken, clearTokens } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!getAccessToken())
  const isHuman = computed(() => user.value?.account_type === 'human')
  const isCompany = computed(() => user.value?.account_type === 'humanize')
  const isAgency = computed(() => user.value?.account_type === 'agency')
  const accountType = computed(() => user.value?.account_type)
  const profileProgress = computed(() => user.value?.profile_progress ?? 0)
  const isProfileComplete = computed(() => profileProgress.value >= 100)
  const isAdminVerified = computed(() => user.value?.admin_verified ?? false)

  // Actions
  async function login(credentials: LoginCredentials): Promise<void> {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      user.value = response.user
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } }
      error.value = err.response?.data?.detail || 'Login failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function register(data: RegisterData): Promise<void> {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.register(data)
      user.value = response.user // Auto-login after registration
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string; email?: string[] } } }
      error.value = err.response?.data?.detail || err.response?.data?.email?.[0] || 'Registration failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    isLoading.value = true
    
    try {
      await authService.logout()
    } finally {
      user.value = null
      isLoading.value = false
    }
  }

  async function fetchCurrentUser(): Promise<void> {
    if (!getAccessToken()) {
      user.value = null
      return
    }

    isLoading.value = true
    
    try {
      user.value = await authService.getCurrentUser()
    } catch {
      user.value = null
      clearTokens()
    } finally {
      isLoading.value = false
    }
  }

  async function checkAuth(): Promise<void> {
    if (isInitialized.value) return
    
    const token = getAccessToken()
    if (token) {
      await fetchCurrentUser()
    }
    
    isInitialized.value = true
  }

  async function loginWithGoogle(idToken: string): Promise<void> {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.loginWithGoogle(idToken)
      user.value = response.user
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } }
      error.value = err.response?.data?.detail || 'Google login failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function loginWithApple(code: string): Promise<void> {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.loginWithApple(code)
      user.value = response.user
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } }
      error.value = err.response?.data?.detail || 'Apple login failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function requestPasswordReset(email: string): Promise<void> {
    isLoading.value = true
    error.value = null
    
    try {
      await authService.requestPasswordReset({ email })
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } }
      error.value = err.response?.data?.detail || 'Password reset request failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function resetPassword(uid: string, token: string, password: string): Promise<void> {
    isLoading.value = true
    error.value = null
    
    try {
      await authService.confirmPasswordReset({
        uid,
        token,
        new_password1: password,
        new_password2: password,
      })
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } }
      error.value = err.response?.data?.detail || 'Password reset failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function setAccountType(type: AccountType): void {
    if (user.value) {
      user.value.account_type = type
    }
  }

  function updateUser(updates: Partial<User>): void {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    user,
    isLoading,
    error,
    isInitialized,
    // Getters
    isAuthenticated,
    isHuman,
    isCompany,
    isAgency,
    accountType,
    profileProgress,
    isProfileComplete,
    isAdminVerified,
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    checkAuth,
    loginWithGoogle,
    loginWithApple,
    requestPasswordReset,
    resetPassword,
    setAccountType,
    updateUser,
    clearError,
  }
})
