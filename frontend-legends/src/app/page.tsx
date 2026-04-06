'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  Instagram,
  Loader2,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

import IntroLoader from '@/components/IntroLoader';
import ServiceMarquee from '@/components/ServiceMarquee';
import ServiceHotspotCar from '@/components/ServiceHotspotCar';
import FidelityCar from '@/components/FidelityCar';
import { fetchJson } from '@/lib/api';
import {
  ADDRESS_LINES,
  ADMIN_FEATURES,
  BOOKING_URL,
  CLIENT_PROMISES,
  EMAIL,
  HERO_NUMBERS,
  HOTSPOT_SERVICES,
  INSTAGRAM_URL,
  LOCATIONS_BADGE,
  OPENING_HOURS,
  OWNER_WORKFLOW,
  PHONE_DISPLAY,
  PHONE_TEL,
  SERVICE_CARDS,
  SITE_HANDLE,
  SITE_NAME,
  TAGLINE_DOORSTEP,
  TESTIMONIAL_STRIPS,
  YOUTUBE_URL,
} from '@/lib/site';

const RevealSlider = dynamic(() => import('@/components/RevealSlider'), {
  ssr: false,
  loading: () => <div className="aspect-video w-full animate-pulse rounded-3xl border border-white/10 bg-zinc-900/80" aria-hidden />,
});

type StatsPayload = {
  daily_turnover: number;
  monthly_turnover: number;
  total_tasks: number;
};

type HistoryRecord = {
  id: number;
  customer_name: string;
  plate_number: string;
  car_model: string;
  amount: number;
  service_type: string;
  service_location?: string | null;
};

