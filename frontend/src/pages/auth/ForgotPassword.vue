<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const authStore = useAuthStore()

const email = ref('')
const isSubmitted = ref(false)

const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

async function handleSubmit() {
  authStore.clearError()
  
  try {
    await authStore.requestPasswordReset(email.value)
    isSubmitted.value = true
  } catch {
    // Error is handled in store
  }
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
              {{ t('auth.check_email') }}
            </h1>
            <p class="mt-4 text-content-muted dark:text-dark-muted">
              {{ t('auth.reset_email_sent') }}
            </p>
            <RouterLink 
              to="/login" 
              class="btn-primary w-full mt-8"
            >
              {{ t('auth.sign_in') }}
            </RouterLink>
          </div>
        </template>

        <!-- Form state -->
        <template v-else>
          <div class="text-center mb-8">
            <h1 class="text-2xl font-display font-bold text-content dark:text-dark-text">
              {{ t('auth.forgot_password') }}
            </h1>
            <p class="mt-2 text-content-muted dark:text-dark-muted">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <!-- Error message -->
          <div 
            v-if="error" 
            class="mb-6 p-4 rounded-lg bg-danger-light dark:bg-danger/10 text-danger text-sm"
          >
            {{ error }}
          </div>

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

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="btn-primary w-full"
            >
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span v-else>{{ t('auth.reset_password') }}</span>
            </button>

            <RouterLink 
              to="/login" 
              class="block text-center text-sm link"
            >
              {{ t('common.back') }} {{ t('auth.sign_in') }}
            </RouterLink>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>
