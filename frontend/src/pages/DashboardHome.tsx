import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  Hourglass, 
  BookOpen, 
  CheckSquare, 
  AlertTriangle, 
  ArrowUpRight,
  Upload,
  BrainCircuit,
  CalendarCheck2,
  Sparkles
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/dashboard')
      .then(res => {
        setStats(res.data);
      })
      .catch(() => {
        toast.error("Failed to load dashboard metrics");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <SkeletonLoader type="card" count={4} />;
  }

  // Format Recharts week data
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = daysOfWeek.map((day, idx) => ({
    name: day,
    Actions: stats?.weekly_progress?.[idx] || 0
  }));

  const quickActions = [
    { label: "Upload Materials", icon: Upload, color: "text-secondary bg-secondary/10", to: "/materials" },
    { label: "Practice Quizzes", icon: BrainCircuit, color: "text-primary bg-primary/10", to: "/quizzes" },
    { label: "Schedule Planners", icon: CalendarCheck2, color: "text-accent bg-accent/10", to: "/planner" }
  ];

  return (
    <div className="space-y-8">
      {/* Header welcome banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-primary/15 to-secondary/15 p-6 rounded-3xl border border-primary/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-40 w-40 bg-secondary/10 rounded-full blur-2xl -z-10" />
        <div className="space-y-1 relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center">
            <span>Explore your Study Workspace</span>
            <Sparkles className="h-5 w-5 text-accent ml-2 animate-pulse" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Select files, generate summaries, configure revision targets, and monitor topics in real-time.
          </p>
        </div>
      </div>

      {/* Grid of 4 numeric indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Completion % */}
        <GlassCard hoverGlow={false} className="flex items-center space-x-4">
          <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Mastery Progress</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{stats?.completion_percentage || 0}%</h3>
          </div>
        </GlassCard>

        {/* Study Hours */}
        <GlassCard hoverGlow={false} className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Hourglass className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Focus Hours</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{stats?.study_hours || 0.0}h</h3>
          </div>
        </GlassCard>

        {/* Topics Covered */}
        <GlassCard hoverGlow={false} className="flex items-center space-x-4">
          <div className="p-3 bg-accent/10 rounded-2xl text-accent">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Mastered Topics</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{stats?.topics_covered || 0}</h3>
          </div>
        </GlassCard>

        {/* Quiz Attempts */}
        <GlassCard hoverGlow={false} className="flex items-center space-x-4">
          <div className="p-3 bg-success/10 rounded-2xl text-success">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Quiz Attempts</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{stats?.total_quizzes || 0}</h3>
          </div>
        </GlassCard>

      </div>

      {/* Main two-column block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Weekly progression chart */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard hoverGlow={false} className="h-[380px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-lg">Weekly Engagement Metrics</h3>
              <span className="text-xs font-semibold text-slate-450 uppercase tracking-widest">Study Actions Logs</span>
            </div>
            <div className="flex-1 w-full text-slate-400">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1E293B', 
                      borderColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="Actions" fill="#6C63FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Weak topics and Quick actions */}
        <div className="space-y-6">
          
          {/* Quick Actions List */}
          <GlassCard hoverGlow={false}>
            <h3 className="font-extrabold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={idx}
                    to={action.to}
                    className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${action.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{action.label}</span>
                    </div>
                    <ArrowUpRight className="h-4.5 w-4.5 text-slate-450 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                );
              })}
            </div>
          </GlassCard>

          {/* Weak Topics Warning Alert */}
          {stats?.weak_topics && stats.weak_topics.length > 0 && (
            <GlassCard hoverGlow={false} className="border-rose-500/20 bg-rose-500/5">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg mt-0.5">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-rose-500">Adaptive Review Recommended</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Our AI parser detected drop rates in: <b className="text-slate-700 dark:text-slate-200">{stats.weak_topics.slice(0, 3).join(', ')}</b>.
                  </p>
                  <Link to="/quizzes" className="text-xs text-rose-500 font-bold hover:underline inline-block mt-2">
                    Retake custom quizzes now →
                  </Link>
                </div>
              </div>
            </GlassCard>
          )}

        </div>

      </div>

    </div>
  );
};
