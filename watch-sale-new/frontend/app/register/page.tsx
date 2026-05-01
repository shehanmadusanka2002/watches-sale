"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
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
          <h2 className="text-xl font-black uppercase tracking-widest text-zinc-900 mt-4">Join The Club</h2>
          <p className="text-xs text-zinc-400 font-bold uppercase italic mt-1">Create your premium account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-green-100">
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
            <div className="relative flex items-center group">
              <User size={18} className="absolute left-4 text-zinc-300 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                required
                placeholder="Shehan Fernando"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-100 py-3 pl-12 pr-4 text-sm focus:border-black outline-none transition-all rounded-sm"
              />
            </div>
          </div>

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
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Password</label>
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
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Account'}
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-50 text-center">
          <p className="text-xs text-zinc-400 font-bold uppercase">
            Already have an account? <Link href="/login" className="text-black underline ml-2">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
