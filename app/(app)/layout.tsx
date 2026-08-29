import { NavBar } from "@/components/nav-bar";
import { SyncOffline } from "./sync-offline";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SyncOffline />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-4">
        {children}
      </main>
      <NavBar />
    </div>
  );
}
