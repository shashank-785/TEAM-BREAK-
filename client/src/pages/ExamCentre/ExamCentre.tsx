import React, { useState, useEffect } from 'react';
import { 
  Award, HelpCircle, BookOpen, Clock, CheckCircle2, 
  XCircle, RotateCcw, ChevronLeft, ChevronRight, Sparkles, 
  Search, Filter, Check, Eye 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { QuizQuestion, Flashcard, PreviousYearQuestion, MockExam } from '../../types';
import { Badge } from '../../components/Badge';

export const ExamCentre: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'flashcards' | 'mock' | 'pyqs'>('quizzes');
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [pyqs, setPyqs] = useState<PreviousYearQuestion[]>([]);
  const [mockExams, setMockExams] = useState<MockExam[]>([]);

  // Quiz Player State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<any>(null);

  // Flashcard Deck State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // PYQ Filter State
  const [pyqSearch, setPyqSearch] = useState('');
  const [pyqYear, setPyqYear] = useState<string>('All');
  const [expandedPyqId, setExpandedPyqId] = useState<string | null>(null);

  useEffect(() => {
    api.getQuizzes().then(setQuizzes);
    api.getFlashcards().then(setFlashcards);
    api.getPYQs().then(setPyqs);
  }, []);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = async () => {
    const res = await api.submitQuiz(selectedAnswers);
    setQuizScore(res);
    setIsQuizSubmitted(true);
    if (res.scorePercentage >= 70) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setQuizScore(null);
    setCurrentQuizIndex(0);
  };

  const handleToggleCardMastery = async (id: string) => {
    const updated = await api.toggleFlashcardMastery(id);
    if (updated) {
      setFlashcards(prev => prev.map(f => f.id === id ? updated : f));
    }
  };

  const filteredPyqs = pyqs.filter(p => {
    const matchesSearch = p.question.toLowerCase().includes(pyqSearch.toLowerCase()) || 
                          p.subject.toLowerCase().includes(pyqSearch.toLowerCase());
    const matchesYear = pyqYear === 'All' || p.year === parseInt(pyqYear);
    return matchesSearch && matchesYear;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="text-amber-400" size={24} />
            <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Exam Centre & Performance</h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Subject quizzes, interactive flashcard recall, mock exams, and university PYQ solutions.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 bg-[#151923] p-1.5 rounded-xl border border-[#232936]">
          {[
            { id: 'quizzes', label: 'Adaptive Quizzes', icon: HelpCircle },
            { id: 'flashcards', label: 'Flashcard Decks', icon: RotateCcw },
            { id: 'pyqs', label: 'University PYQ Bank', icon: BookOpen },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: ADAPTIVE QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {quizzes.length > 0 ? (
            <div className="bg-[#151923] border border-[#232936] rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Progress & Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#232936]">
                <div className="space-y-1">
                  <Badge variant="purple">{quizzes[currentQuizIndex]?.subject}</Badge>
                  <div className="text-xs text-[#94A3B8]">
                    Question {currentQuizIndex + 1} of {quizzes.length}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-400">
                    Answered: {Object.keys(selectedAnswers).length}/{quizzes.length}
                  </span>
                  {isQuizSubmitted && (
                    <button
                      onClick={resetQuiz}
                      className="flex items-center gap-1 px-3 py-1 bg-[#232936] hover:bg-slate-700 text-[#F8FAFC] rounded-lg text-xs"
                    >
                      <RotateCcw size={12} />
                      <span>Retake</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-semibold text-[#F8FAFC] leading-relaxed">
                {quizzes[currentQuizIndex]?.question}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {quizzes[currentQuizIndex]?.options.map((opt, optIdx) => {
                  const qId = quizzes[currentQuizIndex].id;
                  const isSelected = selectedAnswers[qId] === optIdx;
                  const isCorrect = quizzes[currentQuizIndex].correctOption === optIdx;

                  let optStyle = 'bg-[#0B0D12] border-[#232936] text-[#94A3B8] hover:border-indigo-500/50 hover:text-[#F8FAFC]';
                  if (isSelected && !isQuizSubmitted) {
                    optStyle = 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold';
                  } else if (isQuizSubmitted) {
                    if (isCorrect) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isQuizSubmitted}
                      onClick={() => handleSelectOption(qId, optIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isQuizSubmitted && isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                      {isQuizSubmitted && isSelected && !isCorrect && <XCircle size={16} className="text-rose-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown when submitted) */}
              {isQuizSubmitted && (
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-[#F8FAFC] space-y-1">
                  <div className="font-semibold text-indigo-400 flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Step-by-step Model Explanation</span>
                  </div>
                  <p className="text-[#94A3B8] leading-relaxed">
                    {quizzes[currentQuizIndex]?.explanation}
                  </p>
                </div>
              )}

              {/* Navigation & Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#232936]">
                <button
                  disabled={currentQuizIndex === 0}
                  onClick={() => setCurrentQuizIndex(prev => prev - 1)}
                  className="px-4 py-2 bg-[#0B0D12] hover:bg-[#1C2230] disabled:opacity-30 text-[#F8FAFC] border border-[#232936] rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  {!isQuizSubmitted && currentQuizIndex === quizzes.length - 1 ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/30"
                    >
                      Submit Exam
                    </button>
                  ) : (
                    <button
                      disabled={currentQuizIndex === quizzes.length - 1}
                      onClick={() => setCurrentQuizIndex(prev => prev + 1)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Quiz Score Summary Card */}
              {quizScore && (
                <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/40 to-[#0B0D12] border border-indigo-500/40 text-center space-y-2">
                  <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Exam Results</div>
                  <div className="text-3xl font-extrabold text-[#F8FAFC]">
                    Score: {quizScore.score} / {quizScore.total} ({quizScore.scorePercentage}%)
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    {quizScore.scorePercentage >= 70 ? '🎉 Excellent mastery! Quiz logged to student analytics.' : 'Good attempt! Review the missed questions above.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-[#94A3B8]">No quiz questions available.</div>
          )}
        </div>
      )}

      {/* TAB 2: FLASHCARD DECKS */}
      {activeTab === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {flashcards.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Card {currentCardIndex + 1} of {flashcards.length}</span>
                <Badge variant={flashcards[currentCardIndex]?.mastered ? 'success' : 'warning'}>
                  {flashcards[currentCardIndex]?.mastered ? 'Mastered' : 'Needs Review'}
                </Badge>
              </div>

              {/* 3D Flip Card */}
              <div 
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="w-full min-h-[260px] bg-[#151923] border border-[#232936] hover:border-indigo-500/40 rounded-2xl p-8 flex flex-col justify-between cursor-pointer shadow-xl transition-all text-center select-none"
              >
                <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  {flashcards[currentCardIndex]?.subject} • {isCardFlipped ? 'ANSWER (BACK)' : 'QUESTION (FRONT)'}
                </div>

                <div className="text-base sm:text-lg font-medium text-[#F8FAFC] leading-relaxed my-auto">
                  {isCardFlipped 
                    ? flashcards[currentCardIndex]?.back 
                    : flashcards[currentCardIndex]?.front
                  }
                </div>

                <div className="text-[11px] text-[#94A3B8] italic">
                  (Click card to flip)
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button
                  disabled={currentCardIndex === 0}
                  onClick={() => {
                    setCurrentCardIndex(prev => prev - 1);
                    setIsCardFlipped(false);
                  }}
                  className="px-4 py-2 bg-[#151923] hover:bg-[#1C2230] disabled:opacity-30 text-[#F8FAFC] border border-[#232936] rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => handleToggleCardMastery(flashcards[currentCardIndex].id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                    flashcards[currentCardIndex]?.mastered
                      ? 'bg-[#232936] text-[#94A3B8] hover:text-[#F8FAFC]'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                  }`}
                >
                  <Check size={14} />
                  <span>{flashcards[currentCardIndex]?.mastered ? 'Mark Review Needed' : 'Mark as Mastered'}</span>
                </button>

                <button
                  disabled={currentCardIndex === flashcards.length - 1}
                  onClick={() => {
                    setCurrentCardIndex(prev => prev + 1);
                    setIsCardFlipped(false);
                  }}
                  className="px-4 py-2 bg-[#151923] hover:bg-[#1C2230] disabled:opacity-30 text-[#F8FAFC] border border-[#232936] rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#94A3B8]">No flashcards available.</div>
          )}
        </div>
      )}

      {/* TAB 3: UNIVERSITY PYQ BANK */}
      {activeTab === 'pyqs' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-[#151923] border border-[#232936] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
              <input
                type="text"
                value={pyqSearch}
                onChange={(e) => setPyqSearch(e.target.value)}
                placeholder="Search PYQs by keyword (e.g. Banker's Algorithm, Master Theorem)..."
                className="w-full bg-[#0B0D12] border border-[#232936] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#94A3B8] whitespace-nowrap">Filter Year:</span>
              <select
                value={pyqYear}
                onChange={(e) => setPyqYear(e.target.value)}
                className="bg-[#0B0D12] border border-[#232936] rounded-lg px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Years (2021-2025)</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>

          {/* PYQ Question Cards */}
          <div className="space-y-4">
            {filteredPyqs.map(pyq => {
              const isExpanded = expandedPyqId === pyq.id;
              return (
                <div key={pyq.id} className="bg-[#151923] border border-[#232936] rounded-xl p-6 space-y-4 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="purple">{pyq.subject}</Badge>
                      <Badge variant="neutral">{pyq.semester} ({pyq.year})</Badge>
                      <Badge variant="warning">{pyq.marks} Marks</Badge>
                    </div>
                    <span className="text-xs font-mono text-[#94A3B8]">{pyq.questionNumber}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#F8FAFC] leading-relaxed">
                    {pyq.question}
                  </h3>

                  <button
                    onClick={() => setExpandedPyqId(isExpanded ? null : pyq.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5"
                  >
                    <Eye size={13} />
                    <span>{isExpanded ? 'Hide Model Solution' : 'View Step-by-Step Model Solution'}</span>
                  </button>

                  {isExpanded && (
                    <div className="pt-4 border-t border-[#232936] space-y-4">
                      <div className="p-4 rounded-xl bg-[#0B0D12] border border-indigo-500/30 space-y-2">
                        <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          Official Model Answer
                        </div>
                        <p className="text-xs text-[#F8FAFC] leading-relaxed">
                          {pyq.modelAnswer}
                        </p>
                      </div>

                      {pyq.keySteps && (
                        <div className="space-y-1.5">
                          <div className="text-xs font-semibold text-[#94A3B8]">Grading Steps Breakdown:</div>
                          <ul className="space-y-1 text-xs text-[#F8FAFC] pl-4 list-decimal marker:text-indigo-400">
                            {pyq.keySteps.map((st, i) => (
                              <li key={i}>{st}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
