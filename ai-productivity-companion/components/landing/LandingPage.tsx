"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Target,
    SquareCheckBig,
    Flame,
    Bot,
    Calendar,
    ChevronDown,
    Zap,
    ShieldCheck,
    TrendingUp,
    LayoutDashboard,
    LogOut,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
    const { user, logout } = useAuth();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const features = [
        {
            icon: Target,
            title: "Goal & Milestone Tracking",
            description:
                "Break long-term ambitions into manageable targets and measure your completion percentage effortlessly.",
            tag: "Focus & Strategy",
        },
        {
            icon: SquareCheckBig,
            title: "Smart Task Prioritization",
            description:
                "Organize tasks by priority, set due dates, and streamline your daily execute-list without friction.",
            tag: "Execution",
        },
        {
            icon: Flame,
            title: "Habit Streak Engine",
            description:
                "Build daily routines that stick. Track current and highest streaks to turn key actions into lasting habits.",
            tag: "Consistency",
        },
        {
            icon: Bot,
            title: "Personalized AI Coach",
            description:
                "Receive instant AI recommendations on task priority, habit routines, and daily focus strategies.",
            tag: "AI Intelligence",
        },
    ];

    const stats = [
        { label: "Productivity Increase", value: "3.5x", icon: TrendingUp },
        { label: "Habit Completion Rate", value: "92%", icon: Flame },
        { label: "Active Goals Managed", value: "10k+", icon: Target },
        { label: "AI Suggestions Served", value: "50k+", icon: Zap },
    ];

    const faqs = [
        {
            question: "What is the AI Productivity Companion?",
            answer:
                "It is a modern web application designed to help you organize tasks, reach quarterly goals, build habits, and leverage AI insights to optimize your daily focus.",
        },
        {
            question: "How does the AI Assistant feature work?",
            answer:
                "Our integrated AI assistant analyzes your task load, goal progress, and habits to offer actionable daily advice, prioritization help, and quick answers.",
        },
        {
            question: "Is there a free tier available?",
            answer:
                "Yes! You can register for free to start managing tasks, tracking goals, and interacting with your AI companion right away.",
        },
        {
            question: "Can I access this on mobile devices?",
            answer:
                "Absolutely. The application features a fully responsive mobile interface with drawer navigation for seamless on-the-go productivity.",
        },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] font-sans selection:bg-black selection:text-white">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-[#E5E7EB] transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link href="/" className="hover:opacity-90 transition-opacity">
                        <Logo />
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4B5563]">
                        <a href="#features" className="hover:text-black transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="hover:text-black transition-colors">
                            How It Works
                        </a>
                        <a href="#ai-insights" className="hover:text-black transition-colors">
                            AI Assistant
                        </a>
                        <a href="#faq" className="hover:text-black transition-colors">
                            FAQ
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-all shadow-sm"
                                >
                                    <LayoutDashboard size={16} />
                                    <span>Dashboard</span>
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="rounded-xl border border-gray-200 p-2.5 text-gray-600 hover:bg-gray-100 hover:text-black transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4B5563] hover:text-black hover:bg-gray-100 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-all shadow-sm"
                                >
                                    <span>Get Started Free</span>
                                    <ArrowRight size={16} />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_20%,rgba(0,0,0,0.03)_0%,rgba(255,255,255,0)_100%)]" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-800 shadow-xs mb-6">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Next-Gen AI Productivity System</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0A0A0A] tracking-tight leading-[1.15]">
                        Supercharge Your Focus & Goals with <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-black via-zinc-800 to-zinc-500 bg-clip-text text-transparent">
                            AI Intelligence
                        </span>
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl text-[#4B5563] max-w-3xl mx-auto font-normal leading-relaxed">
                        Manage tasks, track ambitious goals, build sticky habits, and receive personalized AI insights—all in one elegant, distraction-free companion.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-black px-8 py-4 text-base font-bold text-white hover:bg-zinc-800 transition-all shadow-md"
                            >
                                <span>Go to Your Dashboard</span>
                                <ArrowRight size={18} />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-black px-8 py-4 text-base font-bold text-white hover:bg-zinc-800 transition-all shadow-md"
                                >
                                    <span>Get Started Free</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-8 py-4 text-base font-semibold text-[#0A0A0A] hover:bg-gray-50 transition-all shadow-xs"
                                >
                                    <span>Sign In to Account</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* App Preview Showcase Mockup */}
                    <div className="mt-14 relative max-w-4xl mx-auto rounded-3xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            </div>
                            <span className="text-xs text-gray-400 font-mono">dashboard.aiproductivity.app</span>
                            <div className="w-12" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                                <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                                    <span>Daily Focus</span>
                                    <SquareCheckBig size={16} className="text-black" />
                                </div>
                                <div className="mt-2 text-2xl font-bold text-black">8 / 10</div>
                                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                                    <CheckCircle2 size={12} /> 80% tasks completed
                                </p>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                                <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                                    <span>Q3 Milestone</span>
                                    <Target size={16} className="text-black" />
                                </div>
                                <div className="mt-2 text-2xl font-bold text-black">85%</div>
                                <div className="mt-2 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div className="bg-black h-full w-[85%] rounded-full" />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                                <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                                    <span>Habit Streak</span>
                                    <Flame size={16} className="text-amber-500" />
                                </div>
                                <div className="mt-2 text-2xl font-bold text-black">14 Days</div>
                                <p className="text-xs text-amber-600 mt-1 font-medium">🔥 Personal best!</p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50/50 to-orange-50/30 p-4 text-left flex items-start gap-3">
                            <div className="rounded-xl bg-amber-500 text-white p-2 shrink-0 mt-0.5">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">AI Daily Recommendation</h4>
                                <p className="text-sm text-amber-900 mt-0.5 font-medium">
                                    “You have completed your top 2 high-priority tasks! Focus next on your goal milestone before end-of-day.”
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="border-y border-[#E5E7EB] bg-white py-10">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} className="space-y-1">
                                <div className="inline-flex p-2 rounded-xl bg-gray-100 text-black mb-1">
                                    <Icon size={20} />
                                </div>
                                <div className="text-3xl font-extrabold text-black">{stat.value}</div>
                                <div className="text-xs font-medium text-gray-500">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Core Capabilities</h2>
                    <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
                        Everything You Need to Stay Accountable
                    </p>
                    <p className="mt-4 text-base text-gray-600">
                        Designed with crisp, modern light styling for effortless clarity and zero visual bloat.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="rounded-xl bg-black text-white p-3 shadow-xs">
                                            <Icon size={22} />
                                        </div>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                                            {item.tag}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-black">{item.title}</h3>
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-white border-t border-[#E5E7EB]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Simple Workflow</h2>
                        <p className="mt-3 text-3xl font-extrabold text-black">How It Works in 3 Steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-8 text-center relative">
                            <div className="w-10 h-10 rounded-full bg-black text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                                01
                            </div>
                            <h3 className="text-lg font-bold text-black">Define Goals & Tasks</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Input your key targets, set priorities, and establish recurring habit streaks.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-8 text-center relative">
                            <div className="w-10 h-10 rounded-full bg-black text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                                02
                            </div>
                            <h3 className="text-lg font-bold text-black">Execute Daily</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Complete tasks, log habit completions, and monitor your visual milestone metrics.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-8 text-center relative">
                            <div className="w-10 h-10 rounded-full bg-black text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                                03
                            </div>
                            <h3 className="text-lg font-bold text-black">Leverage AI Insights</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Ask your AI companion for real-time prioritization advice and productivity briefings.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Got Questions?</h2>
                    <p className="mt-3 text-3xl font-extrabold text-black">Frequently Asked Questions</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div
                                key={idx}
                                className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                                    className="w-full flex items-center justify-between p-6 text-left font-semibold text-black hover:bg-gray-50 transition-colors"
                                >
                                    <span>{faq.question}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="px-6 pb-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Bottom CTA Banner */}
            <section className="py-16 bg-black text-white">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Ready to Elevate Your Daily Productivity?
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base">
                        Join users who plan, track, and achieve their goals with AI intelligence.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-black hover:bg-gray-100 transition-all"
                            >
                                <span>Go to Dashboard</span>
                                <ArrowRight size={16} />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-black hover:bg-gray-100 transition-all"
                                >
                                    <span>Create Free Account</span>
                                    <ArrowRight size={16} />
                                </Link>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-8 py-3.5 text-sm font-semibold text-white hover:bg-zinc-900 transition-all"
                                >
                                    <span>Sign In</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#E5E7EB] bg-white py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <Logo />
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} AI Productivity Companion. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
                        <Link href="/login" className="hover:text-black transition-colors">
                            Sign In
                        </Link>
                        <Link href="/register" className="hover:text-black transition-colors">
                            Register
                        </Link>
                        <Link href="/dashboard" className="hover:text-black transition-colors">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
