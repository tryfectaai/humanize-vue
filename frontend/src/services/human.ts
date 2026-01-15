import api from './api';

// Types
export interface Step1BasicInfoPayload {
  name: string;
  profileName: string;
  dob: string;
  gender: 'male' | 'female';
  nationality: string;
  placeOfLiving: string;
  phone: string;
  address?: string;
}

// Legacy modeling payload (kept for backwards compatibility)
export interface Step2ModelingPayload {
  modelingTypes: number[];
  productionTypes?: number[];
  preferences?: number[];
  heightId?: number;
  modelBefore: boolean;
  price: number;
  otherModeling?: string;
  otherProduction?: string;
  otherPreference?: string;
}

// New interests payload (replaces modeling)
export interface Step2InterestsPayload {
  interests: number[];
  modelBefore: boolean;
  price: number;
  otherModeling?: string;
}

export interface Step3ProfilePayload {
  briefIntro?: string;
  profileVisibility?: 'public' | 'private';
  jobSectorId?: number;
  jobTitle?: string;
  heightId?: number;
  twitterLink?: string;
  instagramLink?: string;
  facebookLink?: string;
  snapchatLink?: string;
  tiktokLink?: string;
  youtubeLink?: string;
}

export interface Step4VerificationPayload {
  civilId: string;
  passportId?: string;
  countryList?: string;
  bankName: string;
  bankAddress?: string;
  accountHolderName: string;
  accountHolderAddress?: string;
  accountNumberIBAN: string;
  swiftNumber?: string;
}

export interface SendOtpPayload {
  mobileNumber: string;
}

export interface VerifyOtpPayload {
  mobileNumber: string;
  code: string;
}

export interface RegistrationStatus {
  steps: {
    step1: 'completed' | 'pending';
    step2: 'completed' | 'pending';
    step3: 'completed' | 'pending';
    step4: 'completed' | 'pending';
    step5: 'completed' | 'pending';
  };
  completedSteps: number;
  totalSteps: number;
  progress: number;
  isComplete: boolean;
  currentState: string;
}

// Human Registration Service
export const humanService = {
  // Step 1: Basic Info
  async saveBasicInfo(payload: Step1BasicInfoPayload) {
    const response = await api.post('/human/registration', payload);
    return response.data;
  },

  async getBasicInfo() {
    const response = await api.get('/human/registration');
    return response.data;
  },

  // Step 2: Interests (NEW - replaces modeling)
  async saveInterests(payload: Step2InterestsPayload) {
    const response = await api.post('/human/interests', payload);
    return response.data;
  },

  async getInterests() {
    const response = await api.get('/human/interests');
    return response.data;
  },

  // Step 2 (Legacy): Modeling (kept for backwards compatibility)
  async saveModeling(payload: Step2ModelingPayload) {
    const response = await api.post('/human/modeling', payload);
    return response.data;
  },

  async getModeling() {
    const response = await api.get('/human/modeling');
    return response.data;
  },

  // Step 3: Profile
  async saveProfile(payload: Step3ProfilePayload) {
    const response = await api.post('/human/profile', payload);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/human/profile');
    return response.data;
  },

  // Step 4: Verification
  async saveVerification(payload: Step4VerificationPayload) {
    const response = await api.post('/human/verification', payload);
    return response.data;
  },

  async getVerification() {
    const response = await api.get('/human/verification');
    return response.data;
  },

  // Step 5: Phone OTP
  async sendOtp(payload: SendOtpPayload) {
    const response = await api.post('/human/phone-verification', payload);
    return response.data;
  },

  async verifyOtp(payload: VerifyOtpPayload) {
    const response = await api.post('/human/phone-verification/verify', payload);
    return response.data;
  },

  async getPhoneVerification() {
    const response = await api.get('/human/phone-verification');
    return response.data;
  },

  // Registration Status
  async getRegistrationStatus(): Promise<RegistrationStatus> {
    const response = await api.get('/human/registration-status');
    return response.data;
  },
};
