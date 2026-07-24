export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-zinc-950 px-4 relative overflow-hidden">
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </main>
  );
}