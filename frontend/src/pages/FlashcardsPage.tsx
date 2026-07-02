import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  Sparkles, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Shuffle, 
  RefreshCw,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export const FlashcardsPage: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch base data once on mount
  useEffect(() => {
    fetchBaseData();
  }, []);

  // Sync keyboard listeners with active card changes
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flashcards, currentIndex, isFlipped]);

  const fetchBaseData = async () => {
    setIsLoading(true);
    try {
      const matsRes = await axios.get('/api/materials');
      setMaterials(matsRes.data);
      if (matsRes.data.length > 0) {
        setSelectedMaterialId(matsRes.data[0].id);
      }
      
      const fcRes = await axios.get('/api/flashcards');
      setFlashcards(fcRes.data);
    } catch (err) {
      toast.error("Failed to load cards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (flashcards.length === 0) return;
    if (e.code === 'Space') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    } else if (e.code === 'ArrowRight') {
      handleNextCard();
    } else if (e.code === 'ArrowLeft') {
      handlePrevCard();
    }
  };

  const handleGenerateCards = async () => {
    if (!selectedMaterialId) {
      toast.error("Please select a study material");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await axios.post('/api/flashcards', { material_id: selectedMaterialId });
      setFlashcards(res.data);
      setCurrentIndex(0);
      setIsFlipped(false);
      toast.success(`Generated ${res.data.length} flashcards!`);
    } catch (err) {
      toast.error("Failed to generate flashcards");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (flashcards.length === 0) return;
    const card = flashcards[currentIndex];
    const newFav = !card.favorite;
    
    try {
      await axios.put(`/api/flashcards/${card.id}/favorite`, { favorite: newFav });
      const updated = [...flashcards];
      updated[currentIndex].favorite = newFav;
      setFlashcards(updated);
      toast.success(newFav ? "Added to favorites" : "Removed from favorites");
    } catch (err) {
      toast.error("Failed to update card status");
    }
  };

  const handleRateDifficulty = async (rating: string) => {
    if (flashcards.length === 0) return;
    const card = flashcards[currentIndex];
    try {
      await axios.put(`/api/flashcards/${card.id}/progress`, { rating });
      toast.success(`Difficulty rated as ${rating}`);
      handleNextCard();
    } catch (err) {
      toast.error("Failed to update progress");
    }
  };

  const handleShuffle = () => {
    if (flashcards.length === 0) return;
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    toast.success("Deck shuffled!");
  };

  const activeCard = flashcards[currentIndex];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Active Flashcards</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review core definitions, flip details, track memory strength, and study with keyboard hotkeys (Space / Arrows).
        </p>
      </div>

      {/* Generator settings panel */}
      <GlassCard hoverGlow={false} className="flex flex-col md:flex-row items-end gap-4 p-5">
        <div className="flex-1 flex flex-col space-y-1.5 w-full">
          <label className="text-xs font-bold text-slate-400 uppercase">Select Subject Material</label>
          <select
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white"
          >
            {materials.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGenerateCards}
          disabled={isGenerating || materials.length === 0}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm flex items-center space-x-2 w-full md:w-auto justify-center disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4.5 w-4.5" />
              <span>Generate Deck</span>
            </>
          )}
        </button>
      </GlassCard>

      {/* Deck Workspace */}
      {isLoading ? (
        <SkeletonLoader type="card" />
      ) : flashcards.length > 0 ? (
        <div className="flex flex-col items-center max-w-xl mx-auto space-y-8">
          
          {/* Deck statistics */}
          <div className="flex items-center justify-between w-full text-slate-400 text-xs px-2">
            <span>Card {currentIndex + 1} of {flashcards.length}</span>
            <button 
              onClick={handleShuffle} 
              className="flex items-center space-x-1.5 font-bold hover:text-white transition-colors"
            >
              <Shuffle className="h-4 w-4" />
              <span>Shuffle</span>
            </button>
          </div>

          {/* 3D Flippable Card box */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-80 perspective-1000 cursor-pointer relative"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full transform-style-3d relative rounded-3xl"
            >
              {/* CARD FRONT */}
              <div className="absolute inset-0 w-full h-full rounded-3xl p-8 bg-cardLight dark:bg-cardDark border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col justify-between backface-hidden glass-panel dark:glass-panel">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-widest">Question</span>
                  <button onClick={handleToggleFavorite} className="p-1 hover:text-yellow-400 transition-colors">
                    <Star className={`h-5 w-5 ${activeCard?.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-450'}`} />
                  </button>
                </div>
                
                <h3 className="font-extrabold text-lg sm:text-xl text-center leading-relaxed text-slate-800 dark:text-white">
                  {activeCard?.question}
                </h3>
                
                <p className="text-xs text-center text-slate-400 font-semibold animate-pulse">
                  Click card to reveal answer
                </p>
              </div>

              {/* CARD BACK */}
              <div className="absolute inset-0 w-full h-full rounded-3xl p-8 bg-cardLight dark:bg-cardDark border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col justify-between backface-hidden rotate-y-180 glass-panel dark:glass-panel">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Answer Explanation</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    activeCard?.difficulty === 'easy' ? 'bg-success/15 text-success' :
                    activeCard?.difficulty === 'hard' ? 'bg-danger/15 text-danger' : 'bg-secondary/15 text-secondary'
                  }`}>
                    {activeCard?.difficulty}
                  </span>
                </div>

                <div className="overflow-y-auto max-h-[160px] pr-1 py-2">
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {activeCard?.answer}
                  </p>
                </div>

                <p className="text-xs text-center text-slate-400 font-semibold">
                  Click card to view question
                </p>
              </div>

            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-6">
            <button
              onClick={handlePrevCard}
              className="p-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-all border dark:border-white/5"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Quality check scoring triggers */}
            <div className="flex space-x-2">
              <button 
                onClick={() => handleRateDifficulty('easy')}
                className="px-4 py-2 rounded-xl bg-success/15 text-success hover:bg-success/20 text-xs font-bold transition-colors"
              >
                Easy
              </button>
              <button 
                onClick={() => handleRateDifficulty('medium')}
                className="px-4 py-2 rounded-xl bg-secondary/15 text-secondary hover:bg-secondary/20 text-xs font-bold transition-colors"
              >
                Medium
              </button>
              <button 
                onClick={() => handleRateDifficulty('hard')}
                className="px-4 py-2 rounded-xl bg-danger/15 text-danger hover:bg-danger/20 text-xs font-bold transition-colors"
              >
                Hard
              </button>
            </div>

            <button
              onClick={handleNextCard}
              className="p-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-all border dark:border-white/5"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

        </div>
      ) : (
        <div className="p-16 text-center text-slate-450 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl max-w-xl mx-auto flex flex-col items-center">
          <FolderOpen className="h-12 w-12 text-primary/30 mb-3" />
          <h3 className="font-bold text-lg text-slate-700 dark:text-slate-350">Flashcard Deck Empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            Select a study material in the panel above and generate a high-yield flashcard set to start reviewing.
          </p>
        </div>
      )}

    </div>
  );
};
