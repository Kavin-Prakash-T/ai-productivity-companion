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
      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        {...props}
        className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:border-black"
      />
    </div>
  );
}