// All the words live here, so they're easy to tweak without touching any layout code.

export const NAMES = { her: 'Shivani', me: 'Vaibhav' }

// If you ever find out the exact date, put it here, e.g. { day: 12, month: 10 } (month is 0-based: 0 = Jan).
// While it's null, the calendar shows the honest truth: a date my brain misplaced.
export const BIRTHDAY = { day: 27, month: 9 } // 27 October

export const SECTIONS = [
  { id: 'hero', label: 'Opening' },
  { id: 'forgot', label: 'The date' },
  { id: 'timeline', label: 'Two days' },
  { id: 'dossier', label: 'Character file' },
  { id: 'gallery', label: 'Evidence' },
  { id: 'cinema', label: 'Cinema' },
  { id: 'scooty', label: 'Scooty' },
  { id: 'pocket', label: 'Magic pocket' },
  { id: 'letter', label: 'The note' },
  { id: 'finale', label: 'Last surprise' },
]

export const TIMELINE = [
  {
    tag: 'Day 01',
    title: 'A random Snapchat connection.',
    body: 'Snapchat decided to introduce two strangers. Neither of us filed a complaint.',
    chips: ['new connection ✨', 'the first hello', 'mild curiosity'],
  },
  {
    tag: 'Day 02',
    title: 'Conversations, random topics, and getting to know each other.',
    body: 'Movies, web series, a fair warning about anger issues, and a scooty-shaped plan for the future.',
    chips: ['movies 🎬', 'series 📺', 'anger issues ⚠️', 'scooty 🛵'],
  },
  {
    tag: 'Today',
    title: 'A small birthday surprise, because someone deserves a proper apology.',
    body: 'A text felt too small for this one. So I built you a little corner of the internet instead.',
    chips: ['an apology', 'a belated wish', 'one small website 💜'],
  },
]

export const DOSSIER = [
  { key: 'Personality', value: 'Sweet, but claims to have anger issues.', meter: 92, icon: 'Sparkles' },
  { key: 'Hidden talent', value: 'Making conversations interesting.', meter: 96, icon: 'MessageCircleHeart' },
  { key: 'Work ethic', value: 'Hardworking.', meter: 98, icon: 'BriefcaseBusiness' },
  { key: 'Appearance', value: 'Pretty, obviously.', meter: 100, icon: 'Star' },
  { key: 'Favourite escape', value: 'Movies and web series.', meter: 99, icon: 'Clapperboard' },
  { key: 'Special ability', value: 'Getting angry and still being adorable about it.', meter: 88, icon: 'Flame' },
  { key: 'Favourite flower', value: 'Sunflowers. Noted, and this one I’m never forgetting.', meter: 100, icon: 'Flower2' },
]

export const UNIVERSES = [
  {
    id: 'gothic',
    title: 'The Gothic Universe',
    hint: 'Wednesday-inspired',
    caption: 'For the mysterious, slightly dark, and unapologetically different side.',
    screen: ['#0b0614', '#3b0d4f', '#9b5de5'],
    accent: '#c4b5fd',
    tagline: 'Now showing: the mysterious side',
  },
  {
    id: 'campus',
    title: 'The Campus Universe',
    hint: 'Off Campus-inspired',
    caption: 'For the stories that keep you hooked episode after episode.',
    screen: ['#1a0716', '#7a1d4f', '#f472b6'],
    accent: '#f9a8d4',
    tagline: 'Now showing: just one more episode',
  },
]

export const SCOOTY_TERMS = [
  'Learning starts with patience.',
  'No unnecessary panic.',
  'Helmet is compulsory.',
  'Falling in love with riding is encouraged, falling off the scooter is not.',
  'Future rides are officially pending.',
]

export const LETTER = [
  'Hey Shivani,',
  'First of all, a very happy belated birthday!',
  'I know this wish is late, and I know I should have remembered the date. It was my mistake, and I’m genuinely sorry. I could blame my short-term memory, but honestly, that’s not an excuse.',
  'We’ve only been talking for around two days, ever since Snapchat decided to introduce us, and somehow these little conversations have already become something I genuinely enjoy.',
  'You describe yourself as someone with anger issues, but from what I’ve seen, you’re also a sweet, pretty, hardworking person. Don’t let your own description of yourself hide all the good things about you.',
  'I hope this new year of your life brings you happiness, achievements, good health, exciting experiences, and everything you’ve been working hard for.',
  'And please, keep watching your movies and series, keep being a little dramatic about your favourites, and don’t forget that you still owe me a scooty lesson opportunity. One day there will be random rides, questionable navigation decisions, unnecessary stops, and stories to laugh about later.',
  'I forgot a date, not the fact that you’re someone worth appreciating.',
  'Happy Birthday once again, Shivani. Stay happy, keep working hard, keep being yourself, and please don’t let your anger issues win every argument.',
  'P.S. Next time I’ll try remembering the date. No promises about remembering directions, though.',
]
