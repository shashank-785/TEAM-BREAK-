import React, { useMemo, useState } from 'react';
import { Brain, Clock3, Trophy, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const day = new Date().toISOString().slice(0, 10);
export const BrainGames: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [result, setResult] = useState<{ seconds: number; rank: number } | null>(null);
  const level = Number(localStorage.getItem('learnos_brain_day') || 1);
  const sequence = useMemo(() => Array.from({ length: 3 + level }, (_, i) => 2 + i * 2 + level % 3), [level]);
  const expected = sequence[sequence.length - 1] + 2 + level % 3;

  const submit = () => {
    const seconds = startedAt ? (Date.now() - startedAt) / 1000 : 999;
    const correct = Number(answer) === expected;
    const stored = JSON.parse(localStorage.getItem('learnos_game_scores') || '{}');
    if (!correct) {
      stored[day] = { seconds, level, correct: false };
      localStorage.setItem('learnos_game_scores', JSON.stringify(stored));
      setResult({ seconds, rank: 0 });
      return;
    }
    confetti({ particleCount: 100, spread: 70 });
    stored[day] = { seconds, level, correct: true };
    localStorage.setItem('learnos_game_scores', JSON.stringify(stored));
    localStorage.setItem('learnos_brain_day', String(level + 1));
    setResult({ seconds, rank: 1 });
  };

  const todayScore = JSON.parse(localStorage.getItem('learnos_game_scores') || '{}')[day];
  const leaderboard = [
    { name: 'Meera K.', seconds: 12.4, correct: true },
    { name: 'Arjun S.', seconds: 14.8, correct: true },
    { name: 'Ishita R.', seconds: 18.2, correct: true },
    { name: 'Rohan P.', seconds: 21.5, correct: true },
    ...(todayScore ? [{ name: 'You', seconds: todayScore.seconds, correct: todayScore.correct !== false }] : [])
  ].sort((a, b) => {
    if (a.correct !== b.correct) return a.correct ? -1 : 1;
    return a.seconds - b.seconds;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><div className="mb-2 flex items-center gap-2 text-indigo-400"><Brain /> <span className="text-xs font-bold uppercase tracking-widest">Daily IQ Arena</span></div><h1 className="text-3xl font-extrabold">Brain Games</h1><p className="mt-1 text-sm text-slate-400">A harder puzzle appears each day. Faster solves rank higher on the weekly board.</p></div>
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-3"><span className="text-xs text-slate-400">Today's level</span><div className="text-2xl font-bold text-indigo-300">Level {level}</div></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-[#232936] bg-[#151923] p-6 text-center sm:p-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"><Zap size={14} /> Pattern Sprint</div>
          <p className="text-sm text-slate-400">Find the next number</p>
          <div className="my-8 flex flex-wrap justify-center gap-3">{sequence.map((number, index) => <span key={index} className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0B0D12] text-xl font-bold shadow-lg">{number}</span>)}<span className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-indigo-400 text-xl text-indigo-400">?</span></div>
          {!startedAt && <button onClick={() => setStartedAt(Date.now())} className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold">Start timer</button>}
          {startedAt && !result && <div className="mx-auto flex max-w-sm gap-3"><input type="number" value={answer} onChange={e => setAnswer(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-[#30384a] bg-[#0B0D12] px-4 py-3 text-center text-lg" /><button onClick={submit} className="rounded-xl bg-emerald-500 px-5 font-bold text-slate-950">Solve</button></div>}
          {result && <div className={`mt-5 rounded-xl p-4 ${result.rank ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}><Clock3 className="mr-2 inline" size={16} />{result.seconds.toFixed(1)} seconds · {result.rank ? 'Correct — level advanced!' : 'Not quite. Try again tomorrow.'}</div>}
        </div>

        <div className="rounded-3xl border border-[#232936] bg-[#151923] p-5">
          <div className="mb-5 flex items-center gap-2"><Trophy className="text-amber-400" /><h2 className="font-bold">Weekly leaderboard</h2></div>
          <p className="mb-4 text-xs text-slate-500">Correct solves are ranked fastest-first. Incorrect answers always finish last, regardless of time. Resets every Monday.</p>
          <div className="space-y-2">{leaderboard.map((score, index) => <div key={score.name} className={`flex items-center rounded-xl px-3 py-3 text-sm ${score.correct ? 'bg-[#0B0D12]' : 'border border-red-500/20 bg-red-500/5'}`}><span className="w-8 font-bold text-slate-500">#{index + 1}</span><span className="flex-1">{score.name}{!score.correct && <span className="ml-2 text-xs text-red-400">(incorrect)</span>}</span><span className={`font-mono ${score.correct ? 'text-indigo-300' : 'text-red-400'}`}>{score.seconds.toFixed(1)}s</span></div>)}</div>
        </div>
      </div>
    </div>
  );
};
