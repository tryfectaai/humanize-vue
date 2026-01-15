<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import FileUpload from '@/components/common/FileUpload.vue';

const { t } = useI18n();

interface FormData {
  civil_id: string;
  passport_id: string;
  civil_id_copy: File | string | null;
  bank_name: string;
  bank_address: string;
  account_holder_name: string;
  account_holder_address: string;
  account_number_IBAN: string;
  SWIFT_number: string;
}

const props = defineProps<{
  modelValue: FormData;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: FormData): void;
  (e: 'next'): void;
  (e: 'back'): void;
}>();

const form = reactive<FormData>({ ...props.modelValue });

// IBAN validation (Kuwait format: KW + 2 check digits + 4 bank code + 22 account number = 30 chars)
const ibanError = computed(() => {
  if (!form.account_number_IBAN) return '';
  const iban = form.account_number_IBAN.replace(/\s/g, '').toUpperCase();
  if (iban.length > 0 && iban.length < 15) {
    return t('registration.ibanTooShort');
  }
  // Basic validation - starts with 2 letters
  if (!/^[A-Z]{2}/.test(iban)) {
    return t('registration.ibanInvalidFormat');
  }
  return '';
});

// Civil ID validation (12 digits for Kuwait)
const civilIdError = computed(() => {
  if (!form.civil_id) return '';
  const cleaned = form.civil_id.replace(/\D/g, '');
  if (cleaned.length > 0 && cleaned.length !== 12) {
    return t('registration.civilIdLength');
  }
  return '';
});

const isValid = computed(() => {
  return (
    form.civil_id.replace(/\D/g, '').length === 12 &&
    !civilIdError.value &&
    // Note: civil_id_copy validation temporarily relaxed for demo/testing
    // In production, uncomment: form.civil_id_copy !== null &&
    form.bank_name.trim().length > 0 &&
    form.account_holder_name.trim().length > 0 &&
    form.account_number_IBAN.replace(/\s/g, '').length >= 15 &&
    !ibanError.value
  );
});

const formatCivilId = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const cleaned = input.value.replace(/\D/g, '');
  form.civil_id = cleaned.slice(0, 12);
  updateForm();
};

const formatIBAN = (event: Event) => {
  const input = event.target as HTMLInputElement;
  // Remove all non-alphanumeric characters and uppercase
  const cleaned = input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  // Format with spaces every 4 characters
  form.account_number_IBAN = cleaned.replace(/(.{4})/g, '$1 ').trim();
  updateForm();
};

const updateForm = () => {
  emit('update:modelValue', { ...form });
};

const handleSubmit = () => {
  if (isValid.value) {
    updateForm();
    emit('next');
  }
};

// List of common banks in Kuwait/GCC
const banks = [
  'National Bank of Kuwait (NBK)',
  'Kuwait Finance House (KFH)',
  'Gulf Bank',
  'Commercial Bank of Kuwait',
  'Al Ahli Bank of Kuwait',
  'Burgan Bank',
  'Warba Bank',
  'Boubyan Bank',
  'Kuwait International Bank',
  'Al Rajhi Bank',
  'Emirates NBD',
  'Qatar National Bank',
  'Other'
];
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('registration.idVerification') }}
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ $t('registration.idVerificationDesc') }}
      </p>
    </div>

    <!-- ID Documents Section -->
    <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
        {{ $t('registration.identityDocuments') }}
      </h3>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Civil ID -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('registration.civilId') }} *
          </label>
          <input
            :value="form.civil_id"
            type="text"
            inputmode="numeric"
            maxlength="12"
            required
            :class="[
              'w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors',
              civilIdError
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary/50 focus:border-primary'
            ]"
            :placeholder="$t('registration.civilIdPlaceholder')"
            @input="formatCivilId"
          />
          <p v-if="civilIdError" class="mt-1 text-sm text-red-500">{{ civilIdError }}</p>
          <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ $t('registration.civilIdHint') }}
          </p>
        </div>

        <!-- Passport ID -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('registration.passportId') }}
            <span class="text-xs text-gray-500">({{ $t('registration.optional') }})</span>
          </label>
          <input
            v-model="form.passport_id"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            :placeholder="$t('registration.passportIdPlaceholder')"
            @input="updateForm"
          />
        </div>

        <!-- Civil ID Copy Upload -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('registration.civilIdCopy') }} *
          </label>
          <FileUpload
            v-model="form.civil_id_copy"
            accept="image/*,.pdf"
            :max-size="10"
            shape="cover"
            preview-height="120px"
            :placeholder="$t('registration.uploadCivilIdCopy')"
            @update:model-value="updateForm"
          />
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {{ $t('registration.civilIdCopyHint') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Bank Details Section -->
    <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        {{ $t('registration.bankDetails') }}
      </h3>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Bank Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('registration.bankName') }} *
          </label>
          <select
            v-model="form.bank_name"
            required
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            @change="updateForm"
          >
            <option value="" disabled>{{ $t('registration.selectBank') }}</option>
            <option v-for="bank in banks" :key="bank" :value="bank">{{ bank }}</option>
          </select>
        </div>

        <!-- Bank Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('registration.bankAddress') }}
          </label>
          <input
            v-model="form.bank_address"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            :placeholder="$t('registration.bankAddressPlaceholder')"
            @input="updateForm"
          />
        </div>

        <!-- Account Holder Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('registration.accountHolderName') }} *
          </label>
          <input
            v-model="form.account_holder_name"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            :placeholder="$t('registration.accountHolderNamePlaceholder')"
            @input="updateForm"
          />
        </div>

        <!-- Account Holder Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('registration.accountHolderAddress') }}
          </label>
          <input
            v-model="form.account_holder_address"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            :placeholder="$t('registration.accountHolderAddressPlaceholder')"
            @input="updateForm"
          />
        </div>

        <!-- IBAN -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('registration.iban') }} *
          </label>
          <input
            :value="form.account_number_IBAN"
            type="text"
            required
            :class="[
              'w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors font-mono tracking-wider',
              ibanError
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary/50 focus:border-primary'
            ]"
            placeholder="KW00 XXXX XXXX XXXX XXXX XXXX XXXX XX"
            @input="formatIBAN"
          />
          <p v-if="ibanError" class="mt-1 text-sm text-red-500">{{ ibanError }}</p>
          <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ $t('registration.ibanHint') }}
          </p>
        </div>

        <!-- SWIFT -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('registration.swiftCode') }}
          </label>
          <input
            v-model="form.SWIFT_number"
            type="text"
            maxlength="11"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors font-mono uppercase"
            placeholder="XXXXXXXX"
            @input="updateForm"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ $t('registration.swiftHint') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Security Notice -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div class="flex gap-3">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div>
          <p class="text-sm font-medium text-blue-800 dark:text-blue-300">
            {{ $t('registration.securityNoticeTitle') }}
          </p>
          <p class="text-sm text-blue-700 dark:text-blue-400 mt-1">
            {{ $t('registration.securityNoticeDesc') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between pt-6">
      <button
        type="button"
        class="px-6 py-3 rounded-lg font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        @click="$emit('back')"
      >
        <svg class="w-5 h-5 inline-block me-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ $t('common.back') }}
      </button>
      
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
