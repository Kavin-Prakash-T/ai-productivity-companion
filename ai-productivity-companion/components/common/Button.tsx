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
      className="w-full h-12 rounded-xl bg-black text-white font-medium transition hover:bg-neutral-800 disabled:opacity-50"
    >
      {title}
    </button>
  );
}