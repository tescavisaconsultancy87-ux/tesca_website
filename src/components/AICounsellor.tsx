import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Mic, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";
const QA_DATABASE = [
  {
    question: "Which countries does TESCA help with?",
    answer: "TESCA assists with study programs in **USA, UK, Canada, Australia, New Zealand, Ireland, Germany, Dubai, Singapore, and Europe**."
  },
  {
    question: "What services does TESCA provide?",
    answer: "We offer **expert career counselling, university admission support, visa guidance, SOP & documentation review, IELTS/PTE preparation, loan/blocked account guidance**, and **pre-departure orientations**."
  },
  {
    question: "What is TESCA's visa success rate?",
    answer: "TESCA has a **99% visa success rate** backed by standard ISO 9001 certified protocols. We have been guiding students since **2005**."
  },
  {
    question: "How do I book an appointment with a counsellor?",
    answer: "You can book a free consultation by **filling out the details directly in this chat** or by calling our support desk at **+91 9824152731**."
  },
  {
    question: "Where is TESCA Visa Consultancy located?",
    answer: "Our main corporate office is located in **Gujarat, India**. We provide both in-person sessions and virtual consultation sessions via Phone/Zoom worldwide."
  },
  {
    question: "Do you provide IELTS coaching?",
    answer: "Yes, we provide intensive **IELTS, PTE, and Spoken English preparation** classes. Our training includes simulated exam diagnostics and one-on-one feedback."
  },
  {
    question: "What is the difference between IELTS and PTE?",
    answer: "**IELTS** is paper or computer-based and widely accepted worldwide, while **PTE** is fully computer-based with automated AI grading. Both are accepted by major universities."
  },
  {
    question: "Can you help with scholarship applications?",
    answer: "Yes, we evaluate your academic profile, resume, and test scores to identify and apply for **university-specific scholarships and financial aid**."
  },
  {
    question: "What documents are required for university admissions?",
    answer: "You typically need: **academic transcripts, degree certificates, resume/CV, 2-3 Letters of Recommendation (LORs), Statement of Purpose (SOP)**, and **English proficiency test scores**."
  },
  {
    question: "How long does the student visa process take?",
    answer: "Average processing times:\n* **USA**: 1-2 weeks after the embassy interview.\n* **Canada**: 3-4 weeks (under SDS).\n* **UK**: 3 weeks (expedited service is 5 days).\n* **Australia**: 4-6 weeks."
  },
  {
    question: "Do I need a blocked account for Germany?",
    answer: "Yes, international students planning to study in Germany must open a **Blocked Account (Sperrkonto)** containing a mandatory cost-of-living proof of **€11,900** per year."
  },
  {
    question: "What is the SDS program for Canada?",
    answer: "The **Student Direct Stream (SDS)** is an expedited visa program. Requirements include an **IELTS score of 6.0+**, **first-year tuition payment**, and a **GIC of $20,635 CAD**."
  },
  {
    question: "Can I work while studying abroad?",
    answer: "Yes, in destinations like Canada, USA, UK, and Australia, international students can work part-time up to **20 hours per week** during study terms and full-time during breaks."
  },
  {
    question: "What is a GIC (Guaranteed Investment Certificate)?",
    answer: "A **GIC** is a mandatory investment of **$20,635 CAD** for students applying to Canada under the SDS stream to prove they can cover their first year's living expenses."
  },
  {
    question: "How can I finance my study abroad education?",
    answer: "You can finance it through **education loans (secured/unsecured), university scholarships, personal savings**, or part-time work. We assist with bank loan documentation."
  },
  {
    question: "What is a Statement of Purpose (SOP)?",
    answer: "An **SOP** is an essay written by the student explaining their academic background, career ambitions, reasons for choosing the specific course, and why they want to study in that country."
  },
  {
    question: "How many Letters of Recommendation (LOR) do I need?",
    answer: "Most universities require **2 to 3 Letters of Recommendation (LORs)** from academic professors or professional employers who have supervised your work."
  },
  {
    question: "Can I study in Europe without IELTS?",
    answer: "Yes, some universities in countries like **Germany, France, Italy, and Spain** waive IELTS if your previous degree was fully instructed in English (requires a Medium of Instruction certificate)."
  },
  {
    question: "What is the cost of studying in the USA?",
    answer: "Tuition fees range from **$20,000 to $50,000 USD** per year. Public universities are generally more affordable than private Ivy League colleges."
  },
  {
    question: "What is the cost of studying in Canada?",
    answer: "Annual tuition fees range from **$15,000 to $30,000 CAD** for diplomas/colleges, and **$25,000 to $45,000 CAD** for university bachelor's or master's degrees."
  },
  {
    question: "What is the cost of studying in the UK?",
    answer: "Tuition ranges from **£12,000 to £28,000** per year. Living costs average **£1,023 to £1,334 per month** depending on whether you live inside or outside London."
  },
  {
    question: "What is an I-20 form?",
    answer: "An **I-20** is an official certificate issued by a US university indicating you are admitted to a full-time program and have shown sufficient funds to cover your tuition and living expenses."
  },
  {
    question: "Do you help with student accommodation?",
    answer: "Yes, we help students search and book **university student halls, private student apartments, and shared homestays** before departure."
  },
  {
    question: "Can I apply for a student visa with a study gap?",
    answer: "Yes! Study gaps are accepted if you can support them with **valid employment certificates, experience letters, or proof of skill-building courses**."
  },
  {
    question: "What is the Post-Graduation Work Permit (PGWP) in Canada?",
    answer: "A **PGWP** allows international graduates from eligible DLIs to stay and work in Canada for **up to 3 years**, depending on the length of their study program."
  },
  {
    question: "What is the UK Graduate Route (PSW)?",
    answer: "The UK **Graduate Route** allows international students completing an eligible degree to stay and work in the UK for **2 years** (3 years for PhD graduates)."
  },
  {
    question: "Do you charge any consultancy fees for counselling?",
    answer: "Our **initial career counselling and profile evaluation are completely free**! Standard fees apply for detailed coaching and document processing."
  },
  {
    question: "What is an intake and what are the main intakes?",
    answer: "Intakes are application cycles. The main ones are **Fall (Sept/Oct)** - the largest intake, **Spring (Jan/Feb)**, and **Summer (May/June)** - which has limited courses."
  },
  {
    question: "What is the eligibility for a Master's degree in Canada?",
    answer: "Requirements generally include a **4-year Bachelor's degree** with 60%+, a GPA above 3.0/4.0, and an **IELTS score of 6.5+** (with no band less than 6.0)."
  },
  {
    question: "What is the SEVIS fee for US student visas?",
    answer: "The **SEVIS I-901 fee is $350 USD** for F-1 student visa applicants, which must be paid online before attending your US Embassy interview."
  },
  {
    question: "What happens during a visa interview?",
    answer: "A visa officer asks questions about your **study plan, university choice, academic history, financial backing**, and your **ties to your home country** to ensure you are a genuine student."
  },
  {
    question: "Can I bring my spouse under a student visa?",
    answer: "Yes! Countries like **Canada, Australia, and New Zealand** allow student spouses to apply for open work permits, typically when the main applicant is enrolled in a Master's or PhD program."
  }
];

