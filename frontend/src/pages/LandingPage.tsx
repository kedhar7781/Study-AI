import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Sparkles, 
  FileText, 
  Layers, 
  Award, 
  CalendarRange, 
  ArrowRight,
  CheckCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    { icon: FileText, title: "Instant Summaries", desc: "Upload files or paste texts to extract key definitions, mnemonics, and examples." },
    { icon: Layers, title: "3D Flashcards", desc: "Flip through auto-generated cards, shuffle, rate difficulty, and tracks study sessions." },
    { icon: Award, title: "Smart Quiz Generator", desc: "Test yourself with MCQ, True/False, or short answer formats graded instantly." },
    { icon: CalendarRange, title: "Adaptive Study Plans", desc: "Get personalized 7 or 30-day schedules matching priorities and syllabus targets." },
  ];

  const testimonials = [
    { name: "Sarah Connor", role: "Medical Student", text: "StudyAI cut my study prep in half! The flashcards and summary guides are incredibly structured." },
    { name: "David Chen", role: "Software Engineering major", text: "The adaptive quiz parser detects my weak topics immediately and offers great memory mnemonics." }
  ];

  const faqs = [
    { q: "How does the AI process my study materials?", a: "When you upload document contents, our system extracts the raw text and routes it to the Llama 3.3 model hosted via Groq, organizing key takeaways into structured guides." },
    { q: "Which file formats do you support?", a: "We support PDF, DOCX, and TXT files, alongside a direct copy/paste text field." },
    { q: "Can I use the app offline?", a: "Yes! StudyAI detects offline modes or missing API credentials and automatically operates in an offline mock-state, allowing you to test out all options immediately." }
  ];

  return (
    <div className="bg-bgDark text-textDark min-h-screen overflow-x-hidden relative font-sans">
      
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 glow-bg -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 h-[600px] w-[600px] rounded-full bg-secondary/10 glow-bg" />

      {/* Header bar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-xl">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent">
            StudyAI
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/auth" className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10 hover:bg-white/5 transition-all">
            Sign In
          </Link>
          <Link to="/auth?signup=true" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-28 text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-secondary mb-8"
        >
          <Sparkles className="h-4.5 w-4.5" />
          <span>Powered by Llama 3.3 on Groq API</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight"
        >
          Your Ultimate AI-Powered <br />
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Study Companion & Quiz Maker
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed"
        >
          Transform PDF documents, notes, or lecture guides into high-yield summaries, 3D interactive flashcards, practice quizzes, and structured daily planners instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center"
        >
          <Link to="/auth?signup=true" className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center space-x-3 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <span>Start studying for free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a href="#features" className="px-8 py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/5 flex items-center justify-center transition-all">
            Explore Features
          </a>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <h2 className="text-3xl font-extrabold text-center mb-16">Supercharge your learning journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-cardDark glass-panel shadow-glass flex flex-col hover:border-primary/30 group"
              >
                <div className="p-3 bg-primary/10 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-bold text-lg mt-6 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <h2 className="text-3xl font-extrabold text-center mb-16">Loved by ambitious students</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((test, i) => (
            <div key={i} className="p-8 rounded-2xl bg-cardDark glass-panel shadow-glass relative">
              <span className="absolute top-4 right-6 text-6xl text-primary/20 font-serif">“</span>
              <p className="text-slate-300 italic mb-6 relative z-10">"{test.text}"</p>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-secondary/15 flex items-center justify-center font-bold text-secondary text-sm">
                  {test.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{test.name}</h4>
                  <span className="text-xs text-slate-400">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <h2 className="text-3xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-2xl bg-cardDark border border-white/5 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-200 hover:text-white"
              >
                <span className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 text-sm text-slate-400 border-t border-white/5 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 relative z-10 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-xs gap-4">
        <div className="flex items-center space-x-3 text-white">
          <div className="p-1.5 bg-gradient-to-tr from-primary to-secondary rounded-lg">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-sm tracking-tight">StudyAI</span>
        </div>
        <p>© 2026 StudyAI – Smart AI Education Companion. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </footer>

    </div>
  );
};
