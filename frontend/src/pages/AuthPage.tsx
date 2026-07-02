import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('signup') === 'true');
  const [isForgot, setIsForgot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleAuthSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isForgot) {
        // Forgot password endpoint mock / alert
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Password recovery instructions sent to your email!");
        setIsForgot(false);
      } else if (isSignUp) {
        const res = await axios.post('/api/register', {
          email: data.email,
          password: data.password,
          name: data.name
        });
        login(res.data.token, res.data.user);
        toast.success("Welcome to StudyAI! Registration successful.");
        navigate('/dashboard');
      } else {
        const res = await axios.post('/api/login', {
          email: data.email,
          password: data.password
        });
        login(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Authentication failed. Please verify credentials.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    reset();
    if (isForgot) {
      setIsForgot(false);
    } else {
      setIsSignUp(!isSignUp);
    }
  };

  return (
    <div className="min-h-screen bg-bgDark text-textDark flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 glow-bg translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-secondary/10 glow-bg -translate-x-1/3 translate-y-1/3" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-8 rounded-3xl bg-cardDark border border-white/5 shadow-2xl relative z-10 glass-panel dark:glass-panel"
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-gradient-to-tr from-primary to-secondary rounded-2xl mb-4">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h2 className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent">
            StudyAI Companion
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {isForgot 
              ? "Recover access to your files" 
              : isSignUp ? "Create your learning profile" : "Sign in to access study tools"
            }
          </p>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit(handleAuthSubmit)} className="space-y-4">
          
          {/* Name Field (Sign Up Only) */}
          {isSignUp && !isForgot && (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-450" />
                <input
                  type="text"
                  placeholder="e.g. Alice Smith"
                  {...register('name', { required: "Name is required" })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                />
              </div>
              {errors.name && <span className="text-rose-500 text-xs font-semibold">{errors.name.message as string}</span>}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-450" />
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', { 
                  required: "Email is required", 
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } 
                })}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>
            {errors.email && <span className="text-rose-500 text-xs font-semibold">{errors.email.message as string}</span>}
          </div>

          {/* Password Field (Except Forgot) */}
          {!isForgot && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-300 font-semibold">Password</label>
                {!isSignUp && (
                  <button 
                    type="button" 
                    onClick={() => setIsForgot(true)}
                    className="text-xs text-secondary font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-450" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password', { 
                    required: "Password is required", 
                    minLength: { value: 6, message: "Must be at least 6 characters" } 
                  })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                />
              </div>
              {errors.password && <span className="text-rose-500 text-xs font-semibold">{errors.password.message as string}</span>}
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{isSubmitting ? "Processing..." : isForgot ? "Reset Password" : isSignUp ? "Sign Up" : "Sign In"}</span>
            {!isSubmitting && <ArrowRight className="h-4.5 w-4.5" />}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-8 text-center text-xs text-slate-400 font-semibold">
          {isForgot ? (
            <button onClick={toggleMode} className="text-secondary hover:underline">
              Back to Sign In
            </button>
          ) : (
            <span>
              {isSignUp ? "Already have an account?" : "New to StudyAI?"}{" "}
              <button onClick={toggleMode} className="text-secondary hover:underline ml-1">
                {isSignUp ? "Sign In" : "Register here"}
              </button>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};
