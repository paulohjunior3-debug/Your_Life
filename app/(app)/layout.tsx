import { NavBar } from "@/components/nav-bar";
import { getUserAndProfile } from "@/lib/supabase/get-profile";
import { SyncOffline } from "./sync-offline";
import { TourGuiado } from "./tour-guiado";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getUserAndProfile();

  return (
    <div className="flex min-h-screen flex-col">
      <SyncOffline />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-4">
        {children}
      </main>
      <NavBar />
      <TourGuiado tourConcluido={profile?.tour_concluido ?? true} />
    </div>
  );
}