const sanitizeAndFormat = (text: string) => {
  // Strip any raw HTML tags to prevent XSS
  const clean = text.replace(/<[^>]*>/g, "");
  // Apply markdown formatting
  return clean
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
    .replace(/\* (.*?)(?:<br \/>|$)/g, '<li class="ml-2 font-sans font-normal">$1</li>');
};

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  showFallbackForm?: boolean;
  originalQuery?: string;
}

function FallbackForm({ originalQuery }: {
  originalQuery: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "failed">("idle");

  const MODES = ["Video Call", "Phone Call", "In-Person Meeting", "Email"];
  const COUNTRIES = [
    "Australia", "New Zealand", "United Kingdom", "Ireland", "Germany", 
    "Europe", "USA", "Canada", "Singapore", "Dubai", "Malaysia", "Switzerland"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !mode) {
      alert("Please fill in all required fields.");
      return;
    }
    setStatus("sending");
    try {
      const sid = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
      const tid = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
      const pk = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!sid || !tid || !pk) {
        throw new Error("EmailJS configuration is missing");
      }

      await emailjs.send(
        sid,
        tid,
        {
          to_email: "dhameliyaavadh592@gmail.com",
          reply_to: email,
          from_name: name,
          first_name: name,
          last_name: "(AI Fallback)",
          user_email: email,
          email: email,
          phone: phone,
          counselling_mode: mode,
          destination: destination || "Not specified",
          message: `[AI CONNECTION TROUBLE] The AI Chat assistant experienced connection errors or was down. The user tried to send this query: "${originalQuery}". Please contact the student immediately.`
        },
        pk
      );
      setStatus("success");
    } catch (error) {
      console.error("Fallback mail failed:", error);
      setStatus("failed");
    }
  };

  if (status === "success") {
    return (
      <div className="text-xs text-green-600 font-semibold py-1">
        ✓ Appointment booked! Our senior consultant will contact you shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <div>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-accent-blue text-slate-800"
          required
          disabled={status === "sending"}
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-accent-blue text-slate-800"
          required
          disabled={status === "sending"}
        />
      </div>
      <div>
        <input
          type="tel"
          placeholder="Your Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          maxLength={10}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-accent-blue text-slate-800"
          required
          disabled={status === "sending"}
        />
      </div>
      <div>
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-accent-blue text-slate-800"
          required
          disabled={status === "sending"}
        >
          <option value="">Calling Preference *</option>
          {MODES.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div>
        <select
          value={destination}
          onChange={e => setDestination(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-accent-blue text-slate-800"
          disabled={status === "sending"}
        >
          <option value="">Country Preference (Optional)</option>
          {COUNTRIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-1.5 bg-[#F08A00] hover:bg-[#C06E00] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
      >
        {status === "sending" ? "Booking..." : "Book Appointment"}
      </button>
      {status === "failed" && (
        <p className="text-[10px] text-red-500 font-medium mt-1">
          Booking failed. Please contact us directly at 9824152731.
        </p>
      )}
    </form>
  );
}

export default function AICounsellor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am **TESCA AI**, your premium admissions and visa compliance assistant. Ask me anything about universities, tuition fees, visa schedules, or IELTS prep.",
      timestamp: "14:40"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Suggestions
  const INITIAL_SUGGESTIONS = [
    "What is TESCA's visa success rate?",
    "How do I book an appointment?",
    "Do you provide IELTS coaching?",
    "What is a Germany Blocked Account?",
    "Can I work while studying?"
  ];
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);

  // Lock body scroll and intercept touch/wheel events when chat is open
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();

      const preventDefault = (e: Event) => {
        const chatBox = document.getElementById("ai-chat-window-panel");
        if (chatBox && chatBox.contains(e.target as Node)) {
          return;
        }
        e.preventDefault();
      };

      window.addEventListener("wheel", preventDefault, { passive: false });
      window.addEventListener("touchmove", preventDefault, { passive: false });

      return () => {
        window.removeEventListener("wheel", preventDefault);
        window.removeEventListener("touchmove", preventDefault);
        const currentLenis = (window as any).lenis;
        currentLenis?.start();
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    }
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newMsg: Message = {
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate natural typing delay for a premium interactive experience
    setTimeout(() => {
      const cleanQuery = text.toLowerCase().replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const words = cleanQuery.split(/\s+/).filter(w => w.length > 2);

      let scores = QA_DATABASE.map(item => {
        let score = 0;
        const cleanQ = item.question.toLowerCase().replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        
        // Exact match
        if (cleanQ === cleanQuery) {
          score += 20;
        }

        // Substring match
        if (cleanQ.includes(cleanQuery) || cleanQuery.includes(cleanQ)) {
          score += 10;
        }

        // Word overlap match
        for (const word of words) {
          if (cleanQ.includes(word)) {
            score += 3;
          }
        }
        
        return { item, score };
      });

      // Sort by score descending
      scores.sort((a, b) => b.score - a.score);

      const bestMatch = scores[0];

      if (bestMatch && bestMatch.score >= 3) {
        // High confidence match found
        setMessages(prev => [...prev, {
          sender: "ai",
          text: bestMatch.item.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        // Get 3 other related questions (excluding the one matched)
        const related = scores
          .slice(1, 5)
          .map(s => s.item.question)
          .filter(q => q !== bestMatch.item.question)
          .slice(0, 3);
        
        // Fill up to 3 if not enough matches
        while (related.length < 3) {
          const randQ = QA_DATABASE[Math.floor(Math.random() * QA_DATABASE.length)].question;
          if (!related.includes(randQ) && randQ !== bestMatch.item.question) {
            related.push(randQ);
          }
        }
        setCurrentSuggestions(related);
      } else {
        // No matching question found in database
        setMessages(prev => [...prev, {
          sender: "ai",
          text: "I couldn't find a direct match in our database, but I'd be glad to help! You can book a priority appointment with our senior consultant below, or click one of these popular questions:",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showFallbackForm: true,
          originalQuery: text
        }]);

        // Show top 3 general matches or popular ones
        const top3Matches = scores.slice(0, 3).map(s => s.item.question);
        setCurrentSuggestions(top3Matches);
      }

      setIsTyping(false);
    }, 600);
  };

  const whatsappNumber = "919824152731";
  const whatsappMsg = encodeURIComponent(
    "Hello TESCA Visa Consultancy,\n\nI hope this message finds you well. I would like to consult about studying abroad and would appreciate your expert guidance on visa requirements, university admissions, and the application process.\n\nKindly let me know the best time to connect.\n\nThank you."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans pointer-events-auto text-left">
      
      {/* Floating Buttons Stack */}
      {!isOpen && (
        <div className="flex flex-col items-end gap-3">
          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="relative group p-3.5 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
            title="Chat on WhatsApp"
          >
            <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping opacity-60 group-hover:opacity-100" style={{ animationDuration: '3.5s' }}></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 relative z-10 fill-white"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.559 4.122 1.532 5.859L.057 23.5l5.784-1.518A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.846 0-3.573-.492-5.063-1.35L2.5 21.869l1.244-4.287A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
          </a>

          {/* AI Chat Toggle Button */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            className="relative group p-3.5 rounded-full bg-accent-blue text-white shadow-lg hover:scale-105 transition-all duration-300 border border-slate-200"
          >
            <span className="absolute inset-0 rounded-full bg-accent-blue/20 animate-ping opacity-75 group-hover:opacity-100" style={{ animationDuration: '3s' }}></span>
            <MessageSquare className="w-5 h-5 relative z-10" />
          </button>
        </div>
      )}

      {/* Chat window panel */}
      {isOpen && (
        <div 
          id="ai-chat-window-panel"
          data-lenis-prevent
          className="w-[300px] sm:w-[340px] h-[440px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden overscroll-contain animate-[chatOpen_0.3s_cubic-bezier(0.16,1,0.3,1)]"
        >
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between font-sans">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-indigo to-accent-blue flex items-center justify-center text-white font-black text-sm font-display">
                T
              </div>
              <div>
                <h4 className="text-sm font-bold text-support-white font-display flex items-center gap-1.5">
                  TESCA AI Assistant <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                </h4>
                <p className="text-[10px] text-support-gray/50 font-sans font-medium">Real-time visa compliance agent</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-support-gray hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages body */}
          <div ref={scrollRef} className="flex-1 min-h-0 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-200 font-sans" style={{ overscrollBehavior: 'contain' }}>
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-accent-blue text-white font-semibold rounded-tr-none shadow-sm font-sans"
                    : "bg-slate-50 border border-slate-200/50 text-support-slate rounded-tl-none space-y-1 shadow-sm font-sans"
                }`}>
                  {m.sender === "user" ? (
                    <div className="space-y-2 font-normal whitespace-pre-wrap">{m.text}</div>
                  ) : (
                    <div className="space-y-2 font-normal" dangerouslySetInnerHTML={{
                      __html: sanitizeAndFormat(m.text)
                    }} />
                  )}
                  {m.showFallbackForm && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-slate-800 space-y-2.5 font-sans">
                      <div className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Book Priority Appointment</div>
                      <FallbackForm originalQuery={m.originalQuery || ""} />
                    </div>
                  )}
                  <span className="block text-[9px] text-right mt-1 opacity-50 font-sans">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200/50 text-support-gray rounded-xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm font-sans">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent-blue" />
                  <span className="text-[10px] font-sans font-normal">TESCA AI thinking…</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions pills */}
          {messages.length === 1 && currentSuggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 font-sans">
              <span className="block text-[9px] font-semibold text-support-gray/50 uppercase tracking-wider font-sans mb-1.5">
                Suggested Questions
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto scrollbar-thin">
                {currentSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="px-2.5 py-1 text-[10px] font-semibold text-support-gray bg-white hover:bg-slate-50 hover:text-slate-800 rounded-lg border border-slate-200/60 shadow-sm transition-all text-left cursor-pointer font-sans"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input control panel */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2 font-sans">
            <button
              onClick={() => alert("Voice transcription mockup initialized... Speak into your mic.")}
              aria-label="Speak query"
              className="p-2.5 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-support-gray hover:text-accent-blue transition-colors shadow-sm cursor-pointer"
            >
              <Mic className="w-4 h-4" />
            </button>
            
            <input
              type="text"
              placeholder="Ask about visas, costs, or schools…"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend(inputVal)}
              className="flex-grow bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-support-slate placeholder-support-gray/55 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue shadow-sm font-sans font-normal"
            />
            
            <button
              onClick={() => handleSend(inputVal)}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-accent-blue text-white font-bold hover:scale-[1.01] transition-transform cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Inline styles for chat fade animation */}
      <style>{`
        @keyframes chatOpen {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
