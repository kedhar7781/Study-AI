import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Award, 
  CalendarDays, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  LogOut,
  GraduationCap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/materials', label: 'Study Material', icon: FileText },
    { to: '/flashcards', label: 'Flashcards', icon: Layers },
    { to: '/quizzes', label: 'Quiz Practice', icon: Award },
    { to: '/planner', label: 'Study Planner', icon: CalendarDays },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/profile', label: 'Profile Settings', icon: Settings },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/admin', label: 'Admin Panel', icon: ShieldAlert });
  }

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 hidden lg:flex flex-col bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-xl border-r border-white/10 text-white z-20">
      {/* Brand logo */}
      <div className="p-6 flex items-center space-x-3 border-b border-white/10">
        <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-xl">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-secondary bg-clip-text text-transparent">
            StudyAI
          </span>
          <p className="text-[10px] text-secondary font-medium tracking-widest uppercase">Companion</p>
        </div>
      </div>

      {/* Profile summary widget */}
      <div className="p-4 mx-4 mt-6 rounded-2xl bg-white/5 border border-white/5 flex items-center space-x-3">
        <img 
          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.avatar || 'avatar1'}`} 
          alt="Avatar" 
          className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/20"
        />
        <div className="overflow-hidden">
          <h4 className="font-bold text-sm truncate">{user?.name}</h4>
          <span className="text-[10px] uppercase font-bold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded tracking-wide">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 mt-6 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                ${isActive 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
                }
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout bottom trigger */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:text-white hover:bg-rose-500/10 border border-transparent hover:border-rose-500/15 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
