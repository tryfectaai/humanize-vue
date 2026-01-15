export type Gender = 'male' | 'female'

export type VerificationStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'completed' 
  | 're_upload' 
  | 'admin_verified' 
  | 'rejected'

export type RegistrationState = 'pending' | 'in_progress' | 'completed' | 'rejected'

export interface HumanOfficialRegistration {
  id: number
  user_id: number
  name: string
  profile_name: string
  profile_slug: string
  phone: string
  gender: Gender
  dob: string
  nationality: string
  place_of_living: string
  address: string
  current_state: RegistrationState
  created: string
  modified: string
}

export interface HumanProfile {
  id: number
  user_id: number
  official_registration_id: number
  profile_visibility: 'public' | 'private'
  brief_intro: string
  profile_photo: string | null
  selfie_image: string | null
  cover_image: string | null
  selfie_date: string | null
  twitter_link: string | null
  instagram_link: string | null
  facebook_link: string | null
  snapchat_link: string | null
  tiktok_link: string | null
  youtube_link: string | null
  rating_average: number
  rating_count: number
  job_sector_id: number | null
  job_title: string | null
  current_state: string
  interests: number[]
}

export interface Modeling {
  id: number
  user_id: number
  official_registration_id: number
  height: number | null
  model_before: boolean
  price: number
  current_status: string
  modeling_type: number[]
  production_type: number[]
  preference: number[]
}

export interface Child {
  id: number
  parent_id: number
  full_name: string
  profile_name: string
  dob: string
  gender: Gender
  civil_id: string
  price: number
  profile_photo: string | null
  cover_image: string | null
  brief: string
  rating: number
  modeling_type: number[]
  preference: number[]
}

export interface ProfileGallery {
  id: number
  profile_id: number
  user_id: number
  child_id: number | null
  picture: string
}

export interface VerificationId {
  id: number
  user_id: number
  official_registration_id: number
  civil_id: string
  passport_id: string | null
  civil_id_copy: string | null
  country_list: string | null
  bank_name: string
  bank_address: string
  account_holder_name: string
  account_holder_address: string
  account_number_IBAN: string
  SWIFT_number: string
  status: VerificationStatus
}

export interface PhoneVerification {
  id: number
  user_id: number
  official_registration_id: number
  mobile_number: string
  code: string
  status: string
}

export interface PendingRequest {
  id: number
  user_id: number
  requester_id: number
  job_id: number | null
  requester_name: string
  logo: string | null
  status: 'pending' | 'approved' | 'canceled'
  created: string
  modified: string
}

// Form data types for registration steps
export interface Step1BasicInfoData {
  name: string
  profile_name: string
  dob: string
  gender: Gender
  nationality: string
  phone: string
  place_of_living: string
  address: string
}

export interface Step2ModelingData {
  modeling_type: number[]
  production_type: number[]
  preference: number[]
  height: number | null
  model_before: boolean
  price: number
}

export interface Step3ProfileData {
  profile_photo: File | null
  cover_image: File | null
  selfie_image: File | null
  brief_intro: string
  profile_visibility: 'public' | 'private'
  twitter_link: string
  instagram_link: string
  facebook_link: string
  snapchat_link: string
  tiktok_link: string
  youtube_link: string
  job_sector_id: number | null
  job_title: string
  interests: number[]
}

export interface Step4VerificationData {
  civil_id: string
  passport_id: string
  civil_id_copy: File | null
  bank_name: string
  bank_address: string
  account_holder_name: string
  account_holder_address: string
  account_number_IBAN: string
  SWIFT_number: string
}

export interface Step5PhoneData {
  mobile_number: string
  otp_code: string
}
