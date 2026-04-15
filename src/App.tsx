import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Scissors,
  Heart,
  Award,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { format, addDays, startOfToday, isBefore, isSameDay } from 'date-fns';
import { db, auth } from './lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';
import { ScrollArea } from '../components/ui/scroll-area';
import { cn } from '../lib/utils';

// --- Constants & Data ---

const SERVICES = [
  {
    id: 'thai-massage',
    name: 'Thai Massage',
    category: 'spa',
    description: 'Traditional therapeutic massage for deep relaxation and flexibility.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    price: '₹1,499'
  },
  {
    id: 'aromatherapy',
    name: 'Aromatherapy',
    category: 'spa',
    description: 'Essential oils blended to soothe your senses and rejuvenate your skin.',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=800',
    price: '₹1,299'
  },
  {
    id: 'hair-styling',
    name: 'Hair Styling & Keratin',
    category: 'salon',
    description: 'Expert hair transformations and premium keratin treatments.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
    price: '₹2,499'
  },
  {
    id: 'bridal-makeup',
    name: 'Bridal Makeup',
    category: 'salon',
    description: 'Flawless, long-lasting makeup for your special day.',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=800',
    price: '₹9,999'
  },
  {
    id: 'facial-luxury',
    name: 'Luxury Facial',
    category: 'salon',
    description: 'Deep cleansing and hydration for a radiant, youthful glow.',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
    price: '₹1,999'
  },
  {
    id: 'mani-pedi',
    name: 'Manicure & Pedicure',
    category: 'salon',
    description: 'Complete hand and foot care with premium products.',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=800',
    price: '₹899'
  }
];

const TEAM = [
  {
    name: 'Sarah D.',
    role: 'Master Stylist',
    specialization: 'Hair Expert',
    experience: '8+ years',
    bio: 'Specializes in high-fashion cuts and advanced color techniques.',
    image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Priya K.',
    role: 'Senior Makeup Artist',
    specialization: 'Bridal Expert',
    experience: '6+ years',
    bio: 'Helping brides achieve their dream look with precision and care.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Anjali M.',
    role: 'Lead Therapist',
    specialization: 'Spa Specialist',
    experience: '10+ years',
    bio: 'Expert in traditional Thai and deep tissue massage therapies.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
  }
];

