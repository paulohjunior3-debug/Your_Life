import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
        <Image
          src="/logo.png"
          alt="Your Life"
          width={512}
          height={512}
          className="mx-auto mb-4 h-28 w-28 rounded-xl"
          priority
        />
        {children}
      </div>
    </div>
  );
}
