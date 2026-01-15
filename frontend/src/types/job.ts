export type JobSubmissionType = 'wall' | 'specific_user' | 'specific_humans_and_wall'
export type JobType = 'adults' | 'kids'
export type InterestRequestState = 'pending' | 'accepted' | 'rejected' | 'completed'

export interface Job {
  id: number
  creator_id: number
  project_name: string
  project_brief: string
  project_date: string
  reference: string | null
  budget: number
  vat: number
  total_amount: number
  number_of_people_id: number
  type: JobType
  number_of_hour_id: number
  completed: boolean
  post_job_on_wall: boolean
  submission_type: JobSubmissionType
  rating: number | null
  comment: string | null
  transaction_id: number | null
  paid: boolean
  display_as_humanize: boolean
  is_private: boolean
  created: string
  modified: string
  modeling_type: number[]
  preference: number[]
  age_groups: number[]
  humans: number[]
  child: number[]
  // Computed / joined fields
  creator?: {
    id: number
    name: string
    profile_photo: string | null
  }
  number_of_people?: number
  number_of_hours?: number
  interest_count?: number
  my_interest_status?: InterestRequestState | null
}

export interface InterestRequest {
  id: number
  human_id: number
  job_id: number
  child_id: number | null
  request_state: InterestRequestState
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
  child?: {
    id: number
    full_name: string
    profile_name: string
    profile_photo: string | null
  }
}

export interface JobComment {
  id: number
  job_id: number
  user_id: number
  parent_id: number | null
  content: string
  is_deleted: boolean
  created: string
  modified: string
  user?: {
    id: number
    name: string
    profile_photo: string | null
  }
  replies?: JobComment[]
}

export interface NumberOfPeople {
  id: number
  number_of_people: number
}

export interface NumberOfHours {
  id: number
  number_of_hour: number
}

export interface JobConfig {
  budget_min: number
  budget_max: number
  fee_percentage: number | null
  flat_fee: number | null
  vat_percentage: number
  private_posting_fee: number
  number_of_people: NumberOfPeople[]
  number_of_hours: NumberOfHours[]
}

// Form data for creating/editing a job
export interface JobFormData {
  project_name: string
  project_brief: string
  project_date: string
  reference: File | null
  budget: number
  type: JobType
  number_of_people_id: number
  number_of_hour_id: number
  submission_type: JobSubmissionType
  display_as_humanize: boolean
  is_private: boolean
  modeling_type: number[]
  preference: number[]
  age_groups: number[]
  humans: number[]
}

export interface JobFilters {
  modeling_type?: number[]
  age_groups?: number[]
  min_budget?: number
  max_budget?: number
  type?: JobType
  date_from?: string
  date_to?: string
  search?: string
}
