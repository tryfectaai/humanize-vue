<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CountrySelect from '@/components/common/CountrySelect.vue';
import PhoneInput from '@/components/common/PhoneInput.vue';

const { t } = useI18n();

interface FormData {
  name: string;
  profile_name: string;
  dob: string;
  gender: 'male' | 'female' | '';
  nationality: string;
  phone: string;
  phone_country: string;
  place_of_living: string;
  address: string;
}

const props = defineProps<{
  modelValue: FormData;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: FormData): void;
  (e: 'next'): void;
}>();

const form = reactive<FormData>({ ...props.modelValue });

// Profile name validation
const profileNameError = computed(() => {
  if (!form.profile_name) return '';
  if (!/^[A-Za-z0-9_]+$/.test(form.profile_name)) {
    return t('registration.profileNameError');
  }
  if (form.profile_name.length < 3) {
    return t('registration.profileNameMinLength');
  }
  return '';
});

// Age calculation
const age = computed(() => {
  if (!form.dob) return null;
  const today = new Date();
  const birth = new Date(form.dob);
  let years = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    years--;
  }
  return years;
});

// Date validation
const maxDate = computed(() => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today.toISOString().split('T')[0];
});

const isValid = computed(() => {
  return (
    form.name.trim().length >= 2 &&
    form.profile_name.length >= 3 &&
    !profileNameError.value &&
    form.dob &&
    age.value !== null &&
    age.value >= 18 &&
    form.gender &&
    form.nationality &&
    form.phone &&
    form.place_of_living.trim().length > 0
  );
});

const updateForm = () => {
  emit('update:modelValue', { ...form });
};

const updateNationality = (value: string) => {
  form.nationality = value;
  updateForm();
};

// Explicit handler for PhoneInput
const updatePhone = (value: string) => {
  form.phone = value;
  updateForm();
};

const updatePhoneCountry = (value: string) => {
  form.phone_country = value;
  updateForm();
};

const handleSubmit = () => {
  if (isValid.value) {
    updateForm();
    emit('next');
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('registration.basicInfo') }}
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ $t('registration.basicInfoDesc') }}
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Full Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.fullName') }} *
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          :placeholder="$t('registration.fullNamePlaceholder')"
          @input="updateForm"
        />
      </div>

      <!-- Profile Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.profileName') }} *
        </label>
        <div class="relative">
          <span class="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
          <input
            v-model="form.profile_name"
            type="text"
            required
            :class="[
              'w-full ps-8 pe-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors',
              profileNameError
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary/50 focus:border-primary'
            ]"
            :placeholder="$t('registration.profileNamePlaceholder')"
            @input="updateForm"
          />
        </div>
        <p v-if="profileNameError" class="mt-1 text-sm text-red-500">
          {{ profileNameError }}
        </p>
        <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ $t('registration.profileNameHint') }}
        </p>
      </div>

      <!-- Date of Birth -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.dateOfBirth') }} *
        </label>
        <input
          v-model="form.dob"
          type="date"
          required
          :max="maxDate"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          @input="updateForm"
        />
        <p v-if="age !== null" class="mt-1 text-sm" :class="age >= 18 ? 'text-green-600' : 'text-red-500'">
          {{ age }} {{ $t('registration.yearsOld') }}
          <span v-if="age < 18"> - {{ $t('registration.mustBe18') }}</span>
        </p>
      </div>

      <!-- Gender -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.gender') }} *
        </label>
        <div class="flex gap-4">
          <button
            type="button"
            :class="[
              'flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all',
              form.gender === 'male'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary/50'
            ]"
            @click="form.gender = 'male'; updateForm()"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ $t('registration.male') }}
            </span>
          </button>
          <button
            type="button"
            :class="[
              'flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all',
              form.gender === 'female'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary/50'
            ]"
            @click="form.gender = 'female'; updateForm()"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ $t('registration.female') }}
            </span>
          </button>
        </div>
      </div>

      <!-- Nationality -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.nationality') }} *
        </label>
        <CountrySelect
          :model-value="form.nationality"
          :placeholder="$t('registration.selectNationality')"
          @update:model-value="updateNationality"
        />
      </div>

      <!-- Phone Number -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.phone') }} *
        </label>
        <PhoneInput
          :model-value="form.phone"
          :country-code="form.phone_country"
          @update:model-value="updatePhone"
          @update:country-code="updatePhoneCountry"
        />
      </div>

      <!-- Place of Living -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.placeOfLiving') }} *
        </label>
        <input
          v-model="form.place_of_living"
          type="text"
          required
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          :placeholder="$t('registration.placeOfLivingPlaceholder')"
          @input="updateForm"
        />
      </div>

      <!-- Address -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.address') }}
        </label>
        <textarea
          v-model="form.address"
          rows="2"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
          :placeholder="$t('registration.addressPlaceholder')"
          @input="updateForm"
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end pt-6">
      <button
        type="submit"
        :disabled="!isValid"
        :class="[
          'px-8 py-3 rounded-lg font-semibold transition-all duration-200',
          isValid
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        ]"
      >
        {{ $t('common.next') }}
        <svg class="w-5 h-5 inline-block ms-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </form>
</template>
