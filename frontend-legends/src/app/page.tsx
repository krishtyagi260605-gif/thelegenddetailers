'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  Instagram,
  MapPin,
  MoveRight,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import IntroLoader from '@/components/IntroLoader';
import ServiceMarquee from '@/components/ServiceMarquee';
import ServiceHotspotCar from '@/components/ServiceHotspotCar';
import FidelityCar from '@/components/FidelityCar';
import {
  ADDRESS_LINES,
  BOOKING_URL,
  BRAND_PILLARS,
  CLIENT_PROMISES,
  EMAIL,
  HERO_NUMBERS,
  HOTSPOT_SERVICES,
  INSTAGRAM_URL,
  LOCATIONS_BADGE,
  PHONE_DISPLAY,
  PHONE_TEL,
  SERVICE_CARDS,
  SITE_HANDLE,
  SITE_NAME,
  STUDIO_SCENES,
  TAGLINE_DOORSTEP,
  TESTIMONIAL_STRIPS,
  YOUTUBE_URL,
} from '@/lib/site';

const RevealSlider = dynamic(() => import('@/components/RevealSlider'), {
  ssr: false,
  loading: () => <div className="aspect-video w-full animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.04]" aria-hidden />,
});

const navItems = [
  ['Services', '#services'],
  ['Studio', '#studio'],
  ['3D Experience', '#experience'],
  ['Contact', '#contact'],
] as const;

const heroPanels = [
  {
    title: 'PPF Shield',
    tag: 'Front-end protection',
    copy: 'Impact zones, rock chips, self-healing film, resale confidence.',
    tone: 'from-[#f4c542]/20 to-transparent',
    rotate: '-6deg',
  },
  {
    title: 'Ceramic Glow',
    tag: 'Hydrophobic finish',
    copy: 'Mirror reflections, dirt rejection, reel-ready shine.',
    tone: 'from-sky-400/20 to-transparent',
    rotate: '7deg',
  },
  {
    title: 'Studio Signature',
    tag: 'Black metal + light geometry',
    copy: 'A workshop identity that already feels cinematic in real life.',
    tone: 'from-white/15 to-transparent',
    rotate: '-10deg',
  },
] as const;

