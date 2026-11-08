import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  GraduationCap, Clock, Award, Code2, Flame, ArrowRight, 
  CheckCircle2, Circle, Sparkles, BookOpen, Calendar, 
  TrendingUp, Compass, Play, ChevronRight 
} from 'lucide-react';
import { api } from '../../services/api';
import { User, PlannerTask, Subject, ScheduleItem } from '../../types';
import { Badge } from '../../components/Badge';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext<{ user: User | null }>();
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getTasks(),
      api.getSubjects(),
      api.getSchedules()
    ]).then(([fetchedTasks, fetchedSubjects, fetchedSchedules]) => {
      setTasks(fetchedTasks);
      setSubjects(fetchedSubjects);
      setSchedules(fetchedSchedules);
      setLoading(false);
    });
  }, []);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus as any } : t));
    await api.updateTask(taskId, { status: nextStatus as any });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/60 via-[#151923] to-[#151923] border border-indigo-500/20 p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="purple">Semester {user?.semester || 5} • Computer Science</Badge>
              <Badge variant="success">Active Study Session</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              Welcome back, <span className="text-indigo-400">{user?.name || 'Alex'}</span>! 👋
            </h1>
            <p className="text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              Targeting <span className="text-[#F8FAFC] font-semibold">{user?.dreamRole || 'Full-Stack AI Engineer'}</span>. 
              You have <span className="text-amber-400 font-semibold">{tasks.filter(t => t.status !== 'completed').length} pending study tasks</span> and 
              2 scheduled review topics today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/planner')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Play size={14} className="fill-white" />
              <span>Start Pomodoro</span>
            </button>
            <button
              onClick={() => navigate('/coding')}
              className="px-5 py-2.5 bg-[#1C2230] hover:bg-[#232936] text-[#F8FAFC] text-xs font-semibold rounded-xl border border-[#232936] flex items-center gap-2 transition-all"
            >
              <Code2 size={15} className="text-indigo-400" />
              <span>Coding Lab</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Stat Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Current GPA */}
        <div className="bg-[#151923] border border-[#232936] rounded-xl p-5 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Current GPA</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <GraduationCap size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#F8FAFC]">{user?.currentGpa?.toFixed(2) || '0.00'}</span>
            <span className="text-xs text-[#94A3B8]">/ 10.00</span>
            <span className="text-xs text-emerald-400 font-medium ml-auto flex items-center gap-0.5">
              <TrendingUp size={13} /> Target {user?.targetGpa?.toFixed(2) || '9.00'}
            </span>
          </div>
        </div>

        {/* Metric 2: Study Hours */}
        <div className="bg-[#151923] border border-[#232936] rounded-xl p-5 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Total Study Hours</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#F8FAFC]">{user?.totalStudyHours || 142.5}</span>
            <span className="text-xs text-[#94A3B8]">hours logged</span>
            <span className="text-xs text-emerald-400 font-medium ml-auto">+14.2 this week</span>
          </div>
        </div>

        {/* Metric 3: Problems Solved */}
        <div className="bg-[#151923] border border-[#232936] rounded-xl p-5 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Coding Problems</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Code2 size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#F8FAFC]">{user?.problemsSolved || 54}</span>
            <span className="text-xs text-[#94A3B8]">solved</span>
            <span className="text-xs text-amber-400 font-medium ml-auto">74% accuracy</span>
          </div>
        </div>

        {/* Metric 4: Quizzes Completed */}
        <div className="bg-[#151923] border border-[#232936] rounded-xl p-5 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Quizzes & Exams</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Award size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#F8FAFC]">{user?.quizzesCompleted || 28}</span>
            <span className="text-xs text-[#94A3B8]">completed</span>
            <span className="text-xs text-purple-400 font-medium ml-auto">Top 5% rank</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tasks & Schedule (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks */}
          <div className="bg-[#151923] border border-[#232936] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-indigo-400" />
                <h2 className="text-base font-semibold text-[#F8FAFC]">Today's Action Tasks</h2>
              </div>
              <button 
                onClick={() => navigate('/planner')} 
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <span>View Full Planner</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map(task => (
                <div 
                  key={task.id}
                  onClick={() => handleToggleTask(task.id, task.status)}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-[#0E1118] border border-[#232936] hover:border-slate-700 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-[#94A3B8] group-hover:text-indigo-400">
                      {task.status === 'completed' ? (
                        <CheckCircle2 size={18} className="text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>
                    <div>
                      <div className={`text-xs font-medium ${task.status === 'completed' ? 'line-through text-[#94A3B8]' : 'text-[#F8FAFC]'}`}>
                        {task.title}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">
                        {task.subjectName} • Due {task.dueDate}
                      </div>
                    </div>
                  </div>

                  <Badge 
                    variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'neutral'}
                    size="sm"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Module Jump Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              onClick={() => navigate('/tutor')}
              className="p-5 rounded-xl bg-[#151923] border border-[#232936] hover:border-indigo-500/40 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen size={20} />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">College Tutor</h3>
              <p className="text-xs text-[#94A3B8] mt-1">6 University core subjects & Feynman AI explainers</p>
              <div className="flex items-center gap-1 text-xs text-indigo-400 font-medium mt-3">
                <span>Explore syllabus</span>
                <ArrowRight size={13} />
              </div>
            </div>

            <div 
              onClick={() => navigate('/exams')}
              className="p-5 rounded-xl bg-[#151923] border border-[#232936] hover:border-amber-500/40 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Award size={20} />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Exam Centre</h3>
              <p className="text-xs text-[#94A3B8] mt-1">Quizzes, Flashcards & 2021-2025 University PYQs</p>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-medium mt-3">
                <span>Practice tests</span>
                <ArrowRight size={13} />
              </div>
            </div>

            <div 
              onClick={() => navigate('/skills')}
              className="p-5 rounded-xl bg-[#151923] border border-[#232936] hover:border-purple-500/40 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Compass size={20} />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Skill Roadmaps</h3>
              <p className="text-xs text-[#94A3B8] mt-1">Interactive career skill trees & AI Mock Interviews</p>
              <div className="flex items-center gap-1 text-xs text-purple-400 font-medium mt-3">
                <span>Unlock skills</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Recommendations & Subject Mastery (1 col) */}
        <div className="space-y-6">
          {/* AI Recommended Focus */}
          <div className="bg-gradient-to-b from-[#191e2b] to-[#151923] border border-indigo-500/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-indigo-400" />
              <h2 className="text-sm font-semibold text-[#F8FAFC]">AI Recommended Focus</h2>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
              Based on your upcoming midterms and spaced repetition intervals:
            </p>

            <div className="space-y-3">
              <div 
                onClick={() => navigate('/tutor')}
                className="p-3 rounded-lg bg-[#0B0D12] border border-[#232936] hover:border-indigo-500/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                  <span>AVL Tree Rotations</span>
                  <Badge variant="warning" size="sm">Due Revision</Badge>
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-1">
                  Data Structures & Algorithms • 15 min review
                </div>
              </div>

              <div 
                onClick={() => navigate('/coding')}
                className="p-3 rounded-lg bg-[#0B0D12] border border-[#232936] hover:border-indigo-500/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
                  <span>Two Sum & Valid Parentheses</span>
                  <Badge variant="primary" size="sm">Coding Lab</Badge>
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-1">
                  Hash map lookup and stack mechanics
                </div>
              </div>
            </div>
          </div>

          {/* Subject Mastery Progress Bars */}
          <div className="bg-[#151923] border border-[#232936] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-[#F8FAFC] mb-4">Coursework Mastery</h2>
            
            <div className="space-y-4">
              {[
                { name: 'Data Structures & Algorithms', pct: 86, color: 'bg-indigo-500' },
                { name: 'Operating Systems', pct: 78, color: 'bg-emerald-500' },
                { name: 'Database Management Systems', pct: 82, color: 'bg-amber-500' },
                { name: 'Computer Networks', pct: 72, color: 'bg-cyan-500' },
                { name: 'AI & Machine Learning', pct: 68, color: 'bg-purple-500' },
              ].map((sub, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#F8FAFC] font-medium truncate">{sub.name}</span>
                    <span className="text-[#94A3B8] font-mono">{sub.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0E1118] overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${sub.color}`} 
                      style={{ width: `${sub.pct}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
