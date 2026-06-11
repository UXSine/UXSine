export const journalPrompts = [
  "What's one thing you did today that your future self will thank you for?",
  "Describe a moment today when you wanted to quit, but didn't.",
  "What's getting easier? What's still hard?",
  "Write about a small win from today.",
  "What's one thought you keep returning to?",
  "How did your body feel today, and what does it need?",
  "What would you say to someone starting their first day right now?",
  "What are you avoiding that you know you need to face?",
  "Describe today in five words. Then explain.",
  "What's something you're proud of that no one else noticed?",
  "What habit feels less like a chore and more like who you are now?",
  "Write down one thing you're looking forward to tomorrow.",
  "What does discipline look like for you today, specifically?",
  "Who or what kept you accountable today?",
  "What's one excuse you didn't let win today?",
]

export function getPromptForDay(day) {
  const idx = (day - 1) % journalPrompts.length
  return journalPrompts[idx]
}
