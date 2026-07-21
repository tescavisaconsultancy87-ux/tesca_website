import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Calendar, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Globe, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Clock, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Zap, 
  Building2,
  ExternalLink
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

export default function ConnectLanding() {
  // Countdown timer for Event
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

  // Main site WhatsApp URL (exact message from main site)
  const whatsappUrl = "https://wa.me/919824152731?text=Hello%20TESCA%20Visa%20Consultancy%2C%20I%20am%20visiting%20your%20website%20and%20would%20like%20to%20consult%20about%20your%20visa%20and%20study%20abroad%20services.%20Please%20guide%20me.";

  // Open the main site's Speak to Counsellor modal popup
  const handleOpenCounsellor = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof (window as any).openCounsellorForm === 'function') {
      (window as any).openCounsellorForm();
    } else {
      window.location.href = '/inquiry';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased selection:bg-[#F97316] selection:text-white pb-24 md:pb-12">
      
      {/* BRAND HEADER (Minimal & Elegant with Official TESCA Logo) */}
      <header className="bg-[#0A2342] text-white border-b border-white/10 py-4 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img 
              src="/images/Tesca_logo.png" 
              alt="TESCA Spoken English & Visa Consultancy" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </a>

          <div className="flex items-center gap-3">
            <a 
              href="tel:+919824152731" 
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/15"
            >
              <Phone className="w-3.5 h-3.5 text-[#F97316]" />
              <span>98241 52731</span>
            </a>
            <button 
              onClick={handleOpenCounsellor}
              className="text-xs font-bold bg-[#F97316] text-white px-4 py-2 rounded-full hover:bg-[#EA580C] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Speak to Our Counsellor
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION - ELEGANT LUXURY BRAND STYLE */}
      <section className="relative bg-[#0A2342] text-white pt-10 pb-16 px-4 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-[#F97316]/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          
          {/* Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-slate-200 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Since 2005 • Surat's Premier Visa Consultancy</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4"
          >
            Start Your <span className="text-[#F97316]">Global Education</span> Journey
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
          >
            Expert Study Abroad Counselling, IELTS Coaching, University Admissions and Visa Guidance — all in one place.
          </motion.p>

          {/* Unified Hero Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
          >
            <a 
              href="#countries" 
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-[16px] bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <GraduationCap className="w-4 h-4 text-[#F97316]" />
              <span>Study Abroad</span>
            </a>

            <button 
              onClick={handleOpenCounsellor}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-[16px] bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#F97316]/25 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Speak to Counsellor</span>
            </button>

            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-[16px] bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <a 
              href="tel:+919824152731" 
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3.5 px-4 rounded-[16px] bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <Phone className="w-4 h-4 text-blue-400" />
              <span>Call Now</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-4xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white rounded-[20px] p-6 shadow-xl border border-slate-200/80">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0A2342] tracking-tight">21+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Years Experience</div>
            </div>

            <div className="p-2 border-l border-slate-200">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F97316] tracking-tight">50,000+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Students Guided</div>
            </div>

            <div className="p-2 sm:border-l border-slate-200">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0A2342] tracking-tight">98%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Visa Success Rate</div>
            </div>

            <div className="p-2 border-l border-slate-200">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F97316] tracking-tight">100+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">University Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTINATIONS SECTION WITH LOCAL GUARANTEED LANDMARK PHOTOS */}
      <section id="countries" className="max-w-4xl mx-auto px-4 mt-14 scroll-mt-20">
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-widest text-[#F97316] uppercase bg-[#F97316]/10 px-3 py-1 rounded-full">
            Global Pathways
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
              landmark: 'Big Ben & Tower Bridge',
              image: '/images/landmarks/uk.jpg',
              desc: 'Top Russell Group unis & 2-year Graduate Work Route.',
              badge: 'Fast Track Offer',
              link: '/study-abroad/uk'
            },
            {
              flag: '🇦🇺',
              name: 'Australia',
              landmark: 'Sydney Opera House',
              image: '/images/landmarks/australia.jpg',
              desc: 'High PR potential, top quality of life & work rights.',
              badge: 'Popular for PR',
              link: '/study-abroad/australia'
            },
            {
              flag: '🇨🇦',
              name: 'Canada',
              landmark: 'CN Tower & Skyline',
              image: '/images/landmarks/canada.jpg',
              desc: 'Express Entry PR pathways & up to 3 yrs PGWP.',
              badge: 'PGWP Available',
              link: '/study-abroad/canada'
            },
            {
              flag: '🇺🇸',
              name: 'United States',
              landmark: 'Statue of Liberty & NYC',
              image: '/images/landmarks/usa.jpg',
              desc: 'Ivy League excellence & 3-year STEM OPT extension.',
              badge: 'STEM OPT 3Yrs',
              link: '/study-abroad/usa'
            },
            {
              flag: '🇳🇿',
              name: 'New Zealand',
              landmark: 'Auckland Sky Tower',
              image: '/images/landmarks/new-zealand.jpg',
              desc: 'Safe, welcoming environment & post-study work rights.',
              badge: 'Safe & Green',
              link: '/study-abroad/new-zealand'
            },
            {
              flag: '🇮🇪',
              name: 'Ireland',
              landmark: 'Dublin Ha\'penny Bridge',
              image: '/images/landmarks/ireland.jpg',
              desc: 'European Tech Hub with 2-year stay back option.',
              badge: 'Tech Hub',
              link: '/study-abroad/ireland'
            },
            {
              flag: '🇩🇪',
              name: 'Germany',
              landmark: 'Brandenburg Gate',
              image: '/images/landmarks/germany.jpg',
              desc: 'Tuition-free public universities & strong engineering job market.',
              badge: 'Free Tuition',
              link: '/study-abroad/germany'
            },
            {
              flag: '🇫🇷',
              name: 'Europe (Schengen)',
              landmark: 'Eiffel Tower Paris',
              image: '/images/landmarks/europe.jpg',
              desc: 'France, Italy, Poland & Spain study opportunities.',
              badge: 'Schengen Access',
              link: '/study-abroad/europe'
            }
          ].map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-[20px] overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img 
                    src={c.image} 
                    alt={`${c.name} Landmark - ${c.landmark}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  
                  <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md text-[#0A2342] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                    <span className="text-sm">{c.flag}</span> {c.name}
                  </span>

                  <span className="absolute bottom-2.5 left-2.5 text-white/90 text-[10px] font-medium drop-shadow-md">
                    📍 {c.landmark}
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
                  href={c.link}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#0A2342] hover:text-white bg-slate-100 hover:bg-[#0A2342] py-2.5 rounded-xl transition-all"
                >
                  <span>Explore {c.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* UPCOMING ADMISSIONS EVENT & UPDATES */}
      <section className="max-w-4xl mx-auto px-4 mt-14">
        <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Upcoming Admission Event
                </span>
                <a 
                  href="/updates" 
                  className="text-xs font-bold text-[#0A2342] hover:text-[#F97316] underline flex items-center gap-1"
                >
                  <span>View All Updates</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
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
                onClick={handleOpenCounsellor}
                className="mt-4 w-full bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Book VIP Seat</span>
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
            Our Advantage
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
            { title: 'Scholarship Guidance', desc: 'Helping unlock up to 100% tuition waivers.', icon: Award }
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-[20px] bg-white border border-slate-200/70 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#0A2342]/5 text-[#0A2342] flex items-center justify-center mb-3">
                  <item.icon className="w-4 h-4 text-[#F97316]" />
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

      {/* GOOGLE REVIEWS & RATING BADGE */}
      <section className="max-w-4xl mx-auto px-4 mt-12 text-center">
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
              className="text-xs font-bold bg-[#F97316] text-white px-4 py-2 rounded-xl hover:bg-[#EA580C] transition-colors flex items-center gap-1.5"
            >
              <span>Read Reviews on Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT INFO & LOCATION */}
      <section className="max-w-4xl mx-auto px-4 mt-14">
        <div className="bg-[#0A2342] text-white rounded-[24px] p-6 sm:p-8 border border-white/10 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="/images/Tesca_logo.png" 
                alt="TESCA Consultancy" 
                className="h-10 w-auto mb-3 object-contain"
              />
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Since 2005 • Your Dreams, Our Guidance. Visit our main office in Surat for free in-person counselling.
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

            {/* Direct Booking Action Box */}
            <div className="bg-white/10 rounded-[20px] p-5 border border-white/10 backdrop-blur-md text-center">
              <h4 className="font-bold text-sm text-white mb-2">Speak to Our Counsellor</h4>
              <p className="text-xs text-slate-300 mb-4">Connect with senior visa officers & advisors.</p>
              <button
                onClick={handleOpenCounsellor}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#F97316] text-white text-xs font-bold py-3 px-4 rounded-xl hover:bg-[#EA580C] transition-colors shadow-md mb-2 cursor-pointer"
              >
                <span>Speak to Our Counsellor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="https://maps.google.com/?q=TESCA+Surat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-2.5 px-4 rounded-xl transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Get Google Maps Directions</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto px-4 mt-12 text-center text-xs text-slate-500 pb-10">
        <p className="font-semibold text-slate-700 mb-1">
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

      {/* MOBILE BOTTOM STICKY NAVIGATION (THUMB-FRIENDLY & DIRECT LINKS) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A2342]/95 backdrop-blur-lg border-t border-white/10 text-slate-300 py-2.5 px-4 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <a
            href="/"
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
            <span>Destinations</span>
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

          <button
            onClick={handleOpenCounsellor}
            className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-[#F97316] hover:text-orange-400 transition-colors cursor-pointer border-none bg-transparent"
          >
            <span className="text-base">📅</span>
            <span>Book</span>
          </button>

          <a
            href="tel:+919824152731"
            className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-white/80 hover:text-white transition-colors"
          >
            <span className="text-base">📞</span>
            <span>Call</span>
          </a>
        </div>
      </nav>

    </div>
  );
}
