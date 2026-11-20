import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
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
  Clock
} from 'lucide-react';
import { cn } from './lib/utils';
import AIConsultantSection from './components/AIConsultantSection';
import SalonChatbot from './components/SalonChatbot';
import heroDesktopImg from './assets/images/salon_hero_desktop_1795163530507.jpg';
import heroMobileImg from './assets/images/salon_hero_mobile_1795163530353.jpg';

// --- Business Constants (Google Business Profile & Verified Listings) ---
const BUSINESS_INFO = {
  name: 'FLORAISON',
  tagline: "L'Oréal Professionnel VIP Unisex Salon",
  address: 'T.G. Road, Near Sankar Chowmuhani, Ram Nagar, Agartala, Tripura 799001',
  shortAddress: 'T.G. Road, Near Sankar Chowmuhani, Ram Nagar, Agartala',
  phonePrimary: '+91 98624 79278',
  phonePrimaryHref: 'tel:+919862479278',
  phoneSecondary: '+91 97743 55193',
  phoneSecondaryHref: 'tel:+919774355193',
  whatsappHref: 'https://wa.me/919862479278',
  hours: 'Mon – Sun: 11:00 AM – 10:00 PM',
  hoursNote: 'Call ahead on Thursdays & holidays',
  googleProfileUrl: 'https://share.google/4KhY6miTT5y6uRD8S',
  mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=23.844058990478516,91.27068328857422',
  rating: '4.1',
  reviewCount: '125+',
};

const TRUST_SIGNALS = [
  { text: `${BUSINESS_INFO.rating}★ Rated (${BUSINESS_INFO.reviewCount} Reviews)`, icon: <Star className="w-4 h-4 text-[#343B42] fill-[#F5D64E]" /> },
  { text: "L'Oréal Professionnel Partner", icon: <ShieldCheck className="w-4 h-4 text-[#343B42]" /> },
  { text: 'T.G. Road, Agartala', icon: <MapPin className="w-4 h-4 text-[#343B42]" /> },
];

const SERVICES_MENU = [
  {
    category: 'Haircuts & Styling',
    price: '₹200 – ₹300',
    subprice: 'Kids Cuts from ₹150',
    desc: 'Precision unisex haircuts, Prince & Princess kids styling, blowouts, and customized face-framing looks.',
  },
  {
    category: "L'Oréal Hair Colour & Balayage",
    price: '₹700 – ₹2,000',
    subprice: 'Global Colour & Highlights',
    desc: 'Ammonia-free INOA, French Balayage, French Blending, Dia Color, and Dia Light gloss transformations.',
  },
  {
    category: 'Keratin & Hair Spa Rituals',
    price: 'On Consultation',
    subprice: 'Smoothing & Repair',
    desc: 'Deep-conditioning hair spa, keratin smoothing, frizz control, and restorative scalp therapies.',
  },
  {
    category: 'Skin, Facials & Bridal',
    price: 'On Consultation',
    subprice: 'Cosmetic & Occasion Care',
    desc: 'Rejuvenating facials, skin & grooming treatments, and bespoke bridal or party makeovers.',
  },
];

const PAIN_POINTS = [
  "Tired of bad haircuts that don’t suit your face?",
  "Hair damage, frizz, or hair fall ruining your confidence?",
  "Visiting salons but never getting the “wow” result?",
  "Want to look fresh and confident but don’t know what suits you?",
];

const EXPERIENCES = [
  { title: "Confident & Camera-Ready", desc: "Walk out feeling like the best version of yourself.", icon: "💫" },
  { title: "No More Guessing", desc: "Know exactly what style suits your face and persona.", icon: "🧠" },
  { title: "Hair That Lives", desc: "Healthy, smooth, and alive from root to tip.", icon: "💁‍♀️" },
  { title: "Polished Effortlessly", desc: "Look high-end every single day with zero effort.", icon: "⚡" },
  { title: "Unexpected Compliments", desc: "Get ready for the attention you deserve.", icon: "🏆" },
  { title: "Deep Mental Reset", desc: "Relax and de-stress in our serene atmosphere.", icon: "🌿" },
];

const TESTIMONIALS = [
  {
    name: "Ayesha S.",
    quote: "I finally found a salon that understands what I want. My hair has never looked this good!",
    role: "Regular Client"
  },
  {
    name: "Rohan M.",
    quote: "I walked in confused… walked out confident. The transformation was instant.",
    role: "Gentleman's Styling"
  },
  {
    name: "Priya K.",
    quote: "The compliments didn’t stop for days. Worth every minute and rupee spent.",
    role: "Bridal Consultation"
  }
];

