<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Option {
  id: number | string;
  name_en: string;
  name_ar: string;
  image?: string;
}

const { locale } = useI18n();

const props = defineProps<{
  modelValue: (number | string)[];
  options: Option[];
  label?: string;
  showIcons?: boolean;
  columns?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: (number | string)[]): void;
}>();

const getOptionName = (option: Option) => {
  return locale.value === 'ar' ? option.name_ar : option.name_en;
};

const isSelected = (id: number | string) => {
  return props.modelValue.includes(id);
};

const toggleOption = (id: number | string) => {
  const newValue = isSelected(id)
    ? props.modelValue.filter(v => v !== id)
    : [...props.modelValue, id];
  emit('update:modelValue', newValue);
};

const gridCols = computed(() => {
  const cols = props.columns || 3;
  return `grid-cols-2 sm:grid-cols-${cols}`;
});
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
      {{ label }}
    </label>
    
    <div :class="['grid gap-3', gridCols]">
      <button
        v-for="option in options"
        :key="option.id"
        type="button"
        :class="[
          'relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200',
          isSelected(option.id)
            ? 'border-primary bg-primary/5 dark:bg-primary/10'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
        ]"
        @click="toggleOption(option.id)"
      >
        <!-- Checkmark -->
        <div
          :class="[
            'absolute top-2 right-2 rtl:right-auto rtl:left-2 w-5 h-5 rounded-full flex items-center justify-center transition-all',
            isSelected(option.id)
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-600'
          ]"
        >
          <svg
            v-if="isSelected(option.id)"
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <!-- Icon/Image -->
        <div
          v-if="showIcons && option.image"
          class="w-12 h-12 mb-2 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
        >
          <img :src="option.image" :alt="getOptionName(option)" class="w-full h-full object-cover" />
        </div>
        <div
          v-else-if="showIcons"
          :class="[
            'w-12 h-12 mb-2 rounded-lg flex items-center justify-center',
            isSelected(option.id)
              ? 'bg-primary/20 text-primary'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
          ]"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>

        <!-- Label -->
        <span
          :class="[
            'text-sm font-medium text-center',
            isSelected(option.id)
              ? 'text-primary dark:text-primary-light'
              : 'text-gray-700 dark:text-gray-300'
          ]"
        >
          {{ getOptionName(option) }}
        </span>
      </button>
    </div>

    <!-- Selected Count -->
    <p v-if="modelValue.length > 0" class="mt-3 text-sm text-gray-500 dark:text-gray-400">
      {{ modelValue.length }} {{ $t('common.selected') }}
    </p>
  </div>
</template>
