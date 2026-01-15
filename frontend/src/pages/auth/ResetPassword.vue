<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isSubmitted = ref(false)

const uid = computed(() => route.params.uid as string)
const token = computed(() => route.params.token as string)
const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

// Password validation
const passwordValidation = computed(() => {
  const pwd = password.value
  return {
    minLength: pwd.length >= 8,
    hasUppercase: /[A-Z]/.test(pwd),
    hasNumber: /\d/.test(pwd),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    matches: pwd === confirmPassword.value && pwd.length > 0,
  }
})

const isPasswordValid = computed(() => {
  const v = passwordValidation.value
  return v.minLength && v.hasUppercase && v.hasNumber && v.hasSpecial && v.matches
})

async function handleSubmit() {
  if (!isPasswordValid.value) return
  
  authStore.clearError()
  
  try {
    await authStore.resetPassword(uid.value, token.value, password.value)
    isSubmitted.value = true
  } catch {
    // Error is handled in store
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="flex min-h-[80vh] items-center justify-center">
    <div class="w-full max-w-md">
      <div class="card p-8 animate-fade-in">
        <!-- Success state -->
        <template v-if="isSubmitted">
          <div class="text-center">
            <div class="mx-auto w-16 h-16 rounded-full bg-success-light flex items-center justify-center mb-6">
              <CheckCircleIcon class="w-8 h-8 text-success" />
            </div>
            <h1 class="text-2xl font-display font-bold text-content dark:text-dark-text">
              {{ t('auth.password_changed') }}
            </h1>
            <p class="mt-4 text-content-muted dark:text-dark-muted">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button 
              type="button"
              class="btn-primary w-full mt-8"
              @click="goToLogin"
            >
              {{ t('auth.sign_in') }}
            </button>
          </div>
        </template>

        <!-- Form state -->
        <template v-else>
          <div class="text-center mb-8">
            <h1 class="text-2xl font-display font-bold text-content dark:text-dark-text">
              {{ t('auth.reset_password') }}
            </h1>
            <p class="mt-2 text-content-muted dark:text-dark-muted">
              Enter your new password below
            </p>
          </div>

          <!-- Error message -->
          <div 
            v-if="error" 
            class="mb-6 p-4 rounded-lg bg-danger-light dark:bg-danger/10 text-danger text-sm"
          >
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Password -->
            <div>
              <label for="password" class="label">{{ t('auth.new_password') }}</label>
              <div class="relative">
                <LockClosedIcon class="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="new-password"
                  class="input pl-10 pr-10 rtl:pl-10 rtl:pr-10"
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

              <!-- Password requirements -->
              <div class="mt-3 space-y-1.5">
                <div 
                  v-for="(valid, key) in passwordValidation" 
                  :key="key"
                  class="flex items-center gap-2 text-xs"
                  :class="valid ? 'text-success' : 'text-content-muted dark:text-dark-muted'"
                >
                  <CheckCircleIcon class="w-4 h-4" :class="valid ? '' : 'opacity-40'" />
                  <span>
                    <template v-if="key === 'minLength'">{{ t('validation.password_min') }}</template>
                    <template v-else-if="key === 'hasUppercase'">{{ t('validation.password_uppercase') }}</template>
                    <template v-else-if="key === 'hasNumber'">{{ t('validation.password_number') }}</template>
                    <template v-else-if="key === 'hasSpecial'">{{ t('validation.password_special') }}</template>
                    <template v-else-if="key === 'matches'">{{ t('validation.passwords_match') }}</template>
                  </span>
                </div>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="label">{{ t('auth.confirm_password') }}</label>
              <div class="relative">
                <LockClosedIcon class="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="new-password"
                  class="input pl-10 rtl:pl-4 rtl:pr-10"
                  :class="{ 'input-error': confirmPassword && !passwordValidation.matches }"
                />
              </div>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="isLoading || !isPasswordValid"
              class="btn-primary w-full"
            >
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span v-else>{{ t('auth.reset_password') }}</span>
            </button>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>
