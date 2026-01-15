<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const { locale } = useI18n()

const isRtl = computed(() => locale.value === 'ar')
</script>

<template>
  <div class="min-h-screen bg-surface dark:bg-dark-bg" :class="{ 'rtl': isRtl }">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-dark-card shadow-sm">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span class="text-white font-display text-xl">H</span>
            </div>
            <span class="text-xl font-display text-primary dark:text-white">Humanize</span>
          </RouterLink>

          <!-- Language Switcher -->
          <LanguageSwitcher />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <RouterView v-slot="{ Component }">
          <Transition name="slide-up" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>
