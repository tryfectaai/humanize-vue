<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import FileUpload from '@/components/common/FileUpload.vue';
import { useConfigStore } from '@/stores/config';

const { t, locale } = useI18n();
const configStore = useConfigStore();

interface FormData {
  profile_photo: File | string | null;
  cover_image: File | string | null;
  selfie_image: File | string | null;
  brief_intro: string;
  profile_visibility: 'public' | 'private';
  job_sector_id: number | null;
  job_title: string;
  height_id: number | null;
  twitter_link: string;
  instagram_link: string;
  facebook_link: string;
  snapchat_link: string;
  tiktok_link: string;
  youtube_link: string;
}

// Height options (150-200 cm)
const heightOptions = Array.from({ length: 51 }, (_, i) => ({
  id: i + 1, // Using index as ID for now; backend should provide actual IDs
  height: 150 + i,
  label: `${150 + i} cm`
}));

const props = defineProps<{
  modelValue: FormData;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: FormData): void;
  (e: 'next'): void;
  (e: 'back'): void;
}>();

const form = reactive<FormData>({
  ...props.modelValue,
  job_sector_id: props.modelValue.job_sector_id ?? null,
  job_title: props.modelValue.job_title ?? '',
  height_id: props.modelValue.height_id ?? null,
});

// Get localized name for job sector
const getJobSectorName = (sector: { id: number; name_en: string; name_ar: string }) => {
  return locale.value === 'ar' ? sector.name_ar : sector.name_en;
};

// Social link validation
const validateUrl = (url: string, platform: string) => {
  if (!url) return true;
  try {
    const u = new URL(url);
    return u.hostname.includes(platform);
  } catch {
    return false;
  }
};

const socialErrors = computed(() => ({
  twitter: form.twitter_link && !validateUrl(form.twitter_link, 'twitter') && !validateUrl(form.twitter_link, 'x.com'),
  instagram: form.instagram_link && !validateUrl(form.instagram_link, 'instagram'),
  facebook: form.facebook_link && !validateUrl(form.facebook_link, 'facebook'),
  tiktok: form.tiktok_link && !validateUrl(form.tiktok_link, 'tiktok'),
  youtube: form.youtube_link && !validateUrl(form.youtube_link, 'youtube'),
}));

const isValid = computed(() => {
  return (
    // Note: profile_photo validation temporarily relaxed for demo/testing
    // In production, uncomment: form.profile_photo !== null &&
    form.job_sector_id !== null && // Job sector is required
    form.brief_intro.trim().length >= 10 &&
    !Object.values(socialErrors.value).some(Boolean)
  );
});

const updateForm = () => {
  emit('update:modelValue', { ...form });
};

const handleSubmit = () => {
  if (isValid.value) {
    updateForm();
    emit('next');
  }
};

