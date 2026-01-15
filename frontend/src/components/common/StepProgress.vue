<script setup lang="ts">
interface Step {
  number: number;
  title: string;
  description?: string;
}

defineProps<{
  steps: Step[];
  currentStep: number;
}>();
</script>

<template>
  <div class="w-full">
    <!-- Desktop Progress Bar -->
    <div class="hidden md:flex items-center justify-between">
      <template v-for="(step, index) in steps" :key="step.number">
        <!-- Step Circle -->
        <div class="flex flex-col items-center">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
              currentStep > step.number
                ? 'bg-green-500 text-white'
                : currentStep === step.number
                ? 'bg-primary text-white ring-4 ring-primary/20'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            ]"
          >
            <svg
              v-if="currentStep > step.number"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span v-else>{{ step.number }}</span>
          </div>
          <span
            :class="[
              'mt-2 text-xs font-medium text-center max-w-[100px]',
              currentStep >= step.number
                ? 'text-primary dark:text-primary-light'
                : 'text-gray-400 dark:text-gray-500'
            ]"
          >
            {{ step.title }}
          </span>
        </div>

        <!-- Connector Line -->
        <div
          v-if="index < steps.length - 1"
          :class="[
            'flex-1 h-1 mx-2 rounded-full transition-all duration-300',
            currentStep > step.number
              ? 'bg-green-500'
              : 'bg-gray-200 dark:bg-gray-700'
          ]"
        />
      </template>
    </div>

    <!-- Mobile Progress Bar -->
    <div class="md:hidden">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
          {{ $t('registration.step') }} {{ currentStep }} {{ $t('registration.of') }} {{ steps.length }}
        </span>
        <span class="text-sm font-semibold text-primary dark:text-primary-light">
          {{ steps[currentStep - 1]?.title }}
        </span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="bg-primary h-2 rounded-full transition-all duration-300"
          :style="{ width: `${(currentStep / steps.length) * 100}%` }"
        />
      </div>
    </div>
  </div>
</template>
