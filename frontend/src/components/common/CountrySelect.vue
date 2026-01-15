<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  gccOnly?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

// GCC countries + common nationalities
const countries = [
  { code: 'KW', name_en: 'Kuwait', name_ar: 'الكويت', flag: '🇰🇼' },
  { code: 'SA', name_en: 'Saudi Arabia', name_ar: 'السعودية', flag: '🇸🇦' },
  { code: 'AE', name_en: 'United Arab Emirates', name_ar: 'الإمارات', flag: '🇦🇪' },
  { code: 'QA', name_en: 'Qatar', name_ar: 'قطر', flag: '🇶🇦' },
  { code: 'BH', name_en: 'Bahrain', name_ar: 'البحرين', flag: '🇧🇭' },
  { code: 'OM', name_en: 'Oman', name_ar: 'عُمان', flag: '🇴🇲' },
  // Non-GCC countries
  { code: 'EG', name_en: 'Egypt', name_ar: 'مصر', flag: '🇪🇬', nonGcc: true },
  { code: 'JO', name_en: 'Jordan', name_ar: 'الأردن', flag: '🇯🇴', nonGcc: true },
  { code: 'LB', name_en: 'Lebanon', name_ar: 'لبنان', flag: '🇱🇧', nonGcc: true },
  { code: 'SY', name_en: 'Syria', name_ar: 'سوريا', flag: '🇸🇾', nonGcc: true },
  { code: 'IQ', name_en: 'Iraq', name_ar: 'العراق', flag: '🇮🇶', nonGcc: true },
  { code: 'PS', name_en: 'Palestine', name_ar: 'فلسطين', flag: '🇵🇸', nonGcc: true },
  { code: 'YE', name_en: 'Yemen', name_ar: 'اليمن', flag: '🇾🇪', nonGcc: true },
  { code: 'MA', name_en: 'Morocco', name_ar: 'المغرب', flag: '🇲🇦', nonGcc: true },
  { code: 'TN', name_en: 'Tunisia', name_ar: 'تونس', flag: '🇹🇳', nonGcc: true },
  { code: 'DZ', name_en: 'Algeria', name_ar: 'الجزائر', flag: '🇩🇿', nonGcc: true },
  { code: 'SD', name_en: 'Sudan', name_ar: 'السودان', flag: '🇸🇩', nonGcc: true },
  { code: 'IN', name_en: 'India', name_ar: 'الهند', flag: '🇮🇳', nonGcc: true },
  { code: 'PK', name_en: 'Pakistan', name_ar: 'باكستان', flag: '🇵🇰', nonGcc: true },
  { code: 'BD', name_en: 'Bangladesh', name_ar: 'بنغلاديش', flag: '🇧🇩', nonGcc: true },
  { code: 'PH', name_en: 'Philippines', name_ar: 'الفلبين', flag: '🇵🇭', nonGcc: true },
  { code: 'ID', name_en: 'Indonesia', name_ar: 'إندونيسيا', flag: '🇮🇩', nonGcc: true },
  { code: 'LK', name_en: 'Sri Lanka', name_ar: 'سريلانكا', flag: '🇱🇰', nonGcc: true },
  { code: 'NP', name_en: 'Nepal', name_ar: 'نيبال', flag: '🇳🇵', nonGcc: true },
  { code: 'US', name_en: 'United States', name_ar: 'أمريكا', flag: '🇺🇸', nonGcc: true },
  { code: 'GB', name_en: 'United Kingdom', name_ar: 'بريطانيا', flag: '🇬🇧', nonGcc: true },
  { code: 'FR', name_en: 'France', name_ar: 'فرنسا', flag: '🇫🇷', nonGcc: true },
  { code: 'DE', name_en: 'Germany', name_ar: 'ألمانيا', flag: '🇩🇪', nonGcc: true },
];

const filteredCountries = computed(() => {
  return props.gccOnly 
    ? countries.filter(c => !c.nonGcc)
    : countries;
});

const getCountryName = (country: typeof countries[0]) => {
  return locale.value === 'ar' ? country.name_ar : country.name_en;
};

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="country-select">
    <select
      :value="modelValue"
      @change="handleChange"
      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none cursor-pointer"
      style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%239ca3af%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.5em 1.5em; padding-right: 3rem;"
    >
      <option value="" disabled>
        {{ placeholder || $t('common.selectCountry') }}
      </option>
      <option
        v-for="country in filteredCountries"
        :key="country.code"
        :value="country.code"
      >
        {{ country.flag }} {{ getCountryName(country) }}
      </option>
    </select>
  </div>
</template>

<style scoped>
/* RTL support for dropdown arrow */
:root[dir="rtl"] select,
[dir="rtl"] select {
  background-position: left 1rem center;
  padding-right: 1rem;
  padding-left: 3rem;
}
</style>
