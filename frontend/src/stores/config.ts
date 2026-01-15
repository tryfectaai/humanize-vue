import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { 
  ModelingType, 
  ProductionType, 
  Preference, 
  Interest, 
  JobSector, 
  AgeGroup,
  Country
} from '@/types/api'

export const useConfigStore = defineStore('config', () => {
  // State
  const modelingTypes = ref<ModelingType[]>([])
  const productionTypes = ref<ProductionType[]>([])
  const preferences = ref<Preference[]>([])
  const interests = ref<Interest[]>([])
  const jobSectors = ref<JobSector[]>([])
  const ageGroups = ref<AgeGroup[]>([])
  const countries = ref<Country[]>([])
  const isLoading = ref(false)
  const isLoaded = ref(false)

  // Default/Mock data for demo
  const defaultModelingTypes: ModelingType[] = [
    { id: 1, name_en: 'Commercial', name_ar: 'إعلانات تجارية', status: 1, order: 1 },
    { id: 2, name_en: 'Fashion', name_ar: 'أزياء', status: 1, order: 2 },
    { id: 3, name_en: 'Fitness', name_ar: 'لياقة بدنية', status: 1, order: 3 },
    { id: 4, name_en: 'Promotional', name_ar: 'ترويجي', status: 1, order: 4 },
    { id: 5, name_en: 'Print', name_ar: 'مطبوعات', status: 1, order: 5 },
    { id: 6, name_en: 'Runway', name_ar: 'عروض أزياء', status: 1, order: 6 },
    { id: 7, name_en: 'Catalog', name_ar: 'كتالوج', status: 1, order: 7 },
    { id: 8, name_en: 'Editorial', name_ar: 'تحريري', status: 1, order: 8 },
  ]

  const defaultProductionTypes: ProductionType[] = [
    { id: 1, name_en: 'TV Commercials', name_ar: 'إعلانات تلفزيونية', status: 1 },
    { id: 2, name_en: 'Digital Content', name_ar: 'محتوى رقمي', status: 1 },
    { id: 3, name_en: 'Social Media', name_ar: 'وسائل التواصل', status: 1 },
    { id: 4, name_en: 'Photography', name_ar: 'تصوير فوتوغرافي', status: 1 },
    { id: 5, name_en: 'Video Production', name_ar: 'إنتاج فيديو', status: 1 },
    { id: 6, name_en: 'Events', name_ar: 'فعاليات', status: 1 },
  ]

  const defaultPreferences: Preference[] = [
    { id: 1, name_en: 'Available for Travel', name_ar: 'متاح للسفر', status: 1 },
    { id: 2, name_en: 'Has Own Transport', name_ar: 'لديه وسيلة نقل', status: 1 },
    { id: 3, name_en: 'Flexible Schedule', name_ar: 'جدول مرن', status: 1 },
    { id: 4, name_en: 'Weekend Availability', name_ar: 'متاح في عطلة نهاية الأسبوع', status: 1 },
    { id: 5, name_en: 'Available for Night Shoots', name_ar: 'متاح للتصوير الليلي', status: 1 },
    { id: 6, name_en: 'Comfortable with Makeup', name_ar: 'مرتاح مع المكياج', status: 1 },
  ]

  // Default interests (new replacement for modeling types)
  const defaultInterests: Interest[] = [
    { id: 1, name_en: 'Product Testing', name_ar: 'اختبار المنتجات', slug: 'product-testing', status: 1 },
    { id: 2, name_en: 'Volunteering', name_ar: 'التطوع', slug: 'volunteering', status: 1 },
    { id: 3, name_en: 'Photography', name_ar: 'التصوير', slug: 'photography', status: 1 },
    { id: 4, name_en: 'Events', name_ar: 'الفعاليات', slug: 'events', status: 1 },
    { id: 5, name_en: 'Fashion', name_ar: 'الأزياء', slug: 'fashion', status: 1 },
    { id: 6, name_en: 'Fitness', name_ar: 'اللياقة البدنية', slug: 'fitness', status: 1 },
    { id: 7, name_en: 'Acting', name_ar: 'التمثيل', slug: 'acting', status: 1 },
    { id: 8, name_en: 'Modeling', name_ar: 'عرض الأزياء', slug: 'modeling', status: 1 },
    { id: 9, name_en: 'Social Media', name_ar: 'وسائل التواصل الاجتماعي', slug: 'social-media', status: 1 },
    { id: 10, name_en: 'Marketing', name_ar: 'التسويق', slug: 'marketing', status: 1 },
    { id: 11, name_en: 'Music', name_ar: 'الموسيقى', slug: 'music', status: 1 },
    { id: 12, name_en: 'Content Creation', name_ar: 'إنشاء المحتوى', slug: 'content-creation', status: 1 },
  ]

  // Default job sectors
  const defaultJobSectors: JobSector[] = [
    { id: 1, name_en: 'Technology', name_ar: 'التكنولوجيا', status: 1 },
    { id: 2, name_en: 'Healthcare', name_ar: 'الرعاية الصحية', status: 1 },
    { id: 3, name_en: 'Education', name_ar: 'التعليم', status: 1 },
    { id: 4, name_en: 'Finance', name_ar: 'المالية', status: 1 },
    { id: 5, name_en: 'Marketing', name_ar: 'التسويق', status: 1 },
    { id: 6, name_en: 'Retail', name_ar: 'التجزئة', status: 1 },
    { id: 7, name_en: 'Entertainment', name_ar: 'الترفيه', status: 1 },
    { id: 8, name_en: 'Real Estate', name_ar: 'العقارات', status: 1 },
    { id: 9, name_en: 'Hospitality', name_ar: 'الضيافة', status: 1 },
    { id: 10, name_en: 'Government', name_ar: 'الحكومة', status: 1 },
    { id: 11, name_en: 'Media', name_ar: 'الإعلام', status: 1 },
    { id: 12, name_en: 'Other', name_ar: 'أخرى', status: 1 },
  ]

  // GCC countries (default for Kuwait focus)
  const gccCountries: Country[] = [
    { code: 'KW', name_en: 'Kuwait', name_ar: 'الكويت', phone_code: '+965', flag: '🇰🇼' },
    { code: 'SA', name_en: 'Saudi Arabia', name_ar: 'السعودية', phone_code: '+966', flag: '🇸🇦' },
    { code: 'AE', name_en: 'United Arab Emirates', name_ar: 'الإمارات', phone_code: '+971', flag: '🇦🇪' },
    { code: 'BH', name_en: 'Bahrain', name_ar: 'البحرين', phone_code: '+973', flag: '🇧🇭' },
    { code: 'OM', name_en: 'Oman', name_ar: 'عمان', phone_code: '+968', flag: '🇴🇲' },
    { code: 'QA', name_en: 'Qatar', name_ar: 'قطر', phone_code: '+974', flag: '🇶🇦' },
  ]

  // Actions
  async function fetchAll(): Promise<void> {
    if (isLoaded.value) return
    
    isLoading.value = true
    
    try {
      const [
        modelingTypesRes,
        productionTypesRes,
        preferencesRes,
        interestsRes,
        jobSectorsRes,
        ageGroupsRes,
        countriesRes,
      ] = await Promise.all([
        api.get<ModelingType[]>('/config/modeling-types/').catch(() => ({ data: defaultModelingTypes })),
        api.get<ProductionType[]>('/config/production-types/').catch(() => ({ data: defaultProductionTypes })),
        api.get<Preference[]>('/config/preferences/').catch(() => ({ data: defaultPreferences })),
        api.get<Interest[]>('/config/interests/').catch(() => ({ data: defaultInterests })),
        api.get<JobSector[]>('/config/job-sectors/').catch(() => ({ data: defaultJobSectors })),
        api.get<AgeGroup[]>('/config/age-groups/').catch(() => ({ data: [] })),
        api.get<Country[]>('/config/countries/').catch(() => ({ data: gccCountries })),
      ])

      modelingTypes.value = modelingTypesRes.data.length > 0 ? modelingTypesRes.data : defaultModelingTypes
      productionTypes.value = productionTypesRes.data.length > 0 ? productionTypesRes.data : defaultProductionTypes
      preferences.value = preferencesRes.data.length > 0 ? preferencesRes.data : defaultPreferences
      interests.value = interestsRes.data.length > 0 ? interestsRes.data : defaultInterests
      jobSectors.value = jobSectorsRes.data.length > 0 ? jobSectorsRes.data : defaultJobSectors
      ageGroups.value = ageGroupsRes.data
      countries.value = countriesRes.data.length > 0 ? countriesRes.data : gccCountries
      
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to fetch config:', error)
      // Set defaults
      modelingTypes.value = defaultModelingTypes
      productionTypes.value = defaultProductionTypes
      preferences.value = defaultPreferences
      interests.value = defaultInterests
      jobSectors.value = defaultJobSectors
      countries.value = gccCountries
      isLoaded.value = true
    } finally {
      isLoading.value = false
    }
  }

  // Alias for fetchAll (for convenience)
  async function fetchConfig(): Promise<void> {
    return fetchAll()
  }

  async function fetchModelingTypes(): Promise<ModelingType[]> {
    if (modelingTypes.value.length > 0) return modelingTypes.value
    
    try {
      const response = await api.get<ModelingType[]>('/config/modeling-types/')
      modelingTypes.value = response.data
      return response.data
    } catch {
      return []
    }
  }

  async function fetchProductionTypes(): Promise<ProductionType[]> {
    if (productionTypes.value.length > 0) return productionTypes.value
    
    try {
      const response = await api.get<ProductionType[]>('/config/production-types/')
      productionTypes.value = response.data
      return response.data
    } catch {
      return []
    }
  }

  async function fetchPreferences(): Promise<Preference[]> {
    if (preferences.value.length > 0) return preferences.value
    
    try {
      const response = await api.get<Preference[]>('/config/preferences/')
      preferences.value = response.data
      return response.data
    } catch {
      return []
    }
  }

  async function fetchInterests(): Promise<Interest[]> {
    if (interests.value.length > 0) return interests.value
    
    try {
      const response = await api.get<Interest[]>('/config/interests/')
      interests.value = response.data.length > 0 ? response.data : defaultInterests
      return interests.value
    } catch {
      interests.value = defaultInterests
      return defaultInterests
    }
  }

  async function fetchJobSectors(): Promise<JobSector[]> {
    if (jobSectors.value.length > 0) return jobSectors.value
    
    try {
      const response = await api.get<JobSector[]>('/config/job-sectors/')
      jobSectors.value = response.data.length > 0 ? response.data : defaultJobSectors
      return jobSectors.value
    } catch {
      jobSectors.value = defaultJobSectors
      return defaultJobSectors
    }
  }

  async function fetchAgeGroups(): Promise<AgeGroup[]> {
    if (ageGroups.value.length > 0) return ageGroups.value
    
    try {
      const response = await api.get<AgeGroup[]>('/config/age-groups/')
      ageGroups.value = response.data
      return response.data
    } catch {
      return []
    }
  }

  // Helper functions
  function getModelingTypeName(id: number, locale: 'en' | 'ar' = 'en'): string {
    const type = modelingTypes.value.find(t => t.id === id)
    return locale === 'ar' ? (type?.name_ar || '') : (type?.name_en || '')
  }

  function getProductionTypeName(id: number, locale: 'en' | 'ar' = 'en'): string {
    const type = productionTypes.value.find(t => t.id === id)
    return locale === 'ar' ? (type?.name_ar || '') : (type?.name_en || '')
  }

  function getPreferenceName(id: number, locale: 'en' | 'ar' = 'en'): string {
    const pref = preferences.value.find(p => p.id === id)
    return locale === 'ar' ? (pref?.name_ar || '') : (pref?.name_en || '')
  }

  function getAgeGroupName(id: number, locale: 'en' | 'ar' = 'en'): string {
    const group = ageGroups.value.find(g => g.id === id)
    return locale === 'ar' ? (group?.name_ar || '') : (group?.name_en || '')
  }

  function getCountryName(code: string, locale: 'en' | 'ar' = 'en'): string {
    const country = countries.value.find(c => c.code === code)
    return locale === 'ar' ? (country?.name_ar || '') : (country?.name_en || '')
  }

  return {
    // State
    modelingTypes,
    productionTypes,
    preferences,
    interests,
    jobSectors,
    ageGroups,
    countries,
    isLoading,
    isLoaded,
    // Actions
    fetchAll,
    fetchConfig,
    fetchModelingTypes,
    fetchProductionTypes,
    fetchPreferences,
    fetchInterests,
    fetchJobSectors,
    fetchAgeGroups,
    // Helpers
    getModelingTypeName,
    getProductionTypeName,
    getPreferenceName,
    getAgeGroupName,
    getCountryName,
  }
})