// --- Components ---

const LuxuryButton = ({ 
  children, 
  variant = 'primary', 
  className,
  onClick,
  href,
  target,
  rel
}: { 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary', 
  className?: string,
  onClick?: () => void,
  href?: string,
  target?: string,
  rel?: string
}) => {
  const baseStyles = 'relative overflow-hidden px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center';
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

export default function FloraisonLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', service: 'Free Consultation', time: '' });
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
          {/* Mobile Hamburger (Left, matching mobile reference) */}
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden text-luxury-white hover:text-luxury-gold transition-colors p-1.5 -ml-1.5 shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Centered Brand Lockup / Desktop Left Brand Lockup */}
          <div className="flex flex-col md:flex-row items-center md:gap-2 text-center md:text-left">
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight gold-gradient-text leading-none">
              FLORAISON
            </span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[3px] md:border-l md:border-luxury-gold/40 md:pl-3 md:ml-1 mt-1 md:mt-0 text-luxury-champagne">
              Agartala
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            <a href="#experiences" className="text-xs uppercase tracking-widest text-luxury-white/90 hover:text-luxury-gold transition-colors">Experience</a>
            <a href="#services" className="text-xs uppercase tracking-widest text-luxury-white/90 hover:text-luxury-gold transition-colors">Services</a>
            <a href="#consultant" className="text-xs uppercase tracking-widest text-luxury-gold font-semibold hover:opacity-80 transition-opacity flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Consultant
            </a>
            <a href="#offer" className="text-xs uppercase tracking-widest text-luxury-white/90 hover:text-luxury-gold transition-colors">The Offer</a>
            <a href="#testimonials" className="text-xs uppercase tracking-widest text-luxury-white/90 hover:text-luxury-gold transition-colors">Reviews</a>
            <LuxuryButton href="#booking" variant="secondary" className="px-6 py-2.5 text-[10px]">Book Now</LuxuryButton>
          </div>

          {/* Mobile Book Now Button (Right, matching mobile reference) */}
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
              <a href="#experiences" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">Experience</a>
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">Services</a>
              <a href="#consultant" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif text-luxury-gold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Consultant
              </a>
              <a href="#offer" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">The Offer</a>
              <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">Reviews</a>
              <LuxuryButton href="#booking" onClick={() => setIsMenuOpen(false)}>Book Free Consultation</LuxuryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <header className="relative min-h-[92vh] md:min-h-screen flex items-center pt-24 pb-16 md:pt-20 md:pb-20 overflow-hidden bg-[#9EABB5] border-b border-[#DCE4E9]/60">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroMobileImg}
            className="w-full h-full object-cover object-center md:hidden"
            alt="Bright Luxury Floraison Salon Interior"
          />
          <img 
            src={heroDesktopImg}
            className="hidden md:block w-full h-full object-cover object-center"
            alt="Bright Luxury Floraison Salon Interior"
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
                L&apos;Oréal Professionnel VIP Salon • Agartala
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-serif font-bold leading-[1.06] mb-5 text-[#202127]">
              <span className="block">Look Stunning.</span>
              <span className="block text-[#F5D64E] italic [text-shadow:0_2px_12px_rgba(32,33,39,0.28)]">
                Feel Confident.
              </span>
            </h1>

            <div className="w-12 h-1 rounded-full bg-[#F5D64E] mb-6" />

            <p className="text-base md:text-lg text-[#202127] font-normal max-w-md mb-8 leading-relaxed">
              Unisex Hair, Skin &amp; Spa Salon at T.G. Road, Near Sankar Chowmuhani, Ram Nagar, Agartala. 
              Precision styling, L&apos;Oréal colour, and personalized consultations.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <LuxuryButton href="#booking" className="w-fit inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs sm:text-sm shadow-xl shadow-[#202127]/15">
                Book Now <ArrowRight className="w-4 h-4" />
              </LuxuryButton>
            </div>

            <div className="mt-8 flex flex-wrap justify-start gap-x-6 gap-y-2.5 text-[#343B42]">
              {TRUST_SIGNALS.map((signal, i) => (
                <div key={i} className="flex items-center gap-2">
                  {signal.icon}
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#202127]">{signal.text}</span>
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
                Still Not Happy With <br />
                <span className="italic text-luxury-black/65">Your Look?</span>
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
              <h3 className="text-3xl font-serif mb-6 italic text-luxury-ivory">Shift the Narrative</h3>
              <p className="text-xl text-luxury-champagne leading-relaxed">
                What if one visit could change how you look… and how you feel about yourself?
              </p>
              <div className="mt-10 h-px bg-luxury-gold/30" />
              <p className="mt-10 text-sm uppercase tracking-[0.2em] text-luxury-gold font-bold">Your Reveal Starts Here</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Experiences Section (Charcoal Black) --- */}
      <section id="experiences" className="py-32 relative overflow-hidden bg-luxury-black">
        <div className="section-container relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <p className="text-luxury-gold font-bold uppercase tracking-[0.3em] text-xs mb-4">Outcome-Driven Artistry</p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-luxury-white">What You’ll Experience at Floraison</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EXPERIENCES.map((exp, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card group hover:border-luxury-gold/40 transition-colors"
              >
                <div className="text-4xl mb-6">{exp.icon}</div>
                <h4 className="text-xl font-bold mb-4 text-luxury-ivory group-hover:text-luxury-gold transition-colors">{exp.title}</h4>
                <p className="text-luxury-champagne text-sm leading-relaxed">{exp.desc}</p>
                <div className="mt-8 pt-8 border-t border-luxury-champagne/15 flex justify-between items-center text-luxury-champagne/60 group-hover:text-luxury-gold transition-colors">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Premium Quality</span>
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
                Salon Menu • Ram Nagar, Agartala
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black">Signature Services &amp; Treatments</h2>
            </div>
            <p className="text-luxury-black/75 max-w-md text-sm leading-relaxed">
              Featuring authentic L&apos;Oréal Professionnel colour systems including INOA, French Balayage, Dia Color, and Dia Light.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {SERVICES_MENU.map((item, i) => (
              <div key={i} className="rounded-2xl p-8 bg-[#F7F7F5] border border-luxury-champagne hover:border-luxury-black/40 transition-all flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-2xl font-serif font-bold text-luxury-black">{item.category}</h3>
                    <div className="text-right shrink-0">
                      <span className="inline-block bg-luxury-black text-luxury-gold font-bold text-sm px-3 py-1 rounded-full">{item.price}</span>
                      <p className="text-[10px] uppercase tracking-widest text-luxury-black/55 mt-1.5">{item.subprice}</p>
                    </div>
                  </div>
                  <p className="text-luxury-black/75 text-sm leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-luxury-champagne/70 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-black/55">Unisex • Walk-in &amp; Appointments</span>
                  <a href="#booking" className="text-xs uppercase tracking-widest font-bold text-luxury-black hover:underline flex items-center gap-1">
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
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
               >
                 <Badge className="bg-luxury-gold text-luxury-black inline-block px-6 py-2 rounded-full font-bold uppercase tracking-[0.2em] text-xs mb-8">
                   Limited Time Offer
                 </Badge>
                 <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-luxury-white">
                   Free Consultation 
                   <span className="block text-2xl md:text-3xl italic text-luxury-gold mt-2">(Worth ₹999)</span>
                 </h2>
                 <p className="text-luxury-champagne max-w-2xl mx-auto mb-12 text-lg">
                   Sit down with our master stylists for a personalized hair &amp; skin deep-dive. 
                   Get a style roadmap tailored to your specific facial structure and lifestyle.
                 </p>
                 
                 <div className="flex flex-wrap justify-center gap-12 mb-12 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-luxury-gold/40 flex items-center justify-center text-luxury-gold"><Check className="w-5 h-5"/></div>
                      <div>
                        <p className="font-bold text-luxury-ivory">Personalized Assessment</p>
                        <p className="text-[10px] uppercase tracking-widest text-luxury-champagne/70">Hair &amp; Skin Profile</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-luxury-gold/40 flex items-center justify-center text-luxury-gold"><Check className="w-5 h-5"/></div>
                      <div>
                        <p className="font-bold text-luxury-ivory">Style Roadmap</p>
                        <p className="text-[10px] uppercase tracking-widest text-luxury-champagne/70">Customized Recommendations</p>
                      </div>
                    </div>
                 </div>

                 <LuxuryButton href="#booking" className="text-xl px-12 py-6">Claim Your Free Consultation</LuxuryButton>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works (Warm Ivory) --- */}
      <section className="py-32 bg-luxury-ivory text-luxury-black border-y border-luxury-champagne">
        <div className="section-container">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-serif font-bold mb-4 text-luxury-black">Your Path to Radiance</h2>
            <p className="text-luxury-black/60 uppercase tracking-widest text-xs">Transform in 3 Simple Steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[60px] left-1/4 right-1/4 h-[1px] border-t border-dashed border-luxury-black/25 z-0" />
            
            {[
              { step: "01", title: "Book Your Slot", desc: "Choose your convenient time online or via WhatsApp." },
              { step: "02", title: "Visit & Consult", desc: "Experience our studio and get expert advice tailored to you." },
              { step: "03", title: "Transform Your Look", desc: "Our specialists execute with precision. Experience the upgrade instantly." },
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
              src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover sepia-[0.1]"
              alt="Expert Stylist"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-luxury-black/45 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-luxury-gold flex items-center justify-center mx-auto mb-4 shadow-lg">
                   <Scissors className="w-10 h-10 text-luxury-black" />
                </div>
                <p className="text-luxury-ivory font-serif italic text-2xl">Craftsmanship</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <p className="text-luxury-gold font-bold uppercase tracking-[0.2em] text-xs">L&apos;Oréal Professionnel VIP Partner • Agartala</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-white">Experts Who Understand <br /> <span className="italic text-luxury-ivory">Your Unique Style</span></h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-luxury-ivory/[0.06] border border-luxury-champagne/20 flex items-center justify-center shrink-0"><Star className="text-luxury-gold w-6 h-6"/></div>
                <div>
                  <p className="font-bold text-lg text-luxury-ivory">L&apos;Oréal Professionnel Hair &amp; Colour Specialists</p>
                  <p className="text-luxury-champagne">Trained in INOA, French Balayage, French Blending, Dia Color &amp; precision cutting.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-luxury-ivory/[0.06] border border-luxury-champagne/20 flex items-center justify-center shrink-0"><Check className="text-luxury-gold w-6 h-6"/></div>
                <div>
                  <p className="font-bold text-lg text-luxury-ivory">Complete Unisex Grooming, Spa &amp; Bridal Studio</p>
                  <p className="text-luxury-champagne">Conveniently located at T.G. Road, Near Sankar Chowmuhani, Ram Nagar, Agartala.</p>
                </div>
              </div>
            </div>
            <p className="text-luxury-champagne/80 italic">✨ Open Mon – Sun (11:00 AM – 10:00 PM) • Appointments recommended.</p>
          </div>
        </div>
      </section>

      {/* --- Testimonials (Warm Ivory) --- */}
      <section id="testimonials" className="py-32 bg-luxury-ivory text-luxury-black border-b border-luxury-champagne">
        <div className="section-container">
          <div className="text-center mb-24">
             <h2 className="text-4xl font-serif font-bold mb-4 text-luxury-black">Stories of Confidence</h2>
             <div className="inline-flex justify-center items-center gap-1 bg-luxury-black px-4 py-1.5 rounded-full">
               {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-luxury-gold text-luxury-gold" />)}
               <Star className="w-4 h-4 fill-luxury-gold/40 text-luxury-gold" />
             </div>
             <p className="mt-4 text-[10px] uppercase tracking-widest text-luxury-black/70">
               {BUSINESS_INFO.rating}★ Average • {BUSINESS_INFO.reviewCount} Verified Local Reviews •{' '}
               <a href={BUSINESS_INFO.googleProfileUrl} target="_blank" rel="noopener noreferrer" className="text-luxury-black font-bold underline hover:opacity-75">
                 View Google Profile
               </a>
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl p-8 bg-[#F7F7F5] border border-luxury-champagne hover:border-luxury-black/40 transition-all shadow-sm">
                <div className="mb-6"><MessageCircle className="w-10 h-10 text-luxury-black/20" /></div>
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

      {/* --- AI Photo Consultant Section --- */}
      <AIConsultantSection onBookRecommendation={handleBookRecommendation} />

      {/* --- Booking Section (Charcoal Black) --- */}
      <section id="booking" className="py-32 relative bg-luxury-black scroll-mt-20">
        <div className="section-container max-w-5xl">
          <div className="glass-card p-12 md:p-20 border-luxury-champagne/25">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-luxury-white">Secure Your Slot Now</h2>
              <div className="flex items-center justify-center gap-2 text-luxury-gold font-bold text-xs uppercase tracking-widest">
                <Calendar className="w-4 h-4" /> Limited slots available today
              </div>
              {aiRecommendationLabel && !isSubmitted && (
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>AI Consultant Recommendation Pre-selected: <strong>{aiRecommendationLabel}</strong></span>
                </div>
              )}
            </div>

            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-luxury-gold/20 flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-luxury-gold" />
                </div>
                <h3 className="text-2xl font-serif text-luxury-white">Consultation Secured!</h3>
                {bookingReference && (
                  <p className="text-xs uppercase tracking-widest text-luxury-gold font-bold">
                    Booking Reference: {bookingReference}
                  </p>
                )}
                <p className="text-luxury-champagne">Our concierge will contact you within the next 15 minutes to confirm your preferred session time.</p>
                <LuxuryButton variant="secondary" onClick={() => setIsSubmitted(false)}>Back to site</LuxuryButton>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-champagne">Full Name</label>
                  <input 
                    ref={bookingNameInputRef}
                    required
                    type="text" 
                    placeholder="Enter your name" 
                    className="w-full bg-luxury-ivory/[0.06] border border-luxury-champagne/20 rounded-xl px-6 py-4 text-luxury-white placeholder:text-luxury-champagne/45 focus:border-luxury-gold outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-champagne">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+91 98624 79278" 
                    className="w-full bg-luxury-ivory/[0.06] border border-luxury-champagne/20 rounded-xl px-6 py-4 text-luxury-white placeholder:text-luxury-champagne/45 focus:border-luxury-gold outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-champagne">Preferred Service</label>
                  <select 
                    className="w-full bg-luxury-ivory/[0.06] border border-luxury-champagne/20 rounded-xl px-6 py-4 text-luxury-white focus:border-luxury-gold outline-none transition-all appearance-none"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                  >
                    <option value="Free Consultation" className="bg-luxury-black text-luxury-white">Free Consultation</option>
                    <option value="Haircut & Styling (₹200–₹300)" className="bg-luxury-black text-luxury-white">Haircut &amp; Styling (₹200–₹300)</option>
                    <option value="Global Hair Colour / French Balayage (₹700–₹2,000)" className="bg-luxury-black text-luxury-white">Global Hair Colour / French Balayage (₹700–₹2,000)</option>
                    <option value="Keratin & Hair Spa" className="bg-luxury-black text-luxury-white">Keratin &amp; Hair Spa</option>
                    <option value="Skin & Facial Treatment" className="bg-luxury-black text-luxury-white">Skin &amp; Facial Treatment</option>
                    <option value="Bridal & Occasion Makeover" className="bg-luxury-black text-luxury-white">Bridal &amp; Occasion Makeover</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-champagne">Preferred Time</label>
                  <input 
                    required
                    type="datetime-local" 
                    className="w-full bg-luxury-ivory/[0.06] border border-luxury-champagne/20 rounded-xl px-6 py-4 text-luxury-white focus:border-luxury-gold outline-none transition-all"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                {bookingError && (
                  <div className="md:col-span-2 rounded-xl bg-red-500/10 border border-red-400/30 px-4 py-3 text-xs text-red-200 text-center">
                    {bookingError}
                  </div>
                )}
                <div className="md:col-span-2 pt-6">
                  <LuxuryButton className="w-full text-lg py-5">
                    {isSubmittingBooking ? 'Securing Your Slot...' : 'Secure My Slot Now'}
                  </LuxuryButton>
                  <p className="mt-4 text-center text-[10px] text-luxury-champagne/70 uppercase tracking-widest">
                    Or call us directly at {BUSINESS_INFO.phonePrimary} / {BUSINESS_INFO.phoneSecondary}
                  </p>
                </div>
              </form>
            )}

            {/* Salon Location & Hours Strip */}
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
                  <p className="font-bold text-luxury-ivory uppercase tracking-wider text-[10px] mb-1">Opening Hours</p>
                  <p>{BUSINESS_INFO.hours}</p>
                  <p className="text-luxury-champagne/65 mt-0.5">{BUSINESS_INFO.hoursNote}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ExternalLink className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-luxury-ivory uppercase tracking-wider text-[10px] mb-1">Google Maps</p>
                  <a href={BUSINESS_INFO.mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="text-luxury-gold hover:underline block">
                    Get Directions
                  </a>
                  <a href={BUSINESS_INFO.googleProfileUrl} target="_blank" rel="noopener noreferrer" className="text-luxury-champagne hover:text-luxury-gold hover:underline block mt-1">
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
           <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-luxury-black">Book Ahead for Peak Hours</h2>
           <p className="text-luxury-black/75 mb-10 max-w-xl mx-auto">Reserve your hair, colour, spa, or bridal consultation in advance at our T.G. Road salon in Agartala.</p>
           <LuxuryButton href="#booking" className="px-12">Claim Your Slot Before It&apos;s Gone</LuxuryButton>
        </div>
      </section>

      {/* --- Footer (Charcoal Black) --- */}
      <footer className="bg-luxury-black pt-32 pb-40 border-t border-luxury-champagne/15">
        <div className="section-container grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-serif font-bold gold-gradient-text">FLORAISON</span>
              <span className="text-[10px] uppercase tracking-[2px] border-l border-luxury-gold/40 pl-3 text-luxury-champagne">Agartala</span>
            </div>
            <p className="text-luxury-champagne max-w-md leading-relaxed">
              An official L&apos;Oréal Professionnel partner unisex salon in Ram Nagar, Agartala — offering haircuts, global colour, French Balayage, spa therapies, skin treatments, and bridal makeovers.
            </p>
            <div className="flex items-center gap-4">
              <a href={BUSINESS_INFO.googleProfileUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full border border-luxury-gold/50 text-xs uppercase tracking-widest text-luxury-gold hover:bg-luxury-gold/10 transition-colors flex items-center gap-2">
                Google Profile <ExternalLink size={14} />
              </a>
              <a href={BUSINESS_INFO.mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full border border-luxury-champagne/25 text-xs uppercase tracking-widest text-luxury-ivory hover:border-luxury-gold hover:text-luxury-gold transition-colors flex items-center gap-2">
                Directions <MapPin size={14} />
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="font-bold text-xs uppercase tracking-widest text-luxury-ivory">Connect</p>
            <div className="space-y-4 text-sm text-luxury-champagne">
              <a href={BUSINESS_INFO.mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-luxury-gold transition-colors">
                <MapPin size={14} className="text-luxury-gold shrink-0 mt-1" />
                <span>{BUSINESS_INFO.address}</span>
              </a>
              <div className="space-y-2">
                <a href={BUSINESS_INFO.phonePrimaryHref} className="flex items-center gap-3 hover:text-luxury-gold transition-colors">
                  <Phone size={14} className="text-luxury-gold shrink-0" /> {BUSINESS_INFO.phonePrimary}
                </a>
                <a href={BUSINESS_INFO.phoneSecondaryHref} className="flex items-center gap-3 hover:text-luxury-gold transition-colors">
                  <Phone size={14} className="text-luxury-gold shrink-0" /> {BUSINESS_INFO.phoneSecondary}
                </a>
              </div>
              <p className="flex items-start gap-3">
                <Calendar size={14} className="text-luxury-gold shrink-0 mt-1" />
                <span>{BUSINESS_INFO.hours}<br /><span className="text-xs text-luxury-champagne/65">{BUSINESS_INFO.hoursNote}</span></span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="font-bold text-xs uppercase tracking-widest text-luxury-ivory">Services</p>
            <div className="space-y-4 text-sm text-luxury-champagne">
              <a href="#services" className="block hover:text-luxury-gold transition-colors">Haircuts &amp; Styling</a>
              <a href="#services" className="block hover:text-luxury-gold transition-colors">L&apos;Oréal Colour &amp; Balayage</a>
              <a href="#services" className="block hover:text-luxury-gold transition-colors">Keratin &amp; Hair Spa</a>
              <a href="#services" className="block hover:text-luxury-gold transition-colors">Skin &amp; Bridal Makeovers</a>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-20 border-t border-luxury-champagne/15 text-luxury-champagne/55 text-[10px] uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} FLORAISON, Agartala. All Rights Reserved.
        </div>
      </footer>

      {/* --- Sticky Botom CTA --- */}
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

      {/* --- AI Salon Concierge Chatbot --- */}
      <SalonChatbot
        isOpen={isChatOpen}
        onToggle={setIsChatOpen}
        onBookFromChat={handleBookRecommendation}
      />
    </div>
  );
}


// --- Small UI Helper ---
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", className)}>
    {children}
  </div>
);
