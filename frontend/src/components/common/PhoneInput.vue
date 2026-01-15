<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { parsePhoneNumberFromString, CountryCode, getExampleNumber, getCountries } from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';

const props = defineProps<{
  modelValue?: string;
  countryCode?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:countryCode', value: string): void;
  (e: 'valid', isValid: boolean): void;
}>();

const isDropdownOpen = ref(false);
const phoneNumber = ref('');

// GCC + common countries
const countryCodes = [
  { code: 'KW', dialCode: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', dialCode: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: 'QA', dialCode: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: 'BH', dialCode: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'OM', dialCode: '+968', name: 'Oman', flag: '🇴🇲' },
  { code: 'EG', dialCode: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: 'JO', dialCode: '+962', name: 'Jordan', flag: '🇯🇴' },
  { code: 'LB', dialCode: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'IN', dialCode: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'PK', dialCode: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PH', dialCode: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: 'US', dialCode: '+1', name: 'USA', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: 'UK', flag: '🇬🇧' },
];

const selectedCountry = computed(() => {
  return countryCodes.find(c => c.code === props.countryCode) || countryCodes[0];
});

const placeholder_text = computed(() => {
  try {
    const example = getExampleNumber(selectedCountry.value.code as CountryCode, examples);
    return example?.formatNational() || props.placeholder || 'Phone number';
  } catch {
    return props.placeholder || 'Phone number';
  }
});

const isValid = computed(() => {
  if (!phoneNumber.value) return false;
  try {
    const fullNumber = selectedCountry.value.dialCode + phoneNumber.value.replace(/\D/g, '');
    const parsed = parsePhoneNumberFromString(fullNumber, selectedCountry.value.code as CountryCode);
    return parsed?.isValid() || false;
  } catch {
    return false;
  }
});

const selectCountry = (code: string) => {
  emit('update:countryCode', code);
  isDropdownOpen.value = false;
};

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  // Only allow numbers
  const cleaned = input.value.replace(/\D/g, '');
  phoneNumber.value = cleaned;
  
  const fullNumber = selectedCountry.value.dialCode + cleaned;
  emit('update:modelValue', fullNumber);
  emit('valid', isValid.value);
};

// Initialize from modelValue
watch(
  () => props.modelValue,
  (value) => {
    if (value && value.startsWith('+')) {
      // Try to extract the phone number without dial code
      const country = countryCodes.find(c => value.startsWith(c.dialCode));
      if (country) {
        phoneNumber.value = value.replace(country.dialCode, '');
        if (props.countryCode !== country.code) {
          emit('update:countryCode', country.code);
        }
      }
    }
  },
  { immediate: true }
);

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.phone-input')) {
    isDropdownOpen.value = false;
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside);
}
</script>

<template>
  <div class="phone-input relative">
    <div class="flex">
      <!-- Country Code Selector -->
      <button
        type="button"
        class="flex items-center gap-2 px-3 py-3 border border-e-0 rtl:border-e rtl:border-s-0 border-gray-300 dark:border-gray-600 rounded-s-lg rtl:rounded-s-none rtl:rounded-e-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        @click.stop="isDropdownOpen = !isDropdownOpen"
      >
        <span class="text-xl">{{ selectedCountry.flag }}</span>
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ selectedCountry.dialCode }}</span>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Phone Number Input -->
      <input
        type="tel"
        :value="phoneNumber"
        :placeholder="placeholder_text"
        inputmode="numeric"
        class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-e-lg rtl:rounded-e-none rtl:rounded-s-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        @input="handleInput"
      />
    </div>

    <!-- Validation Indicator -->
    <div
      v-if="phoneNumber"
      :class="[
        'absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center',
        isValid ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
      ]"
    >
      <svg v-if="isValid" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        class="absolute z-50 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
      >
        <button
          v-for="country in countryCodes"
          :key="country.code"
          type="button"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 text-left rtl:text-right hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            countryCode === country.code && 'bg-primary/10 dark:bg-primary/20'
          ]"
          @click.stop="selectCountry(country.code)"
        >
          <span class="text-xl">{{ country.flag }}</span>
          <span class="text-sm text-gray-900 dark:text-white flex-1">{{ country.name }}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ country.dialCode }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>
