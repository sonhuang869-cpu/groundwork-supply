/**
 * Products were renamed after the first proposals went out. A URL already in
 * somebody's inbox is not ours to break, so an old slug resolves to its
 * replacement instead of landing on a 404.
 */
export const MOVED: Record<string, string> = {
  'percussion-massager': 'studio-yoga-mat',
  'recovery-boots': 'adjustable-dumbbell',
  'kettlebell-12kg': 'cast-kettlebell',
  'foam-roller': 'insulated-bottle',
  'posture-band': 'weighted-jump-rope',
}

export const movedTo = (slug: string | undefined) => (slug ? MOVED[slug] : undefined)
