import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  RefreshCw, 
  Download,
  AlertTriangle,
  FolderLock,
  ListTodo
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

export const QuizPage: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  
  // Quiz Generator controls
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [quizType, setQuizType] = useState("MCQ"); // MCQ, True/False, Short Answer
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Active quiz playing states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuizzesData();
  }, []);

  const fetchQuizzesData = async () => {
    setIsLoading(true);
    try {
      const mats = await axios.get('/api/materials');
      setMaterials(mats.data);
      if (mats.data.length > 0) {
        setSelectedMaterialId(mats.data[0].id);
      }
      
      const qz = await axios.get('/api/quizzes');
      setQuizzes(qz.data);
    } catch (err) {
      toast.error("Failed to load quiz statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialId) {
      toast.error("Select a syllabus document to generate questions from");
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await axios.post('/api/quiz', {
        material_id: selectedMaterialId,
        count: questionCount,
        type: quizType,
        difficulty
      });
      setActiveQuiz(res.data);
      setCurrentQuestionIndex(0);
      setUserAnswers(new Array(res.data.questions.length).fill(""));
      toast.success("AI Quiz Worksheet ready!");
    } catch (err) {
      toast.error("Failed to compile quiz questions");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (ans: string) => {
    const updated = [...userAnswers];
    updated[currentQuestionIndex] = ans;
    setUserAnswers(updated);
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`/api/quiz/${activeQuiz.id}/evaluate`, {
        answers: userAnswers
      });
      setActiveQuiz(res.data);
      toast.success(`Quiz Completed! Scored ${res.data.score}/${res.data.total_questions}`);
      fetchQuizzesData(); // Refresh history
    } catch (err) {
      toast.error("Evaluation submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async (quizId: string) => {
    try {
      toast.loading("Generating Quiz Worksheet PDF...", { id: 'quiz_pdf' });
      const res = await axios.get(`/api/quiz/${quizId}/download-pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Quiz_Practice_${quizId}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.dismiss('quiz_pdf');
      toast.success("Quiz PDF downloaded!");
    } catch (err) {
      toast.dismiss('quiz_pdf');
      toast.error("Failed to generate PDF");
    }
  };

  // Recharts score graph config
  const getPieData = (quiz: any) => {
    const correct = quiz.score;
    const incorrect = quiz.total_questions - quiz.score;
    return [
      { name: "Correct", value: correct, color: "#22C55E" },
      { name: "Incorrect", value: incorrect, color: "#EF4444" }
    ];
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Quiz Practice Hub</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Evaluate your understanding with customizable MCQ, True/False, or Short Answer worksheets.
        </p>
      </div>

      {/* Main Dashboard Layout */}
      {!activeQuiz ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Block: Generator settings */}
          <div className="lg:col-span-1">
            <GlassCard hoverGlow={false}>
              <h3 className="font-extrabold text-lg mb-6 flex items-center">
                <Sparkles className="h-5 w-5 text-secondary mr-2" />
                <span>Configure Practice Quiz</span>
              </h3>
              
              <form onSubmit={handleCreateQuiz} className="space-y-5">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Study Source</label>
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
                  <label className="text-xs font-bold text-slate-400 uppercase">Question Format</label>
                  <select
                    value={quizType}
                    onChange={(e) => setQuizType(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white"
                  >
                    <option value="MCQ">Multiple Choice (MCQ)</option>
                    <option value="True/False">True / False</option>
                    <option value="Short Answer">Short Answer</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Quantity</label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                      className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={20}>20 Questions</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || materials.length === 0}
                  className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                      <span>Generating quiz...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4.5 w-4.5" />
                      <span>Create Practice Quiz</span>
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </div>

          {/* Right Block: Past Quiz History */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard hoverGlow={false}>
              <h3 className="font-extrabold text-lg mb-6">Quiz History Logs</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {isLoading ? (
                  <SkeletonLoader type="line" count={4} />
                ) : quizzes.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
                    <HelpCircle className="h-10 w-10 mx-auto mb-2 text-slate-350" />
                    <p className="text-sm">No quizzes taken yet. Set settings to evaluate your retention!</p>
                  </div>
                ) : (
                  quizzes.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => setActiveQuiz(q)}
                      className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex items-center justify-between cursor-pointer hover:border-slate-300 dark:hover:border-white/15 transition-all"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-250">{q.title}</h4>
                        <div className="flex items-center space-x-3 text-xs text-slate-400 font-semibold">
                          <span className="uppercase text-secondary">{q.difficulty}</span>
                          <span>•</span>
                          <span>Score: {q.completed ? `${q.score}/${q.total_questions}` : "Not Completed"}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDownloadPDF(q.id)}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors"
                          title="Download Quiz PDF"
                        >
                          <Download className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </div>

        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header toolbar when playing a quiz */}
          <div className="flex justify-between items-center bg-cardLight dark:bg-cardDark p-4 rounded-2xl border border-slate-200 dark:border-white/5 glass-panel dark:glass-panel">
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-xs font-bold text-slate-450 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              ← Back to Practice History
            </button>
            <h4 className="font-extrabold text-sm">{activeQuiz.title}</h4>
            <button
              onClick={() => handleDownloadPDF(activeQuiz.id)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-all border dark:border-white/5"
            >
              <Download className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* PLAYING STATE */}
          {!activeQuiz.completed ? (
            <GlassCard hoverGlow={false} className="space-y-6">
              
              {/* Question progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                  <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}% Complete</span>
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Active question layout */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider bg-secondary/10 px-2 py-0.5 rounded">
                  {activeQuiz.questions[currentQuestionIndex].topic || "General"}
                </span>
                <h3 className="font-bold text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                  {activeQuiz.questions[currentQuestionIndex].question}
                </h3>
              </div>

              {/* Input Answers options */}
              {activeQuiz.questions[currentQuestionIndex].options ? (
                // Multiple Choice / True-False Layout
                <div className="space-y-3">
                  {activeQuiz.questions[currentQuestionIndex].options.map((opt: string, oIdx: number) => {
                    const isSelected = userAnswers[currentQuestionIndex] === opt;
                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectAnswer(opt)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center space-x-3
                          ${isSelected
                            ? 'bg-primary/10 border-primary/45 text-primary dark:text-slate-100 font-bold'
                            : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/15'
                          }
                        `}
                      >
                        <span className={`h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center text-xs font-bold
                          ${isSelected ? 'border-primary bg-primary text-white' : 'border-slate-400'}
                        `}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="text-sm">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Short Answer Input
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase">Your Explanation Answer</label>
                  <textarea
                    rows={4}
                    placeholder="Provide your short description explanation here..."
                    value={userAnswers[currentQuestionIndex] || ""}
                    onChange={(e) => handleSelectAnswer(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-primary text-sm text-slate-700 dark:text-white"
                  />
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-white/5">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold flex items-center space-x-2 transition-all disabled:opacity-30"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex === activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all"
                  >
                    <span>{isSubmitting ? "Grading..." : "Submit Quiz"}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border dark:border-white/5 text-sm font-semibold flex items-center space-x-2 transition-all"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>

            </GlassCard>
          ) : (
            // RESULTS COMPLETED STATE
            <div className="space-y-6">
              
              {/* Score breakdown metrics block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard hoverGlow={false} className="flex flex-col items-center justify-center text-center p-8 md:col-span-1">
                  <div className="p-4 bg-primary/10 text-secondary rounded-full mb-3">
                    <Award className="h-10 w-10" />
                  </div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Quiz Score</span>
                  <h3 className="text-4xl font-extrabold mt-1">
                    {activeQuiz.score} / {activeQuiz.total_questions}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    ({Math.round((activeQuiz.score / activeQuiz.total_questions) * 100)}% correct rate)
                  </p>
                </GlassCard>

                {/* Score PieChart representation */}
                <GlassCard hoverGlow={false} className="h-60 flex flex-col md:col-span-2">
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPieData(activeQuiz)}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {getPieData(activeQuiz).map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </div>

              {/* Weak Topics Warning panel */}
              {activeQuiz.weak_topics && activeQuiz.weak_topics.length > 0 && (
                <GlassCard hoverGlow={false} className="border-rose-500/20 bg-rose-500/5">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-rose-500 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-sm text-rose-500">Weak Topics Highlighted</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                        Our review suggests revisits on: <b className="text-slate-700 dark:text-slate-200">{activeQuiz.weak_topics.join(', ')}</b>. Take review planners to strengthen topics.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Corrections / Explanations section */}
              <GlassCard hoverGlow={false} className="space-y-6">
                <h3 className="font-extrabold text-lg mb-4">Question Explanations</h3>
                <div className="space-y-6">
                  {activeQuiz.questions.map((q: any, idx: number) => {
                    const userAns = activeQuiz.answers[idx] || "";
                    const correctAns = q.correct_answer;
                    
                    // Simple correct parsing matches
                    const isCorrect = userAns.trim().toLowerCase() === correctAns.trim().toLowerCase();

                    return (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">
                            Q{idx + 1}. {q.question}
                          </h4>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            isCorrect ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                          }`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 font-bold uppercase">Your Answer:</span>
                            <p className={`font-semibold mt-0.5 ${isCorrect ? 'text-success' : 'text-danger'}`}>
                              {userAns || "No answer provided"}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase">Correct Key:</span>
                            <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{correctAns}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 italic">
                          <b>Explanation:</b> {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