// Load config data on mount
onMounted(() => {
  configStore.fetchJobSectors();
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('registration.profileSetup') }}
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ $t('registration.profileSetupDesc') }}
      </p>
    </div>

    <!-- Photo Uploads -->
    <div class="grid gap-6 md:grid-cols-3">
      <!-- Profile Photo -->
      <div class="text-center">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {{ $t('registration.profilePhoto') }} *
        </label>
        <FileUpload
          v-model="form.profile_photo"
          accept="image/*"
          :max-size="5"
          shape="circle"
          preview-width="150px"
          preview-height="150px"
          :placeholder="$t('registration.uploadProfilePhoto')"
          class="mx-auto"
          @update:model-value="updateForm"
        />
      </div>

      <!-- Cover Image -->
      <div class="text-center">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {{ $t('registration.coverImage') }}
        </label>
        <FileUpload
          v-model="form.cover_image"
          accept="image/*"
          :max-size="10"
          shape="cover"
          preview-width="100%"
          preview-height="100px"
          :placeholder="$t('registration.uploadCoverImage')"
          @update:model-value="updateForm"
        />
      </div>

      <!-- Selfie for Verification -->
      <div class="text-center">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {{ $t('registration.selfieImage') }}
        </label>
        <FileUpload
          v-model="form.selfie_image"
          accept="image/*"
          :max-size="5"
          shape="square"
          preview-width="150px"
          preview-height="150px"
          :placeholder="$t('registration.uploadSelfie')"
          class="mx-auto"
          @update:model-value="updateForm"
        />
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {{ $t('registration.selfieHint') }}
        </p>
      </div>
    </div>

    <!-- Job Sector, Job Title, and Height -->
    <div class="grid gap-6 md:grid-cols-3">
      <!-- Job Sector (Required) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.jobSector') }} *
        </label>
        <select
          v-model="form.job_sector_id"
          required
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          @change="updateForm"
        >
          <option :value="null" disabled>{{ $t('registration.selectJobSector') }}</option>
          <option v-for="sector in configStore.jobSectors" :key="sector.id" :value="sector.id">
            {{ getJobSectorName(sector) }}
          </option>
        </select>
      </div>

      <!-- Job Title (Optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.jobTitle') }}
          <span class="text-xs text-gray-500 ms-1">({{ $t('common.optional') }})</span>
        </label>
        <input
          v-model="form.job_title"
          type="text"
          maxlength="120"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          :placeholder="$t('registration.jobTitlePlaceholder')"
          @input="updateForm"
        />
      </div>

      <!-- Height (Optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.height') }}
          <span class="text-xs text-gray-500 ms-1">({{ $t('common.optional') }})</span>
        </label>
        <select
          v-model="form.height_id"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          @change="updateForm"
        >
          <option :value="null">{{ $t('registration.selectHeight') }}</option>
          <option v-for="h in heightOptions" :key="h.id" :value="h.id">
            {{ h.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Brief Introduction -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ $t('registration.briefIntro') }} *
      </label>
      <textarea
        v-model="form.brief_intro"
        rows="4"
        required
        minlength="10"
        maxlength="500"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
        :placeholder="$t('registration.briefIntroPlaceholder')"
        @input="updateForm"
      />
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 text-end">
        {{ form.brief_intro.length }}/500
      </p>
    </div>

    <!-- Profile Visibility -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {{ $t('registration.profileVisibility') }}
      </label>
      <div class="flex gap-4">
        <button
          type="button"
          :class="[
            'flex-1 p-4 rounded-xl border-2 text-start rtl:text-right transition-all',
            form.profile_visibility === 'public'
              ? 'border-primary bg-primary/5 dark:bg-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
          ]"
          @click="form.profile_visibility = 'public'; updateForm()"
        >
          <div class="flex items-start gap-3">
            <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center', form.profile_visibility === 'public' ? 'border-primary' : 'border-gray-300 dark:border-gray-600']">
              <div v-if="form.profile_visibility === 'public'" class="w-3 h-3 rounded-full bg-primary" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ $t('registration.public') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('registration.publicDesc') }}</p>
            </div>
          </div>
        </button>
        <button
          type="button"
          :class="[
            'flex-1 p-4 rounded-xl border-2 text-start rtl:text-right transition-all',
            form.profile_visibility === 'private'
              ? 'border-primary bg-primary/5 dark:bg-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
          ]"
          @click="form.profile_visibility = 'private'; updateForm()"
        >
          <div class="flex items-start gap-3">
            <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center', form.profile_visibility === 'private' ? 'border-primary' : 'border-gray-300 dark:border-gray-600']">
              <div v-if="form.profile_visibility === 'private'" class="w-3 h-3 rounded-full bg-primary" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ $t('registration.private') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('registration.privateDesc') }}</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Social Media Links -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        {{ $t('registration.socialLinks') }}
      </label>
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Instagram -->
        <div>
          <div class="relative">
            <span class="absolute start-4 top-1/2 -translate-y-1/2 text-pink-500">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </span>
            <input
              v-model="form.instagram_link"
              type="url"
              :class="[
                'w-full ps-12 pe-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors',
                socialErrors.instagram ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary/50 focus:border-primary'
              ]"
              placeholder="https://instagram.com/username"
              @input="updateForm"
            />
          </div>
        </div>

        <!-- Twitter/X -->
        <div>
          <div class="relative">
            <span class="absolute start-4 top-1/2 -translate-y-1/2 text-gray-900 dark:text-white">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </span>
            <input
              v-model="form.twitter_link"
              type="url"
              :class="[
                'w-full ps-12 pe-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors',
                socialErrors.twitter ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary/50 focus:border-primary'
              ]"
              placeholder="https://x.com/username"
              @input="updateForm"
            />
          </div>
        </div>

        <!-- TikTok -->
        <div>
          <div class="relative">
            <span class="absolute start-4 top-1/2 -translate-y-1/2 text-gray-900 dark:text-white">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </span>
            <input
              v-model="form.tiktok_link"
              type="url"
              :class="[
                'w-full ps-12 pe-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors',
                socialErrors.tiktok ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary/50 focus:border-primary'
              ]"
              placeholder="https://tiktok.com/@username"
              @input="updateForm"
            />
          </div>
        </div>

        <!-- YouTube -->
        <div>
          <div class="relative">
            <span class="absolute start-4 top-1/2 -translate-y-1/2 text-red-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </span>
            <input
              v-model="form.youtube_link"
              type="url"
              :class="[
                'w-full ps-12 pe-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors',
                socialErrors.youtube ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary/50 focus:border-primary'
              ]"
              placeholder="https://youtube.com/@channel"
              @input="updateForm"
            />
          </div>
        </div>

        <!-- Snapchat -->
        <div>
          <div class="relative">
            <span class="absolute start-4 top-1/2 -translate-y-1/2 text-yellow-400">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
            </span>
            <input
              v-model="form.snapchat_link"
              type="text"
              class="w-full ps-12 pe-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="snapchat_username"
              @input="updateForm"
            />
          </div>
        </div>

        <!-- Facebook -->
        <div>
          <div class="relative">
            <span class="absolute start-4 top-1/2 -translate-y-1/2 text-blue-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </span>
            <input
              v-model="form.facebook_link"
              type="url"
              :class="[
                'w-full ps-12 pe-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors',
                socialErrors.facebook ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary/50 focus:border-primary'
              ]"
              placeholder="https://facebook.com/username"
              @input="updateForm"
            />
          </div>
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
