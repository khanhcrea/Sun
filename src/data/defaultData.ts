import { CatProfile, WeightRecord, GalleryImage, DailyTask, MoodRecord } from '../types';

export const DEFAULT_CAT_PROFILE: CatProfile = {
  name: "Sún",
  breed: "Grey British shorthair",
  age: "2 Years",
  personality: ["Curious", "Sunny-Sleepy", "Gentle"],
  favoriteSpot: "Tatami patch near window",
  favoriteToy: "Burlap linen ball",
  avatarUrl: "/src/assets/images/z7899206683246_54ebcab0c13069e1652937072d856d5a.jpg",
  bio: "sleepy, seriously",
  furColor: "Grey and White",
  pattern: "Classic Tabby swirls with symmetrical forehead 'M'",
  distinctiveFeatures: ["Luminous amber-golden eyes", "Squishy pink paw pads with black speckles", "Cozy white socks on all front and back paws", "Endearing little cream patch on muzzle tip"]
};

export const DEFAULT_WEIGHT_HISTORY: WeightRecord[] = [
  { id: "w-1", date: "2024-06-15", weight: 4.0 },
  { id: "w-2", date: "2024-09-15", weight: 4.3 },
  { id: "w-3", date: "2024-12-15", weight: 4.6 },
  { id: "w-4", date: "2025-03-15", weight: 4.9 },
  { id: "w-5", date: "2025-06-15", weight: 5.2 },
  { id: "w-6", date: "2025-09-15", weight: 5.5 },
  { id: "w-7", date: "2025-12-15", weight: 5.7 },
  { id: "w-8", date: "2026-03-15", weight: 5.9 },
  { id: "w-9", date: "2026-06-04", weight: "more than 6kg" }
];

export const DEFAULT_PHOTO_GALLERY: GalleryImage[] = [
  {
    id: "g-0",
    url: "/src/assets/images/z7899206683246_54ebcab0c13069e1652937072d856d5a.jpg",
    caption: "Sweet tummy-up posture showing off adorable white socks.",
    date: "2026-06-04"
  },
  {
    id: "g-1",
    url: "/src/assets/images/z7899193555715_04297e941395d7d5965de226a0ce396d.jpg",
    caption: "Sound asleep in full comfort on the soft tatami screen.",
    date: "2026-06-04"
  },
  {
    id: "g-2",
    url: "/src/assets/images/z7899193566643_addbeb28dd4d2bd88e40b0629547b71d.jpg",
    caption: "Perfect snug cinnamon loaf position under soft evening shadows.",
    date: "2026-06-04"
  },
  {
    id: "g-3",
    url: "/src/assets/images/z7899193573804_7aa37d50f6c9d48428ca1c150ed6097d.jpg",
    caption: "Big beautiful amber-golden eyes staring right into your soul.",
    date: "2026-06-04"
  },
  {
    id: "g-4",
    url: "/src/assets/images/z7899193580632_d4551316a76ed3fefe22184c3b05be35.jpg",
    caption: "A magnificent cozy stretch showing gorgeous gray tabby swirls.",
    date: "2026-06-04"
  },
  {
    id: "g-5",
    url: "/src/assets/images/z7899193589880_bc09b2729ee6e63738fe28491d1cda17.jpg",
    caption: "Guarding favorite toy burlap linen ball next to the cozy mat.",
    date: "2026-06-04"
  },
  {
    id: "g-6",
    url: "/src/assets/images/z7899193596744_35c66f4cd7a58a0501ae7dd84913e9bf.jpg",
    caption: "Squishy pink paw pads with black speckles on display.",
    date: "2026-06-04"
  },
  {
    id: "g-7",
    url: "/src/assets/images/z7899193599767_3b42d29482dc837c597e093e489e2ae5.jpg",
    caption: "Golden hours bathing in sunlight on favorite spot near the window.",
    date: "2026-06-04"
  },
  {
    id: "g-8",
    url: "/src/assets/images/z7899206695011_5d61556628d25122b3f302b72518fe9f.jpg",
    caption: "Endearing cream patch on muzzle tip with luminous golden stare.",
    date: "2026-06-04"
  }
];

export const DEFAULT_DAILY_TASKS: DailyTask[] = [
  {
    id: "t-1",
    name: "Morning Wet Food (Salmon pate & broth)",
    category: "diet",
    completed: true,
    time: "07:30 AM"
  },
  {
    id: "t-2",
    name: "Brush coat & check fur health",
    category: "hygiene",
    completed: true,
    time: "10:00 AM"
  },
  {
    id: "t-3",
    name: "Afternoon feather teaser playtime",
    category: "activity",
    completed: false,
    time: "03:00 PM"
  },
  {
    id: "t-4",
    name: "Evening dry food refill & fresh water",
    category: "diet",
    completed: false,
    time: "06:30 PM"
  },
  {
    id: "t-5",
    name: "Nightly dental treat or catnip spray",
    category: "hygiene",
    completed: false,
    time: "09:30 PM"
  }
];

export const DEFAULT_MOOD_HISTORY: MoodRecord[] = [
  { id: "m-1", date: "2026-05-31", mood: "sleepy", note: "Napping 19 hours on the soft tatami mat today" },
  { id: "m-2", date: "2026-06-01", mood: "playful", note: "Ran zoomies at 3:00 AM with his woolen ball!" },
  { id: "m-3", date: "2026-06-02", mood: "hungry", note: "Chirping continuously until the fresh salmon was served" },
  { id: "m-4", date: "2026-06-03", mood: "peaceful", note: "Slept cozy on my lap while it was raining outside" },
  { id: "m-5", date: "2026-06-04", mood: "curious", note: "Staring at butterflies from the sliding window screen" }
];
