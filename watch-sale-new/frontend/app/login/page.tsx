"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';


import { API_BASE_URL } from '@/lib/api';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Google login failed');

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role (simple check)
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-left">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-sm shadow-xl border border-zinc-100"
      >
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-black tracking-tighter mb-4 inline-block">ANIX<span className="text-zinc-300">.</span></Link>
          <h2 className="text-xl font-black uppercase tracking-widest text-zinc-900 mt-4">Welcome Back</h2>
          <p className="text-xs text-zinc-400 font-bold uppercase italic mt-1">Log in to your master account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-red-100">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
            <div className="relative flex items-center group">
              <Mail size={18} className="absolute left-4 text-zinc-300 group-focus-within:text-black transition-colors" />
              <input
                type="email"
                required
                placeholder="hello@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-100 py-3 pl-12 pr-4 text-sm focus:border-black outline-none transition-all rounded-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Password</label>
              <a href="#" className="text-[10px] font-bold text-zinc-400 hover:text-black">Forgot?</a>
            </div>
            <div className="relative flex items-center group">
              <Lock size={18} className="absolute left-4 text-zinc-300 group-focus-within:text-black transition-colors" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-100 py-3 pl-12 pr-4 text-sm focus:border-black outline-none transition-all rounded-sm"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group disabled:bg-zinc-400"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-zinc-100"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black uppercase text-zinc-300">Or Continue With</span>
            <div className="flex-grow border-t border-zinc-100"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Failed')}
              useOneTap
              theme="outline"
              shape="square"
              width="100%"
            />
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-50 text-center">
          <p className="text-xs text-zinc-400 font-bold uppercase">
            New to Watch Haven? <Link href="/register" className="text-black underline ml-2">Join Now</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
