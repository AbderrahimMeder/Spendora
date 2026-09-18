'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Lock, ArrowLeft, ArrowRight, Wallet, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const url = 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${url}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          email: email,
          token: token,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to reset password');
      }
      const data = await response.json();
      if (data.status === 200 || data.status === 'success') {
        toast.success(data.message || 'Password reset successfully!');
        router.push('/login');
      } else {
        toast.error(data.message || 'Password reset failed');
        setError(data.message || 'Reset failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error resetting password');
      toast.error('Network error during reset');
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
          <Link
            href="/login"
            className="group flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors duration-150 hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-1" />
            <span>Back</span>
          </Link>

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
            New Password
          </h1>
          <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
            Choose a strong password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* New Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              New Password
            </label>
            <div className="group relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 flex items-center text-neutral-400 transition-colors group-focus-within:text-emerald-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-[#0d0d0d] pl-11 pr-11 text-sm text-white placeholder:text-neutral-500 outline-none transition-all duration-150 focus:border-emerald-500 focus:bg-white/[0.02] focus:ring-1 focus:ring-emerald-500/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 flex items-center text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              Confirm New Password
            </label>
            <div className="group relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 flex items-center text-neutral-400 transition-colors group-focus-within:text-emerald-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-11 w-full rounded-xl border bg-[#0d0d0d] pl-11 pr-11 text-sm text-white placeholder:text-neutral-500 outline-none transition-all duration-150 focus:bg-white/[0.02] focus:ring-1 ${
                  confirmPassword && newPassword !== confirmPassword
                    ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/40'
                    : confirmPassword && newPassword === confirmPassword
                    ? 'border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500/40'
                    : 'border-white/10 focus:border-emerald-500 focus:ring-emerald-500/40'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 flex items-center text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[10px] text-rose-400">Passwords do not match</p>
            )}
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
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* Back to Login Link */}
          <div className="mt-6 border-t border-white/[0.08] pt-4 text-center text-xs text-neutral-400">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-semibold text-neutral-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

