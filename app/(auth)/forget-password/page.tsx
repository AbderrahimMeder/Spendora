'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, Wallet, AlertCircle, Loader2 } from 'lucide-react';

interface ForgotPasswordProps {
  onSwitchToLogin?: () => void;
}

export default function ForgotPassword({ onSwitchToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const url = 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${url}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!response.ok) {
        throw new Error('Failed to send password reset link');
      }
      const data = await response.json();
      toast.success(data.message || 'Reset link sent!');
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send password reset link. Please try again.');
      toast.error('Could not send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#080808] px-4 py-8 text-white selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-600/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[440px] rounded-2xl border border-white/[0.08] bg-[#111111]/95 p-7 sm:p-9 shadow-2xl shadow-black/80 backdrop-blur-xl">
        {/* Top Header Bar */}
        <div className="relative mb-6 flex items-center justify-between">
          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="group flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors duration-150 hover:text-emerald-400 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-1" />
              <span>Back</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="group flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors duration-150 hover:text-emerald-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-1" />
              <span>Back</span>
            </Link>
          )}

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-black shadow-md shadow-emerald-500/20 transition-transform duration-200 hover:scale-105">
              <Wallet className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-white">
              Expense<span className="text-emerald-400">Tracker</span>
            </span>
          </Link>

          <div className="w-12" />
        </div>

        {/* Title & Subtitle */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[1.65rem]">
            Reset Password
          </h1>
          <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
            Enter your email to receive recovery instructions
          </p>
        </div>

        {/* Success Confirmation or Form */}
        {isSubmitted ? (
          <div className="space-y-5 text-center">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-white shadow-inner">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="text-base font-bold text-white mb-1">Reset Link Sent!</div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                We've sent password reset instructions to{' '}
                <strong className="text-emerald-400 font-semibold">{email}</strong>. Please check your inbox.
              </p>
            </div>

            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 px-4 text-sm font-semibold text-neutral-200 transition-all duration-150 hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Sign In</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 px-4 text-sm font-semibold text-neutral-200 transition-all duration-150 hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Sign In</span>
              </Link>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <div className="flex-1 leading-relaxed">{error}</div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                Account Email
              </label>
              <div className="group relative flex items-center">
                <div className="pointer-events-none absolute left-3.5 flex items-center text-neutral-400 transition-colors group-focus-within:text-emerald-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0d0d0d] pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-all duration-150 focus:border-emerald-500 focus:bg-white/[0.02] focus:ring-1 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-bold text-black shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-400 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Back to Login Link */}
            <div className="mt-6 border-t border-white/[0.08] pt-4 text-center text-xs text-neutral-400">
              {onSwitchToLogin ? (
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="inline-flex items-center gap-1.5 font-semibold text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Sign In</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 font-semibold text-neutral-400 hover:text-emerald-400 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

