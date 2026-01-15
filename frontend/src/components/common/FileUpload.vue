<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  modelValue?: string | File | null;
  accept?: string;
  maxSize?: number; // in MB
  placeholder?: string;
  shape?: 'square' | 'circle' | 'cover';
  previewWidth?: string;
  previewHeight?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void;
  (e: 'error', message: string): void;
}>();

const fileInput = ref<HTMLInputElement>();
const isDragging = ref(false);
const errorMessage = ref('');

const previewUrl = computed(() => {
  if (props.modelValue instanceof File) {
    return URL.createObjectURL(props.modelValue);
  }
  if (typeof props.modelValue === 'string') {
    return props.modelValue;
  }
  return null;
});

const containerClasses = computed(() => {
  const base = 'relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer overflow-hidden';
  const dragState = isDragging.value
    ? 'border-primary bg-primary/5'
    : 'border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary';
  
  let shape = '';
  if (props.shape === 'circle') {
    shape = 'rounded-full aspect-square';
  } else if (props.shape === 'cover') {
    shape = 'aspect-[3/1]';
  } else {
    shape = 'aspect-square';
  }
  
  return `${base} ${dragState} ${shape}`;
});

const handleClick = () => {
  fileInput.value?.click();
};

const handleFile = (file: File) => {
  errorMessage.value = '';
  
  // Validate file type
  if (props.accept) {
    const allowedTypes = props.accept.split(',').map(t => t.trim());
    const fileType = file.type;
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    const isAllowed = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExt === type.toLowerCase();
      }
      if (type.endsWith('/*')) {
        return fileType.startsWith(type.replace('/*', '/'));
      }
      return fileType === type;
    });
    
    if (!isAllowed) {
      errorMessage.value = 'Invalid file type';
      emit('error', errorMessage.value);
      return;
    }
  }
  
  // Validate file size
  if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
    errorMessage.value = `File size must be less than ${props.maxSize}MB`;
    emit('error', errorMessage.value);
    return;
  }
  
  emit('update:modelValue', file);
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    handleFile(file);
  }
  // Reset input so same file can be selected again
  input.value = '';
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    handleFile(file);
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const removeFile = (event: Event) => {
  event.stopPropagation();
  emit('update:modelValue', null);
};
</script>

<template>
  <div>
    <div
      :class="containerClasses"
      :style="{
        width: previewWidth || 'auto',
        height: previewHeight || 'auto'
      }"
      @click="handleClick"
      @drop.prevent="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <!-- Preview -->
      <img
        v-if="previewUrl"
        :src="previewUrl"
        :class="[
          'absolute inset-0 w-full h-full object-cover',
          shape === 'circle' ? 'rounded-full' : 'rounded-lg'
        ]"
        alt="Preview"
      />
      
      <!-- Remove Button -->
      <button
        v-if="previewUrl"
        type="button"
        class="absolute top-2 right-2 rtl:right-auto rtl:left-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
        @click="removeFile"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Upload Placeholder -->
      <div
        v-if="!previewUrl"
        class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
      >
        <svg
          class="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ placeholder || $t('common.uploadImage') }}
        </span>
        <span class="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {{ $t('common.dragOrClick') }}
        </span>
      </div>
    </div>
    
    <!-- Error Message -->
    <p v-if="errorMessage" class="mt-1 text-sm text-red-500">
      {{ errorMessage }}
    </p>
    
    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>
