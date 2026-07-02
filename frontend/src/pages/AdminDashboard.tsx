import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Terminal, 
  ShieldAlert,
  HardDriveDownload,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const [adminData, setAdminData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminMetrics();
  }, []);

  const fetchAdminMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/admin/dashboard');
      setAdminData(res.data);
    } catch (err) {
      toast.error("Failed to load admin systems parameters");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SkeletonLoader type="table" count={4} />;
  }

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-rose-500">Admin Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Admin credentials detected. Review user enrollment parameters, uploaded content capacity, and system activity logs.
          </p>
        </div>
      </div>

      {/* Grid of indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <GlassCard hoverGlow={false} className="flex items-center space-x-4 border-rose-500/10">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{adminData?.users?.length || 0} enrolled</h3>
          </div>
        </GlassCard>

        <GlassCard hoverGlow={false} className="flex items-center space-x-4">
          <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Uploaded Materials</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{adminData?.materials?.length || 0} units</h3>
          </div>
        </GlassCard>

        <GlassCard hoverGlow={false} className="flex items-center space-x-4">
          <div className="p-3 bg-success/10 rounded-2xl text-success">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Average Quiz Score</span>
            <h3 className="text-2xl font-extrabold mt-0.5">{adminData?.quiz_stats?.avg_score || 0.0}%</h3>
          </div>
        </GlassCard>

      </div>

      {/* Database registers columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User enrollment accounts list */}
        <GlassCard hoverGlow={false} className="space-y-4">
          <h3 className="font-extrabold text-lg flex items-center">
            <Users className="h-5 w-5 text-secondary mr-2" />
            <span>Enrolled Students</span>
          </h3>
          <div className="divide-y divide-slate-200 dark:divide-white/5 overflow-y-auto max-h-[300px] pr-1">
            {adminData?.users?.map((u: any) => (
              <div key={u.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-sm text-slate-750 dark:text-slate-200">{u.name}</p>
                  <span className="text-slate-450">{u.email}</span>
                </div>
                <span className={`uppercase font-bold px-2 py-0.5 rounded ${
                  u.role === 'admin' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-400/15 text-slate-450'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Content list */}
        <GlassCard hoverGlow={false} className="space-y-4">
          <h3 className="font-extrabold text-lg flex items-center">
            <FileText className="h-5 w-5 text-primary mr-2" />
            <span>Uploaded Study Files</span>
          </h3>
          <div className="divide-y divide-slate-200 dark:divide-white/5 overflow-y-auto max-h-[300px] pr-1">
            {adminData?.materials?.map((m: any) => (
              <div key={m.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-sm text-slate-750 dark:text-slate-200 truncate max-w-xs">{m.title}</p>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{m.content_type}</span>
                </div>
                <span className="text-slate-450">{Math.round(m.file_size / 100) / 10} KB</span>
              </div>
            ))}
            {adminData?.materials?.length === 0 && (
              <p className="text-xs text-slate-450 italic py-6 text-center">No study files loaded.</p>
            )}
          </div>
        </GlassCard>

      </div>

      {/* System logs table */}
      <GlassCard hoverGlow={false} className="space-y-4">
        <h3 className="font-extrabold text-lg flex items-center">
          <Terminal className="h-5 w-5 text-accent mr-2" />
          <span>System Operation Logs</span>
        </h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/5 text-slate-400 uppercase font-bold pb-2">
                <th className="pb-2.5">Timestamp</th>
                <th className="pb-2.5">User</th>
                <th className="pb-2.5">Event</th>
                <th className="pb-2.5 text-right">Details Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-250">
              {adminData?.logs?.map((l: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                  <td className="py-3 text-slate-450">{new Date(l.timestamp).toLocaleString()}</td>
                  <td className="py-3 font-semibold">{l.user}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                      l.type === 'UPLOAD' ? 'bg-secondary/10 text-secondary' :
                      l.type === 'DELETE' ? 'bg-danger/10 text-danger' :
                      l.type === 'QUIZ_EVALUATE' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                    }`}>
                      {l.type}
                    </span>
                  </td>
                  <td className="py-3 text-right max-w-sm truncate">{l.description}</td>
                </tr>
              ))}
              {(!adminData?.logs || adminData.logs.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-450 italic">
                    No active system operation logs recorded.
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
