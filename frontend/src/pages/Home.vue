<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { 
  BriefcaseIcon, 
  TrophyIcon, 
  CalendarIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const isHuman = computed(() => authStore.isHuman)

// Mock data for demonstration
const recentJobs = [
  { id: 1, title: 'Fashion Photoshoot', company: 'Style Co.', budget: 150, date: '2026-01-20' },
  { id: 2, title: 'TV Commercial', company: 'Media Group', budget: 300, date: '2026-01-22' },
  { id: 3, title: 'Product Launch Event', company: 'Tech Corp', budget: 200, date: '2026-01-25' },
]

const recentContests = [
  { id: 1, title: 'Summer Photo Contest', prize: 500, endDate: '2026-02-01' },
  { id: 2, title: 'Fashion Week Challenge', prize: 1000, endDate: '2026-02-15' },
]

const upcomingEvents = [
  { id: 1, title: 'Fashion Week Kuwait', date: '2026-02-10', location: 'Kuwait City' },
  { id: 2, title: 'Brand Ambassador Event', date: '2026-02-20', location: 'Salmiya' },
]
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="card p-6 bg-gradient-to-r from-primary to-primary-600 text-white">
      <h1 class="text-2xl font-display font-bold">
        {{ t('auth.login_success') }} {{ user?.name }}!
      </h1>
      <p class="mt-2 text-white/80">
        {{ isHuman 
          ? 'Browse opportunities and grow your career' 
          : 'Find talented people for your next project' 
        }}
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <RouterLink 
        :to="isHuman ? '/app/jobs' : '/app/company/jobs'" 
        class="card p-6 hover:shadow-card-hover transition-shadow group"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <BriefcaseIcon class="w-6 h-6 text-primary" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-content-muted dark:text-dark-muted">{{ t('nav.jobs') }}</p>
            <p class="text-2xl font-bold text-content dark:text-dark-text">{{ recentJobs.length }}</p>
          </div>
          <ArrowRightIcon class="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors rtl:rotate-180" />
        </div>
      </RouterLink>

      <RouterLink 
        :to="isHuman ? '/app/contests' : '/app/company/contests'" 
        class="card p-6 hover:shadow-card-hover transition-shadow group"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
            <TrophyIcon class="w-6 h-6 text-warning" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-content-muted dark:text-dark-muted">{{ t('nav.contests') }}</p>
            <p class="text-2xl font-bold text-content dark:text-dark-text">{{ recentContests.length }}</p>
          </div>
          <ArrowRightIcon class="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors rtl:rotate-180" />
        </div>
      </RouterLink>

      <RouterLink 
        :to="isHuman ? '/app/events' : '/app/company/events'" 
        class="card p-6 hover:shadow-card-hover transition-shadow group"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
            <CalendarIcon class="w-6 h-6 text-success" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-content-muted dark:text-dark-muted">{{ t('nav.events') }}</p>
            <p class="text-2xl font-bold text-content dark:text-dark-text">{{ upcomingEvents.length }}</p>
          </div>
          <ArrowRightIcon class="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors rtl:rotate-180" />
        </div>
      </RouterLink>
    </div>

    <!-- Recent Jobs -->
    <div class="card">
      <div class="p-6 border-b border-gray-200 dark:border-dark-border">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-content dark:text-dark-text">
            {{ isHuman ? 'Available Jobs' : 'Your Posted Jobs' }}
          </h2>
          <RouterLink :to="isHuman ? '/app/jobs' : '/app/company/jobs'" class="link text-sm">
            {{ t('common.view') }} {{ t('common.all') }}
          </RouterLink>
        </div>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-dark-border">
        <div 
          v-for="job in recentJobs" 
          :key="job.id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-content dark:text-dark-text">{{ job.title }}</h3>
              <p class="text-sm text-content-muted dark:text-dark-muted">{{ job.company }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-primary">{{ job.budget }} {{ t('common.kwd') }}</p>
              <p class="text-sm text-content-muted dark:text-dark-muted">{{ job.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Two column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Contests -->
      <div class="card">
        <div class="p-6 border-b border-gray-200 dark:border-dark-border">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-content dark:text-dark-text">
              {{ t('contest.title') }}
            </h2>
            <RouterLink to="/app/contests" class="link text-sm">
              {{ t('common.view') }} {{ t('common.all') }}
            </RouterLink>
          </div>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-dark-border">
          <div 
            v-for="contest in recentContests" 
            :key="contest.id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-content dark:text-dark-text">{{ contest.title }}</h3>
                <p class="text-sm text-content-muted dark:text-dark-muted">
                  Ends: {{ contest.endDate }}
                </p>
              </div>
              <div class="badge-warning">
                {{ contest.prize }} {{ t('common.kwd') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Events -->
      <div class="card">
        <div class="p-6 border-b border-gray-200 dark:border-dark-border">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-content dark:text-dark-text">
              {{ t('event.title') }}
            </h2>
            <RouterLink to="/app/events" class="link text-sm">
              {{ t('common.view') }} {{ t('common.all') }}
            </RouterLink>
          </div>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-dark-border">
          <div 
            v-for="event in upcomingEvents" 
            :key="event.id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-content dark:text-dark-text">{{ event.title }}</h3>
                <p class="text-sm text-content-muted dark:text-dark-muted">
                  {{ event.location }}
                </p>
              </div>
              <div class="badge-success">
                {{ event.date }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
