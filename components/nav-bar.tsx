"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Dumbbell, LineChart, User } from "lucide-react";

const TABS = [
  { href: "/inicio", label: "Início", icon: Home, tourId: "inicio" },
  { href: "/rank", label: "Rank", icon: Trophy, tourId: "rank" },
  { href: "/treino", label: "Treino", icon: Dumbbell, tourId: "treino" },
  {
    href: "/acompanhamento",
    label: "Progresso",
    icon: LineChart,
    tourId: "progresso",
  },
  { href: "/perfil", label: "Perfil", icon: User, tourId: "perfil" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 border-t border-border bg-card">
      <ul className="mx-auto flex max-w-md items-stretch justify-between">
        {TABS.map(({ href, label, icon: Icon, tourId }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                id={`tour-nav-${tourId}`}
                className={`flex flex-col items-center gap-1 py-2 text-xs ${
                  active ? "text-accent" : "text-foreground-secondary"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
