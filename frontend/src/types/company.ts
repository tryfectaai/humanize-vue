export interface CompanyOfficialRegistration {
  id: number
  user_id: number
  name: string
  profile_name: string
  profile_slug: string
  phone: string
  location: string
  web_site: string | null
  address: string
  current_state: string
  special_fee: number | null
  special_flat_fee: number | null
  cover_image: string | null
}

export interface CompanyProfile {
  id: number
  user_id: number
  official_registration_id: number
  profile_visibility: 'public' | 'private'
  profile_photo: string | null
  company_brief: string
  current_state: string
}

export interface Hiring {
  id: number
  user_id: number
  assist_on_location: boolean
  current_status: string
  modeling_type: number[]
  production_type: number[]
}

export interface CompanyConnectionRequest {
  id: number
  sender_id: number
  receiver_id: number
  request_state: 'pending' | 'accepted' | 'rejected'
  created: string
  modified: string
  sender?: {
    id: number
    name: string
    profile_photo: string | null
  }
}

export interface TrustedPartner {
  id: number
  logo: string
  humanize_company_id: number
}

// Form data types for company registration
export interface CompanyStep1Data {
  name: string
  profile_name: string
  phone: string
  location: string
  web_site: string
  address: string
}

export interface CompanyStep2Data {
  modeling_type: number[]
  production_type: number[]
  assist_on_location: boolean
}

export interface CompanyStep3Data {
  profile_photo: File | null
  cover_image: File | null
  company_brief: string
  profile_visibility: 'public' | 'private'
}

export interface CompanyStep4Data {
  civil_id: string
  civil_id_copy: File | null
  bank_name: string
  bank_address: string
  account_holder_name: string
  account_holder_address: string
  account_number_IBAN: string
  SWIFT_number: string
}

export interface CompanyStep5Data {
  mobile_number: string
  otp_code: string
}
