// Rotates through these 10 questions, repeating after week 10.
export const weeklyQuestions = [
  "What shifted in you this week that didn't exist on day one?",
  "Where did you surprise yourself?",
  "What excuse did you almost let win? What stopped it?",
  "What does discipline feel like in your body right now?",
  "Who are you becoming that you weren't 7 days ago?",
  "What's the hardest moment you're most proud of?",
  "What would you tell someone starting day 1 right now?",
  "Where did rest feel earned rather than avoided?",
  "What habit is starting to feel like identity?",
  "What do you want to remember about this week in 5 years?",
]

export function getWeeklyQuestion(weekNumber) {
  const idx = (weekNumber - 1) % weeklyQuestions.length
  return weeklyQuestions[idx]
}
