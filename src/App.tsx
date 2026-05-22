import React, { useState } from 'react';
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
  Instagram,
  Facebook
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Constants ---
const TRUST_SIGNALS = [
  { text: '500+ Happy Clients', icon: <Star className="w-4 h-4 text-luxury-gold" /> },
  { text: 'Certified Stylists', icon: <ShieldCheck className="w-4 h-4 text-luxury-gold" /> },
  { text: '5-Star Rated', icon: <Sparkles className="w-4 h-4 text-luxury-gold" /> },
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
  href
}: { 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary', 
  className?: string,
  onClick?: () => void,
  href?: string
}) => {
  const baseStyles = 'relative overflow-hidden px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center';
  const primaryStyles = 'bg-luxury-gold text-luxury-black shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]';
  const secondaryStyles = 'border border-luxury-gold/50 text-luxury-gold bg-transparent hover:bg-luxury-gold/10';
  
  const styles = cn(baseStyles, variant === 'primary' ? primaryStyles : secondaryStyles, className);
  
  if (href) {
    return (
      <a href={href} className={styles}>
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

export default function IndulgeLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', service: 'Consultation', time: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, send this to a backend
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-white overflow-x-hidden">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-luxury-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold tracking-tighter gold-gradient-text">INDULGE</span>
            <span className="text-[10px] uppercase tracking-[3px] border-l border-luxury-gold/30 pl-3 ml-1 opacity-50">Studio</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#experiences" className="text-xs uppercase tracking-widest hover:text-luxury-gold transition-colors">Experience</a>
            <a href="#offer" className="text-xs uppercase tracking-widest hover:text-luxury-gold transition-colors">The Offer</a>
            <a href="#testimonials" className="text-xs uppercase tracking-widest hover:text-luxury-gold transition-colors">Stories</a>
            <LuxuryButton href="#booking" variant="secondary" className="px-6 py-2 py-3 text-[10px]">Book Now</LuxuryButton>
          </div>

          <button className="md:hidden text-luxury-gold" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
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
              <a href="#offer" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">The Offer</a>
              <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif">Stories</a>
              <LuxuryButton href="#booking" onClick={() => setIsMenuOpen(false)}>Book Free Consultation</LuxuryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover opacity-30 scale-105 animate-[pulse_10s_infinite]"
            alt="Luxury Salon Interior"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/30 via-luxury-black/20 to-luxury-black" />
        </div>

        <div className="section-container relative z-10 text-center md:text-left grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 mb-6">
              <Sparkles className="w-3 h-3 text-luxury-gold" />
              <span className="text-[10px] uppercase tracking-[2px] font-bold text-luxury-gold">Premiere Transformation Studio</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-bold leading-[1.1] mb-8">
              Look Stunning. <br />
              <span className="gold-gradient-text italic">Feel Confident.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-light max-w-xl mb-10 leading-relaxed">
              Luxury Hair & Spa Experience | Personalized Styling | Free Consultation. 
              Only turn heads when you walk into the room.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <LuxuryButton href="#booking" className="flex items-center justify-center gap-2">
                Claim Free Consultation <ArrowRight className="w-4 h-4" />
              </LuxuryButton>
              <LuxuryButton href="https://wa.me/your-number" variant="secondary" className="flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </LuxuryButton>
            </div>

            <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-8 opacity-70">
              {TRUST_SIGNALS.map((signal, i) => (
                <div key={i} className="flex items-center gap-2">
                  {signal.icon}
                  <span className="text-[10px] uppercase tracking-widest font-medium">{signal.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
             <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <img 
                  src="https://images.unsplash.com/photo-1620331311520-246422ff83f9?auto=format&fit=crop&q=80&w=800&h=1000" 
                  alt="Model styling"
                  className="w-full transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8 text-left">
                  <p className="font-serif italic text-2xl text-luxury-gold">"The Indulge Glow"</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-60">Hand-crafted Excellence</p>
                </div>
             </div>
             {/* Decorative Elements */}
             <div className="absolute -top-6 -right-6 w-32 h-32 border border-luxury-gold/20 rounded-full animate-float" />
             <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </header>

      {/* --- Problem Section --- */}
      <section className="bg-white/[0.02] border-y border-white/5 py-32">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif font-bold">
                Still Not Happy With <br />
                <span className="italic opacity-50">Your Look?</span>
              </h2>
              <div className="space-y-6">
                {PAIN_POINTS.map((point, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-luxury-gold transition-colors">
                      <X className="w-4 h-4 text-white/30 group-hover:text-luxury-gold" />
                    </div>
                    <p className="text-white/70 text-lg leading-snug pt-2">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card flex flex-col justify-center text-center p-12 border-luxury-gold/20 bg-luxury-gold/[0.02]">
              <Sparkles className="w-12 h-12 text-luxury-gold mx-auto mb-6" />
              <h3 className="text-3xl font-serif mb-6 italic">Shift the Narrative</h3>
              <p className="text-xl text-white/80 leading-relaxed">
                What if one visit could change how you look… and how you feel about yourself?
              </p>
              <div className="mt-10 h-px bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent" />
              <p className="mt-10 text-sm uppercase tracking-[0.2em] text-luxury-gold font-bold">Your Reveal Starts Here</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Experiences Section --- */}
      <section id="experiences" className="py-32 relative overflow-hidden">
        <div className="absolute -right-64 top-0 w-[800px] h-[800px] bg-luxury-gold/[0.03] rounded-full blur-[100px]" />
        
        <div className="section-container relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <p className="text-luxury-gold font-bold uppercase tracking-[0.3em] text-xs mb-4">Outcome-Driven Artistry</p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold">What You’ll Experience at Indulge</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EXPERIENCES.map((exp, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card group"
              >
                <div className="text-4xl mb-6">{exp.icon}</div>
                <h4 className="text-xl font-bold mb-4 group-hover:text-luxury-gold transition-colors">{exp.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{exp.desc}</p>
                <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Premium Quality</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Offer Section --- */}
      <section id="offer" className="py-32">
        <div className="section-container">
          <div className="relative rounded-[40px] overflow-hidden bg-luxury-gold p-1 md:p-2">
            <div className="bg-luxury-black rounded-[36px] px-8 py-20 md:p-24 text-center border border-white/10 relative overflow-hidden">
               {/* Background Texture */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
               
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
               >
                 <Badge className="bg-luxury-gold text-luxury-black inline-block px-6 py-2 rounded-full font-bold uppercase tracking-[0.2em] text-xs mb-8">
                   Limited Time Offer
                 </Badge>
                 <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                   Free Consultation 
                   <span className="block text-2xl md:text-3xl italic text-luxury-gold mt-2">(Worth ₹999)</span>
                 </h2>
                 <p className="text-white/60 max-w-2xl mx-auto mb-12 text-lg">
                   Sit down with our master stylists for a personalized hair & skin deep-dive. 
                   Get a style roadmap tailored to your specific facial structure and lifestyle.
                 </p>
                 
                 <div className="flex flex-wrap justify-center gap-12 mb-12 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-luxury-gold/30 flex items-center justify-center text-luxury-gold"><Check className="w-5 h-5"/></div>
                      <div>
                        <p className="font-bold">Personalized Assessment</p>
                        <p className="text-[10px] uppercase tracking-widest opacity-50">Hair & Skin Profile</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-luxury-gold/30 flex items-center justify-center text-luxury-gold"><Check className="w-5 h-5"/></div>
                      <div>
                        <p className="font-bold">Style Roadmap</p>
                        <p className="text-[10px] uppercase tracking-widest opacity-50">Customized Recommendations</p>
                      </div>
                    </div>
                 </div>

                 <LuxuryButton href="#booking" className="text-xl px-12 py-6">Claim Your Free Consultation</LuxuryButton>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="py-32 bg-white/[0.02]">
        <div className="section-container">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-serif font-bold mb-4">Your Path to Radiance</h2>
            <p className="text-white/40 uppercase tracking-widest text-xs">Transform in 3 Simple Steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[60px] left-1/4 right-1/4 h-[1px] border-t border-dashed border-luxury-gold/30 -z-10" />
            
            {[
              { step: "01", title: "Book Your Slot", desc: "Choose your convenient time online or via WhatsApp." },
              { step: "02", title: "Visit & Consult", desc: "Experience our studio and get expert advice tailored to you." },
              { step: "03", title: "Transform Your Look", desc: "Our specialists execute with precision. Experience the upgrade instantly." },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-6">
                <div className="w-32 h-32 rounded-full border border-luxury-gold/20 bg-luxury-black flex items-center justify-center mx-auto shadow-xl">
                  <span className="text-4xl font-serif font-bold gold-gradient-text">{item.step}</span>
                </div>
                <h4 className="text-xl font-bold">{item.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed max-w-[250px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Authority Section --- */}
      <section className="py-32 border-b border-white/5">
        <div className="section-container grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover"
              alt="Expert Stylist"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-luxury-gold/90 flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                   <Scissors className="w-10 h-10 text-luxury-black" />
                </div>
                <p className="text-white font-serif italic text-2xl">Craftsmanship</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <p className="text-luxury-gold font-bold uppercase tracking-[0.2em] text-xs">Authority & Expertise</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Experts Who Understand <br /> <span className="italic">Your Unique Style</span></h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0"><Star className="text-luxury-gold w-6 h-6"/></div>
                <div>
                  <p className="font-bold text-lg">Certified Professional Stylists</p>
                  <p className="text-white/50">Trained in the latest global trends and techniques.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0"><Check className="text-luxury-gold w-6 h-6"/></div>
                <div>
                  <p className="font-bold text-lg">Transformation Specialists</p>
                  <p className="text-white/50">We don't just provide services; we craft new identities.</p>
                </div>
              </div>
            </div>
            <p className="text-white/40 italic">✨ Not just service providers — transformation specialists.</p>
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section id="testimonials" className="py-32">
        <div className="section-container">
          <div className="text-center mb-24">
             <h2 className="text-4xl font-serif font-bold mb-4">Stories of Confidence</h2>
             <div className="flex justify-center gap-1">
               {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-luxury-gold text-luxury-gold" />)}
             </div>
             <p className="mt-4 text-[10px] uppercase tracking-widest text-white/40">Verified Indulge Experiences</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass-card border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all">
                <div className="mb-6"><MessageCircle className="w-10 h-10 text-luxury-gold/20" /></div>
                <p className="text-xl font-serif italic mb-8 leading-relaxed">“{t.quote}”</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-luxury-gold/20" />
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Booking Section --- */}
      <section id="booking" className="py-32 relative">
        <div className="absolute inset-0 bg-luxury-gold/5 -z-10" />
        <div className="section-container max-w-5xl">
          <div className="glass-card p-12 md:p-20 border-luxury-gold/20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Secure Your Slot Now</h2>
              <div className="flex items-center justify-center gap-2 text-luxury-gold font-bold text-xs uppercase tracking-widest">
                <Calendar className="w-4 h-4" /> Limited slots available today
              </div>
            </div>

            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-luxury-gold/20 flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-luxury-gold" />
                </div>
                <h3 className="text-2xl font-serif">Consultation Secured!</h3>
                <p className="text-white/60">Our concierge will contact you within the next 15 minutes to confirm your preferred session time.</p>
                <LuxuryButton variant="secondary" onClick={() => setIsSubmitted(false)}>Back to site</LuxuryButton>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter your name" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-luxury-gold/50 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+91 00000 00000" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-luxury-gold/50 outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Preferred Service</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-luxury-gold/50 outline-none transition-all appearance-none"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                  >
                    <option className="bg-luxury-black">Free Consultation</option>
                    <option className="bg-luxury-black">Hair Styling</option>
                    <option className="bg-luxury-black">Spa & Massage</option>
                    <option className="bg-luxury-black">Bridal Makeup</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Preferred Time</label>
                  <input 
                    required
                    type="datetime-local" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-luxury-gold/50 outline-none transition-all"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 pt-6">
                  <LuxuryButton className="w-full text-lg py-5">Secure My Slot Now</LuxuryButton>
                  <p className="mt-4 text-center text-[10px] opacity-40 uppercase tracking-widest">No credit card required. Pure transformation.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* --- Scarcity Section --- */}
      <section className="py-24 border-t border-white/5">
        <div className="section-container text-center">
           <Zap className="w-10 h-10 text-luxury-gold mx-auto mb-6 animate-pulse" />
           <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Only 4 Consultation Slots Left This Week</h2>
           <p className="text-white/40 mb-10 max-w-xl mx-auto">High demand. Limited availability. Don’t delay your glow-up. Your future best self is waiting.</p>
           <LuxuryButton href="#booking" className="px-12">Claim Your Slot Before It's Gone</LuxuryButton>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white/[0.01] pt-32 pb-40 border-t border-white/5">
        <div className="section-container grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-serif font-bold gold-gradient-text">INDULGE</span>
            </div>
            <p className="text-white/50 max-w-md leading-relaxed">
              We provide world-class hair, spa, and bridal services that bridge the gap between beauty and confidence.
              Experience the pinnacle of luxury styling.
            </p>
            <div className="flex gap-6">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-colors"><Instagram size={18}/></a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-colors"><Facebook size={18}/></a>
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="font-bold text-xs uppercase tracking-widest">Connect</p>
            <div className="space-y-4 text-sm text-white/50">
              <p className="flex items-center gap-3"><MapPin size={14} className="text-luxury-gold"/> Luxury Row, Design District</p>
              <p className="flex items-center gap-3"><Phone size={14} className="text-luxury-gold"/> +91 99999 88888</p>
              <p className="flex items-center gap-3"><Calendar size={14} className="text-luxury-gold"/> Tue - Sun: 10AM - 9PM</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="font-bold text-xs uppercase tracking-widest">Legal</p>
            <div className="space-y-4 text-sm text-white/50">
              <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block hover:text-white transition-colors">Safety Standards</a>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-20 border-t border-white/5 opacity-20 text-[10px] uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} INDULGE THE SALON. All Rights Reserved.
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
        href="https://wa.me/your-number" 
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce md:animate-none group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
          Need Help? Chat Now
        </span>
      </a>
    </div>
  );
}


// --- Small UI Helper ---
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", className)}>
    {children}
  </div>
);
