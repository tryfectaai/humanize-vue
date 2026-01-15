<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const { locale } = useI18n()
const authStore = useAuthStore()

const isSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)

const isRtl = computed(() => locale.value === 'ar')

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function toggleSidebarCollapse() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-surface dark:bg-dark-bg" :class="{ 'rtl': isRtl }">
    <!-- Mobile sidebar backdrop -->
    <Transition name="fade">
      <div 
        v-if="isSidebarOpen" 
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="closeSidebar"
      />
    </Transition>

    <!-- Sidebar -->
    <AppSidebar
      :is-open="isSidebarOpen"
      :is-collapsed="isSidebarCollapsed"
      @close="closeSidebar"
      @toggle-collapse="toggleSidebarCollapse"
    />

    <!-- Main content area -->
    <div 
      class="transition-all duration-300 lg:ltr:ml-64 lg:rtl:mr-64"
      :class="{ 'lg:ltr:ml-20 lg:rtl:mr-20': isSidebarCollapsed }"
    >
      <!-- Header -->
      <AppHeader @toggle-sidebar="toggleSidebar" />

      <!-- Page content -->
      <main class="py-6 px-4 sm:px-6 lg:px-8">
        <RouterView v-slot="{ Component }">
          <Transition name="slide-up" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>
