'use client'
import Link from 'next/link';
import {toast} from 'sonner';

export function VerifieEmail({userEmail}: { userEmail: string }) {
    const sendEmailVerification=async(email:string)=>{
    try {
        const response = await fetch(
            "http://localhost:8000/api/send-email-verification",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email }),
            }
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(
                `Resend failed: ${response.status} - ${data}`
            );
        }
        toast.success(data.message);
    } catch (error) {
        console.error("[browser] Resend verification error:", error);
    }

    };
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-black px-4 py-12 text-zinc-100 overflow-hidden selection:bg-emerald-500 selection:text-black">
            {/* Ambient Green & Emerald Background Glows */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-[128px]" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-green-600/15 blur-[128px]" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-emerald-600/10 blur-[140px]" />

            {/* Subtle Matrix/Grid Background Pattern */}
            <div 
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(#22c55e 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative w-full max-w-lg">
                {/* Main Card */}
                <div className="relative overflow-hidden rounded-3xl border border-zinc-800/90 bg-zinc-950/80 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-emerald-950/30">
                    {/* Top Decorative Green Highlight Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-90" />

                    {/* Header with Glowing Icon */}
                    <div className="flex flex-col items-center text-center">
                        {/* Tag */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Account Verification
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
                            Verify your email address
                        </h1>

                        <p className="text-zinc-400 text-sm sm:text-base max-w-sm mb-5 leading-relaxed">
                            We&apos;ve sent a verification link to your email address. Please click the link inside to complete your setup.
                        </p>

                        {/* Email Address Pill */}
                        <div className="inline-flex items-center gap-2 max-w-full truncate px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-200 text-sm font-medium shadow-inner">
                            <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            <span className="truncate font-semibold text-emerald-400">{userEmail}</span>
                        </div>
                    </div>

                    {/* Quick Mail Access Providers */}
                    <div className="mt-7 grid grid-cols-2 gap-3">
                        <a
                            href="https://mail.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-emerald-500/40 hover:bg-zinc-900 hover:text-white hover:shadow-lg hover:shadow-emerald-500/10"
                        >
                            <svg className="h-4 w-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5c1.58 0 2.9.74 3.75 1.9l2.84-2.84C16.86 2.45 14.59 1.5 12 1.5 7.4 1.5 3.5 4.35 1.76 8.35l3.49 2.71C6.1 8.27 8.81 5 12 5z" />
                                <path fill="#4285F4" d="M23.49 12.28c0-.79-.07-1.54-.19-2.28H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.71-4.93 3.71-8.69z" />
                                <path fill="#FBBC05" d="M5.25 14.94c-.23-.69-.36-1.43-.36-2.19s.13-1.5.36-2.19L1.76 7.85C.64 10.08 0 12.58 0 15.25s.64 5.17 1.76 7.4l3.49-2.71z" />
                                <path fill="#34A853" d="M12 23.5c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.07.72-2.44 1.16-4.22 1.16-3.19 0-5.9-3.27-6.75-6.06L1.76 15.52C3.5 19.52 7.4 23.5 12 23.5z" />
                            </svg>
                            <span>Open Gmail</span>
                        </a>

                        <a
                            href="https://outlook.live.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-emerald-500/40 hover:bg-zinc-900 hover:text-white hover:shadow-lg hover:shadow-emerald-500/10"
                        >
                            <svg className="h-4 w-4 text-[#0078D4] transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.5 7.5L13.5 2v20l10-5.5V7.5zM12 3.5L1.5 8.8v9.4L12 21.5V3.5z"/>
                            </svg>
                            <span>Open Outlook</span>
                        </a>
                    </div>

                    {/* Primary Confirmation Action */}
                    <div className="mt-7 space-y-3">
                        <Link
                            href="/dashboard"
                            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-black shadow-lg shadow-emerald-950/50 transition-all duration-200 hover:bg-emerald-400 hover:shadow-emerald-500/20 active:scale-[0.99]"
                        >
                            <span>I&apos;ve verified my email</span>
                            <svg
                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>

                        <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-zinc-400">
                            <span>Didn&apos;t receive the email?</span>
                            <button
                                className="font-semibold text-emerald-400 cursor-pointer hover:text-emerald-300 hover:underline transition-colors"

                                onClick={async() => {sendEmailVerification(userEmail)}}
                            >
                                Check again
                            </button>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 hover:text-zinc-200 transition-colors"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Back to sign in
                        </Link>

                        <Link
                            href="/contact"
                            className="hover:text-zinc-200 transition-colors"
                        >
                            Need assistance?
                        </Link>
                    </div>
                </div>

                {/* Subtle Brand Watermark */}
                <div className="mt-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                    <svg className="h-3.5 w-3.5 text-emerald-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span>Secure End-to-End Authentication</span>
                </div>
            </div>
        </div>
    );
}