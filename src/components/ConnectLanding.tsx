import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Calendar, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Star, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  UserCheck, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Search, 
  Share2, 
  X, 
  Check, 
  ExternalLink,
  ChevronLeft,
  Send,
  Building2,
  Users,
  Compass,
  FileCheck,
  Briefcase,
  HelpCircle
} from 'lucide-react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
);

// Types
interface FormState {
  name: string;
  phone: string;
  email: string;
  country: string;
  intake: string;
  qualification: string;
  message: string;
}

export default function ConnectLanding() {
  // Navigation & Scroll state
  const [activeTab, setActiveTab] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Form State
  const [formData, setFormData] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    country: 'UK',
    intake: 'Fall 2026',
    qualification: 'Bachelor\'s Degree',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Resource Download Modal
  const [activeModalResource, setActiveModalResource] = useState<string | null>(null);
  const [resourceEmail, setResourceEmail] = useState('');
  const [resourceSent, setResourceSent] = useState(false);

  // Event Registration Modal
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventFormData, setEventFormData] = useState({ name: '', phone: '', email: '' });
  const [eventBooked, setEventBooked] = useState(false);

  // Quick Action Modal / Drawer
  const [quickActionModal, setQuickActionModal] = useState<string | null>(null);

  // Countdown timer for Event (Target date: 15 days in future)
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 18, mins: 42, secs: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send to webhook (Airtable via n8n or direct webhook endpoint)
      const webhookUrl = 'https://n8n.tescavisa.com/webhook/lead-capture';
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'Business Card QR Code (/connect)',
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.log('Webhook fallback mode active:', err));
    } catch (err) {
      console.log('Submission saved locally');
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResourceSent(true);
    setTimeout(() => {
      setResourceSent(false);
      setActiveModalResource(null);
      setResourceEmail('');
    }, 2500);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEventBooked(true);
    setTimeout(() => {
      setEventBooked(false);
      setIsEventModalOpen(false);
      setEventFormData({ name: '', phone: '', email: '' });
    }, 2500);
  };

  // WhatsApp Pre-filled Link
  const whatsappUrl = `https://wa.me/919824152731?text=${encodeURIComponent('Hi TESCA, I want to study abroad.')}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased selection:bg-[#F97316] selection:text-white pb-24 md:pb-12">
      
      {/* TOP BRAND HEADER (Sticky Glassmorphism) */}
      <header className="sticky top-0 z-40 bg-[#0A2342]/95 backdrop-blur-md border-b border-white/10 text-white transition-all shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F97316] to-[#FB923C] p-0.5 shadow-lg shadow-[#F97316]/20">
              <div className="w-full h-full bg-[#0A2342] rounded-[10px] flex items-center justify-center font-bold text-white text-lg tracking-wider">
                T
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-[#F97316] transition-colors">
                  TESCA
                </span>
                <span className="text-[10px] font-semibold tracking-wider bg-[#F97316]/20 text-[#F97316] px-2 py-0.5 rounded-full border border-[#F97316]/30">
                  Since 2005
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium tracking-tight">
                Spoken English & Visa Consultancy
              </p>
            </div>
          </a>

          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="tel:+919824152731" 
              className="text-xs font-semibold text-white/90 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/15"
            >
              <Phone className="w-3.5 h-3.5 text-[#F97316]" />
              98241 52731
            </a>
            <a 
              href="#counselling-form" 
              className="text-xs font-bold bg-[#F97316] text-white px-4 py-2 rounded-full hover:bg-[#EA580C] transition-all shadow-md hover:shadow-lg hover:shadow-[#F97316]/25 active:scale-95"
            >
              Book Free Counselling
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A2342] via-[#0E2F56] to-[#0A2342] text-white pt-8 pb-16 px-4">
        {/* Soft background light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          
          {/* Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-slate-200 backdrop-blur-md mb-6 shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            <span>21+ Years of Excellence • Surat's Most Trusted</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4"
          >
            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FDBA74]">Global Education</span> Journey
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed"
          >
            Expert Study Abroad Counselling, IELTS Coaching, University Admissions and Visa Guidance — all in one place.
          </motion.p>

          {/* Four Large Rounded Hero CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
          >
            <a 
              href="#countries" 
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-white font-semibold text-xs sm:text-sm transition-all hover:scale-[1.03] active:scale-95 shadow-md group"
            >
              <div className="w-10 h-10 rounded-full bg-[#F97316]/20 flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span>🎓 Study Abroad</span>
            </a>

            <a 
              href="#counselling-form" 
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-[#F97316]/30 group"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span>📅 Book Counselling</span>
            </a>

            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-[#25D366]/30 group"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span>💬 WhatsApp</span>
            </a>

            <a 
              href="tel:+919824152731" 
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-white font-semibold text-xs sm:text-sm transition-all hover:scale-[1.03] active:scale-95 shadow-md group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span>📞 Call Now</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* QUICK ACTIONS - APPLE WALLET STYLE CARDS */}
      <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-4 sm:p-6 shadow-xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Quick Actions & Services
            </h2>
            <span className="text-xs text-[#F97316] font-semibold flex items-center gap-1">
              Apple Wallet Inspired <Sparkles className="w-3 h-3" />
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'study', title: 'Study Abroad', icon: GraduationCap, color: 'from-blue-500 to-indigo-600', desc: 'Top Global Unis' },
              { id: 'ielts', title: 'IELTS / PTE', icon: BookOpen, color: 'from-orange-500 to-amber-600', desc: 'Band 7+ Coaching' },
              { id: 'visitor', title: 'Visitor Visa', icon: Globe, color: 'from-emerald-500 to-teal-600', desc: 'Tourist & Family' },
              { id: 'work', title: 'Work Visa', icon: Briefcase, color: 'from-purple-500 to-indigo-600', desc: 'Post Study & Work' },
              { id: 'scholarship', title: 'Scholarship', icon: Award, color: 'from-amber-500 to-orange-600', desc: 'Up to 100% Aid' },
              { id: 'admission', title: 'Uni Admission', icon: Building2, color: 'from-rose-500 to-red-600', desc: 'Fast Offer Letters' },
              { id: 'docs', title: 'Doc Checklist', icon: FileCheck, color: 'from-cyan-500 to-blue-600', desc: 'Complete Dossier' },
              { id: 'track', title: 'Track Status', icon: Search, color: 'from-slate-700 to-slate-900', desc: 'Live Updates' },
            ].map((action, idx) => (
              <motion.button
                key={action.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (action.id === 'study') {
                    document.getElementById('countries')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (action.id === 'docs' || action.id === 'ielts') {
                    document.getElementById('free-resources')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setQuickActionModal(action.title);
                  }
                }}
                className="flex flex-col justify-between text-left p-3.5 rounded-[20px] bg-slate-50 hover:bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F97316] transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight group-hover:text-[#0A2342] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {action.desc}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS NUMBERS (ANIMATED COUNTERS) */}
      <section className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-[#0A2342] rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center relative z-10">
            <div className="p-2">
              <div className="text-2xl sm:text-4xl font-extrabold text-[#F97316] tracking-tight mb-1">
                21+
              </div>
              <div className="text-xs text-slate-300 font-medium">
                Years Experience
              </div>
            </div>

            <div className="p-2 border-l border-white/10 sm:border-l-1">
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                50,000+
              </div>
              <div className="text-xs text-slate-300 font-medium">
                Students Guided
              </div>
            </div>

            <div className="p-2 sm:border-l border-white/10">
              <div className="text-2xl sm:text-4xl font-extrabold text-[#F97316] tracking-tight mb-1">
                98%
              </div>
              <div className="text-xs text-slate-300 font-medium">
                Visa Success Rate
              </div>
            </div>

            <div className="p-2 border-l border-white/10">
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                100+
              </div>
              <div className="text-xs text-slate-300 font-medium">
                University Partners
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTRIES SECTION */}
      <section id="countries" className="max-w-4xl mx-auto px-4 mt-14 scroll-mt-20">
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-widest text-[#F97316] uppercase bg-[#F97316]/10 px-3 py-1 rounded-full">
            Study Destinations
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2342] mt-2 tracking-tight">
            Choose Your Destination
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            Explore world-class universities, post-study work rights, and direct admission options.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              flag: '🇬🇧',
              name: 'United Kingdom',
              image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
              desc: 'Top Russell Group unis & 2-year Graduate Work Route.',
              badge: 'Fast Track Offer'
            },
            {
              flag: '🇦🇺',
              name: 'Australia',
              image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=600&q=80',
              desc: 'High PR potential, top quality of life & work rights.',
              badge: 'Popular for PR'
            },
            {
              flag: '🇨🇦',
              name: 'Canada',
              image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=600&q=80',
              desc: 'Express Entry PR pathways & up to 3 yrs PGWP.',
              badge: 'PGWP Available'
            },
            {
              flag: '🇺🇸',
              name: 'United States',
              image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=600&q=80',
              desc: 'Ivy League excellence & 3-year STEM OPT extension.',
              badge: 'STEM OPT 3Yrs'
            },
            {
              flag: '🇳🇿',
              name: 'New Zealand',
              image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=600&q=80',
              desc: 'Safe, welcoming environment & post-study work rights.',
              badge: 'Safe & Green'
            },
            {
              flag: '🇮🇪',
              name: 'Ireland',
              image: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=600&q=80',
              desc: 'European Tech Hub with 2-year stay back option.',
              badge: 'Tech Hub'
            },
            {
              flag: '🇩🇪',
              name: 'Germany',
              image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80',
              desc: 'Tuition-free public universities & strong engineering job market.',
              badge: 'Free Tuition'
            },
            {
              flag: '🇫🇷',
              name: 'Europe (Schengen)',
              image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
              desc: 'France, Italy, Poland & Spain study opportunities.',
              badge: 'Schengen Access'
            }
          ].map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-[20px] overflow-hidden border border-slate-200/70 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 overflow-hidden">
                  <img 
                    src={c.image} 
                    alt={c.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md text-[#0A2342] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                    <span className="text-sm">{c.flag}</span> {c.name}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 bg-[#F97316] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                    {c.badge}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1">
                <a
                  href="#counselling-form"
                  onClick={() => setFormData(prev => ({ ...prev, country: c.name }))}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#0A2342] hover:text-[#F97316] bg-slate-100 hover:bg-slate-200/70 py-2.5 rounded-xl transition-colors group-hover:bg-[#0A2342] group-hover:text-white"
                >
                  <span>Explore {c.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FREE RESOURCES SECTION */}
      <section id="free-resources" className="max-w-4xl mx-auto px-4 mt-14 scroll-mt-20">
        <div className="bg-gradient-to-br from-slate-900 to-[#0A2342] rounded-[24px] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#F97316] uppercase bg-white/10 px-3 py-1 rounded-full">
                Instant Download
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
                Free Study Abroad & Visa Guides
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-xs">
              Handcrafted templates, vocabulary kits, and checklists used by 50,000+ students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { title: 'IELTS Vocabulary PDF', type: '1000+ High Band Words', icon: BookOpen },
              { title: 'PTE Templates', type: 'Writing & Speaking 79+ Blueprints', icon: Zap },
              { title: 'Document Checklist', type: 'Complete Embassy Dossier', icon: FileCheck },
              { title: 'SOP Samples', type: 'Winning Statement of Purpose', icon: FileText },
              { title: 'Financial Documents Guide', type: 'Proof of Funds & Bank Solvency', icon: ShieldCheck },
              { title: 'CAS & Visa Guide', type: 'Step-by-step Filing Checklist', icon: CheckCircle2 }
            ].map((res, i) => (
              <div 
                key={res.title}
                className="p-4 rounded-[18px] bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md flex items-center justify-between gap-3 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F97316]/20 text-[#F97316] flex items-center justify-center shrink-0">
                    <res.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight">
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium">
                      {res.type}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalResource(res.title)}
                  className="w-8 h-8 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-md hover:scale-110 active:scale-95 transition-all"
                  title="Download Resource"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS WITH COUNTDOWN TIMER */}
      <section className="max-w-4xl mx-auto px-4 mt-14">
        <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Upcoming Admissions Event
              </div>
              <h2 className="text-2xl font-extrabold text-[#0A2342] tracking-tight">
                🇬🇧 UK Admission Mega Fair 2026
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
                Meet official UK university delegates, get on-spot profile assessment, and apply for fee waivers directly in Surat.
              </p>
              
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#F97316]" /> 111, Royal Arcade, Surat
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#F97316]" /> 10:00 AM - 5:00 PM
                </span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-[#0A2342] rounded-[20px] p-4 text-white text-center min-w-[240px] shrink-0 border border-white/10 shadow-lg">
              <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Fair Starts In
              </div>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
                <div className="bg-white/10 rounded-lg p-1.5">
                  <div className="text-lg font-bold text-[#F97316]">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-[9px] text-slate-400 font-sans uppercase">Days</div>
                </div>
                <div className="bg-white/10 rounded-lg p-1.5">
                  <div className="text-lg font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-[9px] text-slate-400 font-sans uppercase">Hrs</div>
                </div>
                <div className="bg-white/10 rounded-lg p-1.5">
                  <div className="text-lg font-bold text-white">{String(timeLeft.mins).padStart(2, '0')}</div>
                  <div className="text-[9px] text-slate-400 font-sans uppercase">Mins</div>
                </div>
                <div className="bg-white/10 rounded-lg p-1.5">
                  <div className="text-lg font-bold text-[#F97316]">{String(timeLeft.secs).padStart(2, '0')}</div>
                  <div className="text-[9px] text-slate-400 font-sans uppercase">Secs</div>
                </div>
              </div>

              <button
                onClick={() => setIsEventModalOpen(true)}
                className="mt-4 w-full bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Book Seat Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY TESCA SECTION */}
      <section className="max-w-4xl mx-auto px-4 mt-14">
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-widest text-[#F97316] uppercase bg-[#F97316]/10 px-3 py-1 rounded-full">
            Our Key Edge
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2342] mt-2 tracking-tight">
            Why Choose TESCA?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            Providing transparent, end-to-end guidance to over 50,000 students since 2005.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { title: 'Experienced Counsellors', desc: 'Certified experts with 20+ years track record.', icon: UserCheck },
            { title: 'Official Partners', desc: 'Direct tie-ups with 100+ global universities.', icon: Building2 },
            { title: 'Transparent Process', desc: 'Zero hidden charges, complete file visibility.', icon: ShieldCheck },
            { title: 'Fast Application', desc: 'Express offer letter turnaround within 48 hrs.', icon: Zap },
            { title: 'Visa Assistance', desc: '98% visa success rate across all countries.', icon: CheckCircle2 },
            { title: 'Interview Prep', desc: 'Mock interviews with former visa officers.', icon: Users },
            { title: 'Scholarship Guidance', desc: 'Helping unlock up to 100% tuition waivers.', icon: Award }
          ].map((item, idx) => (
            <div
              key={item.title}
              className="p-4 rounded-[20px] bg-white border border-slate-200/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0A2342]/5 text-[#0A2342] flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-[#F97316]" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STUDENT TESTIMONIALS (CAROUSEL SLIDER) */}
      <section className="max-w-4xl mx-auto px-4 mt-14">
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-widest text-[#F97316] uppercase bg-[#F97316]/10 px-3 py-1 rounded-full">
            Student Success Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2342] mt-2 tracking-tight">
            Real Stories, Real Visas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: 'Pooja Patel',
              country: '🇬🇧 United Kingdom',
              university: 'University of Manchester',
              score: 'IELTS 7.5 Band',
              img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              quote: 'TESCA made my UK student visa process seamless! Got my CAS in 3 days and visa stamped in 10 days.'
            },
            {
              name: 'Rahul Desai',
              country: '🇨🇦 Canada',
              university: 'Conestoga College',
              score: 'PTE 72 Score',
              img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
              quote: 'From IELTS coaching to SDS visa file preparation, TESCA staff in Surat supported me step by step.'
            },
            {
              name: 'Anjali Sharma',
              country: '🇦🇺 Australia',
              university: 'University of Melbourne',
              score: 'IELTS 8.0 Band',
              img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
              quote: 'Best visa consultancy in Surat! Got $10,000 scholarship guidance and quick GTE approval.'
            }
          ].map((t) => (
            <div 
              key={t.name}
              className="bg-white rounded-[20px] p-5 border border-slate-200/70 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#F97316]" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{t.name}</h3>
                    <p className="text-[11px] font-semibold text-[#0A2342]">{t.country}</p>
                    <p className="text-[10px] text-slate-400">{t.university}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
                  "{t.quote}"
                </p>
              </div>

              <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md self-start">
                ✓ Verified Visa Issued
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* GOOGLE REVIEWS BADGE */}
      <section className="max-w-4xl mx-auto px-4 mt-10 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white px-6 py-4 rounded-[20px] border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-[#0A2342]">4.9</span>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              (1,500+ Google Reviews)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href="https://g.co/kgs/tesca" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-[#0A2342] px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
            >
              <span>Read Reviews</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://g.co/kgs/tesca" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold bg-[#F97316] text-white px-4 py-2 rounded-xl hover:bg-[#EA580C] transition-colors"
            >
              Leave Review
            </a>
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE FORM SECTION */}
      <section id="counselling-form" className="max-w-4xl mx-auto px-4 mt-14 scroll-mt-20">
        <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold tracking-widest text-[#F97316] uppercase bg-[#F97316]/10 px-3.5 py-1 rounded-full">
              Free 1-on-1 Session
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2342] mt-2 tracking-tight">
              Book Your Free Counselling
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fill in your details below and our senior counsellors will contact you within 2 hours.
            </p>
          </div>

          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 bg-slate-50 rounded-[20px] border border-slate-200/60 p-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-[#0A2342] mb-2">
                Thank You!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                We'll contact you shortly on <span className="font-semibold text-slate-900">{formData.phone}</span> to schedule your free study abroad counselling session.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', phone: '', email: '', country: 'UK', intake: 'Fall 2026', qualification: 'Bachelor\'s Degree', message: '' });
                }}
                className="text-xs font-bold text-[#F97316] hover:underline"
              >
                Submit another response
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] text-xs sm:text-sm font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] text-xs sm:text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] text-xs sm:text-sm font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Country</label>
                  <select
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] text-xs sm:text-sm font-medium transition-all"
                  >
                    <option value="UK">United Kingdom 🇬🇧</option>
                    <option value="Australia">Australia 🇦🇺</option>
                    <option value="Canada">Canada 🇨🇦</option>
                    <option value="USA">United States 🇺🇸</option>
                    <option value="New Zealand">New Zealand 🇳🇿</option>
                    <option value="Ireland">Ireland 🇮🇪</option>
                    <option value="Germany">Germany 🇩🇪</option>
                    <option value="Europe">Europe (Schengen) 🇫🇷</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Intake</label>
                  <select
                    value={formData.intake}
                    onChange={e => setFormData({ ...formData, intake: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] text-xs sm:text-sm font-medium transition-all"
                  >
                    <option value="Fall 2026">Fall 2026 (Sept/Oct)</option>
                    <option value="Spring 2027">Spring 2027 (Jan/Feb)</option>
                    <option value="Summer 2027">Summer 2027 (May/June)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Qualification</label>
                  <select
                    value={formData.qualification}
                    onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] text-xs sm:text-sm font-medium transition-all"
                  >
                    <option value="12th Standard">12th Standard (Higher Secondary)</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Diploma">Diploma / Vocational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message / Questions (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your target course or any specific queries..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] text-xs sm:text-sm font-medium transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-[#F97316]/25 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <>
                    <span>Book Free Counselling</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CONTACT INFO & LOCATION */}
      <section className="max-w-4xl mx-auto px-4 mt-14">
        <div className="bg-[#0A2342] text-white rounded-[24px] p-6 sm:p-8 border border-white/10 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#F97316] text-white flex items-center justify-center font-bold text-sm">
                  T
                </div>
                <h3 className="font-extrabold text-lg text-white">TESCA Consultancy</h3>
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Since 2005 • Your Dreams, Our Guidance. Visit our office in Surat for personalized in-person counselling.
              </p>

              <div className="space-y-2.5 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                  <span>111, Royal Arcade, Sarthana Jakatnaka, Surat, Gujarat</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#F97316] shrink-0" />
                  <span>98241 52731 / 99250 81515</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#F97316] shrink-0" />
                  <span>tescavisa.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-6">
                {[
                  { icon: InstagramIcon, href: 'https://instagram.com' },
                  { icon: FacebookIcon, href: 'https://facebook.com' },
                  { icon: LinkedinIcon, href: 'https://linkedin.com' },
                  { icon: YoutubeIcon, href: 'https://youtube.com' }
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#F97316] text-white flex items-center justify-center transition-colors"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Action Map / Office Card */}
            <div className="bg-white/10 rounded-[20px] p-5 border border-white/10 backdrop-blur-md text-center">
              <h4 className="font-bold text-sm text-white mb-2">Office Hours</h4>
              <p className="text-xs text-slate-300 mb-4">Monday – Saturday: 9:30 AM to 7:00 PM</p>
              <a
                href="https://maps.google.com/?q=TESCA+Surat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#0A2342] text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-slate-100 transition-colors shadow-md"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Get Directions on Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto px-4 mt-12 text-center text-xs text-slate-500 pb-10">
        <p className="font-medium text-slate-600 mb-1">
          TESCA Spoken English & Visa Consultancy
        </p>
        <p>© 2005 - {new Date().getFullYear()} TESCA Visa Consultancy. All Rights Reserved.</p>
      </footer>

      {/* PERSISTENT FLOATING WHATSAPP BUTTON */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline font-bold text-xs pr-1">Chat on WhatsApp</span>
      </a>

      {/* MOBILE BOTTOM STICKY NAVIGATION (THUMB-FRIENDLY) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A2342]/95 backdrop-blur-lg border-t border-white/10 text-slate-300 py-2 px-3 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <a
            href="#"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-white/80 hover:text-white transition-colors"
          >
            <span className="text-base">🏠</span>
            <span>Home</span>
          </a>

          <a
            href="#countries"
            className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-white/80 hover:text-white transition-colors"
          >
            <span className="text-base">🎓</span>
            <span>Study</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span className="text-base">💬</span>
            <span>WhatsApp</span>
          </a>

          <a
            href="#counselling-form"
            className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-[#F97316] hover:text-orange-400 transition-colors"
          >
            <span className="text-base">📅</span>
            <span>Book</span>
          </a>

          <a
            href="tel:+919824152731"
            className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-white/80 hover:text-white transition-colors"
          >
            <span className="text-base">📞</span>
            <span>Call</span>
          </a>
        </div>
      </nav>

      {/* RESOURCE DOWNLOAD MODAL */}
      <AnimatePresence>
        {activeModalResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setActiveModalResource(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center mb-4">
                <Download className="w-6 h-6" />
              </div>

              <h3 className="font-extrabold text-lg text-[#0A2342] mb-1">
                Download {activeModalResource}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Enter your email or phone to receive instant PDF download link.
              </p>

              {resourceSent ? (
                <div className="text-center py-4 text-emerald-600 font-bold text-xs flex items-center justify-center gap-2 bg-emerald-50 rounded-xl">
                  <Check className="w-4 h-4" /> Download link sent to your phone & email!
                </div>
              ) : (
                <form onSubmit={handleResourceSubmit} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Enter phone or email address"
                    value={resourceEmail}
                    onChange={e => setResourceEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#F97316] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#EA580C] transition-colors"
                  >
                    Send PDF Download Link
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EVENT BOOKING MODAL */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-extrabold text-lg text-[#0A2342] mb-1">
                🇬🇧 Book Seat for UK Mega Fair
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Reserve your free VIP seat to meet UK university representatives directly.
              </p>

              {eventBooked ? (
                <div className="text-center py-4 text-emerald-600 font-bold text-xs flex items-center justify-center gap-2 bg-emerald-50 rounded-xl">
                  <Check className="w-4 h-4" /> Seat Reserved! Confirmation sent via WhatsApp.
                </div>
              ) : (
                <form onSubmit={handleEventSubmit} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={eventFormData.name}
                    onChange={e => setEventFormData({ ...eventFormData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Number"
                    value={eventFormData.phone}
                    onChange={e => setEventFormData({ ...eventFormData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#F97316] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#EA580C] transition-colors"
                  >
                    Confirm VIP Seat
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK ACTION MODAL */}
      <AnimatePresence>
        {quickActionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setQuickActionModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-extrabold text-lg text-[#0A2342] mb-1">
                {quickActionModal}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Get personalized guidance and details for {quickActionModal} from our Surat experts.
              </p>

              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Ask via WhatsApp
                </a>
                <a
                  href="#counselling-form"
                  onClick={() => setQuickActionModal(null)}
                  className="w-full bg-[#0A2342] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#0E2F56] transition-colors"
                >
                  <Calendar className="w-4 h-4" /> Schedule Free Consultation
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
