"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({
  label,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-zinc-950">
        {label}
      </label>

      <input
        {...props}
        className="w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all duration-200 shadow-sm"
      />
    </div>
  );
}