<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const isDarkMode = ref(localStorage.getItem('theme') === 'dark')
const searchQuery = ref('')

const user = computed(() => authStore.user)
const userAvatar = computed(() => user.value?.picture || null)
const userName = computed(() => user.value?.name || 'User')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    // TODO: Implement search
    console.log('Search:', searchQuery.value)
  }
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-white dark:bg-dark-card shadow-sm">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left side -->
        <div class="flex items-center gap-4">
          <!-- Mobile menu button -->
          <button 
            type="button"
            class="lg:hidden p-2 rounded-lg text-content dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border"
            @click="emit('toggle-sidebar')"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>

          <!-- Search -->
          <div class="hidden sm:block relative">
            <MagnifyingGlassIcon class="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="t('common.search')"
              class="input pl-10 rtl:pl-4 rtl:pr-10 w-64 lg:w-80"
              @keydown.enter="handleSearch"
            />
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-2">
          <!-- Dark mode toggle -->
          <button
            type="button"
            class="p-2 rounded-lg text-content dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border"
            @click="toggleDarkMode"
          >
            <SunIcon v-if="isDarkMode" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>

          <!-- Language Switcher -->
          <LanguageSwitcher />

          <!-- Notifications -->
          <button
            type="button"
            class="relative p-2 rounded-lg text-content dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border"
          >
            <BellIcon class="w-5 h-5" />
            <!-- Notification badge -->
            <span class="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>

          <!-- User menu -->
          <Menu as="div" class="relative">
            <MenuButton class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border">
              <div v-if="userAvatar" class="avatar-sm">
                <img :src="userAvatar" :alt="userName" class="w-full h-full object-cover rounded-full" />
              </div>
              <div v-else class="avatar-sm bg-primary flex items-center justify-center text-white font-medium">
                {{ userInitial }}
              </div>
              <span class="hidden md:block text-sm font-medium text-content dark:text-dark-text">
                {{ userName }}
              </span>
            </MenuButton>

            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems 
                class="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-dark-card shadow-lg ring-1 ring-black/5 focus:outline-none"
              >
                <div class="p-1">
                  <MenuItem v-slot="{ active }">
                    <RouterLink
                      :to="authStore.isHuman ? '/app/human/profile' : '/app/company/profile'"
                      class="flex items-center gap-3 px-3 py-2 text-sm rounded-md"
                      :class="[active ? 'bg-gray-100 dark:bg-dark-border' : '', 'text-content dark:text-dark-text']"
                    >
                      <UserCircleIcon class="w-5 h-5" />
                      {{ t('nav.profile') }}
                    </RouterLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <RouterLink
                      to="/app/settings"
                      class="flex items-center gap-3 px-3 py-2 text-sm rounded-md"
                      :class="[active ? 'bg-gray-100 dark:bg-dark-border' : '', 'text-content dark:text-dark-text']"
                    >
                      <Cog6ToothIcon class="w-5 h-5" />
                      {{ t('nav.settings') }}
                    </RouterLink>
                  </MenuItem>
                  <div class="border-t border-gray-100 dark:border-dark-border my-1" />
                  <MenuItem v-slot="{ active }">
                    <button
                      class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-danger"
                      :class="[active ? 'bg-danger-light dark:bg-danger/10' : '']"
                      @click="handleLogout"
                    >
                      <ArrowRightOnRectangleIcon class="w-5 h-5" />
                      {{ t('auth.logout') }}
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  </header>
</template>
