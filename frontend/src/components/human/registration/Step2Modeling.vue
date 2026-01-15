<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import MultiSelect from '@/components/common/MultiSelect.vue';
import { useConfigStore } from '@/stores/config';

const { t } = useI18n();
const configStore = useConfigStore();

interface FormData {
  modeling_types: number[];
  production_types: number[];
  preferences: number[];
  height: string;
  model_before: boolean;
  price: number;
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

// Height options (150-200 cm)
const heightOptions = Array.from({ length: 51 }, (_, i) => ({
  value: `${150 + i}`,
  label: `${150 + i} cm`
}));

const isValid = computed(() => {
  return (
    form.modeling_types.length > 0 &&
    form.height &&
    form.price >= 5
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
  configStore.fetchConfig();
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('registration.modelingPreferences') }}
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ $t('registration.modelingPreferencesDesc') }}
      </p>
    </div>

    <!-- Modeling Types -->
    <div>
      <MultiSelect
        v-model="form.modeling_types"
        :options="configStore.modelingTypes"
        :label="$t('registration.modelingTypes') + ' *'"
        :show-icons="true"
        :columns="4"
        @update:model-value="updateForm"
      />
    </div>

    <!-- Production Types -->
    <div>
      <MultiSelect
        v-model="form.production_types"
        :options="configStore.productionTypes"
        :label="$t('registration.productionTypes')"
        :show-icons="false"
        :columns="3"
        @update:model-value="updateForm"
      />
    </div>

    <!-- Preferences -->
    <div>
      <MultiSelect
        v-model="form.preferences"
        :options="configStore.preferences"
        :label="$t('registration.preferences')"
        :show-icons="false"
        :columns="3"
        @update:model-value="updateForm"
      />
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      <!-- Height -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('registration.height') }} *
        </label>
        <select
          v-model="form.height"
          required
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          @change="updateForm"
        >
          <option value="" disabled>{{ $t('registration.selectHeight') }}</option>
          <option v-for="h in heightOptions" :key="h.value" :value="h.value">
            {{ h.label }}
          </option>
        </select>
      </div>

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
              form.model_before
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary/50'
            ]"
            @click="form.model_before = true; updateForm()"
          >
            {{ $t('common.yes') }}
          </button>
          <button
            type="button"
            :class="[
              'flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all',
              !form.model_before
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary/50'
            ]"
            @click="form.model_before = false; updateForm()"
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
