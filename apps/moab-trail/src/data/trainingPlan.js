// Hardcoded 9-week training plan for the Moab Trail Half Marathon (Nov 7, 2026)
// Source of truth for all plan content. Logged/actual data lives in localStorage (see useWorkoutLog).
// Start date: Sep 7, 2026 (Monday). Race day: Nov 7, 2026 (Saturday).

const STRENGTH_FOUNDATION = [
  'Bodyweight squats — 3 sets x 12',
  'Walking lunges — 3 sets x 10 each leg',
  'Step-ups (curb or low box) — 3 sets x 10 each leg',
  'Calf raises — 3 sets x 15',
  'Glute bridges — 3 sets x 12',
  'Plank — 3 sets x 30 sec',
  'Single-leg balance — 2 sets x 30 sec each side',
]

const STRENGTH_TAPER = [
  'Bodyweight squats — 2 sets x 10',
  'Glute bridges — 2 sets x 12',
  'Calf raises — 2 sets x 12',
  'Hip flexor stretch — 2 sets x 30 sec each side',
  'Foam rolling — quads, calves, IT band — 10 min',
]

// Education templates by workout type — overridden per day where context warrants it
const EDU = {
  easyRun: {
    injury:
      "If your knees or shins ache, slow down or switch to a walk. Easy runs should feel genuinely easy — if you can't hold a full conversation, you're going too fast.",
    fuel: 'A light snack (banana, toast with nut butter, or oatmeal) 30–60 min before is plenty. No special fueling needed for runs under 45 minutes.',
    hydration:
      "Drink 16 oz of water 30 min before your run. For efforts under 4 miles you won't need to carry water, but sip before and after.",
  },
  strength: {
    injury:
      'Skip any movement that causes joint pain — not muscle burn, but sharp or achy joint discomfort. Slow, controlled reps protect tendons better than heavy weight ever will.',
    fuel: 'A protein-rich snack within 30 min post-session helps muscles repair: Greek yogurt, eggs, cottage cheese, or a protein shake (aim for 20–30g protein).',
    hydration:
      "Sip water between sets. Strength work doesn't feel sweaty, but even mild dehydration reduces strength output and slows recovery.",
  },
  trailRun: {
    injury:
      'Most trail injuries are ankle rolls, not overuse — stay focused on your footing, especially on descents. Shorten your stride going downhill to protect your quads and knees.',
    fuel: 'For trail runs over 45 min, bring a gel, a few Medjool dates, or a small bag of trail mix. Practice fueling now so race day is never your first time.',
    hydration:
      'Always carry water on trail runs. Altitude, uneven footing, and extra effort mean you sweat more than on flat roads. Sip every 15–20 min.',
  },
  longRun: {
    injury:
      "Walk breaks are a strategy, not failure. If something starts to ache in the first half, adjust now — it's far easier to manage early discomfort than to push through it for miles.",
    fuel: 'Eat a real meal 2 hours before. For runs over 6 miles, fuel every 45–60 min with a gel, chews, or real food — start at 30 min, before you feel hungry.',
    hydration:
      "Carry water on any run over 5 miles. Sip every 15 min on a schedule — don't wait until you're thirsty, because by then you're already behind.",
  },
  longTrail: {
    injury:
      "Trekking poles protect your knees on steep descents and give you purchase on loose rock. Hike — don't run — the steepest sections. Power hiking is faster and safer than a shuffling jog on aggressive grade.",
    fuel: "Treat this like a race: eat before you're hungry. Pack 200–300 calories per hour — gels, nut butter packets, dates, or a real-food snack every 45–60 min.",
    hydration:
      'Carry at least 1.5 liters. High altitude increases fluid loss even on cool days. Sip before you feel thirsty and add an electrolyte tab to offset sodium loss on longer climbs.',
  },
  crossTrain: {
    injury:
      "Cross-training lets your joints recover from impact while keeping your aerobic engine warm. If you're on a bike, spin at high cadence (90+ rpm) with low resistance — this isn't a hard effort day.",
    fuel: 'A normal balanced meal beforehand is all you need. If this follows a hard training day, lean into carbs and protein to support overnight recovery.',
    hydration:
      "Stay hydrated even for low-impact sessions. Swimming and yoga don't feel sweaty, but you still lose fluid — drink anyway.",
  },
  rest: {
    injury:
      'Rest days are when your muscles actually rebuild stronger. Gentle walking or light stretching is fine if you feel restless — just nothing that raises your heart rate significantly.',
    fuel: "Eat protein with every meal to support muscle repair. Don't skip meals or undereat on rest days — your body is still working hard even while you're sitting still.",
    hydration:
      'Keep sipping throughout the day, especially if yesterday was a hard effort. A good baseline: half your body weight in ounces of water across the day.',
  },
}

