export const LOCATIONS = ['غزة الشمالية', 'غزة', 'دير البلح', 'خانيونس', 'رفح'] as const
export const CATEGORIES = ['طبي', 'تعليمي', 'لوجستي', 'دعم نفسي', 'تقني', 'إغاثي'] as const
export const SKILLS = ['تمريض', 'إسعافات أولية', 'تدريس', 'دعم نفسي', 'لوجستيات', 'برمجة', 'تصميم', 'إدارة', 'طبخ', 'نقل'] as const
export const TIME_SLOTS = ['morning', 'afternoon', 'flexible'] as const

export const CATEGORY_ICONS: Record<string, string> = {
  'طبي': '➕',
  'تعليمي': '🎓',
  'لوجستي': '📦',
  'دعم نفسي': '🧠',
  'تقني': '💻',
  'إغاثي': '🆘',
}

export const TIME_SLOT_LABELS: Record<string, string> = {
  morning: 'صباحي',
  afternoon: 'مسائي',
  flexible: 'مرن',
}
