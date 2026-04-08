export const SITE_NAME = 'The Legend Detailers';
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
export const TAGLINE_DOORSTEP = 'Punjab-born automotive protection, coating, and luxury finish';
export const OPENING_HOURS = 'Open daily · 9:30 AM to 10:00 PM';

export const SHOWCASE_VEHICLES = [
  'Fortuner',
  'Scorpio N',
  'Thar',
  'BMW',
  'Defender',
  'Endeavour',
  'Rubicon',
  'Daily Driver',
] as const;

export const CLIENT_PROMISES = [
  'Doorstep execution and studio detailing with a finish-first standard.',
  'Protection packages built for gloss, preservation, and social-proof shine.',
  'A workshop identity that feels cinematic online before the customer even arrives.',
];

export const TESTIMONIAL_STRIPS = [
  'Paint Protection Film keeps high-impact panels safer from chips, scratches, and daily abuse.',
  'Ceramic and graphene coating create hydrophobic gloss that looks unreal on camera and in person.',
  'The illuminated studio, geometric ceiling lights, and bold facade deserve a website with the same theatre.',
];

export const HERO_NUMBERS = [
  { label: 'Studio + Doorstep', value: '2', note: 'one premium standard across both execution modes' },
  { label: 'Protection Layers', value: '5', note: 'paint, glass, leather, gloss, and wash-led care' },
  { label: 'Brand Theatre', value: '24/7', note: 'visual identity built to look premium day or night' },
] as const;

export const SERVICE_CARDS = [
  {
    title: 'Paint Protection Film',
    blurb: 'A defence layer for high-impact panels that protects gloss, reduces paint anxiety, and keeps premium cars looking fresh longer.',
    accent: 'from-[#f7c948]/30 to-transparent',
  },
  {
    title: 'Ceramic & Graphene Coating',
    blurb: 'Hydrophobic reflections, deeper color, easier wash cycles, and the kind of finish that photographs like a luxury launch shoot.',
    accent: 'from-sky-400/18 to-transparent',
  },
  {
    title: 'Wash, Rubbing & Reset',
    blurb: 'High-quality wash routines, correction prep, and interior recovery for daily drivers, SUVs, and delivery-ready detail jobs.',
    accent: 'from-white/12 to-transparent',
  },
  {
    title: 'Glass & Leather Shield',
    blurb: 'Add-on protection for windscreens and cabins so the whole vehicle feels premium, not just the paint.',
    accent: 'from-orange-500/15 to-transparent',
  },
] as const;

export const STUDIO_SCENES = [
  {
    title: 'Geometric Light Canopy',
    body: 'The ceiling grid becomes the website moodboard: sharp lines, reflective surfaces, and a futuristic workshop feel.',
  },
  {
    title: 'Open Facade Presence',
    body: 'The frontage signage and wide-bay entry create the same first impression online as the real location does on arrival.',
  },
  {
    title: 'Warrior Mural Identity',
    body: 'The mural language gives the brand edge, local character, and a stronger personality than generic detailing studios.',
  },
  {
    title: 'Night-Glow Delivery Feel',
    body: 'Evening reflections, illuminated lettering, and glossy cars create a luxury reveal moment the site should echo.',
  },
] as const;

export const BRAND_PILLARS = [
  'Luxury finish without generic luxury clichés',
  'A studio atmosphere built around LED geometry and deep reflections',
  'Protection-first services presented like performance upgrades',
  'A cleaner, sharper public experience while internal workflow lives in the separate ops app',
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
