export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
        <h1 className="mb-6 text-center text-xl font-semibold text-foreground">
          Your Life
        </h1>
        {children}
      </div>
    </div>
  );
}
