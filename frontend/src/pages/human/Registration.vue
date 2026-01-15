<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import StepProgress from '@/components/common/StepProgress.vue';
import Step1BasicInfo from '@/components/human/registration/Step1BasicInfo.vue';
import Step2Interests from '@/components/human/registration/Step2Interests.vue';
import Step3Profile from '@/components/human/registration/Step3Profile.vue';
import Step4Verification from '@/components/human/registration/Step4Verification.vue';
import Step5PhoneOTP from '@/components/human/registration/Step5PhoneOTP.vue';
import { humanService } from '@/services/human';

const router = useRouter();
const { t } = useI18n();

const currentStep = ref(1);
const isSubmitting = ref(false);
const isLoading = ref(true);
const error = ref<string | null>(null);

const steps = computed(() => [
  { number: 1, title: t('registration.steps.basicInfo') },
  { number: 2, title: t('registration.steps.interests') },
  { number: 3, title: t('registration.steps.profile') },
  { number: 4, title: t('registration.steps.verification') },
  { number: 5, title: t('registration.steps.phone') },
]);

// Form data for each step
const step1Data = reactive({
  name: '',
  profile_name: '',
  dob: '',
  gender: '' as 'male' | 'female' | '',
  nationality: '',
  phone: '',
  phone_country: 'KW',
  place_of_living: '',
  address: '',
});

const step2Data = reactive({
  interests: [] as number[],
  modelBefore: false,
  price: 10,
  otherModeling: '',
});

const step3Data = reactive({
  profile_photo: null as File | string | null,
  cover_image: null as File | string | null,
  selfie_image: null as File | string | null,
  brief_intro: '',
  profile_visibility: 'public' as 'public' | 'private',
  job_sector_id: null as number | null,
  job_title: '',
  height_id: null as number | null,
  twitter_link: '',
  instagram_link: '',
  facebook_link: '',
  snapchat_link: '',
  tiktok_link: '',
  youtube_link: '',
});

const step4Data = reactive({
  civil_id: '',
  passport_id: '',
  civil_id_copy: null as File | string | null,
  country_list: 'KW',
  bank_name: '',
  bank_address: '',
  account_holder_name: '',
  account_holder_address: '',
  account_number_IBAN: '',
  SWIFT_number: '',
});

const step5Data = reactive({
  otp_code: '',
  phone_verified: false,
});

// Load existing registration data
onMounted(async () => {
  try {
    isLoading.value = true;
    const status = await humanService.getRegistrationStatus();
    
    // Determine which step to start from based on completed steps
    if (status.isComplete) {
      router.push({ name: 'registration-success' });
      return;
    }
    
    // Find the first incomplete step
    const stepsStatus = status.steps;
    if (stepsStatus.step1 === 'pending') {
      currentStep.value = 1;
    } else if (stepsStatus.step2 === 'pending') {
      currentStep.value = 2;
      // Load step 1 data
      const step1Result = await humanService.getBasicInfo();
      if (step1Result.data) {
        Object.assign(step1Data, {
          name: step1Result.data.name || '',
          profile_name: step1Result.data.profileName || '',
          dob: step1Result.data.dob ? step1Result.data.dob.split('T')[0] : '',
          gender: step1Result.data.gender || '',
          nationality: step1Result.data.nationality || '',
          phone: step1Result.data.phone || '',
          place_of_living: step1Result.data.placeOfLiving || '',
          address: step1Result.data.address || '',
        });
      }
    } else if (stepsStatus.step3 === 'pending') {
      currentStep.value = 3;
    } else if (stepsStatus.step4 === 'pending') {
      currentStep.value = 4;
      // Load step 1 data for phone number (needed for OTP in step 5)
      const step1Result = await humanService.getBasicInfo();
      if (step1Result.data) {
        Object.assign(step1Data, {
          name: step1Result.data.name || '',
          profile_name: step1Result.data.profileName || '',
          dob: step1Result.data.dob ? step1Result.data.dob.split('T')[0] : '',
          gender: step1Result.data.gender || '',
          nationality: step1Result.data.nationality || '',
          phone: step1Result.data.phone || '',
          place_of_living: step1Result.data.placeOfLiving || '',
          address: step1Result.data.address || '',
        });
      }
    } else if (stepsStatus.step5 === 'pending') {
      currentStep.value = 5;
      // Load step 1 data for phone number (needed for OTP verification)
      const step1Result = await humanService.getBasicInfo();
      if (step1Result.data) {
        Object.assign(step1Data, {
          name: step1Result.data.name || '',
          profile_name: step1Result.data.profileName || '',
          dob: step1Result.data.dob ? step1Result.data.dob.split('T')[0] : '',
          gender: step1Result.data.gender || '',
          nationality: step1Result.data.nationality || '',
          phone: step1Result.data.phone || '',
          place_of_living: step1Result.data.placeOfLiving || '',
          address: step1Result.data.address || '',
        });
      }
    }
  } catch (err) {
    console.log('No existing registration data, starting fresh');
    currentStep.value = 1;
  } finally {
    isLoading.value = false;
  }
});

