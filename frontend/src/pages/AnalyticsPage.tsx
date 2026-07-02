import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  Trophy, 
  Hourglass, 
  Award, 
  HelpCircle, 
  Flame, 
  Clock, 
  Percent, 
  ShieldAlert,
  BarChart4
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const statsRes = await axios.get('/api/dashboard');
      setStats(statsRes.data);

      const quizRes = await axios.get('/api/quizzes');
      setQuizzes(quizRes.data);
    } catch (err) {
      toast.error("Failed to load learning analytics details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SkeletonLoader type="table" count={5} />;
  }

  // Format historical scores for Recharts AreaChart
  const completedHistory = quizzes
    .filter(q => q.completed)
    .reverse() // Oldest first for progression
    .map((q, idx) => ({
      attempt: `Quiz ${idx + 1}`,
      Score: Math.round((q.score / q.total_questions) * 100)
    }));

  // Strong vs Weak topic bars
  const topicData = [
    { name: 'Strong Topics', count: stats?.strong_topics?.length || 0, fill: '#22C55E' },
    { name: 'Weak Topics', count: stats?.weak_topics?.length || 0, fill: '#EF4444' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review score progression trends, subject strengths, and details of past quiz attempts.
        </p>
      </div>

      {/* Numerical statistics grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <GlassCard hoverGlow={false} className="flex items-center space-x-4">
          <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Average Score Rate</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{stats?.average_score || 0.0}%</h3>
          </div>
        </GlassCard>

        <GlassCard hoverGlow={false} className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Study Time</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{stats?.study_hours || 0.0} hours</h3>
          </div>
        </GlassCard>

        <GlassCard hoverGlow={false} className="flex items-center space-x-4">
          <div className="p-3 bg-accent/10 rounded-2xl text-accent">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Practice Syllabus Items</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{stats?.topics_covered || 0} Topics</h3>
          </div>
        </GlassCard>

      </div>

      {/* Graphs workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Score progress AreaChart */}
        <GlassCard hoverGlow={false} className="h-[360px] flex flex-col">
          <h3 className="font-extrabold text-lg mb-6">Quiz Score Progression</h3>
          <div className="flex-1 w-full text-slate-400">
            {completedHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={completedHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="attempt" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1E293B', 
                      borderColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="Score" stroke="#6C63FF" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm">
                Take at least one quiz to plot score progression trends.
              </div>
            )}
          </div>
        </GlassCard>

        {/* Strengths BarChart */}
        <GlassCard hoverGlow={false} className="h-[360px] flex flex-col">
          <h3 className="font-extrabold text-lg mb-6">Subject Strengths Overview</h3>
          <div className="flex-1 w-full text-slate-400">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>

      {/* Quiz Attempt History Logs list */}
      <GlassCard hoverGlow={false}>
        <h3 className="font-extrabold text-lg mb-6">Detailed Attempt History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/5 text-slate-400 text-xs uppercase font-bold">
                <th className="pb-3 font-semibold">Quiz Title</th>
                <th className="pb-3 font-semibold">Difficulty</th>
                <th className="pb-3 font-semibold text-center">Score</th>
                <th className="pb-3 font-semibold text-center">Correct Ratio</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-200">
              {quizzes.map((q) => {
                const ratio = Math.round((q.score / q.total_questions) * 100);
                return (
                  <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                    <td className="py-4 font-bold max-w-xs truncate">{q.title}</td>
                    <td className="py-4 uppercase text-xs text-secondary font-bold">{q.difficulty}</td>
                    <td className="py-4 text-center font-bold">{q.score} / {q.total_questions}</td>
                    <td className="py-4 text-center font-extrabold text-primary">{ratio}%</td>
                    <td className="py-4 text-right">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        q.completed ? 'bg-success/10 text-success' : 'bg-slate-400/10 text-slate-400'
                      }`}>
                        {q.completed ? 'Completed' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {quizzes.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-450 italic">
                    No quizzes recorded in history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

    </div>
  );
};
