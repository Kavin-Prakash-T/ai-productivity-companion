"use client";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

export default function Button({
  title,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white font-medium shadow-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
    >
      {title}
    </button>
  );
}