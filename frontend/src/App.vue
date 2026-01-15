<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const { locale } = useI18n()
const authStore = useAuthStore()

// Watch locale changes for RTL
const isRtl = computed(() => locale.value === 'ar')

watch(isRtl, (rtl) => {
  document.documentElement.dir = rtl ? 'rtl' : 'ltr'
  document.documentElement.lang = locale.value
})

// Check auth on mount
onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <RouterView />
</template>

<style>
/* Base transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
