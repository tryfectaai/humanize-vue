export type ParticipationStatus = 'submitted' | 'accepted' | 'rejected' | 'winner'

export interface Contest {
  id: number
  company_id: number
  image: string
  title: string
  brief_details: string
  price: number
  vat: number
  total_amount: number
  done: boolean
  start_date: string
  end_date: string
  transaction_id: number | null
  paid: boolean
  status: number
  category: number[]
  created: string
  modified: string
  // Joined fields
  company?: {
    id: number
    name: string
    profile_photo: string | null
  }
  participation_count?: number
  my_participation_status?: ParticipationStatus | null
}

export interface ContestCategory {
  id: number
  category_en: string
  category_ar: string
}

export interface Participate {
  id: number
  user_id: number
  contest_id: number
  winner: boolean
  status: ParticipationStatus
  created: string
  modified: string
  // Joined fields
  user?: {
    id: number
    name: string
    profile_name: string
    profile_photo: string | null
  }
  images?: ParticipateImage[]
}

export interface ParticipateImage {
  id: number
  participate_id: number
  user_id: number
  image: string
  has_video: boolean
  is_purchased: boolean
}

export interface ContestConfig {
  min_prize: number
  max_prize: number
  fee_percentage: number | null
  flat_fee: number | null
  vat_percentage: number
  categories: ContestCategory[]
}

export interface ContestFormData {
  image: File | null
  title: string
  brief_details: string
  price: number
  start_date: string
  end_date: string
  category: number[]
}

export interface ParticipationFormData {
  images: File[]
  video?: File | null
}