const pulseLines = [
  'Paint protection sold through motion, light, and depth.',
  'A public website built like a launch film, not a brochure.',
  'The separate ops app stays internal. The brand site stays pure.',
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#f4c542]/30 selection:text-black">
      <IntroLoader />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-[#f4ead1] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <Image src="/legend-logo.png" alt={SITE_NAME} fill sizes="56px" className="object-contain object-center p-1.5" />
            </div>
            <div>
              <div className="text-sm font-black uppercase tracking-[0.14em] text-white">{SITE_NAME}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#d3b25a]">@{SITE_HANDLE}</div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-white">
                {label}
              </a>
            ))}
          </nav>

          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#f4c542]/35 bg-[#f4c542]/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#f4c542] transition-all hover:bg-[#f4c542] hover:text-black"
          >
            Book Now
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 pb-18 pt-28 md:px-8 md:pt-32">
        <div className="absolute inset-0">
          <div className="light-grid absolute inset-x-0 top-0 h-[72%] opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(244,197,66,0.24),transparent_22%),radial-gradient(circle_at_80%_15%,rgba(56,189,248,0.18),transparent_22%),linear-gradient(180deg,rgba(0,0,0,0.2),#050505_78%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.98))]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#f4c542]/25 bg-black/45 px-4 py-2 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#f4c542]" />
              <span className="text-[10px] font-black uppercase tracking-[0.32em] text-[#f4c542]">{TAGLINE_DOORSTEP}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-7xl xl:text-[7.5rem]"
            >
              The detailing
              <span className="block bg-[linear-gradient(90deg,#fef0b3_0%,#f4c542_45%,#7dd3fc_100%)] bg-clip-text text-transparent">
                dimension Punjab deserves
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.16 }}
              className="max-w-2xl text-base leading-relaxed text-zinc-300"
            >
              A luxury automobile detailing brand should not feel flat online. This public experience is rebuilt around the illuminated facade,
              geometric workshop lighting, glossy paint protection story, and bold signature presence of {SITE_NAME}.
            </motion.p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#experience"
                className="inline-flex items-center gap-2 rounded-full bg-[#f4c542] px-7 py-4 text-[11px] font-black uppercase tracking-[0.26em] text-black shadow-[0_20px_40px_rgba(244,197,66,0.22)] transition-all hover:brightness-110"
              >
                Enter 3D Experience <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-white/6"
              >
                <Instagram className="h-4 w-4 text-[#f4c542]" />
                Instagram Proof
              </a>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/8 px-7 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-sky-100 transition-all hover:bg-sky-400/14"
              >
                Appointment Link <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {HERO_NUMBERS.map((item) => (
                <div key={item.label} className="glass-panel rounded-[1.8rem] p-5">
                  <div className="text-3xl font-black text-white">{item.value}</div>
                  <div className="mt-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#f4c542]">{item.label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[34rem] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_35px_90px_rgba(0,0,0,0.3)]">
            <div className="scan-lines absolute inset-0 opacity-35" />
            <div className="aurora-orb absolute -left-16 top-10 h-44 w-44 bg-[#f4c542]/25" />
            <div className="aurora-orb absolute right-0 top-28 h-56 w-56 bg-sky-400/20" />
            <div className="particle-field absolute inset-0" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#f4c542]">Immersive brand stage</div>
                  <h2 className="mt-3 max-w-sm text-3xl font-black uppercase tracking-tight text-white">
                    Floating detail stories with depth and motion
                  </h2>
                </div>
                <div className="relative h-20 w-20 overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#f4ead1]">
                  <Image src="/legend-logo-source.png" alt={`${SITE_NAME} logo`} fill sizes="80px" className="object-contain p-2" />
                </div>
              </div>

              <div className="relative mt-10 h-[22rem]">
                <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_60%)] shadow-[0_0_100px_rgba(125,211,252,0.12)]" />
                <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f4c542]/15" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6"
                />
                {heroPanels.map((panel, index) => (
                  <motion.div
                    key={panel.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: [0, -10, 0] }}
                    transition={{ delay: index * 0.12, duration: 6 + index, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      rotate: panel.rotate,
                      left: index === 1 ? '45%' : index === 2 ? '55%' : '12%',
                      top: index === 1 ? '6%' : index === 2 ? '52%' : '34%',
                    }}
                    className={`absolute w-[15rem] rounded-[1.6rem] border border-white/12 bg-gradient-to-br ${panel.tone} from-white/10 p-5 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.35)]`}
                  >
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f4c542]">{panel.tag}</div>
                    <div className="mt-3 text-2xl font-black uppercase tracking-tight text-white">{panel.title}</div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-200">{panel.copy}</p>
                  </motion.div>
                ))}
                <div className="absolute bottom-0 left-0 right-0 grid gap-3 md:grid-cols-3">
                  {CLIENT_PROMISES.map((promise) => (
                    <div key={promise} className="rounded-[1.2rem] border border-white/8 bg-black/35 px-4 py-4 text-sm leading-relaxed text-zinc-200 backdrop-blur-md">
                      {promise}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/6 py-5">
        <ServiceMarquee
          items={[
            'Paint Protection Film',
            'Ceramic Coating',
            'Graphene Coating',
            'Glass Coating',
            'Leather Care',
            'Wash & Reset',
            'Doorstep Service',
            'Luxury Finish',
          ]}
        />
      </section>

      <section id="services" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="mb-14 max-w-3xl space-y-4">
          <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#f4c542]">Protection architecture</div>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
            Services presented like
            <span className="block text-zinc-500">premium upgrades, not menu cards</span>
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            The visual direction takes cues from the studio itself: black metal, illuminated geometry, golden signage, deep gloss, and high-contrast surfaces.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {SERVICE_CARDS.map((service) => (
            <div
              key={service.title}
              className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${service.accent} p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#f4c542]/30`}
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/8 blur-3xl" />
              <div className="relative">
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#f4c542]">Signature package</div>
                <h3 className="mt-4 text-2xl font-black uppercase tracking-tight text-white">{service.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-300">{service.blurb}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pulseLines.map((line, index) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
              className="metal-card rounded-[1.6rem] px-5 py-5"
            >
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#f4c542]">
                <MoveRight className="h-4 w-4" />
                Pulse 0{index + 1}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-200">{line}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/6 bg-[#050505] px-5 py-24 md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(125,211,252,0.12),transparent_18%),radial-gradient(circle_at_70%_35%,rgba(244,197,66,0.12),transparent_20%)]" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative z-10 space-y-6">
            <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#f4c542]">VFX narrative strip</div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
              A launch-film mood
              <span className="block text-zinc-500">for a detailing brand</span>
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
              Instead of static brochure sections, this zone behaves like a visual trailer. Floating UI slabs, glowing rings, and motion-led hierarchy make the website feel expensive before a customer even scrolls to contact.
            </p>
            <div className="grid gap-3">
              {['Glassmorphism overlays', 'Particle-like ambient motion', 'Dark luxury contrast with gold heat', '3D layers tied back to real protection services'].map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-relaxed text-zinc-200">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[30rem] overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
            <div className="particle-field absolute inset-0 opacity-90" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f4c542]/15"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/15"
            />
            <div className="relative z-10 flex h-full items-center justify-center">
              <div className="grid w-full max-w-xl gap-4">
                {heroPanels.map((panel, index) => (
                  <motion.div
                    key={panel.title}
                    animate={{
                      x: index === 0 ? [0, 18, 0] : index === 1 ? [0, -14, 0] : [0, 10, 0],
                      y: index === 1 ? [0, 12, 0] : [0, -8, 0],
                      rotate: index === 0 ? [-4, -1, -4] : index === 1 ? [5, 8, 5] : [-7, -4, -7],
                    }}
                    transition={{ duration: 8 + index, repeat: Infinity, ease: 'easeInOut' }}
                    className={`rounded-[1.8rem] border border-white/10 bg-gradient-to-br ${panel.tone} from-white/10 p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f4c542]">{panel.tag}</div>
                        <div className="mt-2 text-2xl font-black uppercase tracking-tight text-white">{panel.title}</div>
                      </div>
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-[#f4ead1]">
                        <Image src="/legend-logo.png" alt={SITE_NAME} fill sizes="48px" className="object-contain p-1" />
                      </div>
                    </div>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-200">{panel.copy}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="border-y border-white/6 bg-[#040404] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-3xl space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#f4c542]">Interactive protection cockpit</div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
              Explore the car
              <span className="block text-sky-300">like a high-end showroom demo</span>
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              The 3D layer explains where each protection story lives on the vehicle, so customers understand value visually before they ask for price.
            </p>
          </div>
          <ServiceHotspotCar />
        </div>
      </section>

      <section id="studio" className="mx-auto max-w-7xl space-y-24 px-5 py-24 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#f4c542]">Studio atmosphere</div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
              Built from the same language
              <span className="block text-zinc-500">as the real workshop</span>
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Your real location already has strong visual identity: lit ceilings, bold front signage, mural art, and premium delivery shots. The website now echoes that rather than feeling generic.
            </p>
            <div className="grid gap-3">
              {BRAND_PILLARS.map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-relaxed text-zinc-200">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {STUDIO_SCENES.map((scene, index) => (
              <div key={scene.title} className="studio-card rounded-[2rem] p-6">
                <div className="text-5xl font-black text-[#f4c542]/80">0{index + 1}</div>
                <h3 className="mt-5 text-2xl font-black uppercase tracking-tight text-white">{scene.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-300">{scene.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-[0.96fr_1.04fr]">
          <div className="space-y-8">
            <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#f4c542]">Finish storytelling</div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
              Slide between
              <span className="block text-zinc-500">ordinary and legendary</span>
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Use interaction to make coating and finish benefits feel obvious. The point is not to list features but to let the customer feel the difference.
            </p>
            <div className="grid gap-3">
              {TESTIMONIAL_STRIPS.map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-relaxed text-zinc-300">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <RevealSlider />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="mb-14 space-y-4 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#f4c542]">Full-spectrum 3D detail view</div>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-7xl">
            360 degree luxury
            <span className="block text-zinc-500">with depth, light, and motion</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400">
            This extra interaction layer turns the public site into an experience piece instead of a template brochure.
          </p>
        </div>

        <FidelityCar />

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {HOTSPOT_SERVICES.map((service) => (
            <div key={service.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-5">
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f4c542]">{service.label}</div>
              <div className="mt-3 text-sm font-black uppercase tracking-tight text-white">{service.title}</div>
              <div className="mt-2 text-xs leading-relaxed text-zinc-400">{service.stat}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="border-t border-white/8 bg-[linear-gradient(180deg,#060606,#020202)] px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2.4rem] border border-[#f4c542]/20 bg-[radial-gradient(circle_at_top,rgba(244,197,66,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f4c542]/25 bg-black/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#f4c542]">
              <ShieldCheck className="h-4 w-4" />
              Make the first impression unforgettable
            </div>
            <h2 className="mt-6 text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
              Book the studio.
              <span className="block text-sky-300">Capture the finish.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-300">
              The public website is now purely customer-facing. Intake and operations live in the separate internal app, while this experience focuses on trust, aspiration, and premium conversion.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#f4c542] px-7 py-4 text-[11px] font-black uppercase tracking-[0.26em] text-black"
              >
                Book Appointment
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/12 px-7 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-white/6"
              >
                See Reels & Photos
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/12 px-7 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-white/6"
              >
                YouTube
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="metal-card rounded-[2rem] p-6">
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-5 w-5 text-[#f4c542]" />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">Call</div>
                  <a href={PHONE_TEL} className="mt-2 block text-xl font-black uppercase tracking-tight text-white transition-colors hover:text-[#f4c542]">
                    {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>

            <div className="metal-card rounded-[2rem] p-6">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 text-[#f4c542]" />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">Visit</div>
                  <div className="mt-2 text-xl font-black uppercase tracking-tight text-white">{LOCATIONS_BADGE}</div>
                  <div className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {ADDRESS_LINES.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="metal-card rounded-[2rem] p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">Mail</div>
              <a href={`mailto:${EMAIL}`} className="mt-2 block text-xl font-black uppercase tracking-tight text-white transition-colors hover:text-[#f4c542]">
                {EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/8 bg-black px-5 py-12 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-[#f4ead1]">
              <Image src="/legend-logo.png" alt={SITE_NAME} fill sizes="56px" className="object-contain p-1.5" />
            </div>
            <div>
              <div className="text-sm font-black uppercase tracking-[0.14em] text-white">{SITE_NAME}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">{LOCATIONS_BADGE}</div>
            </div>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#f4c542]"
          >
            <Instagram className="h-4 w-4" />
            @{SITE_HANDLE}
          </a>
        </div>
      </footer>
    </main>
  );
}
