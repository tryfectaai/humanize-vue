<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

const redirectPath = computed(() => {
  return (route.query.redirect as string) || '/app'
})

async function handleSubmit() {
  authStore.clearError()
  
  try {
    await authStore.login({ email: email.value, password: password.value })
    
    // Redirect based on account type and profile completion
    if (authStore.isHuman && !authStore.isProfileComplete) {
      router.push('/human/registration')
    } else if (authStore.isCompany && !authStore.isProfileComplete) {
      router.push('/company/registration')
    } else {
      router.push(redirectPath.value)
    }
  } catch {
    // Error is handled in store
  }
}

function handleGoogleLogin() {
  // TODO: Implement Google OAuth
  console.log('Google login')
}

function handleAppleLogin() {
  // TODO: Implement Apple OAuth
  console.log('Apple login')
}
</script>

<template>
  <div class="flex min-h-[80vh] items-center justify-center">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="card p-8 animate-fade-in">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-display font-bold text-content dark:text-dark-text">
            {{ t('auth.sign_in') }}
          </h1>
          <p class="mt-2 text-content-muted dark:text-dark-muted">
            {{ t('auth.dont_have_account') }}
            <RouterLink to="/register" class="link font-medium">
              {{ t('auth.sign_up') }}
            </RouterLink>
          </p>
        </div>

        <!-- Error message -->
        <div 
          v-if="error" 
          class="mb-6 p-4 rounded-lg bg-danger-light dark:bg-danger/10 text-danger text-sm animate-slide-down"
        >
          {{ error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="label">{{ t('auth.email') }}</label>
            <div class="relative">
              <EnvelopeIcon class="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="input pl-10 rtl:pl-4 rtl:pr-10"
                :placeholder="t('auth.email')"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label for="password" class="label mb-0">{{ t('auth.password') }}</label>
              <RouterLink to="/forgot-password" class="text-sm link">
                {{ t('auth.forgot_password') }}
              </RouterLink>
            </div>
            <div class="relative">
              <LockClosedIcon class="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="input pl-10 pr-10 rtl:pl-10 rtl:pr-10"
                :placeholder="t('auth.password')"
              />
              <button
                type="button"
                class="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                @click="showPassword = !showPassword"
              >
                <EyeSlashIcon v-if="showPassword" class="w-5 h-5" />
                <EyeIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Remember me -->
          <div class="flex items-center">
            <input
              id="remember"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label for="remember" class="ml-2 rtl:ml-0 rtl:mr-2 text-sm text-content dark:text-dark-text">
              {{ t('auth.remember_me') }}
            </label>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="btn-primary w-full"
          >
            <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span v-else>{{ t('auth.sign_in') }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-dark-border" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white dark:bg-dark-card px-4 text-content-muted dark:text-dark-muted">
              {{ t('auth.or_continue_with') }}
            </span>
          </div>
        </div>

        <!-- Social login buttons -->
        <div class="grid grid-cols-2 gap-4">
          <button
            type="button"
            class="btn-ghost border border-gray-300 dark:border-dark-border"
            @click="handleGoogleLogin"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{{ t('auth.google') }}</span>
          </button>
          <button
            type="button"
            class="btn-ghost border border-gray-300 dark:border-dark-border"
            @click="handleAppleLogin"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span>{{ t('auth.apple') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
