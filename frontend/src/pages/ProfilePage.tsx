import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Settings, 
  Keyboard, 
  HelpCircle,
  Paintbrush
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  // Profile settings state variables
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [avatarSeed, setAvatarSeed] = useState(user?.avatar || "avatar1");
  const [isUpdating, setIsUpdating] = useState(false);

  // Available avatars
  const avatars = ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5", "avatar6"];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name coordinates cannot be empty");
      return;
    }

    setIsUpdating(true);
    try {
      const payload: any = { name, avatar: avatarSeed };
      if (password) {
        payload.password = password;
      }
      
      const res = await axios.put('/api/user/profile', payload);
      updateUser(res.data);
      setPassword("");
      toast.success("Profile coordinates successfully updated!");
    } catch (err) {
      toast.error("Failed to update user profile parameters");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Profile Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your profile metadata, avatar seeds, theme layouts, and review keyboard shortcuts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: General and Avatar Info */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard hoverGlow={false}>
            <h3 className="font-extrabold text-lg mb-6 flex items-center">
              <Settings className="h-5 w-5 text-secondary mr-2" />
              <span>General Configurations</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              {/* Avatar Selector Grid */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase">Profile Avatar Style</label>
                <div className="grid grid-cols-6 gap-3">
                  {avatars.map((av) => {
                    const isSelected = avatarSeed === av;
                    return (
                      <div
                        key={av}
                        onClick={() => setAvatarSeed(av)}
                        className={`p-1.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center bg-slate-50 dark:bg-white/5
                          ${isSelected 
                            ? 'border-primary scale-105 shadow-md shadow-primary/10' 
                            : 'border-transparent hover:border-slate-300 dark:hover:border-white/5'
                          }
                        `}
                      >
                        <img
                          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${av}`}
                          alt={av}
                          className="h-12 w-12 rounded-lg bg-primary/10"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Input fields */}
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-450" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5 opacity-60">
                  <label className="text-xs font-bold text-slate-400 uppercase">Email Address (Read-only)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-450" />
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm text-slate-650 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Update Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-450" />
                    <input
                      type="password"
                      placeholder="Leave blank to keep current password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20"
              >
                <span>{isUpdating ? "Saving changes..." : "Save Changes"}</span>
              </button>

            </form>
          </GlassCard>
        </div>

        {/* Right Side: Keyboard Shortcuts and Help */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Shortcuts details list */}
          <GlassCard hoverGlow={false}>
            <h3 className="font-extrabold text-lg mb-6 flex items-center">
              <Keyboard className="h-5 w-5 text-secondary mr-2" />
              <span>Keyboard Shortcuts</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-white/5 pb-2.5">
                <span className="text-slate-450 font-bold uppercase">Flip Flashcard</span>
                <kbd className="px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 border dark:border-white/10 font-mono text-[10px] text-primary">Space</kbd>
              </div>

              <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-white/5 pb-2.5">
                <span className="text-slate-450 font-bold uppercase">Next Flashcard</span>
                <kbd className="px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 border dark:border-white/10 font-mono text-[10px] text-primary">→</kbd>
              </div>

              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-slate-450 font-bold uppercase">Prev Flashcard</span>
                <kbd className="px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 border dark:border-white/10 font-mono text-[10px] text-primary">←</kbd>
              </div>
            </div>
          </GlassCard>

          {/* Help & Support block */}
          <GlassCard hoverGlow={false} className="bg-secondary/5 border-secondary/10">
            <div className="flex items-start space-x-3">
              <HelpCircle className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm text-slate-700 dark:text-slate-200 font-sans">Need assistance?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  Check our local docs guides or drop details in the settings support channels.
                </p>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
