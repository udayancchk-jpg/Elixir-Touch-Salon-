import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flower2,
  MapPin,
  Phone,
  Check,
  Star,
  MessageCircle,
  ArrowRight,
  Calendar,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { cn } from './lib/utils';
import AIConsultantSection from './components/AIConsultantSection';
import SalonChatbot from './components/SalonChatbot';
import heroDesktopImg from './assets/images/crown_spa_hero_desktop_1795422293273.jpg';
import heroMobileImg from './assets/images/crown_spa_hero_mobile_1795422294238.jpg';
import suiteSquareImg from './assets/images/crown_spa_suite_square_1795422294160.jpg';

// --- Business Constants (Verified Crown Spa Pitampura Profile) ---
const BUSINESS_INFO = {
  name: 'CROWN SPA',
  tagline: 'Luxury Body & Wellness Spa',
  address:
    'House No. 372, 2nd Floor (Near Kohat Enclave Metro, Pillar Nos. 342 & 343), Kohat Enclave, Pitampura, New Delhi, Delhi 110034',
  shortAddress: 'Kohat Enclave, Pitampura, New Delhi',
  phonePrimary: '+91 87929 02454',
  phonePrimaryHref: 'tel:+918792902454',
  phoneSecondary: '+91 93542 47716',
  phoneSecondaryHref: 'tel:+919354247716',
  whatsappHref: 'https://wa.me/919354247716',
  hours: 'Mon – Sun: 10:00 AM – 10:00 PM',
  hoursNote: 'Call ahead to confirm private suite availability',
  googleProfileUrl: 'https://share.google/a6wdlxGyipxGRJVCj',
  mapsDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Crown+Spa+House+No+372+Kohat+Enclave+Pitampura+New+Delhi+110034',
  rating: '4.1',
  reviewCount: 'Local Verified Reviews',
};

const TRUST_SIGNALS = [
  {
    text: `${BUSINESS_INFO.rating}★ Rated (${BUSINESS_INFO.reviewCount})`,
    icon: <Star className="w-4 h-4 text-[#343B42] fill-[#F5D64E]" />,
  },
  {
    text: 'Private Suites & Steam Facilities',
    icon: <ShieldCheck className="w-4 h-4 text-[#343B42]" />,
  },
  {
    text: 'Kohat Enclave, Pitampura',
    icon: <MapPin className="w-4 h-4 text-[#343B42]" />,
  },
];

const SERVICES_MENU = [
  {
    category: 'Swedish & Aromatherapy Massage',
    price: 'On Consultation',
    subprice: '60 & 90 Min Private Sessions',
    desc: 'Long, flowing relaxation strokes paired with warm aromatic oils to calm the nervous system, restore sleep quality, and ease everyday fatigue.',
  },
  {
    category: 'Deep Tissue & Thai Massage',
    price: 'On Consultation',
    subprice: 'Muscular Release & Stretching',
    desc: 'Focused slow-pressure myofascial bodywork and assisted Thai stretching tailored to dissolve chronic neck, lower-back, and shoulder knots.',
  },
  {
    category: 'Head, Shoulder & Reflexology',
    price: 'On Consultation',
    subprice: '30 & 45 Min Express Reset',
    desc: 'Targeted scalp, temple, cervical, and foot pressure-point therapy built for busy Pitampura workdays and quick post-commute recovery.',
  },
  {
    category: 'Couple Spa, Scrub & Steam Rituals',
    price: 'On Consultation',
    subprice: 'Private Suite & Shower Access',
    desc: 'Indulgent couple spa sessions, exfoliating body scrubs, nourishing wraps, and serene private steam & warm shower facilities.',
  },
];

const PAIN_POINTS = [
  'Carrying deep neck, shoulder, or lower-back stiffness from long desk hours?',
  'City traffic and daily stress leaving you drained with restless sleep?',
  'Visited crowded spas that felt rushed, noisy, or lacked real hygiene?',
  'Want genuine therapeutic relief without guessing which massage fits your body?',
];

