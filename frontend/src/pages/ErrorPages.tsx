import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertOctagon, HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bgDark text-textDark flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] bg-primary/10 glow-bg" />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md p-8 rounded-3xl bg-cardDark border border-white/5 shadow-2xl glass-panel relative z-10"
      >
        <div className="p-4 bg-primary/10 text-secondary rounded-2xl w-fit mx-auto mb-6">
          <HelpCircle className="h-10 w-10 animate-bounce" />
        </div>
        <h1 className="text-4xl font-extrabold mb-3">404 - Not Found</h1>
        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          The requested study path does not exist. Check the URL or return to the main dashboard workspace.
        </p>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>
    </div>
  );
};

export const ServerErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bgDark text-textDark flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans">
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] bg-danger/10 glow-bg" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md p-8 rounded-3xl bg-cardDark border border-white/5 shadow-2xl glass-panel relative z-10"
      >
        <div className="p-4 bg-danger/10 text-danger rounded-2xl w-fit mx-auto mb-6">
          <AlertOctagon className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-extrabold mb-3">500 - Server Error</h1>
        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          Something went wrong in the StudyAI pipelines. Our system loggers are checking the database fallback status.
        </p>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>
    </div>
  );
};
