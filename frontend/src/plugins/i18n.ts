import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

export type Locale = 'en' | 'ar'

// Get stored locale or default to 'en'
const getStoredLocale = (): Locale => {
  const stored = localStorage.getItem('locale')
  if (stored === 'en' || stored === 'ar') {
    return stored
  }
  // Check browser language
  const browserLang = navigator.language.split('-')[0]
  return browserLang === 'ar' ? 'ar' : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    ar
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'KWD',
        minimumFractionDigits: 3
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    },
    ar: {
      currency: {
        style: 'currency',
        currency: 'KWD',
        minimumFractionDigits: 3
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    }
  },
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      },
      time: {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      },
      datetime: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    ar: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      },
      time: {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      },
      datetime: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
})

export default i18n
