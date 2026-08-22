import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Award, Calendar, Sparkles } from 'lucide-react';

interface ToastItem {
  id: number;
  name: string;
  location: string;
  action: string;
  detail: string;
  timeAgo: string;
  type: 'booking' | 'approval' | 'evaluation';
}

const RECENT_ACTIVITIES: ToastItem[] = [
  {
    id: 1,
    name: 'Priya P.',
    location: 'Varachha, Surat',
    action: 'evaluated her profile',
    detail: 'Canada Student Visa (SDS)',
    timeAgo: '2 mins ago',
    type: 'evaluation'
  },
  {
    id: 2,
    name: 'Rahul Patel',
    location: 'Mota Varachha, Surat',
    action: 'received visa approval 🎉',
    detail: 'UK Graduate Route (PSW)',
    timeAgo: '14 mins ago',
    type: 'approval'
  },
  {
    id: 3,
    name: 'Harshil Shah',
    location: 'Adajan, Surat',
    action: 'booked free counselling',
    detail: 'Germany Opportunity Card',
    timeAgo: '28 mins ago',
    type: 'booking'
  },
  {
    id: 4,
    name: 'Devanshi M.',
    location: 'Navsari',
    action: 'evaluated her profile',
    detail: 'Australia Higher Education',
    timeAgo: '42 mins ago',
    type: 'evaluation'
  },
  {
    id: 5,
    name: 'Jayesh G.',
    location: 'Katargam, Surat',
    action: 'received visa approval 🎉',
    detail: 'USA Master\'s F1 Visa',
    timeAgo: '1 hour ago',
    type: 'approval'
  },
  {
    id: 6,
    name: 'Anjali V.',
    location: 'Bardoli',
    action: 'booked free counselling',
    detail: 'IELTS Fast-Track Coaching',
    timeAgo: '2 hours ago',
    type: 'booking'
  }
];

export default function LiveSocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Initial delay before showing first toast
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed) return;

    // Cycle items every 12 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_ACTIVITIES.length);
        setVisible(true);
      }, 400);
    }, 12000);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const current = RECENT_ACTIVITIES[currentIndex];

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 max-w-xs sm:max-w-sm transition-all duration-500 transform font-sans ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-xl flex items-start gap-3 relative overflow-hidden group">
        
        {/* Left Icon Badge */}
        <div className={`p-2.5 rounded-xl text-white shrink-0 shadow-sm ${
          current.type === 'approval'
            ? 'bg-emerald-600'
            : current.type === 'booking'
            ? 'bg-accent-blue'
            : 'bg-accent-cyan'
        }`}>
          {current.type === 'approval' ? (
            <Award className="w-4 h-4" />
          ) : current.type === 'booking' ? (
            <Calendar className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 pr-4 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
            <span className="truncate">{current.name}</span>
            <span className="text-slate-400 font-normal">•</span>
            <span className="text-slate-500 font-medium truncate">{current.location}</span>
          </div>

          <p className="text-xs text-slate-700 font-normal leading-snug mt-0.5">
            {current.action} for <span className="font-semibold text-slate-900">{current.detail}</span>
          </p>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Verified Activity</span>
            <span>•</span>
            <span>{current.timeAgo}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
}
