// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiError {
  detail?: string
  message?: string
  errors?: Record<string, string[]>
  [key: string]: unknown
}

// Notification types
export interface Notification {
  id: number
  recipient_id: number
  actor_content_type_id: number
  actor_object_id: string
  verb: string
  description: string
  target_content_type_id: number | null
  target_object_id: string | null
  action_object_content_type_id: number | null
  action_object_object_id: string | null
  timestamp: string
  public: boolean
  deleted: boolean
  emailed: boolean
  unread: boolean
  level: string
  data: {
    image?: string
    [key: string]: unknown
  }
}

// Config types (from conf app)
export interface ModelingType {
  id: number
  name_en: string
  name_ar: string
  order: number
  image: string | null
  status: number
}

export interface ProductionType {
  id: number
  name_en: string
  name_ar: string
  status: number
}

export interface Preference {
  id: number
  name_en: string
  name_ar: string
  status: number
}

export interface Interest {
  id: number
  name_en: string
  name_ar: string
  slug: string
  status: number
}

export interface JobSector {
  id: number
  name_en: string
  name_ar: string
  status: number
}

export interface AgeGroup {
  id: number
  name_en: string
  name_ar: string
  min_age: number
  max_age: number | null
  status: number
}

export interface Height {
  id: number
  height: number
}

export interface Country {
  code: string
  name_en: string
  name_ar: string
  phone_code: string
  flag: string
}

// Escrow types
export interface Escrow {
  id: number
  humanize_id: number
  human_id: number | null
  job_id: number | null
  event_id: number | null
  contest_id: number | null
  amount: number
  status: 'pending' | 'completed' | 'reverted_to_humanize'
  created: string
  modified: string
  images: number[]
}

// Report types
export interface Report {
  id: number
  reporter_id: number
  abuser_id: number
  reason: string
  image_abuse: boolean
  image: string | null
  created: string
}

export interface ReportFormData {
  abuser_id: number
  reason: string
  image_abuse: boolean
  image?: File | null
}

// Social Account (Singleton)
export interface SocialAccount {
  facebook: string
  twitter: string
  instagram: string
}

// Payment types
export interface PaymentRequest {
  amount: number
  item_type: 'job' | 'contest' | 'event'
  item_id: number
  return_url: string
}

export interface PaymentResponse {
  payment_url: string
  transaction_id: number
}

export interface Transaction {
  id: number
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created: string
}
