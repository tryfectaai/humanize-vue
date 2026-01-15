<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { GlobeAltIcon, CheckIcon } from '@heroicons/vue/24/outline'

const { locale } = useI18n()

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇰🇼' },
]

const currentLanguage = computed(() => {
  return languages.find(l => l.code === locale.value) || languages[0]
})

function setLanguage(code: string) {
  locale.value = code
  localStorage.setItem('locale', code)
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = code
}
</script>

<template>
  <Menu as="div" class="relative">
    <MenuButton class="btn-ghost p-2 rounded-lg">
      <GlobeAltIcon class="w-5 h-5" />
      <span class="sr-only">{{ $t('nav.language') }}</span>
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
        class="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-40 origin-top-right rounded-lg bg-white dark:bg-dark-card shadow-lg ring-1 ring-black/5 focus:outline-none"
      >
        <div class="p-1">
          <MenuItem 
            v-for="lang in languages" 
            :key="lang.code"
            v-slot="{ active }"
          >
            <button
              class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors"
              :class="[
                active ? 'bg-gray-100 dark:bg-dark-border' : '',
                locale === lang.code ? 'text-primary font-medium' : 'text-content dark:text-dark-text'
              ]"
              @click="setLanguage(lang.code)"
            >
              <span class="text-lg">{{ lang.flag }}</span>
              <span class="flex-1 text-left rtl:text-right">{{ lang.name }}</span>
              <CheckIcon v-if="locale === lang.code" class="w-4 h-4 text-primary" />
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Transition>
  </Menu>
</template>