export default function Home() {
  const [stats, setStats] = useState<StatsPayload>({ daily_turnover: 0, monthly_turnover: 0, total_tasks: 0 });
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const payload = await fetchJson<StatsPayload>('/api/legends/turnover');
      setStats(payload);
      setApiError(null);
    } catch {
      setApiError('Backend is not reachable right now. Start the API to enable live intake, search, and turnover.');
    }
  };

  useEffect(() => {
    void fetchStats();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const payload = await fetchJson<HistoryRecord[]>(
        `/api/legends/history?q=${encodeURIComponent(searchQuery.trim())}`
      );
      setHistory(payload);
      setApiError(null);
    } catch {
      setApiError('Search failed because the backend is unavailable.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] font-sans text-white selection:bg-[#FFD700]/30 selection:text-black">
      <IntroLoader />
      <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-black/80 px-6 py-4 backdrop-blur-xl md:px-10">
        <a href="#" className="group flex items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl transition-transform group-hover:scale-105">
            <Image src="/logo.png" alt="Legends Detailers" fill sizes="56px" className="object-cover" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-bold uppercase leading-tight tracking-[0.1em] text-white italic">{SITE_NAME}</span>
            <span className="text-[10px] font-mono tracking-wide text-zinc-500">@{SITE_HANDLE}</span>
          </div>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#services" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-white">
            Services
          </a>
          <a href="#3d" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-white">
            3D Experience
          </a>
          <a href="#workflow" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-white">
            Owner Flow
          </a>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-white">
            Book
          </a>
          <a href="/admin" className="rounded-full border border-[#FFD700]/40 px-6 py-2.5 text-[10px] font-black tracking-[0.2em] text-[#FFD700] transition-all hover:bg-[#FFD700] hover:text-black">
            Admin
          </a>
        </nav>
      </header>

      <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-16 pt-28">
        <div className="absolute inset-0">
          <div
            className="h-full w-full scale-105 bg-cover bg-center opacity-45"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,215,0,0.16),transparent_26%),radial-gradient(circle_at_85%_16%,rgba(56,189,248,0.16),transparent_22%),linear-gradient(180deg,rgba(0,0,0,0.4),#050505)]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-end gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/25 bg-black/50 px-4 py-2 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FFD700]" />
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-[#FFD700]">{TAGLINE_DOORSTEP}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-7xl md:text-[6.2rem]"
            >
              Build trust
              <span className="block bg-gradient-to-r from-[#FFD700] via-[#fff1a8] to-sky-300 bg-clip-text text-transparent">
                before the wash starts
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18 }}
              className="max-w-2xl text-base leading-relaxed text-zinc-300"
            >
              {SITE_NAME} is a premium automobile detailing and protection brand for PPF, ceramic, graphene, glass coating,
              leather care, washing, rubbing, dry clean, and doorstep execution. This site is designed to feel as premium as the
              finish your client is selling.
            </motion.p>

            <div className="flex flex-wrap gap-4">
              <a href="#3d" className="rounded-full bg-[#FFD700] px-8 py-4 text-[11px] font-black uppercase tracking-[0.26em] text-black shadow-xl shadow-[#FFD700]/20 transition-all hover:brightness-110">
                Explore 3D Car
              </a>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#FFD700]/25 px-8 py-4 text-[11px] font-black uppercase tracking-[0.26em] text-[#FFD700] transition-all hover:bg-[#FFD700] hover:text-black">
                Book Appointment
              </a>
              <a href="/admin" className="flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-[11px] font-black uppercase tracking-[0.26em] text-white transition-all hover:bg-white/5">
                Open Admin <ArrowRight className="h-4 w-4" />
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full border border-sky-400/30 px-8 py-4 text-[11px] font-black uppercase tracking-[0.26em] text-sky-200 transition-all hover:bg-sky-950/30">
                <Instagram className="h-4 w-4" /> View Instagram
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {HERO_NUMBERS.map((item) => (
                <div key={item.label} className="rounded-[1.6rem] border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                  <div className="text-3xl font-black text-white">{item.value}</div>
                  <div className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#FFD700]">{item.label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.note}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-black/40 px-5 py-4 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-black uppercase tracking-[0.24em] text-zinc-300">
                <span className="text-[#FFD700]">{OPENING_HOURS}</span>
                <span>{PHONE_DISPLAY}</span>
                <span>{LOCATIONS_BADGE}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {CLIENT_PROMISES.map((promise) => (
              <div key={promise} className="rounded-[1.7rem] border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
                <ShieldCheck className="mb-4 text-[#FFD700]" />
                <p className="text-base leading-relaxed text-zinc-200">{promise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 space-y-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FFD700]">Instagram-led service architecture</p>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-6xl">
            A proper detailing site
            <span className="block text-zinc-500">for a proper automobile client</span>
          </h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-zinc-400">
            The public side now focuses on protection, finish, gloss, confidence, and visual storytelling. The admin side lives under <span className="font-mono text-[#FFD700]">/admin</span> for staff updates.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {SERVICE_CARDS.map((service) => (
            <div
              key={service.title}
              className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${service.accent} p-8 transition-all hover:-translate-y-1 hover:border-[#FFD700]/30`}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFD700]">Premium package</div>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-tight text-white">{service.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{service.blurb}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <ServiceMarquee
            items={[
              'PPF',
              'Ceramic Coating',
              'Graphene Coating',
              'Glass Coating',
              'Leather Coating',
              'Car Wash',
              'Rubbing',
              'Dry Clean',
              'Doorstep Service',
            ]}
          />
        </div>
      </section>

      <section id="3d" className="border-y border-white/5 bg-[#040404] px-6 py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-3xl space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#FFD700]">Interactive VFX hero</div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
              A 3D car that sells
              <span className="block text-sky-300">the services visually</span>
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              This is the core premium move: the car loads first, hotspots reveal each protection or finish service, and the customer understands the value before they even call or DM.
            </p>
          </div>
          <ServiceHotspotCar />
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-24 px-6 py-24">
        <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8">
            <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#FFD700]">PPF & finish storytelling</div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
              Show transformation,
              <span className="block text-zinc-500">not just a rate card</span>
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              The image reference you shared works because it explains protection benefits and coating difference visually. This section turns that same idea into an interactive premium reveal block.
            </p>
            <div className="grid gap-3">
              {HOTSPOT_SERVICES.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-zinc-300">
                  <span className="font-black uppercase tracking-[0.18em] text-[#FFD700]">{item.title}</span>
                  <span className="block mt-2 text-zinc-400">{item.stat}</span>
                </div>
              ))}
            </div>
          </div>
          <RevealSlider />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIAL_STRIPS.map((item) => (
            <div key={item} className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#FFD700]">Protection note</div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">{item}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFD700]">Luxury contact block</div>
            <h3 className="mt-4 text-3xl font-black uppercase tracking-tight text-white">Make the customer take action fast</h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
              A premium detailing website should not just look good. It should convert. Use the booking page for appointment-style leads, Instagram for visual proof, and the admin route for internal control.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#FFD700] px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-black">
                Book now
              </a>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-white/5">
                YouTube
              </a>
              <a href={`mailto:${EMAIL}`} className="rounded-full border border-white/10 px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-white/5">
                Email
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              ['Instagram', '@thelegenddetailers'],
              ['Phone', PHONE_DISPLAY],
              ['Email', EMAIL],
              ['Address', ADDRESS_LINES.join(' · ')],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">{label}</div>
                <div className="mt-3 text-lg font-black uppercase tracking-tight text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#FFD700]">Ultra Fidelity Visualization</div>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-7xl">360° Quality Control</h2>
          <p className="max-w-2xl text-zinc-500 text-sm">
            Experience the Legend Detailer difference with our interactive high-fidelity 3D model. 
            See how every surface is protected with precision and care.
          </p>
        </div>
        <FidelityCar />
      </section>

      <section id="workflow" className="border-t border-white/10 bg-black/60 px-6 py-24">
        <div className="mx-auto max-w-7xl space-y-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#FFD700]">How the owner uses it</div>
              <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
                No backend confusion.
                <span className="block text-zinc-500">Just open admin and update tasks.</span>
              </h2>
              <p className="text-sm leading-relaxed text-zinc-400">
                The owner does not need to touch FastAPI docs or code. They use the website admin route. The backend keeps storing the data in the database and returns it to the public site search and dashboard.
              </p>
            </div>
            <a href="/admin" className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-7 py-4 text-[11px] font-black uppercase tracking-[0.28em] text-black">
              Open /admin <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {OWNER_WORKFLOW.map((step, index) => (
              <div key={step.title} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
                <div className="text-4xl font-black text-[#FFD700]">0{index + 1}</div>
                <h3 className="mt-5 text-2xl font-black uppercase tracking-tight text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-[#FFD700]/20 bg-[#080808] p-8">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFD700]">What admins can do on the site</div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {ADMIN_FEATURES.map((feature) => (
                <div key={feature} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-zinc-200">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="erp" className="relative overflow-hidden border-t border-white/10 bg-[#050505] py-28 scroll-mt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#FFD700_0%,transparent_45%)] opacity-[0.07]" />
        <div className="relative z-10 mx-auto max-w-7xl space-y-20 px-6">
          <div className="flex flex-col items-end justify-between gap-10 border-b border-white/10 pb-16 lg:flex-row">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                <TrendingUp size={18} className="text-[#FFD700]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Legends Admin-Ready System</span>
              </div>
              <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-white md:text-7xl">
                Intake, search,
                <span className="block text-[#FFD700]">and live turnover</span>
              </h2>
              <p className="max-w-md text-sm text-zinc-500">
                Customer details, car model, plate number, service, amount, and notes can be entered by any admin from the site admin panel. This section shows the live backend data on the website.
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-10 lg:w-auto">
              <div>
                <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-zinc-600">Today</span>
                <span className="text-3xl font-black italic text-white">₹ {stats.daily_turnover.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right">
                <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-zinc-600">Month</span>
                <span className="text-3xl font-black italic text-[#FFD700]">₹ {stats.monthly_turnover.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {apiError ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-100">
              {apiError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 md:p-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/25 bg-black/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]">
                  Staff-only update flow
                </div>
                <h3 className="mt-6 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
                  The owner should use
                  <span className="block text-sky-300">the secure admin panel</span>
                </h3>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400">
                  Customer entry and task updates are no longer mixed into the public site experience. The admin panel is the proper place for
                  adding customer details, updating service status, assigning staff, and tracking payments securely.
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {[
                    'Login to /admin using the owner or staff credentials',
                    'Create the task with model, plate number, service, payment, notes, and assigned staff',
                    'Track status from pending to delivered from one workflow board',
                    'Search previous tasks anytime using the same backend records',
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-zinc-200">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="/admin" className="rounded-full bg-[#FFD700] px-7 py-4 text-[11px] font-black uppercase tracking-[0.26em] text-black">
                    Open secure admin
                  </a>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 px-7 py-4 text-[11px] font-black uppercase tracking-[0.26em] text-white transition-all hover:bg-white/5">
                    Open booking page
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-10 lg:col-span-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
                <h3 className="text-xl font-black uppercase tracking-tight text-white">History search</h3>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Plate, model, or client name</p>
                <div className="relative mt-6">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                  <input
                    type="text"
                    placeholder="Search…"
                    className="w-full rounded-2xl border border-white/10 bg-black py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-[#FFD700]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        void handleSearch();
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void handleSearch()}
                  disabled={isSearching}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/15"
                >
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isSearching ? 'Searching…' : 'Search records'}
                </button>
                <div className="mt-6 max-h-[280px] space-y-2 overflow-y-auto">
                  <AnimatePresence>
                    {history.length > 0 ? (
                      history.map((record) => (
                        <motion.div
                          key={record.id}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between gap-3 rounded-2xl border border-white/5 bg-black/80 p-4"
                        >
                          <div>
                            <div className="text-xs font-black uppercase tracking-widest text-white">{record.plate_number}</div>
                            <div className="text-[10px] font-bold uppercase text-zinc-500">{record.customer_name}</div>
                            <div className="mt-1 text-[10px] font-bold uppercase text-zinc-500">{record.car_model}</div>
                            {record.service_location ? (
                              <div className="mt-1 text-[9px] uppercase tracking-wider text-[#FFD700]/80">{record.service_location}</div>
                            ) : null}
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-sm font-black text-[#FFD700]">₹ {record.amount}</div>
                            <div className="text-[9px] font-bold uppercase text-zinc-600">{record.service_type}</div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="py-8 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-700">
                        Run a search to see tasks
                      </p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-4 rounded-[2rem] bg-gradient-to-br from-[#FFD700] to-[#c9a000] p-8 shadow-2xl shadow-[#FFD700]/15">
                <TrendingUp className="h-10 w-10 text-black" />
                <h3 className="text-xl font-black uppercase tracking-tight text-black">Live totals</h3>
                <p className="text-xs leading-relaxed text-black/75">
                  Tasks in database: <strong>{stats.total_tasks}</strong>. Data is stored by the backend and can be updated by staff from <strong>/admin</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => void fetchStats()}
                  className="w-full rounded-2xl bg-black py-4 text-[10px] font-black uppercase tracking-widest text-[#FFD700] transition-opacity hover:opacity-95"
                >
                  Refresh Metrics
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-6 py-20">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-14 lg:flex-row">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-lg border border-white/10">
                <Image src="/logo.png" alt="Legends Detailers" width={48} height={48} className="h-full w-full object-cover" />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.1em] text-white italic">{SITE_NAME}</span>
            </div>
            <p className="max-w-sm text-[11px] leading-relaxed text-zinc-500">{LOCATIONS_BADGE}</p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FFD700] hover:underline">
              <Instagram className="h-4 w-4" /> @{SITE_HANDLE}
            </a>
          </div>
          <div className="space-y-4 text-sm">
            <a href={PHONE_TEL} className="flex items-center gap-3 text-white transition-colors hover:text-[#FFD700]">
              <Phone className="h-4 w-4 text-[#FFD700]" />
              <span className="font-mono tracking-wide">{PHONE_DISPLAY}</span>
            </a>
            <a href={`mailto:${EMAIL}`} className="block text-sm text-zinc-300 transition-colors hover:text-[#FFD700]">
              {EMAIL}
            </a>
            <div className="flex items-start gap-3 text-zinc-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD700]" />
              <div className="text-xs font-bold uppercase leading-relaxed tracking-widest">
                {ADDRESS_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-[9px] font-bold uppercase tracking-[0.35em] text-zinc-600 lg:text-right">
            Legends Detailers · Website + Admin Flow
          </div>
        </div>
      </footer>
    </main>
  );
}
