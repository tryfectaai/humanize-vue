<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfigStore } from '@/stores/config';

const { t, locale } = useI18n();
const configStore = useConfigStore();

interface FormData {
  interests: number[];
  modelBefore: boolean;
  price: number;
  otherModeling?: string;
}

const props = defineProps<{
  modelValue: FormData;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: FormData): void;
  (e: 'next'): void;
  (e: 'back'): void;
}>();

const form = reactive<FormData>({ 
  interests: props.modelValue.interests || [],
  modelBefore: props.modelValue.modelBefore ?? false,
  price: props.modelValue.price || 0,
  otherModeling: props.modelValue.otherModeling || ''
});

const isValid = computed(() => {
  return form.interests.length > 0 && form.price >= 5;
});

const updateForm = () => {
  emit('update:modelValue', { ...form });
};

const toggleInterest = (interestId: number) => {
  const index = form.interests.indexOf(interestId);
  if (index > -1) {
    form.interests.splice(index, 1);
  } else {
    form.interests.push(interestId);
  }
  updateForm();
};

const isSelected = (interestId: number) => {
  return form.interests.includes(interestId);
};

const handleSubmit = () => {
  if (isValid.value) {
    updateForm();
    emit('next');
  }
};

// Get localized name for interest
const getInterestName = (interest: { id: number; name_en: string; name_ar: string }) => {
  return locale.value === 'ar' ? interest.name_ar : interest.name_en;
};

// Load config data on mount
onMounted(() => {
  configStore.fetchInterests();
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('registration.interests') }}
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ $t('registration.interestsDesc') }}
      </p>
    </div>

    <!-- Interests Selection (Chips/Tags) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {{ $t('registration.selectInterests') }} *
        <span class="text-xs text-gray-500 ms-2">({{ form.interests.length }} {{ $t('common.selected') }})</span>
      </label>
      
      <div class="flex flex-wrap gap-3">
        <button
          v-for="interest in configStore.interests"
          :key="interest.id"
          type="button"
          :class="[
            'px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200 border-2',
            isSelected(interest.id)
              ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary/50 hover:bg-primary/5'
          ]"
          @click="toggleInterest(interest.id)"
        >
          <span v-if="isSelected(interest.id)" class="me-1.5">✓</span>
          {{ getInterestName(interest) }}
        </button>
      </div>
      
      <p v-if="form.interests.length === 0" class="mt-2 text-sm text-orange-500">
        {{ $t('registration.selectAtLeastOneInterest') }}
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Previous Experience -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.modelBefore') }}
        </label>
        <div class="flex gap-4 mt-1">
          <button
            type="button"
            :class="[
              'flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all',
              form.modelBefore
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary/50'
            ]"
            @click="form.modelBefore = true; updateForm()"
          >
            {{ $t('common.yes') }}
          </button>
          <button
            type="button"
            :class="[
              'flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all',
              !form.modelBefore
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary/50'
            ]"
            @click="form.modelBefore = false; updateForm()"
          >
            {{ $t('common.no') }}
          </button>
        </div>
      </div>

      <!-- Hourly Rate -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.hourlyRate') }} * <span class="text-xs text-gray-500">(KWD)</span>
        </label>
        <div class="relative">
          <input
            v-model.number="form.price"
            type="number"
            min="5"
            step="1"
            required
            class="w-full px-4 py-3 pe-16 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            :placeholder="$t('registration.hourlyRatePlaceholder')"
            @input="updateForm"
          />
          <span class="absolute end-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
            KWD/hr
          </span>
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ $t('registration.minimumRate') }}: 5 KWD
        </p>
      </div>
    </div>

    <!-- Other Modeling (Optional) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ $t('registration.otherModeling') }}
        <span class="text-xs text-gray-500 ms-1">({{ $t('common.optional') }})</span>
      </label>
      <input
        v-model="form.otherModeling"
        type="text"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        :placeholder="$t('registration.otherModelingPlaceholder')"
        @input="updateForm"
      />
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
