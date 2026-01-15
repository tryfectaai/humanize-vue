<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
      <!-- Success Icon -->
      <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <!-- Title -->
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('registration.successTitle') }}
      </h1>

      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ $t('registration.successDesc') }}
      </p>

      <!-- What's Next Section -->
      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8 text-start rtl:text-right">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('registration.whatsNext') }}
        </h3>
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-primary text-sm font-bold">1</span>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('registration.nextStep1') }}
            </span>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-primary text-sm font-bold">2</span>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('registration.nextStep2') }}
            </span>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-primary text-sm font-bold">3</span>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('registration.nextStep3') }}
            </span>
          </li>
        </ul>
      </div>

      <!-- CTA Buttons -->
      <div class="space-y-3">
        <button
          class="w-full py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          @click="router.push({ name: 'home' })"
        >
          {{ $t('registration.goToDashboard') }}
        </button>
        <button
          class="w-full py-4 px-6 text-gray-600 dark:text-gray-400 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          @click="router.push({ name: 'human-profile' })"
        >
          {{ $t('registration.completeProfile') }}
        </button>
      </div>

      <!-- Notification Note -->
      <p class="mt-6 text-xs text-gray-500 dark:text-gray-500">
        {{ $t('registration.verificationNote') }}
      </p>
    </div>
  </div>
</template>
