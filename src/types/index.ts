export interface Profile {
  id: string
  full_name: string
  role: 'volunteer' | 'org' | 'admin'
  location: string
  skills: string[]
  time_slot: 'morning' | 'afternoon' | 'flexible' | null
  bio: string
  avatar_url: string | null
  signature_path: string | null
  is_verified: boolean
  created_at: string
}

export interface Opportunity {
  id: string
  org_id: string
  title: string
  description: string
  category: string
  location: string
  required_skills: string[]
  time_slot: 'morning' | 'afternoon' | 'flexible' | null
  start_date: string
  end_date: string
  status: 'draft' | 'open' | 'closed' | 'completed'
  created_at: string
}

export interface Application {
  id: string
  volunteer_id: string
  opportunity_id: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  applied_at: string
}

export interface Certificate {
  id: string
  volunteer_id: string
  application_id: string
  hours_logged: number
  issue_date: string
  file_path: string
  verification_code: string
  status: 'active' | 'revoked'
  issued_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'new_opportunity' | 'application_accepted' | 'application_rejected' | 'new_application' | 'org_verified' | 'certificate_issued'
  message: string
  is_read: boolean
  related_id: string | null
  created_at: string
}

// Extended Types
export interface OpportunityWithOrg extends Opportunity {
  org: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
}

export interface ApplicationWithDetails extends Application {
  volunteer: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'skills' | 'location'>
  opportunity: Pick<Opportunity, 'id' | 'title'>
}
