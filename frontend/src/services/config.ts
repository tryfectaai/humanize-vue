import api from './api';

// Types
export interface ModelingType {
  id: number;
  nameEn: string;
  nameAr: string;
  order: number;
  image?: string;
  status: number;
}

export interface ProductionType {
  id: number;
  nameEn: string;
  nameAr: string;
  status: number;
}

export interface Preference {
  id: number;
  nameEn: string;
  nameAr: string;
  status: number;
}

export interface Height {
  id: number;
  height: string;
}

export interface Country {
  code: string;
  name_en: string;
  name_ar: string;
  phone_code: string;
  flag: string;
}

export interface Bank {
  id: number;
  name: string;
}

// Config Service
export const configService = {
  async getModelingTypes(): Promise<ModelingType[]> {
    const response = await api.get('/config/modeling-types');
    return response.data;
  },

  async getProductionTypes(): Promise<ProductionType[]> {
    const response = await api.get('/config/production-types');
    return response.data;
  },

  async getPreferences(): Promise<Preference[]> {
    const response = await api.get('/config/preferences');
    return response.data;
  },

  async getHeights(): Promise<Height[]> {
    const response = await api.get('/config/heights');
    return response.data;
  },

  async getCountries(): Promise<Country[]> {
    const response = await api.get('/config/countries');
    return response.data;
  },

  async getBanks(): Promise<Bank[]> {
    const response = await api.get('/config/banks');
    return response.data;
  },

  async getInterests() {
    const response = await api.get('/config/interests');
    return response.data;
  },

  async getJobSectors() {
    const response = await api.get('/config/job-sectors');
    return response.data;
  },

  async getAgeGroups() {
    const response = await api.get('/config/age-groups');
    return response.data;
  },
};