const TESTIMONIALS = [
  {
    name: 'Riya Sharma',
    text: 'The best salon experience in Agartala! The staff is incredibly professional and the ambiance is so luxurious.',
    rating: 5
  },
  {
    name: 'Amit Das',
    text: 'Had a Thai massage here and it was life-changing. Truly a premium experience at a great value.',
    rating: 5
  },
  {
    name: 'Sneha Roy',
    text: 'My bridal makeup was exactly what I wanted. Flawless and lasted all night. Thank you Elixir Touch!',
    rating: 5
  }
];

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', 
  '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
];

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Team', href: '#team' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500",
      scrolled ? "bg-luxury-wine/90 backdrop-blur-lg py-4 shadow-xl" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-black font-serif font-bold text-xl">E</div>
          <span className="font-serif text-2xl font-bold tracking-tight text-luxury-gold">Elixir Touch</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium hover:text-luxury-gold transition-colors tracking-wide uppercase"
            >
              {link.name}
            </a>
          ))}
          <Button className="bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90 gold-glow rounded-full px-6" asChild>
            <a href="#booking">Book Now</a>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-luxury-gold" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-luxury-black/95 backdrop-blur-xl border-t border-white/10 md:hidden py-8 px-6 flex flex-col gap-6 items-center"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-xl font-serif hover:text-luxury-gold transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Button className="w-full bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90 rounded-full py-6 text-lg" asChild>
              <a href="#booking" onClick={() => setIsOpen(false)}>Book Appointment</a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-luxury-wine/30 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-wine/70 via-luxury-wine/50 to-luxury-wine z-10"></div>
        <iframe 
          src="https://www.youtube.com/embed/F4C4VBIJuQY?autoplay=1&mute=1&controls=0&loop=1&playlist=F4C4VBIJuQY&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&enablejsapi=1"
          className="w-[300%] h-[300%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-70"
          allow="autoplay; encrypted-media"
          title="Luxury Salon Background"
        ></iframe>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="bg-luxury-gold/20 text-luxury-gold border-luxury-gold/30 mb-6 px-4 py-1 text-sm uppercase tracking-widest">
            Premium Beauty & Wellness
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-tight">
            Your Best Look Isn’t a Dream. <br />
            <span className="text-luxury-gold italic">It’s One Appointment Away.</span>
          </h1>
          <p className="text-lg md:text-xl text-luxury-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Expert stylists, premium care, and real transformations that you can see and feel from the very first visit.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            <Button size="lg" className="bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90 gold-glow rounded-full px-10 py-7 text-lg font-bold group" asChild>
              <a href="#booking">
                Book Your Appointment
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <div className="flex items-center gap-3 text-luxury-white/60">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-luxury-wine bg-luxury-black flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium">⭐ Rated 4.9 by 300+ happy clients</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-luxury-gold/50"
      >
        <div className="w-6 h-10 border-2 border-luxury-gold/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-luxury-gold rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-luxury-black/30">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-columns-2 gap-16 items-center">
        <div className="relative">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000" 
              alt="Salon Interior" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-2xl overflow-hidden border-8 border-luxury-wine hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=500" 
              alt="Styling" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-luxury-gold uppercase tracking-widest text-sm font-bold">Our Story</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Agartala's Premier Destination for <span className="italic">Luxury Beauty</span>
            </h3>
          </div>
          <p className="text-luxury-white/70 text-lg leading-relaxed">
            At Elixir Touch Salon, we believe that beauty is an experience, not just a service. Located in the heart of Agartala, we've created a sanctuary where modern techniques meet personalized care.
          </p>
          <p className="text-luxury-white/70 text-lg leading-relaxed">
            Our team of certified professionals is dedicated to helping you discover your most confident self. From transformative hair styling to soul-soothing spa therapies, every detail is designed for your ultimate comfort and satisfaction.
          </p>
          
          <div className="grid grid-cols-2 gap-8 pt-6">
            <div className="space-y-2">
              <h4 className="text-3xl font-serif font-bold text-luxury-gold">500+</h4>
              <p className="text-sm text-luxury-white/50 uppercase tracking-wider">Happy Clients</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-serif font-bold text-luxury-gold">10+</h4>
              <p className="text-sm text-luxury-white/50 uppercase tracking-wider">Expert Stylists</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'spa' | 'salon'>('all');

  const filteredServices = activeCategory === 'all' 
    ? SERVICES 
    : SERVICES.filter(s => s.category === activeCategory);

  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-luxury-gold uppercase tracking-widest text-sm font-bold">Our Services</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold">Exquisite Care for You</h3>
          <div className="flex justify-center gap-4 mt-8">
            {['all', 'spa', 'salon'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all uppercase tracking-widest border",
                  activeCategory === cat 
                    ? "bg-luxury-gold text-luxury-black border-luxury-gold" 
                    : "bg-transparent text-luxury-white/60 border-white/10 hover:border-luxury-gold/50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="luxury-card h-full flex flex-col group">
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-luxury-black/60 backdrop-blur-md text-luxury-gold border-luxury-gold/30">
                        {service.price}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-xl font-serif font-bold mb-2 group-hover:text-luxury-gold transition-colors">{service.name}</h4>
                      <p className="text-luxury-white/60 text-sm leading-relaxed mb-6">
                        {service.description}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-full" asChild>
                      <a href="#booking">Book Now</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const features = [
    { icon: <Award className="text-luxury-gold" />, title: "Expert & Certified", desc: "Our team consists of industry-leading professionals." },
    { icon: <ShieldCheck className="text-luxury-gold" />, title: "Premium Hygiene", desc: "We follow strict medical-grade sterilization protocols." },
    { icon: <Heart className="text-luxury-gold" />, title: "Personalized Care", desc: "Every treatment is tailored to your unique needs." },
    { icon: <Sparkles className="text-luxury-gold" />, title: "Modern Techniques", desc: "We use the latest equipment and global beauty trends." }
  ];

  return (
    <section className="py-24 bg-luxury-black/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-luxury-gold uppercase tracking-widest text-sm font-bold">Why Choose Us</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold">The Elixir Touch <span className="italic">Experience</span></h3>
            </div>
            <p className="text-luxury-white/70 text-lg">
              We don't just provide services; we deliver transformations. Our commitment to excellence has made us the most trusted salon in Agartala.
            </p>
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    {f.icon}
                  </div>
                  <h4 className="font-serif font-bold text-xl">{f.title}</h4>
                  <p className="text-sm text-luxury-white/50 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000" 
              alt="Luxury Spa" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-wine/60 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Team = () => {
  return (
    <section id="team" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-luxury-gold uppercase tracking-widest text-sm font-bold">Our Experts</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold">Meet the Artists</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TEAM.map((member, i) => (
            <Card key={i} className="luxury-card group">
              <div className="aspect-[4/5] overflow-hidden relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge className="bg-luxury-gold text-luxury-black mb-2">{member.role}</Badge>
                  <h4 className="text-2xl font-serif font-bold text-white">{member.name}</h4>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-luxury-gold font-medium">{member.specialization}</span>
                  <span className="text-luxury-white/40">{member.experience}</span>
                </div>
                <p className="text-sm text-luxury-white/60 italic leading-relaxed">
                  "{member.bio}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const BookingSection = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [service, setService] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !service || !time || !formData.fullName || !formData.phoneNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // 1. Save to Firestore (Internal Record)
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        service,
        timeSlot: time,
        date: format(date, 'yyyy-MM-dd'),
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // 2. Send to Formspree (Email Notification)
      const response = await fetch('https://formspree.io/f/xzdyzaed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          service,
          timeSlot: time,
          date: format(date, 'yyyy-MM-dd'),
          _subject: `New Appointment: ${formData.fullName} - ${service}`
        })
      });

      if (!response.ok) throw new Error('Formspree submission failed');

      toast.success("Your appointment request has been received. We will confirm your booking shortly.");
      // Reset form
      setFormData({ fullName: '', phoneNumber: '', email: '', notes: '' });
      setService('');
      setTime('');
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="py-24 bg-luxury-black/30">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-luxury-gold uppercase tracking-widest text-sm font-bold">Reservations</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold">Book Your Transformation</h3>
          <p className="text-luxury-white/60 max-w-xl mx-auto">
            Experience the pinnacle of beauty and wellness. Select your preferred date and service below.
          </p>
        </div>

        <Card className="luxury-card border-luxury-gold/20 overflow-hidden">
          <div className="grid lg:grid-cols-5">
            {/* Left Side: Calendar */}
            <div className="lg:col-span-2 bg-luxury-black/40 p-6 border-r border-white/5">
              <Label className="text-luxury-gold uppercase tracking-widest text-xs mb-4 block">1. Select Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => isBefore(date, startOfToday())}
                className="rounded-md border-none bg-transparent text-white"
              />
            </div>

            {/* Right Side: Form */}
            <div className="lg:col-span-3 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-xs uppercase tracking-widest text-luxury-white/60">2. Select Service</Label>
                    <Select value={service} onValueChange={setService}>
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-luxury-gold">
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent className="bg-luxury-black border-white/10 text-white">
                        {SERVICES.map(s => (
                          <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-xs uppercase tracking-widest text-luxury-white/60">3. Select Time</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-luxury-gold">
                        <SelectValue placeholder="Choose a slot" />
                      </SelectTrigger>
                      <SelectContent className="bg-luxury-black border-white/10 text-white">
                        {TIME_SLOTS.map(slot => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-white/5" />

                <div className="space-y-4">
                  <Label className="text-xs uppercase tracking-widest text-luxury-white/60">4. Personal Details</Label>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Input 
                        placeholder="Full Name" 
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-luxury-gold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Phone Number" 
                        value={formData.phoneNumber}
                        onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-luxury-gold"
                        required
                      />
                    </div>
                  </div>
                  <Input 
                    placeholder="Email Address (Optional)" 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-luxury-gold"
                  />
                  <textarea 
                    placeholder="Notes / Special Requests (Optional)"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-24 focus:ring-luxury-gold focus:outline-none transition-all"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90 h-14 rounded-xl text-lg font-bold gold-glow"
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </Button>
                <p className="text-center text-xs text-luxury-white/40">
                  By booking, you agree to our terms and conditions.
                </p>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-luxury-gold uppercase tracking-widest text-sm font-bold">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold">Client Experiences</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} className="luxury-card p-8 space-y-6">
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-luxury-gold text-luxury-gold" />
                ))}
              </div>
              <p className="text-lg italic text-luxury-white/80 leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-bold">
                  {t.name[0]}
                </div>
                <span className="font-serif font-bold">{t.name}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1595475243692-392820991677?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <section id="gallery" className="py-24 bg-luxury-black/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-luxury-gold uppercase tracking-widest text-sm font-bold">Gallery</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold">Our Aesthetic Space</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="aspect-square rounded-xl overflow-hidden border border-white/5"
            >
              <img 
                src={img} 
                alt={`Gallery ${i}`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-luxury-gold uppercase tracking-widest text-sm font-bold">Contact Us</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold">Visit Our Sanctuary</h3>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-luxury-gold" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl mb-2">Location</h4>
                  <p className="text-luxury-white/60">
                    Agartala, Tripura, India <br />
                    Near City Center, Pin: 799001
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                  <Phone className="text-luxury-gold" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl mb-2">Phone</h4>
                  <p className="text-luxury-white/60">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                  <Clock className="text-luxury-gold" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl mb-2">Hours</h4>
                  <p className="text-luxury-white/60">Mon - Sun: 10:00 AM - 08:00 PM</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full px-8 h-12 flex gap-2 items-center">
                <MessageSquare size={20} />
                WhatsApp Us
              </Button>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/10 h-[450px] relative">
            {/* Placeholder for Map */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14594.123456789!2d91.28!3d23.83!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ5JzQ4LjAiTiA5McKwMTYnNDguMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-luxury-black py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 space-y-6">
            <a href="#" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-black font-serif font-bold text-xl">E</div>
              <span className="font-serif text-2xl font-bold tracking-tight text-luxury-gold">Elixir Touch</span>
            </a>
            <p className="text-luxury-white/50 max-w-sm leading-relaxed">
              Agartala's premier luxury salon and spa destination. We bring global beauty standards to your doorstep with expert care and premium products.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-serif font-bold text-lg">Quick Links</h4>
            <ul className="space-y-4 text-luxury-white/50 text-sm">
              <li><a href="#" className="hover:text-luxury-gold transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-luxury-gold transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-luxury-gold transition-colors">Services</a></li>
              <li><a href="#booking" className="hover:text-luxury-gold transition-colors">Book Appointment</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-serif font-bold text-lg">Contact</h4>
            <ul className="space-y-4 text-luxury-white/50 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="text-luxury-gold shrink-0" />
                Agartala, Tripura, India
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-luxury-gold shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="text-luxury-gold shrink-0" />
                hello@elixirtouch.com
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/5 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-luxury-white/30 uppercase tracking-widest">
          <p>© 2024 Elixir Touch Salon. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-luxury-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-luxury-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-luxury-wine selection:bg-luxury-gold selection:text-luxury-black">
      <Toaster position="top-center" richColors />
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Offer Banner */}
        <div className="bg-luxury-gold text-luxury-black py-4 overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-8 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <Sparkles size={16} />
                ₹200 OFF on your first visit • Limited slots available today • Book Now
              </span>
            ))}
          </div>
        </div>

        <About />
        <Services />
        <WhyChooseUs />
        <Team />
        <BookingSection />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>

      <Footer />

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-40">
        <Button className="w-full bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90 h-14 rounded-full font-bold shadow-2xl gold-glow" asChild>
          <a href="#booking">Book Appointment</a>
        </Button>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
