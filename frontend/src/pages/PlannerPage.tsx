import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  Sparkles, 
  CalendarDays, 
  CheckSquare, 
  Square, 
  RefreshCw, 
  AlertCircle,
  Lightbulb,
  ListTodo
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const PlannerPage: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [studyPlans, setStudyPlans] = useState<any[]>([]);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Track checked activities for local state
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPlannerData();
  }, []);

  const fetchPlannerData = async () => {
    setIsLoading(true);
    try {
      const mats = await axios.get('/api/materials');
      setMaterials(mats.data);
      if (mats.data.length > 0) {
        setSelectedMaterialId(mats.data[0].id);
      }
      
      const plans = await axios.get('/api/study-plans');
      setStudyPlans(plans.data);
      if (plans.data.length > 0) {
        setActivePlan(plans.data[0]);
      }
    } catch (err) {
      toast.error("Failed to load study plans");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialId) {
      toast.error("Select a document to structure your schedule");
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await axios.post('/api/study-plan', {
        material_id: selectedMaterialId,
        duration_days: durationDays
      });
      setActivePlan(res.data);
      setCompletedActivities({});
      toast.success("AI Study Planner compiled!");
      fetchPlannerData();
    } catch (err) {
      toast.error("Failed to generate plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleActivity = (dayKey: string, actIdx: number) => {
    const key = `${dayKey}-${actIdx}`;
    setCompletedActivities(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Study Planner</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate structured 7 or 30-day schedules complete with daily priorities and checklist items.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Settings Generator */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard hoverGlow={false}>
            <h3 className="font-extrabold text-lg mb-6 flex items-center">
              <CalendarDays className="h-5 w-5 text-secondary mr-2" />
              <span>Configure Schedule</span>
            </h3>

            <form onSubmit={handleCreatePlan} className="space-y-5">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Target Syllabus</label>
                <select
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Schedule Duration</label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value))}
                  className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white"
                >
                  <option value={7}>7 Day Sprint</option>
                  <option value={30}>30 Day Marathon</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating || materials.length === 0}
                className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                    <span>Compiling planner...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4.5 w-4.5" />
                    <span>Generate Schedule</span>
                  </>
                )}
              </button>
            </form>
          </GlassCard>

          {/* AI Tips Card */}
          <GlassCard hoverGlow={false} className="bg-primary/5 border-primary/10">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-secondary mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-700 dark:text-slate-200">Study suggestions</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Split your day into 25-minute Pomodoro sessions. Focus on High priority tasks during peak energy levels, leaving lower priority checks for evening reviews.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Active calendar plan list */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <SkeletonLoader type="line" count={4} />
          ) : activePlan ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-xl">{activePlan.title}</h3>
                <span className="text-xs uppercase font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                  {activePlan.duration_days} days
                </span>
              </div>

              {/* Day lists grid */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {Object.entries(activePlan.schedule).map(([dayKey, dayData]: [string, any]) => (
                  <GlassCard key={dayKey} hoverGlow={false} className="p-5 border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                      <div>
                        <span className="text-xs font-extrabold text-primary uppercase">{dayKey}</span>
                        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-100">{dayData.title}</h4>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        dayData.priority === 'high' ? 'bg-danger/15 text-danger' : 'bg-slate-400/15 text-slate-400'
                      }`}>
                        {dayData.priority} Priority
                      </span>
                    </div>

                    {/* Action checklists */}
                    <div className="space-y-2.5">
                      {dayData.activities.map((act: string, actIdx: number) => {
                        const isDone = completedActivities[`${dayKey}-${actIdx}`];
                        return (
                          <div
                            key={actIdx}
                            onClick={() => toggleActivity(dayKey, actIdx)}
                            className="flex items-center space-x-3 cursor-pointer text-xs group"
                          >
                            {isDone ? (
                              <CheckSquare className="h-4.5 w-4.5 text-success flex-shrink-0" />
                            ) : (
                              <Square className="h-4.5 w-4.5 text-slate-400 group-hover:text-primary transition-colors flex-shrink-0" />
                            )}
                            <span className={`font-semibold transition-all ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300'
                            }`}>
                              {act}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-slate-450 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl h-60 flex flex-col items-center justify-center">
              <ListTodo className="h-12 w-12 text-primary/30 mb-3" />
              <h3 className="font-bold text-lg text-slate-700 dark:text-slate-350">No Active Study Plan</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Generate a study plan from the left setup panel to organize calendar timelines and check items.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
