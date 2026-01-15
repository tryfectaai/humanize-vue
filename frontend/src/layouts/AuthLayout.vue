<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const { t } = useI18n()

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-light dark:from-dark-bg dark:via-dark-card dark:to-dark-bg">
    <!-- Background Pattern -->
    <div class="fixed inset-0 opacity-5 dark:opacity-10 pointer-events-none">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%2324598c&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
      <nav class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span class="text-white font-display text-xl">H</span>
          </div>
          <span class="text-xl font-display text-primary dark:text-white">Humanize</span>
        </RouterLink>

        <!-- Language Switcher -->
        <LanguageSwitcher />
      </nav>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center text-sm text-content-muted dark:text-dark-muted">
        <p>© {{ currentYear }} Humanize. {{ t('auth.terms_agree') }} 
          <a href="#" class="link">{{ t('auth.terms_of_service') }}</a> {{ t('common.and') }} 
          <a href="#" class="link">{{ t('auth.privacy_policy') }}</a>
        </p>
      </div>
    </footer>
  </div>
</template>