const handleStep1Next = async () => {
  isSubmitting.value = true;
  error.value = null;
  
  try {
    await humanService.saveBasicInfo({
      name: step1Data.name,
      profileName: step1Data.profile_name,
      dob: step1Data.dob,
      gender: step1Data.gender as 'male' | 'female',
      nationality: step1Data.nationality,
      placeOfLiving: step1Data.place_of_living,
      phone: step1Data.phone,
      address: step1Data.address,
    });
    
    currentStep.value = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save basic information';
    console.error('Step 1 error:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleStep2Next = async () => {
  isSubmitting.value = true;
  error.value = null;
  
  try {
    await humanService.saveInterests({
      interests: step2Data.interests,
      modelBefore: step2Data.modelBefore,
      price: step2Data.price,
      otherModeling: step2Data.otherModeling || undefined,
    });
    
    currentStep.value = 3;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save interests';
    console.error('Step 2 error:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleStep3Next = async () => {
  isSubmitting.value = true;
  error.value = null;
  
  try {
    await humanService.saveProfile({
      briefIntro: step3Data.brief_intro,
      profileVisibility: step3Data.profile_visibility,
      jobSectorId: step3Data.job_sector_id || undefined,
      jobTitle: step3Data.job_title || undefined,
      heightId: step3Data.height_id || undefined,
      twitterLink: step3Data.twitter_link,
      instagramLink: step3Data.instagram_link,
      facebookLink: step3Data.facebook_link,
      snapchatLink: step3Data.snapchat_link,
      tiktokLink: step3Data.tiktok_link,
      youtubeLink: step3Data.youtube_link,
    });
    
    currentStep.value = 4;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save profile';
    console.error('Step 3 error:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleStep4Next = async () => {
  isSubmitting.value = true;
  error.value = null;
  
  try {
    await humanService.saveVerification({
      civilId: step4Data.civil_id,
      passportId: step4Data.passport_id || undefined,
      countryList: step4Data.country_list || undefined,
      bankName: step4Data.bank_name,
      bankAddress: step4Data.bank_address || undefined,
      accountHolderName: step4Data.account_holder_name,
      accountHolderAddress: step4Data.account_holder_address || undefined,
      accountNumberIBAN: step4Data.account_number_IBAN.replace(/\s/g, ''), // Strip spaces
      swiftNumber: step4Data.SWIFT_number || undefined,
    });
    
    // Move to step 5 - OTP will be sent when user provides phone number
    currentStep.value = 5;
    
    // Only send OTP if phone number is available from step 1
    if (step1Data.phone) {
      try {
        await humanService.sendOtp({
          mobileNumber: step1Data.phone,
        });
      } catch (otpErr: any) {
        console.warn('Failed to send OTP automatically:', otpErr);
        // Continue to step 5 anyway, user can manually trigger OTP
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save verification details';
    console.error('Step 4 error:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleStep5Submit = async () => {
  isSubmitting.value = true;
  error.value = null;
  
  try {
    await humanService.verifyOtp({
      mobileNumber: step1Data.phone,
      code: step5Data.otp_code,
    });
    
    // Redirect to success page
    router.push({ name: 'registration-success' });
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to verify OTP';
    console.error('Step 5 error:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleResendOtp = async () => {
  try {
    await humanService.sendOtp({
      mobileNumber: step1Data.phone,
    });
    alert('OTP sent successfully!');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to resend OTP';
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2">
            <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">H</span>
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">Humanize</span>
          </router-link>
          
          <!-- Progress Indicator (Mobile) -->
          <div class="md:hidden text-sm text-gray-600 dark:text-gray-400">
            {{ currentStep }}/5
          </div>
        </div>
      </div>
    </header>

    <!-- Progress Steps -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6">
      <div class="max-w-4xl mx-auto px-4">
        <StepProgress :steps="steps" :current-step="currentStep" />
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="max-w-4xl mx-auto px-4 mt-4">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p class="text-red-700 dark:text-red-400">{{ error }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
        <svg class="w-12 h-12 animate-spin text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p class="text-gray-600 dark:text-gray-400">Loading registration data...</p>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <!-- Step 1: Basic Info -->
        <Step1BasicInfo
          v-if="currentStep === 1"
          v-model="step1Data"
          @next="handleStep1Next"
        />

        <!-- Step 2: Interests -->
        <Step2Interests
          v-if="currentStep === 2"
          v-model="step2Data"
          @next="handleStep2Next"
          @back="prevStep"
        />

        <!-- Step 3: Profile -->
        <Step3Profile
          v-if="currentStep === 3"
          v-model="step3Data"
          @next="handleStep3Next"
          @back="prevStep"
        />

        <!-- Step 4: Verification -->
        <Step4Verification
          v-if="currentStep === 4"
          v-model="step4Data"
          @next="handleStep4Next"
          @back="prevStep"
        />

        <!-- Step 5: Phone OTP -->
        <Step5PhoneOTP
          v-if="currentStep === 5"
          v-model="step5Data"
          :phone-number="step1Data.phone"
          @submit="handleStep5Submit"
          @back="prevStep"
          @resend="handleResendOtp"
        />
      </div>
    </main>

    <!-- Loading Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isSubmitting"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <svg class="w-12 h-12 animate-spin text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p class="text-gray-600 dark:text-gray-400">{{ $t('registration.submitting') }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
