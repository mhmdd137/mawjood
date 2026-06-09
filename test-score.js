const opportunities = [
  { id:'1', title:'دعم نفسي للأسر النازحة', org_id:'o1', description:'', category:'دعم نفسي', location:'خانيونس', required_skills:['دعم نفسي','إدارة الأزمات'], time_slot:'morning', start_date:'2024-05-15', end_date:'2024-08-15', status:'open', created_at:'' },
  { id:'2', title:'تدريس الأطفال في المخيمات', org_id:'o2', description:'', category:'تعليمي', location:'غزة الشمالية', required_skills:['تدريس'], time_slot:'morning', start_date:'2024-05-10', end_date:'2024-07-10', status:'open', created_at:'' },
]

const MOCK_VOLUNTEER = { location: 'خانيونس', skills: ['دعم نفسي', 'إدارة'], time_slot: 'morning' }

function scoreOpportunity(opportunity, volunteer) {
  let score = 0
  const hasSkillMatch = opportunity.required_skills.some(
    (skill) => volunteer.skills.includes(skill)
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

console.log('Opp 1 score:', scoreOpportunity(opportunities[0], MOCK_VOLUNTEER))
console.log('Opp 2 score:', scoreOpportunity(opportunities[1], MOCK_VOLUNTEER))
