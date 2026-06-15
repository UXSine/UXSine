// Rotated after each saved workout log
export const MOTIVATIONAL_FACTS = [
  'The Moab Trail Half Marathon winds through Kane Creek Canyon, with red rock walls towering on both sides for much of the route.',
  "Moab's total elevation gain (~1,500 ft) is less than your Red Pine Lake long run — you're already trained for harder than race day.",
  'Trail running is about time on feet, not pace. Every minute you spend out there is building the fitness that gets you to the finish.',
  'The Wasatch trails you train on — sandstone, scrub oak, granite — are great prep for the slickrock and sand of the Moab desert.',
  'Walking the uphills is a real strategy, not a fallback. Most trail runners — even fast ones — hike the steep stuff.',
  'November in Moab is cool and crisp, usually 40s-60s°F — perfect trail running weather after a summer of training in the heat.',
]

export function getRandomFact() {
  return MOTIVATIONAL_FACTS[Math.floor(Math.random() * MOTIVATIONAL_FACTS.length)]
}