export const TRAILS = {
  bst: {
    trailName: 'Bonneville Shoreline Trail',
    trailLocation: 'Sandy/Draper',
    trailMiles: 6,
    trailElevationGain: 629,
    trailDifficulty: 'Moderate',
    trailAllTrailsUrl:
      'https://www.alltrails.com/trail/us/utah/bonneville-shoreline-trail-highlands-of-hidden-valley-to-draper',
    trailNote:
      'Park at Hidden Valley Trailhead off 10600 South. Rolling singletrack along the Wasatch foothills. Dogs allowed on this section.',
    moabGainPct: 42,
  },
  mountOlympusFoothills: {
    trailName: 'Mount Olympus Foothills',
    trailLocation: 'Millcreek / Wasatch Blvd',
    trailMiles: 4,
    trailElevationGain: 700,
    trailDifficulty: 'Moderate',
    trailAllTrailsUrl:
      'https://www.alltrails.com/trail/us/utah/mount-olympus-trail',
    trailNote:
      'Park at the Mount Olympus Trailhead on Wasatch Blvd. Stay on the lower foothills section — turn around at the first saddle, no need to go higher. Rocky in spots, good trail shoes required.',
    moabGainPct: 47,
  },
  snowCanyon: {
    trailName: 'Snow Canyon State Park',
    trailLocation: 'St. George',
    trailMiles: 4,
    trailElevationGain: 550,
    trailDifficulty: 'Moderate',
    trailAllTrailsUrl:
      'https://www.alltrails.com/trail/us/utah/hidden-pinyon-trail',
    trailNote:
      'Park at the Hidden Pinyon Trailhead inside Snow Canyon State Park. Combine Hidden Pinyon with the Lava Flow Trail for ~4 miles of red rock singletrack. $6 day-use fee. No dogs on trails.',
    moabGainPct: 37,
  },
  cornerCanyon: {
    trailName: "Corner Canyon (Ghost Falls / Clark's Loop)",
    trailLocation: 'Draper',
    trailMiles: 6,
    trailElevationGain: 750,
    trailDifficulty: 'Moderate',
    trailAllTrailsUrl: 'https://www.alltrails.com/parks/us/utah/corner-canyon-regional-park',
    trailNote:
      "Park at the Ghost Falls Trailhead. Smooth, well-graded singletrack through scrub oak and maple — popular with mountain bikers, so stay alert on the descents.",
    moabGainPct: 50,
  },
  lccCreek: {
    trailName: 'Little Cottonwood Creek Trail',
    trailLocation: 'Sandy',
    trailMiles: 5.5,
    trailElevationGain: 1013,
    trailDifficulty: 'Hard',
    trailAllTrailsUrl: 'https://www.alltrails.com/trail/us/utah/little-cottonwood-trail--3',
    trailNote:
      'Start from the trailhead near 9000 South. Follows the creek up-canyon with granite views — steady, sustained climbing that mirrors what Moab will ask of your legs.',
    moabGainPct: 68,
  },
  redPineLake: {
    trailName: 'Red Pine Lake',
    trailLocation: 'Little Cottonwood Canyon, Sandy',
    trailMiles: 8,
    trailElevationGain: 2204,
    trailDifficulty: 'Hard',
    trailAllTrailsUrl: 'https://www.alltrails.com/trail/us/utah/red-pine-lake',
    trailNote:
      'Park at the White Pine/Red Pine Trailhead (Cottonwood Canyons parking pass required). A tough, rocky climb to an alpine lake — your biggest vertical day before Lake Blanche.',
    moabGainPct: 147,
  },
  lakeBlanche: {
    trailName: 'Lake Blanche',
    trailLocation: 'Mill B South Fork, Big Cottonwood Canyon',
    trailMiles: 7,
    trailElevationGain: 2700,
    trailDifficulty: 'Hard',
    trailAllTrailsUrl: 'https://www.alltrails.com/trail/us/utah/lake-blanche-trail',
    trailNote:
      'Park at the Mill B South Fork Trailhead. Relentless switchbacks up to a stunning glacial cirque — the hardest day of the entire plan. Take it slow and enjoy it.',
    moabGainPct: 180,
  },
  silverLake: {
    trailName: 'Silver Lake Loop',
    trailLocation: 'Brighton, Big Cottonwood Canyon',
    trailMiles: 2,
    trailElevationGain: 60,
    trailDifficulty: 'Easy',
    trailAllTrailsUrl: 'https://www.alltrails.com/trail/us/utah/silver-lake-loop',
    trailNote:
      'An easy, mostly-flat boardwalk loop around the lake. Perfect for shaking out tired legs during taper week — bring the camera, fall colors should be in full swing.',
    moabGainPct: 4,
  },
}