const EXPERIENCES = [
  {
    title: 'Deep Muscular Relief',
    desc: 'Targeted release for stiff shoulders, sore backs, and built-up workday tension.',
    icon: '🌿',
  },
  {
    title: 'Calibrated Pressure',
    desc: 'Your therapist adapts every stroke to your exact comfort—gentle calm or deep focus.',
    icon: '🧠',
  },
  {
    title: 'Hygienic Private Suites',
    desc: 'Spotless rooms with fresh linens, warm ambient lighting, and tranquil acoustics.',
    icon: '✨',
  },
  {
    title: 'Steam & Warm Showers',
    desc: 'Unwind further with private steam and shower amenities attached to treatment rituals.',
    icon: '💧',
  },
  {
    title: 'Attentive Hospitality',
    desc: 'Courteous certified therapists dedicated to unhurried care from arrival to tea.',
    icon: '🏆',
  },
  {
    title: 'Total Mental Reset',
    desc: 'Step back onto Kohat Enclave feeling lighter, calmer, and noticeably refreshed.',
    icon: '💫',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ritika V.',
    quote:
      'Spotless rooms, calming aroma the moment you step in, and a therapist who knew exactly how to unlock my stiff shoulders.',
    role: 'Deep Tissue Session',
  },
  {
    name: 'Aman G.',
    quote:
      'Super convenient right near Kohat Enclave Metro. The Swedish massage and steam left me completely recharged after a hectic week.',
    role: 'Evening Stress Reset',
  },
  {
    name: 'Neha & Kabir S.',
    quote:
      'Booked the private couple spa ritual—attentive staff, warm lighting, and great hygiene throughout. Easily our go-to retreat in Pitampura.',
    role: 'Couple Spa Ritual',
  },
];

// --- Components ---

const LuxuryButton = ({
  children,
  variant = 'primary',
  className,
  onClick,
  href,
  target,
  rel,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
}) => {
  const baseStyles =
    'relative overflow-hidden px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center';
  const primaryStyles = 'bg-luxury-gold text-luxury-black shadow-lg shadow-black/20 hover:bg-[#F9DF6F]';
  const secondaryStyles = 'border border-luxury-gold/60 text-luxury-gold bg-transparent hover:bg-luxury-gold/10';

  const styles = cn(baseStyles, variant === 'primary' ? primaryStyles : secondaryStyles, className);

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={styles}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={styles}>
      {children}
    </button>
  );
};

