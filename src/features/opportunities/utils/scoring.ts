// src/features/opportunities/utils/scoring.ts

// نوع بسيط — بس الحقول اللي الـ function بتستخدمها فعلاً
type ScorableOpportunity = {
  required_skills: string[]
  location: string
  start_date: string
  time_slot: string | null
}

type ScorableVolunteer = {
  skills: string[]
  location: string
  time_slot: string | null
}

export function scoreOpportunity(
  opportunity: ScorableOpportunity,
  volunteer: ScorableVolunteer
): number {
  let score = 0

  const hasSkillMatch = opportunity.required_skills.some(
    skill => volunteer.skills.includes(skill)
  )
  if (hasSkillMatch) score += 50

  if (opportunity.location === volunteer.location) score += 30

  const today = new Date()
  const startDate = new Date(opportunity.start_date)
  if (startDate >= today) score += 20

  if (
    opportunity.time_slot &&
    opportunity.time_slot !== 'flexible' &&
    volunteer.time_slot === opportunity.time_slot
  ) score += 10

  return score
}