export const TRAINING_PLAN = [
  // ─── PREP WEEK — Sep 3 ────────────────────────────────────────────────────
  {
    weekNumber: 0,
    title: 'Prep Week',
    phase: 'Warmup',
    badge: 'Prep',
    longRunMiles: 3,
    ...TRAILS.bst,
    days: [
      {
        dayName: 'Thursday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2.5 miles',
        description: 'First run of the prep week. Conversational pace — just wake up the legs before formal training begins Monday.',
        miles: 2.5,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Friday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: 'Full rest or gentle stretching. Save your legs for Saturday.',
        miles: 0,
        education: { ...EDU.rest },
      },
      {
        dayName: 'Saturday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 3 miles (BST Preview)',
        description: "Head to the Bonneville Shoreline Trail for a preview of next week's trail run. Jog easy and just get a feel for the terrain — no pressure, no pace.",
        miles: 3,
        education: {
          injury: "This isn't a workout — it's a tour. Walk anything that feels sketchy. You're just getting familiar with the trail before it counts.",
          fuel: EDU.easyRun.fuel,
          hydration: EDU.easyRun.hydration,
        },
      },
      {
        dayName: 'Sunday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: 'Full rest before Week 1 kicks off tomorrow. Get your gear ready — formal training starts Monday.',
        miles: 0,
        education: {
          injury: EDU.rest.injury,
          fuel: EDU.rest.fuel,
          hydration: 'Top off your hydration today. Starting the plan well-hydrated makes a difference in how the first week feels.',
        },
      },
    ],
  },

  // ─── WEEK 1 — Sep 7 ───────────────────────────────────────────────────────
  {
    weekNumber: 1,
    title: 'Hit the Trail',
    phase: 'Foundation',
    badge: 'Building',
    longRunMiles: 4,
    ...TRAILS.mountOlympusFoothills,
    days: [
      {
        dayName: 'Monday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2.5 miles',
        description: 'First formal training day. Conversational pace only — 3 min run / 1 min walk if needed.',
        miles: 2.5,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Tuesday',
        workoutType: 'Strength',
        title: 'Foundation Strength',
        description: 'Bodyweight circuit focused on knees, hips, and ankles. Focus on form over reps.',
        miles: 0,
        strengthExercises: STRENGTH_FOUNDATION,
        education: { ...EDU.strength },
      },
      {
        dayName: 'Wednesday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2.5 miles',
        description: 'Second easy effort of the week. Same conversational pace — these midweek miles build the aerobic base your trail runs will rely on.',
        miles: 2.5,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Thursday',
        workoutType: 'Cross-Train',
        title: 'Cross-Train — 30 minutes',
        description: 'Bike, swim, or yoga. Anything low-impact that keeps you moving without pounding the legs.',
        miles: 0,
        education: { ...EDU.crossTrain },
      },
      {
        dayName: 'Friday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: 'Full rest before the trail weekend. Lay out your gear and pack water for tomorrow.',
        miles: 0,
        education: { ...EDU.rest },
      },
      {
        dayName: 'Saturday',
        workoutType: 'Trail Run',
        title: 'Trail Run — Bonneville Shoreline Trail (3.5 miles)',
        description: 'Your first planned trail run! Head out from Hidden Valley Trailhead. Walk the climbs, jog the flats. Focus on footing and fun, not pace.',
        miles: 3.5,
        education: {
          injury:
            "First trail run of the plan — stay focused on footing over pace. Most trail injuries are ankle rolls. Walk any descent that feels sketchy. There's zero shame in hiking.",
          fuel: EDU.trailRun.fuel,
          hydration: EDU.trailRun.hydration,
        },
      },
      {
        dayName: 'Sunday',
        workoutType: 'Long Run',
        title: 'Long Run — 4 miles',
        description: 'Back-to-back efforts after yesterday\'s trail run. Slow and steady — walk breaks are completely fine. Notice how the trail miles affect your road legs.',
        miles: 4,
        education: { ...EDU.longRun },
      },
    ],
  },

  // ─── WEEK 2 — Sep 14 ──────────────────────────────────────────────────────
  {
    weekNumber: 2,
    title: 'Climbing Begins',
    phase: 'Build',
    badge: 'Building',
    longRunMiles: 5,
    ...TRAILS.snowCanyon,
    days: [
      {
        dayName: 'Monday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 3 miles',
        description: 'Notice how your legs feel compared to last week. Keep the effort fully conversational.',
        miles: 3,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Tuesday',
        workoutType: 'Strength',
        title: 'Foundation Strength',
        description: 'Same circuit as week 1. Try to add one more rep per set if it feels comfortable.',
        miles: 0,
        strengthExercises: STRENGTH_FOUNDATION,
        education: { ...EDU.strength },
      },
      {
        dayName: 'Wednesday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 3 miles',
        description: 'Steady midweek easy effort. Keep it relaxed — Corner Canyon on Saturday is the main event.',
        miles: 3,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Thursday',
        workoutType: 'Cross-Train',
        title: 'Cross-Train — 30 minutes',
        description: 'Low-impact cross-training. Prioritize hydration today to be ready for Saturday\'s climb.',
        miles: 0,
        education: { ...EDU.crossTrain },
      },
      {
        dayName: 'Friday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: 'Full rest before your first day on Corner Canyon. Lay out your gear and pack water tonight.',
        miles: 0,
        education: { ...EDU.rest },
      },
      {
        dayName: 'Saturday',
        workoutType: 'Trail Run',
        title: 'Trail Run — Hidden Pinyon + Lava Flow, Snow Canyon (4 miles)',
        description: "You're in St. George — make it count. Hidden Pinyon + Lava Flow loop through red rock slickrock. Similar climbing to Corner Canyon but completely different terrain. Walk the steep slickrock sections.",
        miles: 4,
        education: {
          injury:
            'Slickrock is grippy when dry but deceptively slick at angles — stay on the painted trail markers. The red rock descents are shorter but sharper than what you\'re used to on Wasatch trails.',
          fuel: EDU.trailRun.fuel,
          hydration: 'St. George is significantly hotter and drier than Salt Lake — carry more water than you think you need. Plan for at least 20 oz per hour.',
        },
      },
      {
        dayName: 'Sunday',
        workoutType: 'Long Run',
        title: 'Long Run — 5 miles',
        description: "New distance milestone on the road. Run the streets of St. George or Cedar City — flat roads let your legs recover from yesterday's red rock while still hitting the mileage. Bring water and start practicing race-day fuel.",
        miles: 5,
        education: { ...EDU.longRun },
      },
    ],
  },

  // ─── WEEK 3 — Sep 21 ──────────────────────────────────────────────────────
  {
    weekNumber: 3,
    title: 'Steady Vert',
    phase: 'Build',
    badge: 'Building',
    longRunMiles: 6,
    ...TRAILS.cornerCanyon,
    days: [
      {
        dayName: 'Monday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 3 miles',
        description: 'Easy effort. A comfortable start to a step-up week.',
        miles: 3,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Tuesday',
        workoutType: 'Strength',
        title: 'Foundation Strength',
        description: 'Keep the circuit going — strong hips and glutes protect your knees on the descents.',
        miles: 0,
        strengthExercises: STRENGTH_FOUNDATION,
        education: { ...EDU.strength },
      },
      {
        dayName: 'Wednesday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 3 miles',
        description: 'Easy midweek run. Keep the pace fully conversational to recover well for the trail weekend.',
        miles: 3,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Thursday',
        workoutType: 'Cross-Train',
        title: 'Cross-Train — 30 minutes',
        description: 'Low-impact cross-training of your choice. Light stretching in the evening.',
        miles: 0,
        education: { ...EDU.crossTrain },
      },
      {
        dayName: 'Friday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: 'Full rest before a big trail-plus-long-run weekend.',
        miles: 0,
        education: { ...EDU.rest },
      },
      {
        dayName: 'Saturday',
        workoutType: 'Trail Run',
        title: 'Trail Run — Corner Canyon (5 miles)',
        description: 'A longer Corner Canyon loop. More climbing, more descending — practice your downhill form by shortening your stride and letting your arms help balance you.',
        miles: 5,
        education: {
          injury:
            'Longer downhills mean more quad load — shorten your stride on descents. If your knees feel tender from last week, take the steeper sections extra easy.',
          fuel: EDU.trailRun.fuel,
          hydration: EDU.trailRun.hydration,
        },
      },
      {
        dayName: 'Sunday',
        workoutType: 'Long Run',
        title: 'Long Run — 6 miles',
        description: 'Biggest road long run yet. Settle into a rhythm and enjoy it. If you can still feel yesterday\'s hills in your legs, take extra walk breaks — that\'s normal.',
        miles: 6,
        education: { ...EDU.longRun },
      },
    ],
  },

  // ─── WEEK 4 — Sep 28 ──────────────────────────────────────────────────────
  {
    weekNumber: 4,
    title: 'Creek Climb',
    phase: 'Build',
    badge: 'Building',
    longRunMiles: 8,
    ...TRAILS.lccCreek,
    days: [
      {
        dayName: 'Monday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 3 miles',
        description: 'Easy effort. Same comfortable pace as always — let the legs loosen up.',
        miles: 3,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Tuesday',
        workoutType: 'Strength',
        title: 'Foundation Strength',
        description: 'Keep building — this strength work is what protects your knees on technical downhills.',
        miles: 0,
        strengthExercises: STRENGTH_FOUNDATION,
        education: { ...EDU.strength },
      },
      {
        dayName: 'Wednesday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 3 miles',
        description: 'Easy midweek effort. Keep it fully conversational — this week is a step up in both trail and long-run distance.',
        miles: 3,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Thursday',
        workoutType: 'Cross-Train',
        title: 'Cross-Train — 30 minutes',
        description: 'Low-impact cross-training. Prioritize hydration and sleep heading into a big weekend.',
        miles: 0,
        education: { ...EDU.crossTrain },
      },
      {
        dayName: 'Friday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: 'Full rest. Big miles this weekend — lay out your gear and pack water tonight.',
        miles: 0,
        education: { ...EDU.rest },
      },
      {
        dayName: 'Saturday',
        workoutType: 'Trail Run',
        title: 'Trail Run — Little Cottonwood Creek Trail (4.5 miles)',
        description: 'Steady climbing alongside the creek. This sustained grade mirrors what Moab will ask of your legs — practice running tall and breathing steady on the climbs.',
        miles: 4.5,
        education: {
          injury: EDU.trailRun.injury,
          fuel: 'Good week to test any mid-run fuel you\'re considering for the race. Bring a gel or a few dates and note how your stomach handles it on the trail.',
          hydration: EDU.trailRun.hydration,
        },
      },
      {
        dayName: 'Sunday',
        workoutType: 'Long Run',
        title: 'Long Run — 8 miles',
        description: 'Your biggest long run so far — more than half of race distance. Bring fuel and water. Take walk breaks whenever you need them. This is about time on feet, not pace.',
        miles: 8,
        education: {
          injury:
            "At this distance, form breaks down before fitness does. If you start shuffling or hunching, take a walk break to reset. Knee pain on descents today is worth paying attention to.",
          fuel: 'You\'ll need to fuel during this run. Aim for 100–150 calories around the 45-minute mark, then every 45 min after. Practice what you\'ll use on race day.',
          hydration: EDU.longRun.hydration,
        },
      },
    ],
  },

  // ─── WEEK 5 — Oct 5 ───────────────────────────────────────────────────────
  {
    weekNumber: 5,
    title: 'Check the Knees',
    phase: 'Build',
    badge: 'Recovery',
    longRunMiles: 6,
    ...TRAILS.lccCreek,
    days: [
      {
        dayName: 'Monday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2.5 miles',
        description: 'A lighter week — give your body a chance to absorb the last four weeks of work.',
        miles: 2.5,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Tuesday',
        workoutType: 'Strength',
        title: 'Foundation Strength',
        description: 'Same circuit. Pay extra attention to how your knees feel through each movement this week.',
        miles: 0,
        strengthExercises: STRENGTH_FOUNDATION,
        education: { ...EDU.strength },
      },
      {
        dayName: 'Wednesday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2.5 miles',
        description: 'Short and easy. Recovery week — keep the effort genuinely light.',
        miles: 2.5,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Thursday',
        workoutType: 'Cross-Train',
        title: 'Cross-Train — 30 minutes',
        description: 'Low-impact cross-training. Great week for an extra foam rolling session on quads and calves.',
        miles: 0,
        education: { ...EDU.crossTrain },
      },
      {
        dayName: 'Friday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: 'Full rest before the LCC trail run. Good time to check your trail shoes for wear.',
        miles: 0,
        education: { ...EDU.rest },
      },
      {
        dayName: 'Saturday',
        workoutType: 'Trail Run',
        title: 'Trail Run — Little Cottonwood Creek Trail (3.5 miles)',
        description: 'Shorter than last week on the same trail. Use it to dial in your effort — notice how the climbing feels now that you\'ve been training for a month.',
        miles: 3.5,
        education: { ...EDU.trailRun },
      },
      {
        dayName: 'Sunday',
        workoutType: 'Long Run',
        title: 'Long Run — 6 miles',
        description: 'A cutback long run — shorter than last week. Use the extra recovery energy to feel genuinely fresh for the Red Pine push next week.',
        miles: 6,
        education: {
          injury:
            'Mid-plan knee check-in: any lingering aches below the kneecap or on stairs? Three weeks to the big vert days — there\'s still time to address niggles now. A few easy days won\'t hurt your fitness.',
          fuel: EDU.longRun.fuel,
          hydration: EDU.longRun.hydration,
        },
      },
    ],
  },

  // ─── WEEK 6 — Oct 12 ──────────────────────────────────────────────────────
  {
    weekNumber: 6,
    title: 'Highest Point',
    phase: 'Build',
    badge: 'Building',
    longRunMiles: 8,
    ...TRAILS.redPineLake,
    days: [
      {
        dayName: 'Monday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 3 miles',
        description: 'Easy effort to start the biggest week of the plan. Trust the rest you had last week.',
        miles: 3,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Tuesday',
        workoutType: 'Strength',
        title: 'Foundation Strength',
        description: "Keep the circuit going — strong legs are what will make Saturday's Red Pine climb survivable.",
        miles: 0,
        strengthExercises: STRENGTH_FOUNDATION,
        education: { ...EDU.strength },
      },
      {
        dayName: 'Wednesday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2.5 miles',
        description: 'Easy midweek effort. Nothing heroic — all energy is being saved for Saturday.',
        miles: 2.5,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Thursday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2.5 miles',
        description: 'Easy pace. Keep effort low and legs fresh ahead of the biggest climb of the plan.',
        miles: 2.5,
        education: {
          injury: EDU.easyRun.injury,
          fuel: "Start loading carbs slightly today. A pasta or rice dinner tonight sets you up well for Saturday's effort.",
          hydration: EDU.easyRun.hydration,
        },
      },
      {
        dayName: 'Friday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: "Full rest before tomorrow's Red Pine climb. Pack water, snacks, a layer, and trekking poles if you have them. Set an early alarm.",
        miles: 0,
        education: {
          injury: EDU.rest.injury,
          fuel: 'Eat a carb-forward dinner tonight — pasta, rice, or bread. Easy to digest, slow to burn.',
          hydration: 'Drink an extra glass or two of water today. You want to start tomorrow fully hydrated.',
        },
      },
      {
        dayName: 'Saturday',
        workoutType: 'Long Trail',
        title: 'Long Trail — Red Pine Lake (8 miles)',
        description: 'The biggest vertical day of the plan — more climbing than the race itself. Go slow, hike every steep section, and take real breaks at the top.',
        miles: 8,
        education: {
          injury:
            'Your biggest vert day — 2,204 ft of gain, more than the race. Hike everything over 15% grade. Quads burning on descent is normal; sharp knee pain on descent means slow to a walk immediately.',
          fuel: EDU.longTrail.fuel,
          hydration: EDU.longTrail.hydration,
        },
      },
      {
        dayName: 'Sunday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: "Full rest. Whatever Saturday felt like — you just did something genuinely hard. Let your body process it.",
        miles: 0,
        education: {
          injury: EDU.rest.injury,
          fuel: "Eat a protein-and-carb heavy recovery meal today. Your muscles are doing a lot of repair work after that climb — don't undereat.",
          hydration: EDU.rest.hydration,
        },
      },
    ],
  },

  // ─── WEEK 7 — Oct 19 ──────────────────────────────────────────────────────
  {
    weekNumber: 7,
    title: 'Hardest Day',
    phase: 'Sharpen',
    badge: 'Building',
    longRunMiles: 7,
    ...TRAILS.lakeBlanche,
    days: [
      {
        dayName: 'Monday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2.5 miles',
        description: "Easy effort. Your legs may still feel last week's Red Pine climb — that's completely normal.",
        miles: 2.5,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Tuesday',
        workoutType: 'Strength',
        title: 'Foundation Strength',
        description: "Same circuit. Strong legs are about to matter a lot on Saturday's switchbacks.",
        miles: 0,
        strengthExercises: STRENGTH_FOUNDATION,
        education: { ...EDU.strength },
      },
      {
        dayName: 'Wednesday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2 miles',
        description: 'Short and easy. Nothing heroic this week — Lake Blanche is the main event.',
        miles: 2,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Thursday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2 miles',
        description: 'Easy pace. Keep it relaxed and save your legs for the hardest day of the plan.',
        miles: 2,
        education: {
          injury: EDU.easyRun.injury,
          fuel: "Load carbs tonight — a big, easy-to-digest meal sets you up well for Saturday's effort.",
          hydration: EDU.easyRun.hydration,
        },
      },
      {
        dayName: 'Friday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: 'Full rest before the hardest day of the plan. Hydrate well, pack trekking poles, and set a comfortable alarm.',
        miles: 0,
        education: {
          injury: "Get good sleep tonight — fatigue amplifies perceived exertion and slows reaction time on loose terrain. If you're nervous, that's normal. You're ready.",
          fuel: 'Carb-forward dinner, eat early. Keep it familiar — no rich or spicy foods the night before a big effort.',
          hydration: 'Drink extra water today. You want to start tomorrow fully hydrated, not scrambling to catch up mid-climb.',
        },
      },
      {
        dayName: 'Saturday',
        workoutType: 'Long Trail',
        title: 'Long Trail — Lake Blanche (7 miles)',
        description: 'The steepest, most demanding day of the entire plan — relentless switchbacks to a stunning glacial cirque. Hike with poles, take real breaks, and soak in the view at the top.',
        miles: 7,
        education: {
          injury:
            'Lake Blanche has more gain per mile than anything else in the plan — or the race. Use trekking poles if you have them. Hike every pitch over 15% grade. Your quads will be on fire descending — slow down and take it one switchback at a time.',
          fuel: "Pack more food than you think you need: 200–300 cal/hour minimum. The climb is relentless and you'll be out there longer than you expect. Dates, nut butter packets, and a sandwich all work great.",
          hydration: 'Carry at least 2 liters. This is a long, steep effort at elevation. Drink every 20 min on a schedule — don\'t wait until you feel thirsty.',
        },
      },
      {
        dayName: 'Sunday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: "Full rest. That was your hardest training day — everything from here is taper. You've done the hard work.",
        miles: 0,
        education: {
          injury: 'Your legs will be very sore today. Gentle walking, compression socks, and plenty of sleep are your best tools. Foam rolling the quads and calves is fine — go easy.',
          fuel: EDU.rest.fuel,
          hydration: EDU.rest.hydration,
        },
      },
    ],
  },

  // ─── WEEK 8 — Oct 26 ──────────────────────────────────────────────────────
  {
    weekNumber: 8,
    title: 'Ease Off',
    phase: 'Taper',
    badge: 'Taper',
    longRunMiles: 4,
    ...TRAILS.silverLake,
    days: [
      {
        dayName: 'Monday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2 miles',
        description: 'Easy effort. Mileage drops significantly this week — let your legs finally feel genuinely fresh.',
        miles: 2,
        education: {
          injury:
            'Taper soreness is real — legs may feel heavy or tight despite less volume. This is normal. Don\'t add extra miles to "fix" it; the taper is doing exactly what it\'s supposed to.',
          fuel: EDU.easyRun.fuel,
          hydration: EDU.easyRun.hydration,
        },
      },
      {
        dayName: 'Tuesday',
        workoutType: 'Strength',
        title: 'Taper Strength & Mobility',
        description: 'A lighter strength session focused on mobility and loosening tight spots from the last two big weekends.',
        miles: 0,
        strengthExercises: STRENGTH_TAPER,
        education: {
          injury:
            'Keep the load light — this is maintenance, not building. If anything feels irritated, skip that movement entirely. Mobility work matters more than reps right now.',
          fuel: EDU.strength.fuel,
          hydration: EDU.strength.hydration,
        },
      },
      {
        dayName: 'Wednesday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2 miles',
        description: 'Short and easy midweek effort. Enjoy feeling rested — the taper is working.',
        miles: 2,
        education: { ...EDU.easyRun },
      },
      {
        dayName: 'Thursday',
        workoutType: 'Cross-Train',
        title: 'Cross-Train — 20 minutes',
        description: 'Light, low-impact movement. A gentle bike spin, easy yoga, or a short swim — nothing that raises your heart rate above comfortable.',
        miles: 0,
        education: {
          injury: 'Keep intensity very low. Taper is not the time to test a new activity or push any effort. Easy movement only.',
          fuel: EDU.crossTrain.fuel,
          hydration: EDU.crossTrain.hydration,
        },
      },
      {
        dayName: 'Friday',
        workoutType: 'Rest',
        title: 'Rest Day',
        description: 'Full rest. One more week of taper after this. The fitness is locked in — rest is your final performance enhancer.',
        miles: 0,
        education: {
          injury: EDU.rest.injury,
          fuel: EDU.rest.fuel,
          hydration: 'Begin gently ramping up hydration in the days leading to race week. You want to arrive in Moab already well topped-off.',
        },
      },
      {
        dayName: 'Saturday',
        workoutType: 'Trail Run',
        title: 'Trail Run — Silver Lake Loop (2 miles)',
        description: 'An easy, mostly-flat boardwalk loop at Brighton. Enjoy the fall colors — they should be spectacular up here. Keep it to a gentle jog.',
        miles: 2,
        education: {
          injury: "This is a shakeout, not a workout. Walk any section that doesn't feel right. The only goal today is to stay loose.",
          fuel: 'No special fueling needed for this short loop — just bring water and enjoy the scenery.',
          hydration: EDU.trailRun.hydration,
        },
      },
      {
        dayName: 'Sunday',
        workoutType: 'Long Run',
        title: 'Long Run — 4 miles',
        description: 'Easy, comfortable miles. No need to push — this is about staying loose and confident heading into race week.',
        miles: 4,
        education: {
          injury:
            "If your legs feel heavy, that's the taper. If something actually hurts, rest — one run won't make or break race day. Trust what you've built.",
          fuel: "Practice your race-day hydration and fuel routine on this run — same amounts, same timing as you plan for Moab.",
          hydration: "This is your last long run before race day. Lock in your hydration protocol — whatever you've been practicing.",
        },
      },
    ],
  },

  // ─── WEEK 9 — Nov 2 (Race Week) ───────────────────────────────────────────
  {
    weekNumber: 9,
    title: 'Trust It',
    phase: 'Taper',
    badge: 'Race Week',
    longRunMiles: 13.1,
    ...TRAILS.silverLake,
    trailNote:
      'An easy, mostly-flat boardwalk loop around the lake. A perfect short shakeout during race week — save your legs for Moab.',
    days: [
      {
        dayName: 'Monday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 2 miles',
        description: "Easy effort, short and relaxed. The work is done — this is just keeping your legs awake.",
        miles: 2,
        education: {
          injury:
            "Any new aches this week are almost certainly phantom taper pains — they vanish on race day. Don't do anything extra to \"fix\" them.",
          fuel: EDU.easyRun.fuel,
          hydration: 'Begin race-week hydration: aim for 80–100 oz of water daily through Saturday. This sets you up for the desert.',
        },
      },
      {
        dayName: 'Tuesday',
        workoutType: 'Cross-Train',
        title: 'Cross-Train — 20 minutes',
        description: 'Light, low-impact movement. Nothing strenuous.',
        miles: 0,
        education: {
          injury: 'Nothing new this week. Stick to familiar movement patterns only.',
          fuel: EDU.crossTrain.fuel,
          hydration: EDU.crossTrain.hydration,
        },
      },
      {
        dayName: 'Wednesday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 1.5 miles (shakeout)',
        description: "A short, gentle shakeout jog. Your legs should feel surprisingly good — that's the taper working. Keep it light.",
        miles: 1.5,
        education: {
          injury: "Short and easy only. If your legs feel off today, just walk it instead — 1.5 miles won't affect race day either way.",
          fuel: 'Practice your race-day breakfast today at the same time relative to your run. No new foods.',
          hydration: EDU.easyRun.hydration,
        },
      },
      {
        dayName: 'Thursday',
        workoutType: 'Easy Run',
        title: 'Easy Run — 1.5 miles',
        description: 'Short and easy. Start thinking through race-day logistics: breakfast timing, what to pack, what time to arrive.',
        miles: 1.5,
        education: {
          injury: 'Keep this one genuinely easy. Your job this week is to rest, not to squeeze out fitness.',
          fuel: "Think through your race-morning meal. Whatever you plan to eat before the gun — eat it now, at the same relative timing, so your gut is familiar.",
          hydration: EDU.easyRun.hydration,
        },
      },
      {
        dayName: 'Friday',
        workoutType: 'Rest',
        title: 'Rest Day — Travel to Moab',
        description: 'Full rest. Travel down to Moab, get settled, and do a little gear prep. Walk around town and eat an early dinner.',
        miles: 0,
        education: {
          injury:
            'Keep your feet up after the drive. Compression socks during travel help reduce leg stiffness from hours in the car.',
          fuel: 'Race-eve dinner: carb-forward and familiar — pasta, rice, or bread. Nothing rich, spicy, or new. Eat at least 3 hours before bedtime.',
          hydration:
            "Drink extra water during the drive. Moab is dry desert air — you lose fluid even just sitting in the car. Arrive hydrated.",
        },
      },
      {
        dayName: 'Saturday',
        workoutType: 'Long Run',
        title: 'Race Day — Moab Trail Half Marathon!',
        description: "13.1 miles through Kane Creek Canyon. The training, the trails, all those big weekend days — it was all for this. Run your own race and enjoy every mile.",
        miles: 13.1,
        education: {
          injury:
            "If something starts hurting early, don't push through and make it worse. Slow down, assess, and adjust — a smart race beats a hobbled finish.",
          fuel: "Race-morning breakfast 2–2.5 hours before start. During the race, fuel every 45–60 min — whatever you've been practicing. Don't try anything new today.",
          hydration:
            "Use every aid station. Even if you're not thirsty, take water or electrolytes. Moab's dry desert air will dehydrate you faster than you expect.",
        },
      },
      {
        dayName: 'Sunday',
        workoutType: 'Rest',
        title: 'Rest Day — Celebrate!',
        description: 'Full rest. You finished a half marathon through canyon country. Celebrate with the Moab crew and let those legs recover.',
        miles: 0,
        education: {
          injury:
            'Post-race legs will be very sore, especially the quads. Gentle walking, compression socks, and elevation are your friends. No running for at least a week.',
          fuel: "Eat plenty today — you just burned 1,500+ calories. Enjoy the celebration meal. You've absolutely earned it.",
          hydration:
            "Keep drinking today even if you don't feel thirsty. Race-day dehydration lingers. Electrolytes help replenish what the desert took.",
        },
      },
    ],
  },
]

export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const MOAB_RACE_GAIN_FT = 1500
export const MOAB_RACE_DISTANCE_MILES = 13.1

export function getWeek(weekNumber) {
  return TRAINING_PLAN.find((w) => w.weekNumber === weekNumber)
}
