export const SITE_NAME = 'Legends Detailers';
export const SITE_HANDLE = 'thelegenddetailers';
export const INSTAGRAM_URL =
  'https://www.instagram.com/thelegenddetailers?igsh=MTM0Z3NrZXh3dTBsYQ%3D%3D&utm_source=qr';

export const PHONE_DISPLAY = '9780135911 · 9687135911';
export const PHONE_TEL = 'tel:+919780135911';
export const EMAIL = '5911detailing@legenddetailers.com';
export const BOOKING_URL = 'https://jagdeepsinghf0bj.setmore.com/';
export const YOUTUBE_URL = 'https://youtube.com/@TheLegendDetailers?si=GBBc6PvpmLtKtDE_';

export const ADDRESS_LINES = ['Begowal Tanda Road', 'Begowal, Punjab 144621'];
export const LOCATIONS_BADGE = 'Begowal · Punjab · Doorstep Service';
export const TAGLINE_DOORSTEP = 'Automotive protection, coating, wash, and luxury finish';
export const OPENING_HOURS = 'Open daily · 9:30 AM to 10:00 PM';

export const SHOWCASE_VEHICLES = [
  'Thar',
  'Rubicon',
  'Fortuner',
  'Scorpio N',
  'Scorpio Classic',
  'Endeavour',
  'Brezza',
  'Tractor',
] as const;

export const CLIENT_PROMISES = [
  'Doorstep and studio detailing with premium delivery standards',
  'Protection-first packages for paint, glass, leather, and gloss',
  'Fast intake and admin workflow so the owner can manage every task clearly',
];

export const TESTIMONIAL_STRIPS = [
  'PPF keeps the paint safer from chips, swirl marks, and road scars.',
  'Ceramic and graphene packages create hydrophobic gloss that photographs beautifully.',
  'A premium detailing brand should feel premium online before the customer even calls.',
];

export const HERO_NUMBERS = [
  { label: 'Protection Focus', value: '10+', note: 'core protection and finish categories' },
  { label: 'Client Flow', value: '1', note: 'single admin path for intake and updates' },
  { label: 'Service Modes', value: '2', note: 'studio and doorstep execution' },
] as const;

export const SERVICE_CARDS = [
  {
    title: 'Paint Protection Film',
    blurb: 'Clear defensive film built for scratch resistance, gloss retention, easy cleaning, and stronger resale confidence.',
    accent: 'from-[#FFD700]/25 to-transparent',
  },
  {
    title: 'Ceramic & Graphene Coating',
    blurb: 'Hydrophobic protection, rich reflections, dirt resistance, and long-term shine for clients who want their car to stay reel-ready.',
    accent: 'from-sky-500/15 to-transparent',
  },
  {
    title: 'Wash, Rubbing & Dry Clean',
    blurb: 'High-quality wash routines, interior reset, paint correction prep, and finish restoration for daily drivers and show builds.',
    accent: 'from-white/10 to-transparent',
  },
  {
    title: 'Glass & Leather Care',
    blurb: 'Glass coating, leather coating, and detailing add-ons that complete the premium treatment story for the full vehicle.',
    accent: 'from-red-500/15 to-transparent',
  },
] as const;

export const HOTSPOT_SERVICES = [
  {
    id: 'ppf',
    label: 'PPF Shield',
    title: 'Paint Protection Film',
    position: [-2.3, 1.1, 0.6] as [number, number, number],
    stat: 'Scratch resistance · UV protection · self-healing',
    description:
      'Ideal for front-end impact zones, deep gloss retention, stain resistance, and clients who care about preserving fresh paint.',
    bullets: ['Rock-chip defence', 'Self-healing surface', 'Easy wash maintenance'],
  },
  {
    id: 'ceramic',
    label: 'Ceramic Glow',
    title: 'Ceramic / Graphene Coating',
    position: [0, 2.2, 0] as [number, number, number],
    stat: 'Hydrophobic gloss · dirt rejection · easier upkeep',
    description:
      'Liquid coating package for deep reflections, strong water beading, and a premium finish that works beautifully for social content.',
    bullets: ['Mirror finish', 'Water beading', 'Paint and wheel protection'],
  },
  {
    id: 'glass',
    label: 'Glass Vision',
    title: 'Glass Coating',
    position: [1.8, 1.4, 0.9] as [number, number, number],
    stat: 'Visibility boost · water repellence · cleaner windshield',
    description:
      'A useful premium add-on for monsoon driving, easier windshield cleaning, and a complete protection package story.',
    bullets: ['Rain repellence', 'Cleaner visibility', 'Luxury package upsell'],
  },
  {
    id: 'wash',
    label: 'Detail Reset',
    title: 'Wash, Rubbing & Dry Clean',
    position: [-1.6, -1.1, 0.7] as [number, number, number],
    stat: 'Interior reset · exterior detail · correction prep',
    description:
      'Best for repeat clients, monthly upkeep, and showroom-style transformation before delivery reels or customer pickup.',
    bullets: ['Deep wash', 'Interior refresh', 'Paint prep'],
  },
  {
    id: 'leather',
    label: 'Cabin Care',
    title: 'Leather Coating',
    position: [2.1, -0.7, 0.2] as [number, number, number],
    stat: 'Cabin preservation · touch feel · premium finish',
    description:
      'For clients who want the same premium treatment inside the cabin, especially on luxury or family vehicles.',
    bullets: ['Seat protection', 'Cleaner upkeep', 'Premium touch feel'],
  },
] as const;

export const OWNER_WORKFLOW = [
  {
    title: 'Open Legends Admin',
    body: 'Any staff admin opens the /admin page on the website and adds the customer, car model, number plate, service, amount, and notes.',
  },
  {
    title: 'Live Task Tracking',
    body: 'The task enters the FastAPI backend instantly and appears in the admin board where staff can move it from pending to in progress to completed.',
  },
  {
    title: 'Data Storage',
    body: 'All records are stored in the backend database. Right now this project uses the local database file magic_engine.db, and it can be switched to Postgres for production.',
  },
] as const;

export const ADMIN_FEATURES = [
  'Add customer name, phone, car model, and plate number',
  'Assign service type, amount, payment mode, and doorstep or in-shop',
  'Track tasks from pending to delivered',
  'Search history for repeat customers and previous vehicles',
] as const;
