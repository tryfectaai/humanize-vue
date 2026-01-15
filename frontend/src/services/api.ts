import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management
const getAccessToken = (): string | null => localStorage.getItem('accessToken')
const getRefreshToken = (): string | null => localStorage.getItem('refreshToken')

const setTokens = (access: string, refresh: string): void => {
  localStorage.setItem('accessToken', access)
  localStorage.setItem('refreshToken', refresh)
}

const clearTokens = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Wait for token refresh
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || '/api'}/auth/token/refresh`,
          { refreshToken: refreshToken }
        )

        const { accessToken } = response.data
        localStorage.setItem('accessToken', accessToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        onTokenRefreshed(accessToken)
        isRefreshing = false

        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// API helper functions
export const uploadFile = async (
  url: string,
  file: File,
  fieldName: string = 'file',
  additionalData?: Record<string, string>
): Promise<unknown> => {
  const formData = new FormData()
  formData.append(fieldName, file)
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }

  const response = await api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const uploadFiles = async (
  url: string,
  files: File[],
  fieldName: string = 'files',
  additionalData?: Record<string, string>
): Promise<unknown> => {
  const formData = new FormData()
  
  files.forEach((file) => {
    formData.append(fieldName, file)
  })
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }

  const response = await api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export { api, getAccessToken, getRefreshToken, setTokens, clearTokens }
export default api
