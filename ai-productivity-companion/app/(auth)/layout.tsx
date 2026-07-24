export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] text-zinc-100 px-4 relative overflow-hidden">
      {/* Ambient glows behind the login card */}
      <div className="glow-spot-violet top-[10%] left-[10%] animate-pulse-glow" />
      <div className="glow-spot-indigo bottom-[10%] right-[10%] animate-pulse-glow" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </main>
  );
}