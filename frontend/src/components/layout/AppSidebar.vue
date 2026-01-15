<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  HomeIcon,
  BriefcaseIcon,
  TrophyIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  UserCircleIcon,
  UsersIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  isOpen: boolean
  isCollapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggle-collapse'): void
}>()

const { t, locale } = useI18n()
const route = useRoute()
const authStore = useAuthStore()

const isRtl = computed(() => locale.value === 'ar')

// Navigation items based on account type
const humanNavItems = computed(() => [
  { name: t('nav.home'), to: '/app', icon: HomeIcon },
  { name: t('nav.jobs'), to: '/app/jobs', icon: BriefcaseIcon },
  { name: t('nav.contests'), to: '/app/contests', icon: TrophyIcon },
  { name: t('nav.events'), to: '/app/events', icon: CalendarIcon },
  { name: t('nav.chat'), to: '/app/chat', icon: ChatBubbleLeftRightIcon },
  { divider: true },
  { name: t('nav.my_jobs'), to: '/app/human/my-jobs', icon: BriefcaseIcon },
  { name: t('nav.my_contests'), to: '/app/human/my-contests', icon: TrophyIcon },
  { name: t('nav.my_events'), to: '/app/human/my-events', icon: CalendarIcon },
  { name: t('nav.pending_requests'), to: '/app/human/pending-requests', icon: ClockIcon },
  { name: t('nav.children'), to: '/app/human/children', icon: UsersIcon },
  { divider: true },
  { name: t('nav.profile'), to: '/app/human/profile', icon: UserCircleIcon },
])

const companyNavItems = computed(() => [
  { name: t('nav.home'), to: '/app', icon: HomeIcon },
  { name: t('nav.talents'), to: '/app/company/talents', icon: UserGroupIcon },
  { name: t('nav.connections'), to: '/app/company/connections', icon: UsersIcon },
  { name: t('nav.chat'), to: '/app/chat', icon: ChatBubbleLeftRightIcon },
  { divider: true },
  { name: t('nav.my_jobs'), to: '/app/company/jobs', icon: BriefcaseIcon },
  { name: t('nav.my_contests'), to: '/app/company/contests', icon: TrophyIcon },
  { name: t('nav.my_events'), to: '/app/company/events', icon: CalendarIcon },
  { divider: true },
  { name: t('nav.profile'), to: '/app/company/profile', icon: UserCircleIcon },
])

const navItems = computed(() => {
  return authStore.isHuman ? humanNavItems.value : companyNavItems.value
})

function isActiveRoute(to: string): boolean {
  if (to === '/app') {
    return route.path === '/app'
  }
  return route.path.startsWith(to)
}
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 z-50 flex flex-col bg-white dark:bg-dark-card border-r rtl:border-r-0 rtl:border-l border-gray-200 dark:border-dark-border transition-all duration-300"
    :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:translate-x-0',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-dark-border">
      <RouterLink to="/app" class="flex items-center gap-3" :class="{ 'justify-center w-full': isCollapsed }">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <span class="text-white font-display text-xl">H</span>
        </div>
        <span 
          v-if="!isCollapsed" 
          class="text-xl font-display text-primary dark:text-white transition-opacity"
        >
          Humanize
        </span>
      </RouterLink>

      <!-- Close button (mobile) -->
      <button 
        type="button"
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border"
        @click="emit('close')"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
      <ul class="space-y-1">
        <template v-for="(item, index) in navItems" :key="index">
          <!-- Divider -->
          <li v-if="'divider' in item" class="my-4">
            <div class="border-t border-gray-200 dark:border-dark-border" />
          </li>
          
          <!-- Nav item -->
          <li v-else>
            <RouterLink
              :to="item.to"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
              :class="[
                isActiveRoute(item.to) 
                  ? 'bg-primary/10 text-primary dark:text-primary-300' 
                  : 'text-content dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border',
                isCollapsed ? 'justify-center' : ''
              ]"
              :title="isCollapsed ? item.name : undefined"
              @click="emit('close')"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span 
                v-if="!isCollapsed" 
                class="font-medium text-sm"
              >
                {{ item.name }}
              </span>
            </RouterLink>
          </li>
        </template>
      </ul>
    </nav>

    <!-- Collapse toggle (desktop) -->
    <div class="hidden lg:block border-t border-gray-200 dark:border-dark-border p-3">
      <button
        type="button"
        class="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border text-content dark:text-dark-text"
        @click="emit('toggle-collapse')"
      >
        <ChevronRightIcon 
          v-if="isRtl ? !isCollapsed : isCollapsed" 
          class="w-5 h-5" 
        />
        <ChevronLeftIcon 
          v-else 
          class="w-5 h-5" 
        />
      </button>
    </div>
  </aside>
</template>
