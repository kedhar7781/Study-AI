import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Bell, Menu, X, User as UserIcon, LogOut, ShieldAlert, Key } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export const Navbar: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock list of relevant notifications
  const [notifications] = useState([
    { id: 1, text: "AI Summary for 'Physics' ready", time: "5m ago" },
    { id: 2, text: "High priority quiz reminder", time: "2h ago" },
    { id: 3, text: "Study schedule adjusted by 1 day", time: "1d ago" }
  ]);

  const toggleTheme = async () => {
    if (!user) return;
    const targetTheme = user.theme === 'dark' ? 'light' : 'dark';
    try {
      updateUser({ theme: targetTheme });
      await axios.put('/api/user/profile', { theme: targetTheme });
      toast.success(`Switched to ${targetTheme} mode`);
    } catch (err) {
      toast.error("Failed to update theme settings");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="h-20 fixed top-0 right-0 left-0 lg:left-64 bg-slate-900/50 dark:bg-slate-900/50 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border-b border-white/5 lg:border-none flex items-center justify-between px-6 z-30 transition-all duration-300">
      
      {/* Search/Greetings */}
      <div>
        <h2 className="hidden md:block font-bold text-xl text-slate-800 dark:text-slate-100">
          Welcome back, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user?.name}</span> 👋
        </h2>
        <span className="md:hidden font-extrabold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          StudyAI
        </span>
      </div>

      {/* Toolbar tools */}
      <div className="flex items-center space-x-4">
        {/* Toggle Theme */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border dark:border-white/5 text-slate-700 dark:text-slate-200 transition-all duration-200"
          title={user?.theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {user?.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications Icon and Card */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border dark:border-white/5 text-slate-700 dark:text-slate-200 transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-2xl p-4 z-40 text-slate-900 dark:text-white glass-panel dark:glass-panel">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-sm">Notifications</h4>
                <button className="text-xs text-primary font-semibold hover:underline">Clear all</button>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent dark:border-white/5 text-xs flex justify-between items-center transition-colors">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">{n.text}</p>
                      <span className="text-[10px] text-slate-400 font-semibold">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent dark:border-white/5 transition-all"
          >
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.avatar || 'avatar1'}`}
              alt="Avatar"
              className="h-9 w-9 rounded-lg bg-primary/20 border border-primary/10"
            />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-2xl p-2.5 z-40 text-slate-900 dark:text-white glass-panel dark:glass-panel">
              <div className="p-2 border-b border-slate-100 dark:border-white/5 mb-1.5">
                <p className="font-bold text-xs text-slate-400 uppercase tracking-widest">Active User</p>
                <p className="font-bold text-sm truncate">{user?.name}</p>
              </div>
              <div className="space-y-0.5">
                <Link to="/profile" onClick={() => setShowProfileDropdown(false)} className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                  <UserIcon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setShowProfileDropdown(false)} className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 text-secondary transition-colors">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border dark:border-white/5 text-slate-700 dark:text-slate-200 transition-all duration-200"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-slate-950/95 backdrop-blur-xl z-50 flex flex-col p-6 space-y-6 lg:hidden">
          <div className="space-y-4">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-200 hover:text-white transition-colors">Dashboard</Link>
            <Link to="/materials" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-200 hover:text-white transition-colors">Study Material</Link>
            <Link to="/flashcards" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-200 hover:text-white transition-colors">Flashcards</Link>
            <Link to="/quizzes" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-200 hover:text-white transition-colors">Quiz Generator</Link>
            <Link to="/planner" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-200 hover:text-white transition-colors">Study Planner</Link>
            <Link to="/analytics" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-200 hover:text-white transition-colors">Analytics</Link>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-200 hover:text-white transition-colors">Profile</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-secondary hover:text-white transition-colors">Admin Panel</Link>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 p-4 rounded-2xl bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

    </header>
  );
};
