export type EventInterestState = 'pending' | 'accepted' | 'rejected'

export interface GenericEvent {
  id: number
  creator_id: number
  event_name: string
  event_category_id: number
  event_description: string
  event_address: string
  country: string
  number_of_attendees: number
  number_of_hours: number
  start_date: string
  end_date: string
  image: string | null
  budget: number
  vat: number
  total_amount: number
  transaction_id: number | null
  is_unpaid: boolean
  paid: boolean
  created: string
  modified: string
  attendees: number[]
  // Joined fields
  creator?: {
    id: number
    name: string
    profile_photo: string | null
  }
  category?: EventCategory
  registration_count?: number
  my_registration_status?: EventInterestState | null
}

export interface EventCategory {
  id: number
  category_en: string
  category_ar: string
  is_active: boolean
}

export interface EventInterestRequest {
  id: number
  event_id: number
  human_id: number
  request_state: EventInterestState
  accepted_date: string | null
  created: string
  modified: string
  // Joined fields
  human?: {
    id: number
    name: string
    profile_name: string
    profile_photo: string | null
    rating_average: number
  }
}

export interface EventConfig {
  min_budget: number
  max_budget: number
  max_attendees: number
  fee_percentage: number | null
  flat_fee: number | null
  service_fee: number | null
  vat_percentage: number
  categories: EventCategory[]
}

export interface EventFormData {
  event_name: string
  event_category_id: number
  event_description: string
  event_address: string
  country: string
  number_of_attendees: number
  number_of_hours: number
  start_date: string
  end_date: string
  image: File | null
  budget: number
}

export interface EventFilters {
  category_id?: number
  country?: string
  date_from?: string
  date_to?: string
  search?: string
}