export default function CrownSpaLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Free Wellness Consultation',
    time: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [aiRecommendationLabel, setAiRecommendationLabel] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const bookingNameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingBooking) return;

    setBookingError(null);
    setIsSubmittingBooking(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const rawText = await response.text();
      let data: { error?: string; bookingId?: string } | null = null;

      if (rawText.trim()) {
        try {
          data = JSON.parse(rawText);
        } catch {
          if (!response.ok) {
            throw new Error(`Unable to submit booking (HTTP ${response.status}). Please try again or call us.`);
          }
          throw new Error('Received an unexpected response from the booking desk. Please try again.');
        }
      }

      if (!response.ok) {
        throw new Error(data?.error || `Unable to confirm slot right now (HTTP ${response.status}).`);
      }

      setBookingReference(typeof data?.bookingId === 'string' ? data.bookingId : null);
      setIsSubmitted(true);
    } catch (err) {
      setBookingError(
        err instanceof Error ? err.message : 'Unable to reach booking server. Please call us or try again.'
      );
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleBookRecommendation = (serviceOption: string, serviceDisplayName: string) => {
    setFormData((prev) => ({ ...prev, service: serviceOption }));
    setAiRecommendationLabel(serviceDisplayName);
    setIsSubmitted(false);
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      bookingNameInputRef.current?.focus({ preventScroll: true });
    }, 550);
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-white overflow-x-hidden">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#202127]/95 backdrop-blur-md border-b border-luxury-champagne/15">
        <div className="max-w-7xl mx-auto px-5 md:px-6 h-20 flex items-center justify-between gap-4">
          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden text-luxury-white hover:text-luxury-gold transition-colors p-1.5 -ml-1.5 shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Lockup */}
          <div className="flex flex-col md:flex-row items-center md:gap-2 text-center md:text-left">
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight gold-gradient-text leading-none">
              CROWN SPA
            </span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[3px] md:border-l md:border-luxury-gold/40 md:pl-3 md:ml-1 mt-1 md:mt-0 text-luxury-champagne">
              Pitampura
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            <a
              href="#experiences"
              className="text-xs uppercase tracking-widest text-luxury-white/90 hover:text-luxury-gold transition-colors whitespace-nowrap"
            >
              Experience
            </a>
            <a
              href="#services"
              className="text-xs uppercase tracking-widest text-luxury-white/90 hover:text-luxury-gold transition-colors whitespace-nowrap"
            >
              Therapies
            </a>
            <a
              href="#consultant"
              className="text-xs uppercase tracking-widest text-luxury-gold font-semibold hover:opacity-80 transition-opacity flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Consultant
            </a>
            <a
              href="#offer"
              className="text-xs uppercase tracking-widest text-luxury-white/90 hover:text-luxury-gold transition-colors whitespace-nowrap"
            >
              The Offer
            </a>
            <a
              href="#testimonials"
              className="text-xs uppercase tracking-widest text-luxury-white/90 hover:text-luxury-gold transition-colors whitespace-nowrap"
            >
              Reviews
            </a>
            <LuxuryButton href="#booking" variant="secondary" className="px-6 py-2.5 text-[10px] whitespace-nowrap">
              Book Now
            </LuxuryButton>
          </div>

          {/* Mobile Book Now Button */}
          <a
            href="#booking"
            className="md:hidden px-4 py-2 rounded-full border border-luxury-gold text-luxury-white hover:bg-luxury-gold hover:text-[#202127] transition-colors text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shrink-0"
          >
            Book Now
          </a>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-luxury-black pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              <a href="#experiences" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">
                Experience
              </a>
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">
                Therapies
              </a>
              <a
                href="#consultant"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-serif text-luxury-gold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> AI Consultant
              </a>
              <a href="#offer" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">
                The Offer
              </a>
              <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">
                Reviews
              </a>
              <LuxuryButton href="#booking" onClick={() => setIsMenuOpen(false)}>
                Book Free Consultation
              </LuxuryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section (Preserving Misty Blue Signature Design) --- */}
      <header className="relative min-h-[92vh] md:min-h-screen flex items-center pt-24 pb-16 md:pt-20 md:pb-20 overflow-hidden bg-[#9EABB5] border-b border-[#DCE4E9]/60">
        <div className="absolute inset-0 z-0">
          <img
            src={heroMobileImg}
            className="w-full h-full object-cover object-center md:hidden"
            alt="Crown Spa Private Luxury Lounge in Pitampura"
            referrerPolicy="no-referrer"
          />
          <img
            src={heroDesktopImg}
            className="hidden md:block w-full h-full object-cover object-center"
            alt="Crown Spa Serene Sanctuary Interior in Pitampura"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#9EABB5]/90 via-[#9EABB5]/60 via-55% to-transparent md:from-[#9EABB5]/90 md:via-[#9EABB5]/55 md:via-45% md:to-transparent" />
        </div>

        <div className="section-container py-12 md:py-20 relative z-10 text-left w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#F5D64E] bg-[#343B42]/55 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#F5D64E] shrink-0" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[2px] font-semibold text-[#F7F7F5]">
                Luxury Body &amp; Wellness Spa • Pitampura, Delhi
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-serif font-bold leading-[1.06] mb-5 text-[#202127]">
              <span className="block">Unwind Deeply.</span>
              <span className="block text-[#F5D64E] italic [text-shadow:0_2px_12px_rgba(32,33,39,0.28)]">
                Feel Confident.
              </span>
            </h1>

            <div className="w-12 h-1 rounded-full bg-[#F5D64E] mb-6" />

            <p className="text-base md:text-lg text-[#202127] font-normal max-w-md mb-8 leading-relaxed">
              Full-body massages, aromatherapy, private suites &amp; steam facilities at House No. 372, Kohat
              Enclave, Pitampura — steps from Kohat Enclave Metro (Pillar 342 &amp; 343).
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <LuxuryButton
                href="#booking"
                className="w-fit inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs sm:text-sm shadow-xl shadow-[#202127]/15"
              >
                Book Now <ArrowRight className="w-4 h-4" />
              </LuxuryButton>
            </div>

            <div className="mt-8 flex flex-wrap justify-start gap-x-6 gap-y-2.5 text-[#343B42]">
              {TRUST_SIGNALS.map((signal, i) => (
                <div key={i} className="flex items-center gap-2">
                  {signal.icon}
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#202127]">
                    {signal.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* --- Problem Section (Warm Ivory) --- */}
      <section className="bg-luxury-ivory text-luxury-black border-y border-luxury-champagne py-32">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black">
                Still Carrying Tension <br />
                <span className="italic text-luxury-black/65">Every Single Day?</span>
              </h2>
              <div className="space-y-6">
                {PAIN_POINTS.map((point, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full border border-luxury-black/20 bg-luxury-champagne/40 flex items-center justify-center shrink-0 group-hover:bg-luxury-black group-hover:border-luxury-black transition-colors">
                      <X className="w-4 h-4 text-luxury-black/60 group-hover:text-luxury-gold" />
                    </div>
                    <p className="text-luxury-black/80 text-lg leading-snug pt-2">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl flex flex-col justify-center text-center p-12 bg-luxury-black text-luxury-white border border-luxury-gold/30 shadow-xl">
              <Sparkles className="w-12 h-12 text-luxury-gold mx-auto mb-6" />
              <h3 className="text-3xl font-serif mb-6 italic text-luxury-ivory">Restore Your Balance</h3>
              <p className="text-xl text-luxury-champagne leading-relaxed">
                What if one tranquil hour could melt away weeks of physical strain and mental fatigue?
              </p>
              <div className="mt-10 h-px bg-luxury-gold/30" />
              <p className="mt-10 text-sm uppercase tracking-[0.2em] text-luxury-gold font-bold">
                Your Sanctuary Starts Here
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Experiences Section (Charcoal Black) --- */}
      <section id="experiences" className="py-32 relative overflow-hidden bg-luxury-black">
        <div className="section-container relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <p className="text-luxury-gold font-bold uppercase tracking-[0.3em] text-xs mb-4">
              Restorative Hospitality
            </p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-luxury-white">
              What You’ll Experience at Crown Spa
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card group hover:border-luxury-gold/40 transition-colors"
              >
                <div className="text-4xl mb-6">{exp.icon}</div>
                <h4 className="text-xl font-bold mb-4 text-luxury-ivory group-hover:text-luxury-gold transition-colors">
                  {exp.title}
                </h4>
                <p className="text-luxury-champagne text-sm leading-relaxed">{exp.desc}</p>
                <div className="mt-8 pt-8 border-t border-luxury-champagne/15 flex justify-between items-center text-luxury-champagne/60 group-hover:text-luxury-gold transition-colors">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Pure Serenity</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Services & Menu Section (Warm Ivory) --- */}
      <section id="services" className="py-32 bg-luxury-ivory text-luxury-black border-y border-luxury-champagne">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="inline-block bg-luxury-black text-luxury-gold px-3 py-1 rounded-full font-bold uppercase tracking-[0.25em] text-[10px] mb-4">
                Spa Menu • Kohat Enclave, Pitampura
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black">
                Signature Massages &amp; Rituals
              </h2>
            </div>
            <p className="text-luxury-black/75 max-w-md text-sm leading-relaxed">
              Personalized bodywork, aromatic oil blends, private treatment suites, and optional steam &amp; warm shower access.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {SERVICES_MENU.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 bg-[#F7F7F5] border border-luxury-champagne hover:border-luxury-black/40 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-2xl font-serif font-bold text-luxury-black">{item.category}</h3>
                    <div className="text-right shrink-0">
                      <span className="inline-block bg-luxury-black text-luxury-gold font-bold text-sm px-3 py-1 rounded-full">
                        {item.price}
                      </span>
                      <p className="text-[10px] uppercase tracking-widest text-luxury-black/55 mt-1.5">
                        {item.subprice}
                      </p>
                    </div>
                  </div>
                  <p className="text-luxury-black/75 text-sm leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-luxury-champagne/70 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-black/55">
                    Private Rooms • Hygienic Linens
                  </span>
                  <a
                    href="#booking"
                    className="text-xs uppercase tracking-widest font-bold text-luxury-black hover:underline flex items-center gap-1"
                  >
                    Book Slot <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Offer Section (Charcoal Black) --- */}
      <section id="offer" className="py-32 bg-luxury-black">
        <div className="section-container">
          <div className="relative rounded-[40px] overflow-hidden bg-luxury-gold p-1 md:p-2">
            <div className="bg-luxury-black rounded-[36px] px-8 py-20 md:p-24 text-center border border-luxury-champagne/15 relative overflow-hidden">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}>
                <Badge className="bg-luxury-gold text-luxury-black inline-block px-6 py-2 rounded-full font-bold uppercase tracking-[0.2em] text-xs mb-8">
                  First-Visit Privileges
                </Badge>
                <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-luxury-white">
                  Free Wellness Consultation
                  <span className="block text-2xl md:text-3xl italic text-luxury-gold mt-2">
                    Personalized Therapy Matching
                  </span>
                </h2>
                <p className="text-luxury-champagne max-w-2xl mx-auto mb-12 text-lg">
                  Speak with our spa concierge to match the right pressure, essential oil blend, and private steam suite duration to how your body feels today.
                </p>

                <div className="flex flex-wrap justify-center gap-12 mb-12 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-luxury-gold/40 flex items-center justify-center text-luxury-gold">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-luxury-ivory">Custom Pressure &amp; Focus</p>
                      <p className="text-[10px] uppercase tracking-widest text-luxury-champagne/70">
                        Swedish, Deep Tissue or Thai
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-luxury-gold/40 flex items-center justify-center text-luxury-gold">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-luxury-ivory">Private Suite Allocation</p>
                      <p className="text-[10px] uppercase tracking-widest text-luxury-champagne/70">
                        Sanitized Rooms &amp; Steam Access
                      </p>
                    </div>
                  </div>
                </div>

                <LuxuryButton href="#booking" className="text-xl px-12 py-6">
                  Claim Your Free Consultation
                </LuxuryButton>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works (Warm Ivory) --- */}
      <section className="py-32 bg-luxury-ivory text-luxury-black border-y border-luxury-champagne">
        <div className="section-container">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-serif font-bold mb-4 text-luxury-black">Your Path to Pure Calm</h2>
            <p className="text-luxury-black/60 uppercase tracking-widest text-xs">Reset in 3 Simple Steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[60px] left-1/4 right-1/4 h-[1px] border-t border-dashed border-luxury-black/25 z-0" />

            {[
              {
                step: '01',
                title: 'Reserve Your Slot',
                desc: 'Book online, via WhatsApp, or call us to lock your preferred hour.',
              },
              {
                step: '02',
                title: 'Arrive & Unwind',
                desc: 'Step into our serene 2nd-floor Kohat Enclave sanctuary near Metro Pillar 342.',
              },
              {
                step: '03',
                title: 'Leave Recharged',
                desc: 'Enjoy unhurried bodywork, steam access, and a noticeably lighter body.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-6 relative z-10">
                <div className="w-32 h-32 rounded-full border-2 border-luxury-champagne bg-luxury-black flex items-center justify-center mx-auto shadow-xl">
                  <span className="text-4xl font-serif font-bold text-luxury-gold">{item.step}</span>
                </div>
                <h4 className="text-xl font-bold text-luxury-black">{item.title}</h4>
                <p className="text-luxury-black/75 text-sm leading-relaxed max-w-[250px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Authority Section (Charcoal Black) --- */}
      <section className="py-32 border-b border-luxury-champagne/15 bg-luxury-black">
        <div className="section-container grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-square border border-luxury-champagne/20">
            <img
              src={suiteSquareImg}
              className="w-full h-full object-cover"
              alt="Crown Spa Pitampura Private Candlelit Therapy Suite"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-luxury-black/45 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-luxury-gold flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Flower2 className="w-10 h-10 text-luxury-black" />
                </div>
                <p className="text-luxury-ivory font-serif italic text-2xl">Tranquility</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <p className="text-luxury-gold font-bold uppercase tracking-[0.2em] text-xs">
              Luxury Wellness Sanctuary • Pitampura, New Delhi
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-white">
              Therapists Who Listen to <br /> <span className="italic text-luxury-ivory">What Your Body Needs</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-luxury-ivory/[0.06] border border-luxury-champagne/20 flex items-center justify-center shrink-0">
                  <Star className="text-luxury-gold w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-luxury-ivory">Trained Wellness &amp; Massage Therapists</p>
                  <p className="text-luxury-champagne">
                    Skilled in Swedish relaxation, Deep Tissue recovery, Thai stretching &amp; reflexology.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-luxury-ivory/[0.06] border border-luxury-champagne/20 flex items-center justify-center shrink-0">
                  <Check className="text-luxury-gold w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-luxury-ivory">
                    Private Hygienic Rooms &amp; Steam Suites
                  </p>
                  <p className="text-luxury-champagne">
                    At House No. 372, 2nd Floor, Kohat Enclave (near Metro Pillar Nos. 342 &amp; 343).
                  </p>
                </div>
              </div>
            </div>
            <p className="text-luxury-champagne/80 italic">
              Open Mon – Sun (10:00 AM – 10:00 PM) • Appointments recommended for evening suites.
            </p>
          </div>
        </div>
      </section>

      {/* --- Testimonials (Warm Ivory) --- */}
      <section id="testimonials" className="py-32 bg-luxury-ivory text-luxury-black border-b border-luxury-champagne">
        <div className="section-container">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-serif font-bold mb-4 text-luxury-black">Guest Stories of Relief</h2>
            <div className="inline-flex justify-center items-center gap-1 bg-luxury-black px-4 py-1.5 rounded-full">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 fill-luxury-gold text-luxury-gold" />
              ))}
              <Star className="w-4 h-4 fill-luxury-gold/40 text-luxury-gold" />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-widest text-luxury-black/70">
              {BUSINESS_INFO.rating}★ Average • {BUSINESS_INFO.reviewCount} •{' '}
              <a
                href={BUSINESS_INFO.googleProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-luxury-black font-bold underline hover:opacity-75"
              >
                View Google Profile
              </a>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 bg-[#F7F7F5] border border-luxury-champagne hover:border-luxury-black/40 transition-all shadow-sm"
              >
                <div className="mb-6">
                  <MessageCircle className="w-10 h-10 text-luxury-black/20" />
                </div>
                <p className="text-xl font-serif italic mb-8 leading-relaxed text-luxury-black">“{t.quote}”</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-luxury-champagne border border-luxury-black/10" />
                  <div>
                    <p className="font-bold text-luxury-black">{t.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-luxury-black/60">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- AI Photo Wellness Consultant Section --- */}
      <AIConsultantSection onBookRecommendation={handleBookRecommendation} />

      {/* --- Booking Section (Charcoal Black) --- */}
      <section id="booking" className="py-32 relative bg-luxury-black scroll-mt-20">
        <div className="section-container max-w-5xl">
          <div className="glass-card p-12 md:p-20 border-luxury-champagne/25">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-luxury-white">
                Reserve Your Suite Now
              </h2>
              <div className="flex items-center justify-center gap-2 text-luxury-gold font-bold text-xs uppercase tracking-widest">
                <Calendar className="w-4 h-4" /> Private slots filling fast today
              </div>
              {aiRecommendationLabel && !isSubmitted && (
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    AI Consultant Recommendation Pre-selected: <strong>{aiRecommendationLabel}</strong>
                  </span>
                </div>
              )}
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-luxury-gold/20 flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-luxury-gold" />
                </div>
                <h3 className="text-2xl font-serif text-luxury-white">Session Request Secured!</h3>
                {bookingReference && (
                  <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold">
                    Booking Reference: {bookingReference}
                  </p>
                )}
                <p className="text-luxury-champagne">
                  Our concierge will call you within the next 15 minutes to confirm your private suite and preferred therapist.
                </p>
                <LuxuryButton variant="secondary" onClick={() => setIsSubmitted(false)}>
                  Back to site
                </LuxuryButton>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-champagne">
                    Full Name
                  </label>
                  <input
                    ref={bookingNameInputRef}
                    required
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-luxury-ivory/[0.06] border border-luxury-champagne/20 rounded-xl px-6 py-4 text-luxury-white placeholder:text-luxury-champagne/45 focus:border-luxury-gold outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-champagne">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 87929 02454"
                    className="w-full bg-luxury-ivory/[0.06] border border-luxury-champagne/20 rounded-xl px-6 py-4 text-luxury-white placeholder:text-luxury-champagne/45 focus:border-luxury-gold outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-champagne">
                    Preferred Therapy
                  </label>
                  <select
                    className="w-full bg-luxury-ivory/[0.06] border border-luxury-champagne/20 rounded-xl px-6 py-4 text-luxury-white focus:border-luxury-gold outline-none transition-all appearance-none"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="Free Wellness Consultation" className="bg-luxury-black text-luxury-white">
                      Free Wellness Consultation
                    </option>
                    <option value="Swedish & Aromatherapy Massage" className="bg-luxury-black text-luxury-white">
                      Swedish &amp; Aromatherapy Massage
                    </option>
                    <option value="Deep Tissue & Thai Massage" className="bg-luxury-black text-luxury-white">
                      Deep Tissue &amp; Thai Massage
                    </option>
                    <option value="Head, Shoulder & Reflexology" className="bg-luxury-black text-luxury-white">
                      Head, Shoulder &amp; Reflexology
                    </option>
                    <option value="Couple Spa & Steam Rituals" className="bg-luxury-black text-luxury-white">
                      Couple Spa &amp; Steam Rituals
                    </option>
                    <option value="Body Scrub, Wrap & Skin Care" className="bg-luxury-black text-luxury-white">
                      Body Scrub, Wrap &amp; Skin Care
                    </option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-champagne">
                    Preferred Time
                  </label>
                  <input
                    required
                    type="datetime-local"
                    className="w-full bg-luxury-ivory/[0.06] border border-luxury-champagne/20 rounded-xl px-6 py-4 text-luxury-white focus:border-luxury-gold outline-none transition-all"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                {bookingError && (
                  <div className="md:col-span-2 rounded-xl bg-red-500/10 border border-red-400/30 px-4 py-3 text-xs text-red-200 text-center">
                    {bookingError}
                  </div>
                )}
                <div className="md:col-span-2 pt-6">
                  <LuxuryButton className="w-full text-lg py-5">
                    {isSubmittingBooking ? 'Reserving Your Suite...' : 'Reserve My Suite Now'}
                  </LuxuryButton>
                  <p className="mt-4 text-center text-[10px] text-luxury-champagne/70 uppercase tracking-widest">
                    Or call us directly at {BUSINESS_INFO.phonePrimary} / {BUSINESS_INFO.phoneSecondary}
                  </p>
                </div>
              </form>
            )}

            {/* Spa Location & Hours Strip */}
            <div className="mt-12 pt-10 border-t border-luxury-champagne/15 grid sm:grid-cols-3 gap-6 text-left text-xs text-luxury-champagne">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-luxury-ivory uppercase tracking-wider text-[10px] mb-1">Visit Us</p>
                  <p>{BUSINESS_INFO.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-luxury-ivory uppercase tracking-wider text-[10px] mb-1">
                    Opening Hours
                  </p>
                  <p>{BUSINESS_INFO.hours}</p>
                  <p className="text-luxury-champagne/65 mt-0.5">{BUSINESS_INFO.hoursNote}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ExternalLink className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-luxury-ivory uppercase tracking-wider text-[10px] mb-1">
                    Google Maps
                  </p>
                  <a
                    href={BUSINESS_INFO.mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-luxury-gold hover:underline block"
                  >
                    Get Directions
                  </a>
                  <a
                    href={BUSINESS_INFO.googleProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-luxury-champagne hover:text-luxury-gold hover:underline block mt-1"
                  >
                    Google Business Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Scarcity Section (Warm Ivory) --- */}
      <section className="py-24 bg-luxury-ivory text-luxury-black border-t border-luxury-champagne">
        <div className="section-container text-center">
          <div className="w-16 h-16 rounded-full bg-luxury-black flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-luxury-gold animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-luxury-black">
            Book Ahead for Evening Suites
          </h2>
          <p className="text-luxury-black/75 mb-10 max-w-xl mx-auto">
            Reserve your massage, steam ritual, or couple sanctuary session in advance at our Kohat Enclave, Pitampura studio.
          </p>
          <LuxuryButton href="#booking" className="px-12">
            Claim Your Suite Before It&apos;s Gone
          </LuxuryButton>
        </div>
      </section>

      {/* --- Footer (Charcoal Black) --- */}
      <footer className="bg-luxury-black pt-32 pb-40 border-t border-luxury-champagne/15">
        <div className="section-container grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-serif font-bold gold-gradient-text">CROWN SPA</span>
              <span className="text-[10px] uppercase tracking-[2px] border-l border-luxury-gold/40 pl-3 text-luxury-champagne">
                Pitampura
              </span>
            </div>
            <p className="text-luxury-champagne max-w-md leading-relaxed">
              A luxury body massage and wellness studio in Kohat Enclave, Pitampura, New Delhi — offering Swedish, Deep Tissue, Thai &amp; Aromatherapy sessions, reflexology, private suites, and steam facilities.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={BUSINESS_INFO.googleProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-luxury-gold/50 text-xs uppercase tracking-widest text-luxury-gold hover:bg-luxury-gold/10 transition-colors flex items-center gap-2"
              >
                Google Profile <ExternalLink size={14} />
              </a>
              <a
                href={BUSINESS_INFO.mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-luxury-champagne/25 text-xs uppercase tracking-widest text-luxury-ivory hover:border-luxury-gold hover:text-luxury-gold transition-colors flex items-center gap-2"
              >
                Directions <MapPin size={14} />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <p className="font-bold text-xs uppercase tracking-widest text-luxury-ivory">Connect</p>
            <div className="space-y-4 text-sm text-luxury-champagne">
              <a
                href={BUSINESS_INFO.mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-luxury-gold transition-colors"
              >
                <MapPin size={14} className="text-luxury-gold shrink-0 mt-1" />
                <span>{BUSINESS_INFO.address}</span>
              </a>
              <div className="space-y-2">
                <a
                  href={BUSINESS_INFO.phonePrimaryHref}
                  className="flex items-center gap-3 hover:text-luxury-gold transition-colors"
                >
                  <Phone size={14} className="text-luxury-gold shrink-0" /> {BUSINESS_INFO.phonePrimary}
                </a>
                <a
                  href={BUSINESS_INFO.phoneSecondaryHref}
                  className="flex items-center gap-3 hover:text-luxury-gold transition-colors"
                >
                  <Phone size={14} className="text-luxury-gold shrink-0" /> {BUSINESS_INFO.phoneSecondary}
                </a>
              </div>
              <p className="flex items-start gap-3">
                <Calendar size={14} className="text-luxury-gold shrink-0 mt-1" />
                <span>
                  {BUSINESS_INFO.hours}
                  <br />
                  <span className="text-xs text-luxury-champagne/65">{BUSINESS_INFO.hoursNote}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="font-bold text-xs uppercase tracking-widest text-luxury-ivory">Therapies</p>
            <div className="space-y-4 text-sm text-luxury-champagne">
              <a href="#services" className="block hover:text-luxury-gold transition-colors">
                Swedish &amp; Aromatherapy
              </a>
              <a href="#services" className="block hover:text-luxury-gold transition-colors">
                Deep Tissue &amp; Thai
              </a>
              <a href="#services" className="block hover:text-luxury-gold transition-colors">
                Head, Shoulder &amp; Reflexology
              </a>
              <a href="#services" className="block hover:text-luxury-gold transition-colors">
                Couple Spa &amp; Steam Suites
              </a>
            </div>
          </div>
        </div>

        <div className="text-center pt-20 border-t border-luxury-champagne/15 text-luxury-champagne/55 text-[10px] uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} CROWN SPA, Pitampura, New Delhi. All Rights Reserved.
        </div>
      </footer>

      {/* --- Sticky Bottom CTA --- */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 w-full z-50 p-4 md:hidden pointer-events-none"
      >
        <div className="max-w-md mx-auto pointer-events-auto">
          <LuxuryButton href="#booking" className="w-full shadow-2xl h-16 text-sm">
            Book Free Consultation
          </LuxuryButton>
        </div>
      </motion.div>

      {/* --- WhatsApp Floating Button --- */}
      <a
        href={BUSINESS_INFO.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce md:animate-none group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 bg-luxury-ivory text-luxury-black border border-luxury-champagne px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
          Chat on WhatsApp
        </span>
      </a>

      {/* --- AI Spa Concierge Chatbot --- */}
      <SalonChatbot
        isOpen={isChatOpen}
        onToggle={setIsChatOpen}
        onBookFromChat={handleBookRecommendation}
      />
    </div>
  );
}

// --- Small UI Helper ---
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', className)}>
    {children}
  </div>
);
