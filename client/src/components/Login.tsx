import React, { useState } from 'react';
import { GraduationCap, LogIn, PlayCircle } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
  onSignup: (user: User) => void;
  onDemo: (user: User) => void;
}

export const Login: React.FC<Props> = ({ onLogin, onSignup, onDemo }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        if (password.length < 8) throw new Error('Password must be at least 8 characters');
        if (password !== confirmPassword) throw new Error('Passwords do not match');
        const result = await api.register(email.trim(), password, confirmPassword, {});
        onSignup(result.user);
      } else {
        const result = await api.login(email.trim(), password);
        onLogin(result.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const enterDemo = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.loginAsDemo();
      onDemo(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'mt-2 w-full rounded-xl border border-[#30384a] bg-[#0B0D12] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,#312e81_0%,#0b0d12_42%,#080a0f_100%)] p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-indigo-400/20 bg-[#151923]/95 p-8 shadow-2xl">
        <div className="mb-7 flex items-center gap-4">
          <div className="rounded-2xl bg-indigo-600 p-3"><GraduationCap /></div>
          <div><h1 className="text-2xl font-bold text-white">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1><p className="text-sm text-slate-400">{mode === 'login' ? 'Sign in to LearnOS' : 'Start learning with LearnOS'}</p></div>
        </div>
        <button type="button" disabled={loading} onClick={enterDemo} className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 to-orange-500/10 px-5 py-4 text-sm font-bold text-amber-300 shadow-lg shadow-amber-950/20 transition hover:border-amber-300/60 hover:bg-amber-400/20 disabled:opacity-50">
          <PlayCircle size={20} />
          {loading ? 'Opening demo workspace...' : 'Proceed as Demo Account'}
        </button>
        <p className="-mt-4 mb-6 text-center text-[11px] text-slate-500">Start the full website immediately with Shashank's demo data.</p>
        <label className="block text-xs text-slate-300">Email<input type="email" required value={email} onChange={e => { setEmail(e.target.value); setError(''); }} className={inputClass} /></label>
        <label className="mt-4 block text-xs text-slate-300">Password{mode === 'signup' && ' (8+ characters)'}<input type="password" required minLength={mode === 'signup' ? 8 : undefined} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} className={inputClass} /></label>
        {mode === 'signup' && <label className="mt-4 block text-xs text-slate-300">Confirm password<input type="password" required value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }} className={inputClass} /></label>}
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
        <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
          <LogIn size={16} />{loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Log in' : 'Sign up')}
        </button>
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="mt-4 w-full text-xs text-indigo-300 hover:text-indigo-200">
          {mode === 'login' ? 'New to LearnOS? Sign up' : 'Already have an account? Log in'}
        </button>
      </form>
    </div>
  );
};
