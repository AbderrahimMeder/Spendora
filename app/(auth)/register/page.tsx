"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff, Wallet, Check, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

interface RegisterProps {
  onSwitchToLogin?: () => void;
  onRegisterSuccess?: (data: any) => void;
}

export default function Register({ onSwitchToLogin, onRegisterSuccess }: RegisterProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const url = 'http://localhost:8000';

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    window.location.href = `${url}/api/auth/google`;
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score === 2 || score === 3) return { score: 2, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !passwordConfirmation) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${url}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
        }),
      });
      const data = await res.json();
      if (data.status === 200) {
        toast.success('Registration successful!');
        router.push('/login');
        return;
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('Network error during registration');
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

      <div className="relative w-full max-w-[460px] rounded-2xl border border-white/[0.08] bg-[#111111]/95 p-7 sm:p-9 shadow-2xl shadow-black/80 backdrop-blur-xl">
        {/* Top Header Bar */}
        <div className="relative mb-6 flex items-center justify-between">
          <Link
            href="/"
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
            Create Account
          </h1>
          <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
            Join thousands managing their finances smarter
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              Full Name
            </label>
            <div className="group relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 flex items-center text-neutral-400 transition-colors group-focus-within:text-emerald-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-[#0d0d0d] pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-all duration-150 focus:border-emerald-500 focus:bg-white/[0.02] focus:ring-1 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              Email Address
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

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              Password
            </label>
            <div className="group relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 flex items-center text-neutral-400 transition-colors group-focus-within:text-emerald-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Password strength bar */}
            {password && (
              <div className="mt-1 space-y-1">
                <div className="flex h-1 w-full gap-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full flex-1 rounded-full transition-all duration-300 ${
                      strength.score >= 1 ? strength.color : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full transition-all duration-300 ${
                      strength.score >= 2 ? strength.color : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full transition-all duration-300 ${
                      strength.score >= 3 ? strength.color : 'bg-transparent'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>Strength: <span className={strength.text}>{strength.label}</span></span>
                  <span>Min. 8 characters</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              Confirm Password
            </label>
            <div className="group relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 flex items-center text-neutral-400 transition-colors group-focus-within:text-emerald-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className={`h-11 w-full rounded-xl border bg-[#0d0d0d] pl-11 pr-11 text-sm text-white placeholder:text-neutral-500 outline-none transition-all duration-150 focus:bg-white/[0.02] focus:ring-1 ${
                  passwordConfirmation && password !== passwordConfirmation
                    ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/40'
                    : passwordConfirmation && password === passwordConfirmation
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
            {passwordConfirmation && password !== passwordConfirmation && (
              <p className="text-[10px] text-rose-400">Passwords do not match</p>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-emerald-500 accent-emerald-500 focus:ring-emerald-500/40 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-neutral-400 leading-tight cursor-pointer select-none">
              I agree to the{' '}
              <Link href="/terms" className="text-emerald-400 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-emerald-400 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="group relative mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-bold text-black shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-400 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google Signup Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isLoading || isGoogleLoading}
          className="group relative flex h-11 w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-neutral-200 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] hover:text-white hover:shadow-lg hover:shadow-black/40 active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
        >
          {/* Subtle hover gradient shimmer overlay */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

          {/* Google icon in sleek container */}
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] transition-all duration-200 group-hover:scale-105 group-hover:border-white/20 group-hover:bg-white/[0.09]">
            <FcGoogle size={19} />
          </div>

          <span className="tracking-wide">
            {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </span>
        </button>

        {/* Footer Link */}
        <div className="mt-6 border-t border-white/[0.08] pt-4 text-center text-xs text-neutral-400">
          <span>Already have an account? </span>
          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          ) : (
            <Link
              href="/login"
              className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

