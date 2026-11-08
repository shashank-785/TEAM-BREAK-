import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, CheckCircle, Circle, Sparkles, 
  Code, HelpCircle, Lightbulb, ChevronRight, Search, 
  Brain, Loader2, ArrowLeft, Bookmark
} from 'lucide-react';
import { api } from '../../services/api';
import { Subject, Unit, Topic } from '../../types';
import { Badge } from '../../components/Badge';

export const CollegeTutor: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  // AI Learning Support State
  const [aiMode, setAiMode] = useState<string>('feynman');
  const [aiCustomQuestion, setAiCustomQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    api.getSubjects().then((data) => {
      setSubjects(data);
      if (data.length > 0) {
        setSelectedSubject(data[0]);
        if (data[0].units.length > 0 && data[0].units[0].topics.length > 0) {
          setSelectedTopic(data[0].units[0].topics[0]);
        }
      }
      setLoading(false);
    });
  }, []);

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setAiResponse(null);
  };

  const handleToggleCompletion = async () => {
    if (!selectedTopic) return;
    const nextVal = !selectedTopic.isCompleted;
    setSelectedTopic({ ...selectedTopic, isCompleted: nextVal });

    // Update in tree
    setSubjects(prev => prev.map(s => {
      if (s.id !== selectedSubject?.id) return s;
      return {
        ...s,
        units: s.units.map(u => ({
          ...u,
          topics: u.topics.map(t => t.id === selectedTopic.id ? { ...t, isCompleted: nextVal } : t)
        }))
      };
    }));

    await api.toggleTopicCompletion(selectedTopic.id);
  };

  const handleTriggerAI = async (mode: string, customText?: string) => {
    if (!selectedTopic || isAiLoading) return;
    setAiMode(mode);
    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const response = await api.askTopicAI(selectedTopic.id, mode, customText);
      setAiResponse(response);
    } catch {
      setAiResponse("Unable to connect to AI Tutor service.");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#94A3B8]">
        <Loader2 size={24} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-indigo-400" size={24} />
            <h1 className="text-2xl font-extrabold text-[#F8FAFC]">College Tutor & Syllabus</h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Core semester subjects, unit-by-unit curriculum, and Socratic AI explanations.
          </p>
        </div>

        {/* Subject Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {subjects.map(sub => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubject(sub);
                if (sub.units.length > 0 && sub.units[0].topics.length > 0) {
                  setSelectedTopic(sub.units[0].topics[0]);
                  setAiResponse(null);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubject?.id === sub.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-[#151923] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#232936]'
              }`}
            >
              {sub.code} • {sub.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Syllabus Tree (Left) & Topic Reader with AI (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Syllabus Units & Topics Explorer (4 cols) */}
        <div className="lg:col-span-4 bg-[#151923] border border-[#232936] rounded-xl p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
            <div>
              <h2 className="text-sm font-semibold text-[#F8FAFC]">{selectedSubject?.name}</h2>
              <span className="text-[11px] text-[#94A3B8]">{selectedSubject?.credits} Credits • Sem {selectedSubject?.semester}</span>
            </div>
            <Badge variant="primary" size="sm">{selectedSubject?.code}</Badge>
          </div>

          <div className="space-y-4">
            {selectedSubject?.units.map(unit => (
              <div key={unit.id} className="space-y-2">
                <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Unit {unit.unitNumber}: {unit.title}</span>
                </div>

                <div className="space-y-1.5 pl-3 border-l border-[#232936]">
                  {unit.topics.map(topic => {
                    const isSelected = selectedTopic?.id === topic.id;
                    return (
                      <div
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic)}
                        className={`flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/40 font-semibold'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E1118]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {topic.isCompleted ? (
                            <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                          ) : (
                            <Circle size={14} className="text-[#94A3B8] shrink-0" />
                          )}
                          <span className="truncate">{topic.title}</span>
                        </div>
                        <span className="text-[10px] text-[#94A3B8] font-mono shrink-0 ml-2">
                          {topic.estimatedMinutes}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Topic Content & AI Assistant (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTopic ? (
            <div className="bg-[#151923] border border-[#232936] rounded-xl p-6 space-y-6">
              {/* Topic Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232936]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="purple">{selectedSubject?.name}</Badge>
                    <Badge variant="neutral">{selectedTopic.estimatedMinutes} Mins Read</Badge>
                  </div>
                  <h2 className="text-xl font-bold text-[#F8FAFC]">{selectedTopic.title}</h2>
                </div>

                <button
                  onClick={handleToggleCompletion}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedTopic.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-[#232936] text-[#F8FAFC] hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  <CheckCircle size={15} />
                  <span>{selectedTopic.isCompleted ? 'Mastered' : 'Mark Completed'}</span>
                </button>
              </div>

              {/* Main Content Body */}
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#F8FAFC] leading-relaxed space-y-4">
                <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#232936] font-sans whitespace-pre-line">
                  {selectedTopic.content}
                </div>
              </div>

              {/* Key Exam Points Checklist */}
              {selectedTopic.keyPoints && selectedTopic.keyPoints.length > 0 && (
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-2.5">
                  <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={14} />
                    <span>High-Yield Exam Points</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#F8FAFC]">
                    {selectedTopic.keyPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Code Examples */}
              {selectedTopic.codeExamples && selectedTopic.codeExamples.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-2">
                    <Code size={15} className="text-emerald-400" />
                    <span>Reference Algorithm Implementation ({selectedTopic.codeExamples[0].language})</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#0B0D12] border border-[#232936] overflow-x-auto text-xs font-mono text-emerald-300">
                    <code>{selectedTopic.codeExamples[0].code}</code>
                  </pre>
                </div>
              )}

              {/* Interactive AI Tutor Section */}
              <div className="p-5 rounded-xl bg-gradient-to-b from-[#191e2b] to-[#151923] border border-indigo-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Brain size={16} />
                    <span>AI Learning Co-Pilot</span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">Pedagogical Learning Modes</span>
                </div>

                {/* AI Action Quick Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleTriggerAI('feynman')}
                    disabled={isAiLoading}
                    className="p-2.5 rounded-lg bg-[#0B0D12] border border-[#232936] hover:border-indigo-500 text-left transition-all group"
                  >
                    <div className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5 group-hover:text-indigo-400">
                      <Lightbulb size={13} className="text-amber-400" />
                      <span>Feynman</span>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">Explain simply</div>
                  </button>

                  <button
                    onClick={() => handleTriggerAI('analogy')}
                    disabled={isAiLoading}
                    className="p-2.5 rounded-lg bg-[#0B0D12] border border-[#232936] hover:border-indigo-500 text-left transition-all group"
                  >
                    <div className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5 group-hover:text-indigo-400">
                      <Sparkles size={13} className="text-indigo-400" />
                      <span>Analogy</span>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">Real-world model</div>
                  </button>

                  <button
                    onClick={() => handleTriggerAI('code')}
                    disabled={isAiLoading}
                    className="p-2.5 rounded-lg bg-[#0B0D12] border border-[#232936] hover:border-indigo-500 text-left transition-all group"
                  >
                    <div className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5 group-hover:text-indigo-400">
                      <Code size={13} className="text-emerald-400" />
                      <span>Code Example</span>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">Python/C sample</div>
                  </button>

                  <button
                    onClick={() => handleTriggerAI('quiz')}
                    disabled={isAiLoading}
                    className="p-2.5 rounded-lg bg-[#0B0D12] border border-[#232936] hover:border-indigo-500 text-left transition-all group"
                  >
                    <div className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5 group-hover:text-indigo-400">
                      <HelpCircle size={13} className="text-purple-400" />
                      <span>Socratic Quiz</span>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">Test mastery</div>
                  </button>
                </div>

                {/* Custom Ask AI on this topic */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (aiCustomQuestion.trim()) {
                      handleTriggerAI('custom', aiCustomQuestion);
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={aiCustomQuestion}
                    onChange={(e) => setAiCustomQuestion(e.target.value)}
                    placeholder={`Ask AI a specific question about ${selectedTopic.title}...`}
                    className="flex-1 bg-[#0B0D12] border border-[#232936] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!aiCustomQuestion.trim() || isAiLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                  >
                    {isAiLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    <span>Ask</span>
                  </button>
                </form>

                {/* AI Response Display */}
                {isAiLoading && (
                  <div className="flex items-center gap-2 p-4 text-xs text-indigo-400 bg-[#0B0D12] rounded-lg border border-[#232936]">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Synthesizing pedagogical explanation...</span>
                  </div>
                )}

                {aiResponse && !isAiLoading && (
                  <div className="p-4 rounded-xl bg-[#0B0D12] border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-400">
                      <span>Tutor Response ({aiMode.toUpperCase()} MODE)</span>
                      <button 
                        onClick={() => setAiResponse(null)}
                        className="text-[10px] text-[#94A3B8] hover:text-[#F8FAFC]"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="text-xs text-[#F8FAFC] leading-relaxed whitespace-pre-line font-sans">
                      {aiResponse}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#94A3B8] bg-[#151923] border border-[#232936] rounded-xl">
              Select a topic from the syllabus tree to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
