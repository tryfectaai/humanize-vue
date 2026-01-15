<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { humanService } from '@/services/human';

const { t } = useI18n();

interface FormData {
  otp_code: string;
  phone_verified: boolean;
}

const props = defineProps<{
  modelValue: FormData;
  phoneNumber: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: FormData): void;
  (e: 'submit'): void;
  (e: 'back'): void;
  (e: 'resend'): void;
}>();

const otpInputs = ref<string[]>(['', '', '', '', '', '']);
const otpInputRefs = ref<HTMLInputElement[]>([]);
const isVerifying = ref(false);
const isResending = ref(false);
const verificationError = ref('');
const resendTimer = ref(60);
let timerInterval: number | null = null;

const canResend = computed(() => resendTimer.value === 0);
const maskedPhone = computed(() => {
  if (!props.phoneNumber) return '';
  const cleaned = props.phoneNumber.replace(/\D/g, '');
  if (cleaned.length < 4) return props.phoneNumber;
  return `${props.phoneNumber.slice(0, 6)}****${props.phoneNumber.slice(-2)}`;
});

const isOtpComplete = computed(() => {
  return otpInputs.value.every(digit => digit !== '');
});

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  resendTimer.value = 60;
  timerInterval = window.setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--;
    } else {
      if (timerInterval) clearInterval(timerInterval);
    }
  }, 1000);
};

const handleInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/\D/g, '');
  
  if (value.length > 1) {
    // Handle paste
    const digits = value.split('').slice(0, 6);
    digits.forEach((digit, i) => {
      if (i < otpInputs.value.length) {
        otpInputs.value[i] = digit;
      }
    });
    // Focus last input or first empty one
    const nextIndex = Math.min(digits.length, 5);
    otpInputRefs.value[nextIndex]?.focus();
  } else {
    otpInputs.value[index] = value.slice(0, 1);
    if (value && index < 5) {
      otpInputRefs.value[index + 1]?.focus();
    }
  }
  
  verificationError.value = '';
};

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !otpInputs.value[index] && index > 0) {
    otpInputRefs.value[index - 1]?.focus();
  }
  if (event.key === 'ArrowLeft' && index > 0) {
    otpInputRefs.value[index - 1]?.focus();
  }
  if (event.key === 'ArrowRight' && index < 5) {
    otpInputRefs.value[index + 1]?.focus();
  }
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6);
  if (pasteData) {
    pasteData.split('').forEach((digit, i) => {
      if (i < otpInputs.value.length) {
        otpInputs.value[i] = digit;
      }
    });
    const nextIndex = Math.min(pasteData.length, 5);
    otpInputRefs.value[nextIndex]?.focus();
  }
};

const verifyOtp = async () => {
  if (!isOtpComplete.value) return;
  
  isVerifying.value = true;
  verificationError.value = '';
  
  const otpCode = otpInputs.value.join('');
  
  try {
    // Call the actual backend API for verification
    await humanService.verifyOtp({
      mobileNumber: props.phoneNumber,
      code: otpCode,
    });
    
    // Success - update model and emit submit
    emit('update:modelValue', { otp_code: otpCode, phone_verified: true });
    emit('submit');
  } catch (error: any) {
    // Handle error from backend
    const errorMessage = error.response?.data?.message || t('registration.otpVerificationFailed');
    verificationError.value = errorMessage;
    otpInputs.value = ['', '', '', '', '', ''];
    otpInputRefs.value[0]?.focus();
  } finally {
    isVerifying.value = false;
  }
};

const resendOtp = async () => {
  if (!canResend.value || isResending.value) return;
  
  isResending.value = true;
  
  try {
    // Call the actual backend API to resend OTP
    await humanService.sendOtp({
      mobileNumber: props.phoneNumber,
    });
    emit('resend');
    startTimer();
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || t('registration.resendFailed');
    verificationError.value = errorMessage;
  } finally {
    isResending.value = false;
  }
};

onMounted(() => {
  startTimer();
  otpInputRefs.value[0]?.focus();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <div class="max-w-md mx-auto space-y-8">
    <div class="text-center">
      <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('registration.phoneVerification') }}
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ $t('registration.otpSentTo') }}
      </p>
      <p class="mt-1 text-lg font-semibold text-primary dark:text-primary-light" dir="ltr">
        {{ maskedPhone }}
      </p>
    </div>

    <!-- OTP Input -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
        {{ $t('registration.enterOtp') }}
      </label>
      
      <div class="flex justify-center gap-3" dir="ltr" @paste="handlePaste">
        <input
          v-for="(_, index) in otpInputs"
          :key="index"
          :ref="el => { if (el) otpInputRefs[index] = el as HTMLInputElement }"
          v-model="otpInputs[index]"
          type="text"
          inputmode="numeric"
          maxlength="6"
          :class="[
            'w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-all',
            verificationError
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : otpInputs[index]
              ? 'border-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
              : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
          ]"
          @input="(e) => handleInput(index, e)"
          @keydown="(e) => handleKeydown(index, e)"
        />
      </div>

      <!-- Error Message -->
      <p v-if="verificationError" class="mt-4 text-center text-sm text-red-500">
        {{ verificationError }}
      </p>
    </div>

    <!-- Verify Button -->
    <button
      type="button"
      :disabled="!isOtpComplete || isVerifying"
      :class="[
        'w-full py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2',
        isOtpComplete && !isVerifying
          ? 'bg-primary text-white hover:bg-primary-dark'
          : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
      ]"
      @click="verifyOtp"
    >
      <svg v-if="isVerifying" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {{ isVerifying ? $t('registration.verifying') : $t('registration.verifyAndComplete') }}
    </button>

    <!-- Resend Section -->
    <div class="text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ $t('registration.didntReceiveCode') }}
      </p>
      <button
        type="button"
        :disabled="!canResend || isResending"
        :class="[
          'mt-2 text-sm font-semibold transition-colors',
          canResend && !isResending
            ? 'text-primary hover:text-primary-dark cursor-pointer'
            : 'text-gray-400 cursor-not-allowed'
        ]"
        @click="resendOtp"
      >
        <span v-if="isResending" class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ $t('registration.sendingCode') }}
        </span>
        <span v-else-if="!canResend">
          {{ $t('registration.resendIn') }} {{ resendTimer }}s
        </span>
        <span v-else>
          {{ $t('registration.resendCode') }}
        </span>
      </button>
    </div>

    <!-- Back Button -->
    <div class="pt-4">
      <button
        type="button"
        class="w-full py-3 rounded-lg font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        @click="$emit('back')"
      >
        <svg class="w-5 h-5 inline-block me-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ $t('common.back') }}
      </button>
    </div>
  </div>
</template>
