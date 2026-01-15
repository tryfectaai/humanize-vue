<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import type { AccountType } from '@/types/user'
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Form state
const step = ref<'type' | 'form'>('type')
const accountType = ref<AccountType | null>(null)
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const agreedToTerms = ref(false)

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

function selectAccountType(type: AccountType) {
  accountType.value = type
  step.value = 'form'
}

function goBack() {
  step.value = 'type'
  authStore.clearError()
}

async function handleSubmit() {
  if (!accountType.value || !isPasswordValid.value || !agreedToTerms.value) {
    return
  }

  authStore.clearError()

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password1: password.value,
      password2: confirmPassword.value,
      account_type: accountType.value,
    })

    // Redirect to registration wizard
    if (accountType.value === 'human') {
      router.push('/human/registration')
    } else {
      router.push('/company/registration')
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
      <!-- Account Type Selection -->
        <div v-if="step === 'type'" class="card p-8 animate-fade-in">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-display font-bold text-content dark:text-dark-text">
              {{ t('auth.select_account_type') }}
            </h1>
            <p class="mt-2 text-content-muted dark:text-dark-muted">
              {{ t('auth.already_have_account') }}
              <RouterLink to="/login" class="link font-medium">
                {{ t('auth.sign_in') }}
              </RouterLink>
            </p>
          </div>

          <!-- Account type cards -->
          <div class="space-y-4">
            <!-- Talent (Human) -->
            <button
              type="button"
              class="w-full p-6 rounded-xl border-2 border-gray-200 dark:border-dark-border hover:border-primary dark:hover:border-primary transition-colors text-left rtl:text-right group"
              @click="selectAccountType('human')"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UserGroupIcon class="w-6 h-6 text-primary" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-lg text-content dark:text-dark-text">
                    {{ t('auth.people') }}
                  </h3>
                  <p class="mt-1 text-sm text-content-muted dark:text-dark-muted">
                    {{ t('auth.talent_description') }}
                  </p>
                </div>
              </div>
            </button>

            <!-- Company (Humanize) -->
            <button
              type="button"
              class="w-full p-6 rounded-xl border-2 border-gray-200 dark:border-dark-border hover:border-primary dark:hover:border-primary transition-colors text-left rtl:text-right group"
              @click="selectAccountType('humanize')"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BuildingOfficeIcon class="w-6 h-6 text-primary" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-lg text-content dark:text-dark-text">
                    {{ t('auth.companies') }}
                  </h3>
                  <p class="mt-1 text-sm text-content-muted dark:text-dark-muted">
                    {{ t('auth.company_description') }}
                  </p>
                </div>
              </div>
            </button>
          </div>

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

        <!-- Registration Form -->
        <div v-else class="card p-8 animate-fade-in">
          <!-- Header -->
          <div class="text-center mb-8">
            <button 
              type="button" 
              class="text-sm text-primary hover:underline mb-4"
              @click="goBack"
            >
              ← {{ t('common.back') }}
            </button>
            <h1 class="text-2xl font-display font-bold text-content dark:text-dark-text">
              {{ t('auth.sign_up') }}
            </h1>
            <p class="mt-2 text-content-muted dark:text-dark-muted">
              {{ accountType === 'human' ? t('auth.talent_description') : t('auth.company_description') }}
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
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Name -->
            <div>
              <label for="name" class="label">
                {{ accountType === 'human' ? t('human.full_name') : t('company.company_name') }}
              </label>
              <div class="relative">
                <UserIcon class="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  required
                  class="input pl-10 rtl:pl-4 rtl:pr-10"
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="label">{{ t('auth.password') }}</label>
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

            <!-- Terms agreement -->
            <div class="flex items-start gap-2">
              <input
                id="terms"
                v-model="agreedToTerms"
                type="checkbox"
                required
                class="h-4 w-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label for="terms" class="text-sm text-content dark:text-dark-text">
                {{ t('auth.terms_agree') }}
                <a href="#" class="link">{{ t('auth.terms_of_service') }}</a>
                {{ t('common.and') }}
                <a href="#" class="link">{{ t('auth.privacy_policy') }}</a>
              </label>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="isLoading || !isPasswordValid || !agreedToTerms"
              class="btn-primary w-full"
            >
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span v-else>{{ t('auth.sign_up') }}</span>
            </button>
          </form>
        </div>
    </div>
  </div>
</template>
