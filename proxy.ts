import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/cadastro",
  "/esqueci-senha",
  "/redefinir-senha",
  "/auth/callback",
];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/cadastro")) {
    const url = request.nextUrl.clone();
    url.pathname = "/inicio";
    return NextResponse.redirect(url);
  }

  if (user && !isPublicPath) {
    // Evita bater no banco em toda navegação só pra checar isso: uma vez
    // que sabemos que o onboarding tá completo, guardamos num cookie
    // (com o id do usuário, pra não vazar de uma conta pra outra no
    // mesmo navegador) e só voltamos a consultar se o cookie sumir.
    const cookieOnboarding = request.cookies.get("ob")?.value === user.id;
    let onboardingCompleto = cookieOnboarding;

    if (!cookieOnboarding) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("sexo")
        .eq("id", user.id)
        .maybeSingle();
      onboardingCompleto = profile?.sexo != null;
    }

    if (!onboardingCompleto && pathname !== "/onboarding") {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    if (onboardingCompleto && pathname === "/onboarding") {
      const url = request.nextUrl.clone();
      url.pathname = "/inicio";
      return NextResponse.redirect(url);
    }

    if (onboardingCompleto && !cookieOnboarding) {
      response.cookies.set("ob", user.id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: "lax",
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
