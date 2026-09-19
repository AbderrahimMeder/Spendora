"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowLeft, ArrowRight, Eye, EyeOff, Wallet, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

interface LoginProps {
    onSwitchToRegister?: () => void;
    onSwitchToForgotPassword?: () => void;
}

export default function Login({ onSwitchToForgotPassword }: LoginProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const url = 'http://localhost:8000';

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        window.location.href = `${url}/api/auth/google`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password
                })
            });
            const data = await res.json();
            if (data.status === 401) {
                router.push('/error?code=401');
                return;
            }
            if (data.status === 200) {
                console.log(data);
                toast.success(data.message || 'Login successful');
                router.push('/dashboard');
                return;
            }
            toast.error(data.message || 'Login failed');
        } catch (err) {
            toast.error('Network error during login');
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
                        Welcome Back
                    </h1>
                    <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                        Sign in to access your personal dashboard
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
                    {/* Email Input */}
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

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                                Password
                            </label>
                            <Link
                                href="/forget-password"
                                className="text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="group relative flex items-center">
                            <div className="pointer-events-none absolute left-3.5 flex items-center text-neutral-400 transition-colors group-focus-within:text-emerald-400">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="••••••••"
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
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-emerald-500 accent-emerald-500 focus:ring-emerald-500/40 cursor-pointer"
                        />
                        <label htmlFor="remember" className="text-xs text-neutral-400 leading-tight cursor-pointer select-none">
                            Keep me logged in
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
                                <span>Signing In...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
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

                {/* Google Login Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
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
                    <span>Don't have an account? </span>
                    <Link
                        href="/register"
                        className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}

